const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  const response = await fetch(API_BASE + url, { ...options, headers });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Erreur serveur');
  }
  return data;
}

const api = {
  get(url) { return request(url); },
  post(url, data) { return request(url, { method: 'POST', body: JSON.stringify(data) }); },
  put(url, data) { return request(url, { method: 'PUT', body: JSON.stringify(data) }); },
  delete(url) { return request(url, { method: 'DELETE' }); },
};

const auth = {
  login(email, password) { return api.post('/auth/login', { email, password }); },
  register(username, email, password) { return api.post('/auth/register', { username, email, password }); },
  logout() { localStorage.removeItem('token'); },
  getMe() { return api.get('/auth/me'); },
  updateProfile(data) { return api.put('/auth/profile', data); },
  updatePassword(data) { return api.put('/auth/password', data); },
};

const quizzes = {
  list(params) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get('/quizzes' + query);
  },
  get(id) { return api.get('/quizzes/' + id); },
  getQuestions(id) { return api.get('/quizzes/' + id + '/questions'); },
  submit(id, answers, time) { return api.post('/quizzes/' + id + '/submit', { answers, time }); },
  getAttempts(id) { return api.get('/quizzes/' + id + '/attempts'); },
};

const tests = {
  list(params) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get('/tests' + query);
  },
  get(id) { return api.get('/tests/' + id); },
  getQuestions(id) { return api.get('/tests/' + id + '/questions'); },
  submit(id, answers, time) { return api.post('/tests/' + id + '/submit', { answers, time }); },
  getAttempts(id) { return api.get('/tests/' + id + '/attempts'); },
};

const courses = {
  list(params) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get('/courses' + query);
  },
  getCategories() { return api.get('/courses/categories'); },
  get(id) { return api.get('/courses/' + id); },
};

const progress = {
  get() { return api.get('/progress'); },
  updateCourse(courseId, status) { return api.put('/progress/course/' + courseId, { status }); },
  getStats() { return api.get('/progress/stats'); },
};

const comments = {
  list(params) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get('/comments' + query);
  },
  create(data) { return api.post('/comments', data); },
  update(id, data) { return api.put('/comments/' + id, data); },
  delete(id) { return api.delete('/comments/' + id); },
  getStats(type, id) { return api.get('/comments/stats/' + type + '/' + id); },
};

const admin = {
  getDashboard() { return api.get('/admin/dashboard'); },
  getUsers(params) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get('/admin/users' + query);
  },
  updateUserRole(id, role) { return api.put('/admin/users/' + id + '/role', { role }); },
  deleteUser(id) { return api.delete('/admin/users/' + id); },
  createCategory(data) { return api.post('/admin/categories', data); },
  updateCategory(id, data) { return api.put('/admin/categories/' + id, data); },
  createCourse(data) { return api.post('/admin/courses', data); },
  createQuiz(data) { return api.post('/admin/quizzes', data); },
  addQuestion(quizId, data) { return api.post('/admin/quizzes/' + quizId + '/questions', data); },
  createTest(data) { return api.post('/admin/tests', data); },
  addTestQuestion(testId, data) { return api.post('/admin/tests/' + testId + '/questions', data); },
  getComments(params) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get('/admin/comments' + query);
  },
  approveComment(id) { return api.put('/admin/comments/' + id + '/approve'); },
  deleteComment(id) { return api.delete('/admin/comments/' + id); },
};