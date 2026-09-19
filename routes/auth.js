const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { generateToken, authenticate, logActivity } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Le nom d\'utilisateur doit contenir entre 3 et 30 caracteres' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caracteres' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existingUser) {
      return res.status(409).json({ error: 'Email ou nom d\'utilisateur deja utilise' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    db.prepare('INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)').run(userId, username, email, hashedPassword);
    const token = generateToken(userId, 'user');
    logActivity(userId, 'register', 'user', userId, 'Nouvel utilisateur inscrit', req.ip);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ message: 'Inscription reussie', user: { id: userId, username, email, role: 'user' }, token });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    const token = generateToken(user.id, user.role);
    logActivity(user.id, 'login', 'user', user.id, 'Connexion reussie', req.ip);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ message: 'Connexion reussie', user: { id: user.id, username: user.username, email: user.email, role: user.role, avatar: user.avatar }, token });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.post('/logout', authenticate, (req, res) => {
  logActivity(req.user.id, 'logout', 'user', req.user.id, 'Deconnexion', req.ip);
  res.clearCookie('token');
  res.json({ message: 'Deconnexion reussie' });
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;
    const updates = [];
    const params = [];
    if (username) {
      const existing = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, req.user.id);
      if (existing) return res.status(409).json({ error: 'Nom d\'utilisateur deja utilise' });
      updates.push('username = ?');
      params.push(username);
    }
    if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); }
    if (avatar !== undefined) { updates.push('avatar = ?'); params.push(avatar); }
    if (updates.length === 0) return res.status(400).json({ error: 'Aucun champ a modifier' });
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.user.id);
    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    const updatedUser = db.prepare('SELECT id, username, email, role, avatar, bio FROM users WHERE id = ?').get(req.user.id);
    res.json({ message: 'Profil mis a jour', user: updatedUser });
  } catch (error) {
    console.error('Erreur mise a jour profil:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.put('/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel et nouveau mot de passe requis' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caracteres' });
    }
    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hashedPassword, req.user.id);
    logActivity(req.user.id, 'password_change', 'user', req.user.id, 'Mot de passe modifie', req.ip);
    res.json({ message: 'Mot de passe mis a jour' });
  } catch (error) {
    console.error('Erreur mot de passe:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
