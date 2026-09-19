const express = require('express');
const db = require('../database');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, (req, res) => {
  try {
    const { category_id, difficulty, search, page = 1, limit = 20 } = req.query;
    let query = 'SELECT co.*, c.name as category_name FROM courses co JOIN categories c ON co.category_id = c.id WHERE co.is_published = 1';
    const params = [];
    if (category_id) { query += ' AND co.category_id = ?'; params.push(category_id); }
    if (difficulty) { query += ' AND co.difficulty = ?'; params.push(difficulty); }
    if (search) { query += ' AND (co.title LIKE ? OR co.description LIKE ?)'; params.push('%'+search+'%', '%'+search+'%'); }
    const total = db.prepare(query.replace('SELECT co.*, c.name as category_name', 'SELECT COUNT(*) as count')).get(...params).count;
    query += ' ORDER BY co.sort_order, co.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    const courses = db.prepare(query).all(...params);
    res.json({ courses, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/categories', optionalAuth, (req, res) => {
  try {
    const categories = db.prepare('SELECT c.*, (SELECT COUNT(*) FROM courses WHERE category_id = c.id AND is_published = 1) as course_count FROM categories c ORDER BY c.sort_order, c.name').all();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/:id', optionalAuth, (req, res) => {
  try {
    const course = db.prepare('SELECT co.*, c.name as category_name FROM courses co JOIN categories c ON co.category_id = c.id WHERE co.id = ?').get(req.params.id);
    if (!course) return res.status(404).json({ error: 'Cours non trouve' });
    const relatedCourses = db.prepare('SELECT id, title, slug, difficulty, duration_minutes FROM courses WHERE category_id = ? AND id != ? AND is_published = 1 LIMIT 5').all(course.category_id, course.id);
    res.json({ course, relatedCourses });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
