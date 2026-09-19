const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticate, requireRole, logActivity } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, requireRole('admin'));

router.get('/dashboard', (req, res) => {
  try {
    const stats = {
      users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
      courses: db.prepare('SELECT COUNT(*) as count FROM courses').get().count,
      quizzes: db.prepare('SELECT COUNT(*) as count FROM quizzes').get().count,
      tests: db.prepare('SELECT COUNT(*) as count FROM tests').get().count,
      quizAttempts: db.prepare('SELECT COUNT(*) as count FROM quiz_attempts').get().count,
      testAttempts: db.prepare('SELECT COUNT(*) as count FROM test_attempts').get().count,
      comments: db.prepare('SELECT COUNT(*) as count FROM comments').get().count,
    };
    const recentUsers = db.prepare('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 10').all();
    const recentActivity = db.prepare('SELECT al.*, u.username FROM activity_log al LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT 20').all();
    res.json({ stats, recentUsers, recentActivity });
  } catch (error) {
    console.error('Erreur admin dashboard:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/users', (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    let query = 'SELECT id, username, email, role, created_at FROM users';
    const params = [];
    if (search) { query += ' WHERE username LIKE ? OR email LIKE ?'; params.push('%'+search+'%', '%'+search+'%'); }
    const total = db.prepare(query.replace('SELECT id, username, email, role, created_at', 'SELECT COUNT(*) as count')).get(...params).count;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    const users = db.prepare(query).all(...params);
    res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.put('/users/:id/role', (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({ error: 'Role invalide' });
    }
    db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(role, req.params.id);
    logActivity(req.user.id, 'role_change', 'user', req.params.id, 'Role change: ' + role, req.ip);
    res.json({ message: 'Role mis a jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.delete('/users/:id', (req, res) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'Impossible de supprimer son propre compte' });
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    logActivity(req.user.id, 'user_delete', 'user', req.params.id, 'Utilisateur supprime', req.ip);
    res.json({ message: 'Utilisateur supprime' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.post('/categories', (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    if (!name) return res.status(400).json({ error: 'Le nom est requis' });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = uuidv4();
    db.prepare('INSERT INTO categories (id, name, slug, description, icon, color) VALUES (?, ?, ?, ?, ?, ?)').run(id, name, slug, description || '', icon || 'code', color || '#3b82f6');
    res.status(201).json({ message: 'Categorie creee', category: { id, name, slug } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.put('/categories/:id', (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    const updates = [];
    const params = [];
    if (name) { updates.push('name = ?'); params.push(name); updates.push('slug = ?'); params.push(name.toLowerCase().replace(/[^a-z0-9]+/g, '-')); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (icon) { updates.push('icon = ?'); params.push(icon); }
    if (color) { updates.push('color = ?'); params.push(color); }
    if (updates.length === 0) return res.status(400).json({ error: 'Aucun champ a modifier' });
    params.push(req.params.id);
    db.prepare('UPDATE categories SET ' + updates.join(', ') + ' WHERE id = ?').run(...params);
    res.json({ message: 'Categorie mise a jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.post('/courses', (req, res) => {
  try {
    const { category_id, title, description, content, difficulty, duration_minutes } = req.body;
    if (!category_id || !title) return res.status(400).json({ error: 'Categorie et titre requis' });
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = uuidv4();
    db.prepare('INSERT INTO courses (id, category_id, title, slug, description, content, difficulty, duration_minutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, category_id, title, slug, description || '', content || '', difficulty || 'medium', duration_minutes || 30);
    res.status(201).json({ message: 'Cours cree', course: { id, title, slug } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.post('/quizzes', (req, res) => {
  try {
    const { category_id, title, description, time_limit_minutes, passing_score, max_attempts } = req.body;
    if (!category_id || !title) return res.status(400).json({ error: 'Categorie et titre requis' });
    const id = uuidv4();
    db.prepare('INSERT INTO quizzes (id, category_id, title, description, time_limit_minutes, passing_score, max_attempts) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, category_id, title, description || '', time_limit_minutes || 15, passing_score || 70, max_attempts || 3);
    res.status(201).json({ message: 'Quiz cree', quiz: { id, title } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.post('/quizzes/:quizId/questions', (req, res) => {
  try {
    const { question_text, question_type, options, correct_answer, explanation, points } = req.body;
    if (!question_text || !correct_answer) return res.status(400).json({ error: 'Question et reponse correcte requis' });
    const id = uuidv4();
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM questions WHERE quiz_id = ?').get(req.params.quizId);
    db.prepare('INSERT INTO questions (id, quiz_id, question_text, question_type, options, correct_answer, explanation, points, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, req.params.quizId, question_text, question_type || 'multiple_choice', JSON.stringify(options || []), correct_answer, explanation || '', points || 1, (maxOrder?.max || 0) + 1);
    res.status(201).json({ message: 'Question ajoutee', question: { id } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.post('/tests', (req, res) => {
  try {
    const { category_id, title, description, time_limit_minutes, total_points, passing_score, max_attempts } = req.body;
    if (!category_id || !title) return res.status(400).json({ error: 'Categorie et titre requis' });
    const id = uuidv4();
    db.prepare('INSERT INTO tests (id, category_id, title, description, time_limit_minutes, total_points, passing_score, max_attempts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, category_id, title, description || '', time_limit_minutes || 60, total_points || 100, passing_score || 60, max_attempts || 1);
    res.status(201).json({ message: 'Test cree', test: { id, title } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.post('/tests/:testId/questions', (req, res) => {
  try {
    const { question_text, question_type, options, correct_answer, explanation, points } = req.body;
    if (!question_text || !correct_answer) return res.status(400).json({ error: 'Question et reponse correcte requis' });
    const id = uuidv4();
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM test_questions WHERE test_id = ?').get(req.params.testId);
    db.prepare('INSERT INTO test_questions (id, test_id, question_text, question_type, options, correct_answer, explanation, points, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, req.params.testId, question_text, question_type || 'multiple_choice', JSON.stringify(options || []), correct_answer, explanation || '', points || 10, (maxOrder?.max || 0) + 1);
    res.status(201).json({ message: 'Question ajoutee', question: { id } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/comments', (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = db.prepare('SELECT COUNT(*) as count FROM comments').get().count;
    const comments = db.prepare('SELECT cm.*, u.username FROM comments cm JOIN users u ON cm.user_id = u.id ORDER BY cm.created_at DESC LIMIT ? OFFSET ?').all(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    res.json({ comments, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.put('/comments/:id/approve', (req, res) => {
  try {
    db.prepare('UPDATE comments SET is_approved = 1 WHERE id = ?').run(req.params.id);
    res.json({ message: 'Commentaire approuve' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.delete('/comments/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
    res.json({ message: 'Commentaire supprime' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
