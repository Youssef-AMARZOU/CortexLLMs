const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'cortexllms-secret-key-change-in-production';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentification requise' });
    }
    const decoded = verifyToken(token);
    const user = db.prepare('SELECT id, username, email, role, avatar, bio FROM users WHERE id = ?').get(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouve' });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expiree. Veuillez vous reconnecter.' });
    }
    return res.status(401).json({ error: 'Token invalide' });
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = verifyToken(token);
      const user = db.prepare('SELECT id, username, email, role, avatar, bio FROM users WHERE id = ?').get(decoded.id);
      if (user) req.user = user;
    }
  } catch {}
  next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acces interdit. Role requis: ' + roles.join(' ou ') });
    }
    next();
  };
};

const logActivity = (userId, action, resourceType, resourceId, details, ipAddress) => {
  try {
    db.prepare(`
      INSERT INTO activity_log (id, user_id, action, resource_type, resource_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(require('uuid').v4(), userId, action, resourceType, resourceId, details, ipAddress);
  } catch (error) {
    console.error('Erreur log activite:', error);
  }
};

module.exports = { generateToken, verifyToken, authenticate, optionalAuth, requireRole, logActivity, JWT_SECRET };
