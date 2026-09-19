const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticate, optionalAuth, logActivity } = require('../middleware/auth');
const { quizLimiter } = require('../middleware/security');

const router = express.Router();

router.get('/', optionalAuth, (req, res) => {
  try {
    const { category_id, difficulty, search, page = 1, limit = 20 } = req.query;
    let query = 'SELECT q.*, c.name as category_name FROM quizzes q JOIN categories c ON q.category_id = c.id WHERE q.is_published = 1';
    const params = [];
    if (category_id) { query += ' AND q.category_id = ?'; params.push(category_id); }
    if (difficulty) { query += ' AND q.difficulty = ?'; params.push(difficulty); }
    if (search) { query += ' AND (q.title LIKE ? OR q.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    const total = db.prepare(query.replace('SELECT q.*, c.name as category_name', 'SELECT COUNT(*) as count')).get(...params).count;
    query += ' ORDER BY q.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    const quizzes = db.prepare(query).all(...params);
    res.json({ quizzes, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error('Erreur quiz list:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/:id', optionalAuth, (req, res) => {
  try {
    const quiz = db.prepare('SELECT q.*, c.name as category_name FROM quizzes q JOIN categories c ON q.category_id = c.id WHERE q.id = ?').get(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz non trouve' });
    const questions = db.prepare('SELECT id, question_text, question_type, options, points, sort_order FROM questions WHERE quiz_id = ? ORDER BY sort_order').all(req.params.id);
    res.json({ quiz: { ...quiz, questions_count: questions.length } });
  } catch (error) {
    console.error('Erreur quiz detail:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/:id/questions', authenticate, (req, res) => {
  try {
    const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ? AND is_published = 1').get(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz non trouve' });
    const questions = db.prepare('SELECT id, question_text, question_type, options, points, sort_order FROM questions WHERE quiz_id = ? ORDER BY sort_order').all(req.params.id);
    const attempts = db.prepare('SELECT COUNT(*) as count FROM quiz_attempts WHERE user_id = ? AND quiz_id = ?').get(req.user.id, req.params.id);
    if (attempts.count >= quiz.max_attempts) {
      return res.status(403).json({ error: 'Nombre maximum de tentatives atteint' });
    }
    res.json({ quiz: { id: quiz.id, title: quiz.title, time_limit_minutes: quiz.time_limit_minutes, passing_score: quiz.passing_score }, questions, attempts_used: attempts.count });
  } catch (error) {
    console.error('Erreur quiz questions:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.post('/:id/submit', authenticate, quizLimiter, (req, res) => {
  try {
    const { answers, time_spent_seconds } = req.body;
    const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ? AND is_published = 1').get(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz non trouve' });
    const attempts = db.prepare('SELECT COUNT(*) as count FROM quiz_attempts WHERE user_id = ? AND quiz_id = ?').get(req.user.id, req.params.id);
    if (attempts.count >= quiz.max_attempts) {
      return res.status(403).json({ error: 'Nombre maximum de tentatives atteint' });
    }
    const questions = db.prepare('SELECT * FROM questions WHERE quiz_id = ?').all(req.params.id);
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    const results = questions.map(q => {
      totalPoints += q.points;
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) { correctAnswers++; earnedPoints += q.points; }
      return { question_id: q.id, user_answer: userAnswer, correct_answer: q.correct_answer, is_correct: isCorrect, explanation: q.explanation, points: q.points };
    });
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const attemptId = uuidv4();
    db.prepare(`INSERT INTO quiz_attempts (id, user_id, quiz_id, score, total_questions, correct_answers, answers, time_spent_seconds, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`).run(attemptId, req.user.id, req.params.id, score, questions.length, correctAnswers, JSON.stringify(results), time_spent_seconds || 0);
    const passing = score >= quiz.passing_score;
    logActivity(req.user.id, 'quiz_submit', 'quiz', req.params.id, `Score: ${score}%`, req.ip);
    res.json({ attempt_id: attemptId, score, total_questions: questions.length, correct_answers: correctAnswers, passing_score: quiz.passing_score, passed: passing, results, time_spent_seconds: time_spent_seconds || 0 });
  } catch (error) {
    console.error('Erreur quiz submit:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/:id/attempts', authenticate, (req, res) => {
  try {
    const attempts = db.prepare('SELECT id, score, total_questions, correct_answers, time_spent_seconds, started_at, completed_at FROM quiz_attempts WHERE user_id = ? AND quiz_id = ? ORDER BY started_at DESC').all(req.user.id, req.params.id);
    res.json({ attempts });
  } catch (error) {
    console.error('Erreur quiz attempts:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
