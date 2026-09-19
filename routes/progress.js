const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  try {
    const progress = db.prepare(`
      SELECT up.*, c.title as course_title, q.title as quiz_title, t.title as test_title
      FROM user_progress up
      LEFT JOIN courses c ON up.course_id = c.id
      LEFT JOIN quizzes q ON up.quiz_id = q.id
      LEFT JOIN tests t ON up.test_id = t.id
      WHERE up.user_id = ?
      ORDER BY up.started_at DESC
    `).all(req.user.id);
    const stats = db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM user_progress WHERE user_id = ? AND status = 'completed') as completed,
        (SELECT COUNT(*) FROM user_progress WHERE user_id = ? AND status = 'in_progress') as in_progress,
        (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = ?) as quiz_attempts,
        (SELECT COUNT(*) FROM test_attempts WHERE user_id = ?) as test_attempts,
        (SELECT ROUND(AVG(score)) FROM quiz_attempts WHERE user_id = ?) as avg_quiz_score,
        (SELECT ROUND(AVG(score)) FROM test_attempts WHERE user_id = ?) as avg_test_score
    `).get(req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id);
    res.json({ progress, stats });
  } catch (error) {
    console.error('Erreur progress:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.post('/course/:courseId', authenticate, (req, res) => {
  try {
    const { status } = req.body;
    const course = db.prepare('SELECT id FROM courses WHERE id = ?').get(req.params.courseId);
    if (!course) return res.status(404).json({ error: 'Cours non trouve' });
    let progress = db.prepare('SELECT * FROM user_progress WHERE user_id = ? AND course_id = ?').get(req.user.id, req.params.courseId);
    if (progress) {
      db.prepare("UPDATE user_progress SET status = ?, completed_at = CASE WHEN ? = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END WHERE id = ?").run(status || 'in_progress', status || 'in_progress', progress.id);
    } else {
      const id = uuidv4();
      db.prepare('INSERT INTO user_progress (id, user_id, course_id, status) VALUES (?, ?, ?, ?)').run(id, req.user.id, req.params.courseId, status || 'in_progress');
    }
    res.json({ message: 'Progression mise a jour' });
  } catch (error) {
    console.error('Erreur course progress:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/stats', authenticate, (req, res) => {
  try {
    const weeklyActivity = db.prepare(`
      SELECT DATE(started_at) as day, COUNT(*) as count, AVG(score) as avg_score
      FROM quiz_attempts WHERE user_id = ? AND started_at >= DATE('now', '-7 days')
      GROUP BY DATE(started_at) ORDER BY day
    `).all(req.user.id);
    const topCategories = db.prepare(`
      SELECT c.name, ROUND(AVG(qa.score)) as avg_score, COUNT(*) as attempts
      FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id = q.id JOIN categories c ON q.category_id = c.id
      WHERE qa.user_id = ? GROUP BY c.id ORDER BY avg_score DESC LIMIT 5
    `).all(req.user.id);
    const recentActivity = db.prepare(`
      SELECT action, resource_type, details, created_at FROM activity_log
      WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
    `).all(req.user.id);
    res.json({ weeklyActivity, topCategories, recentActivity });
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
