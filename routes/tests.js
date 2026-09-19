const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticate, optionalAuth, logActivity } = require('../middleware/auth');
const { quizLimiter } = require('../middleware/security');

const router = express.Router();

router.get('/', optionalAuth, (req, res) => {
  try {
    const { category_id, search, page = 1, limit = 20 } = req.query;
    let query = 'SELECT t.*, c.name as category_name FROM tests t JOIN categories c ON t.category_id = c.id WHERE t.is_published = 1';
    const params = [];
    if (category_id) { query += ' AND t.category_id = ?'; params.push(category_id); }
    if (search) { query += ' AND (t.title LIKE ? OR t.description LIKE ?)'; params.push('%'+search+'%', '%'+search+'%'); }
    const total = db.prepare(query.replace('SELECT t.*, c.name as category_name', 'SELECT COUNT(*) as count')).get(...params).count;
    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    const tests = db.prepare(query).all(...params);
    res.json({ tests, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error('Erreur tests list:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/:id', optionalAuth, (req, res) => {
  try {
    const test = db.prepare('SELECT t.*, c.name as category_name FROM tests t JOIN categories c ON t.category_id = c.id WHERE t.id = ?').get(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test non trouve' });
    const questionsCount = db.prepare('SELECT COUNT(*) as count FROM test_questions WHERE test_id = ?').get(req.params.id).count;
    res.json({ test: { ...test, questions_count: questionsCount } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/:id/questions', authenticate, (req, res) => {
  try {
    const test = db.prepare('SELECT * FROM tests WHERE id = ? AND is_published = 1').get(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test non trouve' });
    const attempts = db.prepare('SELECT COUNT(*) as count FROM test_attempts WHERE user_id = ? AND test_id = ?').get(req.user.id, req.params.id);
    if (attempts.count >= test.max_attempts) {
      return res.status(403).json({ error: 'Nombre maximum de tentatives atteint' });
    }
    const questions = db.prepare('SELECT id, question_text, question_type, options, points, sort_order FROM test_questions WHERE test_id = ? ORDER BY sort_order').all(req.params.id);
    res.json({ test: { id: test.id, title: test.title, time_limit_minutes: test.time_limit_minutes, total_points: test.total_points, passing_score: test.passing_score }, questions, attempts_used: attempts.count });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.post('/:id/submit', authenticate, quizLimiter, (req, res) => {
  try {
    const { answers, time_spent_seconds } = req.body;
    const test = db.prepare('SELECT * FROM tests WHERE id = ? AND is_published = 1').get(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test non trouve' });
    const attempts = db.prepare('SELECT COUNT(*) as count FROM test_attempts WHERE user_id = ? AND test_id = ?').get(req.user.id, req.params.id);
    if (attempts.count >= test.max_attempts) {
      return res.status(403).json({ error: 'Nombre maximum de tentatives atteint' });
    }
    const questions = db.prepare('SELECT * FROM test_questions WHERE test_id = ?').all(req.params.id);
    let earnedPoints = 0;
    const results = questions.map(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) earnedPoints += q.points;
      return { question_id: q.id, user_answer: userAnswer, correct_answer: q.correct_answer, is_correct: isCorrect, explanation: q.explanation, points: q.points, earned: isCorrect ? q.points : 0 };
    });
    const score = test.total_points > 0 ? Math.round((earnedPoints / test.total_points) * 100) : 0;
    const attemptId = uuidv4();
    db.prepare('INSERT INTO test_attempts (id, user_id, test_id, score, total_points, earned_points, answers, time_spent_seconds, status, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)').run(attemptId, req.user.id, req.params.id, score, test.total_points, earnedPoints, JSON.stringify(results), time_spent_seconds || 0, 'submitted');
    logActivity(req.user.id, 'test_submit', 'test', req.params.id, 'Score: ' + score + '%', req.ip);
    res.json({ attempt_id: attemptId, score, total_points: test.total_points, earned_points: earnedPoints, passing_score: test.passing_score, passed: score >= test.passing_score, results, time_spent_seconds: time_spent_seconds || 0 });
  } catch (error) {
    console.error('Erreur test submit:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/:id/attempts', authenticate, (req, res) => {
  try {
    const attempts = db.prepare('SELECT * FROM test_attempts WHERE user_id = ? AND test_id = ? ORDER BY started_at DESC').all(req.user.id, req.params.id);
    res.json({ attempts });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
