let cachedUser = null;

async function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const data = await api.get('/auth/me');
    cachedUser = data.user || data;
    return cachedUser;
  } catch (e) {
    localStorage.removeItem('token');
    cachedUser = null;
    return null;
  }
}

function requireAuth() {
  if (!localStorage.getItem('token')) {
    window.location.href = '/pages/login.html';
    return false;
  }
  return true;
}

function requireAdmin() {
  if (!requireAuth()) return false;
  if (!cachedUser || cachedUser.role !== 'admin') {
    window.location.href = '/';
    return false;
  }
  return true;
}

function getUser() {
  return cachedUser;
}

function showToast(message, type) {
  type = type || 'success';
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all .3s ease';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

function showModal(title, content, onClose) {
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.onclick = function(e) {
    if (e.target === overlay) closeModal();
  };
  overlay.innerHTML = '<div class="modal">' +
    '<div class="modal-header">' +
      '<h2>' + title + '</h2>' +
      '<button class="modal-close" onclick="App.closeModal()">&times;</button>' +
    '</div>' +
    '<div class="modal-body">' + content + '</div>' +
  '</div>';
  document.body.appendChild(overlay);
  if (onClose) overlay._onClose = onClose;
}

function closeModal() {
  var overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    if (overlay._onClose) overlay._onClose();
    overlay.remove();
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDuration(seconds) {
  if (!seconds) return '0s';
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = seconds % 60;
  if (h > 0) return h + 'h ' + m + 'min';
  if (m > 0) return m + 'min ' + s + 's';
  return s + 's';
}

function updateNav(user) {
  var nav = document.querySelector('.header-nav');
  if (!nav) return;
  if (user) {
    nav.innerHTML =
      '<a href="/pages/dashboard.html" class="btn btn-secondary btn-sm">Tableau de bord</a>' +
      (user.role === 'admin' ? '<a href="/pages/admin.html" class="btn btn-primary btn-sm">Admin</a>' : '') +
      '<div class="avatar avatar-sm">' + (user.username ? user.username.charAt(0).toUpperCase() : '?') + '</div>' +
      '<button class="btn btn-secondary btn-sm" onclick="App.logout()">Déconnexion</button>';
  } else {
    nav.innerHTML =
      '<a href="/pages/login.html" class="btn btn-secondary btn-sm">Connexion</a>' +
      '<a href="/pages/register.html" class="btn btn-primary btn-sm">Inscription</a>';
  }
}

async function initApp() {
  var user = await checkAuth();
  updateNav(user);
}

window.App = {
  checkAuth: checkAuth,
  requireAuth: requireAuth,
  requireAdmin: requireAdmin,
  getUser: getUser,
  showToast: showToast,
  showModal: showModal,
  closeModal: closeModal,
  formatDate: formatDate,
  formatDuration: formatDuration,
  updateNav: updateNav,
  initApp: initApp,
  logout: function() {
    auth.logout();
    cachedUser = null;
    window.location.href = '/';
  }
};