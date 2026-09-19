require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { securityHeaders, globalLimiter, apiLimiter, sanitizeInput, corsOptions } = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(sanitizeInput);
app.use(globalLimiter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', apiLimiter, require('./routes/courses'));
app.use('/api/quizzes', apiLimiter, require('./routes/quiz'));
app.use('/api/tests', apiLimiter, require('./routes/tests'));
app.use('/api/progress', apiLimiter, require('./routes/progress'));
app.use('/api/comments', apiLimiter, require('./routes/comments'));
app.use('/api/admin', apiLimiter, require('./routes/admin'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Route API non trouvee' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Erreur non geree:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`CortexLLMs.io - Serveur demarre sur le port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

module.exports = app;
