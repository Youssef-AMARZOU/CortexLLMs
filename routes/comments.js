const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, (req, res) => {
  try {
    const { course_id, quiz_id, test_id, page = 1, limit = 20 } = req.query;
    let query = 'SELECT cm.*, u.username, u.avatar FROM comments cm JOIN users u ON cm.user_id = u.id WHERE cm.is_approved = 1';
    const params = [];
    if (course_id) { query += ' AND cm.course_id = ?'; params.push(course_id); }
    if (quiz_id) { query += ' AND cm.quiz_id = ?'; params.push(quiz_id); }
    if (test_id) { query += ' AND cm.test_id = ?'; params.push(test_id); }
    const total = db.prepare(query.replace('SELECT cm.*, u.username, u.avatar', 'SELECT COUNT(*) as count')).get(...params).count;
    query += ' ORDER BY cm.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    const comments = db.prepare(query).all(...params);
    res.json({ comments, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error('Erreur comments list:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.post('/', authenticate, (req, res) => {
  try {
    const { course_id, quiz_id, test_id, parent_id, content, rating } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Le contenu du commentaire est requis' });
    }
    if (content.length > 2000) {
      return res.status(400).json({ error: 'Le commentaire ne doit pas depasser 2000 caracteres' });
    }
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'La note doit etre entre 1 et 5' });
    }
    const id = uuidv4();
    db.prepare('INSERT INTO comments (id, user_id, course_id, quiz_id, test_id, parent_id, content, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, req.user.id, course_id || null, quiz_id || null, test_id || null, parent_id || null, content.trim(), rating || null);
    const comment = db.prepare('SELECT cm.*, u.username, u.avatar FROM comments cm JOIN users u ON cm.user_id = u.id WHERE cm.id = ?').get(id);
    res.status(201).json({ message: 'Commentaire publie', comment });
  } catch (error) {
    console.error('Erreur comment create:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.put('/:id', authenticate, (req, res) => {
  try {
    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Commentaire non trouve' });
    if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorise' });
    }
    const { content, rating } = req.body;
    if (content) {
      db.prepare('UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(content.trim(), req.params.id);
    }
    if (rating !== undefined) {
      db.prepare('UPDATE comments SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(rating, req.params.id);
    }
    const updated = db.prepare('SELECT cm.*, u.username, u.avatar FROM comments cm JOIN users u ON cm.user_id = u.id WHERE cm.id = ?').get(req.params.id);
    res.json({ message: 'Commentaire mis a jour', comment: updated });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  try {
    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Commentaire non trouve' });
    if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Non autorise' });
    }
    db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
    res.json({ message: 'Commentaire supprime' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/stats/:contentType/:contentId', optionalAuth, (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const column = contentType === 'course' ? 'course_id' : contentType === 'quiz' ? 'quiz_id' : 'test_id';
    const stats = db.prepare(`
      SELECT COUNT(*) as total_comments, ROUND(AVG(rating)) as avg_rating
      FROM comments WHERE ${column} = ? AND is_approved = 1 AND rating IS NOT NULL
    `).get(contentId);
    const distribution = db.prepare(`
      SELECT rating, COUNT(*) as count FROM comments
      WHERE ${column} = ? AND is_approved = 1 AND rating IS NOT NULL
      GROUP BY rating ORDER BY rating DESC
    `).all(contentId);
    res.json({ stats, distribution });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
