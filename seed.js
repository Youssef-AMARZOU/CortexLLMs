const db = require('./database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

console.log('Seeding database...');

const categories = [
  { id: uuidv4(), name: 'Ingenierie IA', slug: 'ingenierie-ia', description: 'Preparation aux entretiens IA/ML', icon: 'robot', color: '#8b5cf6', sort_order: 1 },
  { id: uuidv4(), name: 'DevOps', slug: 'devops', description: 'Maitrisez les entretiens DevOps', icon: 'cloud', color: '#06b6d4', sort_order: 2 },
  { id: uuidv4(), name: 'System Design', slug: 'system-design', description: 'Low Level Design & System Design', icon: 'architecture', color: '#f59e0b', sort_order: 3 },
  { id: uuidv4(), name: 'Patterns DSA', slug: 'patterns-dsa', description: 'Maitriser tous les patterns DSA', icon: 'code', color: '#10b981', sort_order: 4 },
  { id: uuidv4(), name: 'Recherche Entreprises', slug: 'recherche-entreprises', description: 'Conventions communes des ingenieurs logiciel', icon: 'building', color: '#ef4444', sort_order: 5 },
  { id: uuidv4(), name: 'Problemes DSA', slug: 'problemes-dsa', description: 'Comment resoudre les problemes DSA', icon: 'puzzle', color: '#ec4899', sort_order: 6 },
];

const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (id, name, slug, description, icon, color, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)');
for (const c of categories) {
  insertCategory.run(c.id, c.name, c.slug, c.description, c.icon, c.color, c.sort_order);
}

const quizzes = [
  { id: uuidv4(), category_id: categories[0].id, title: 'Quiz Fondamentaux IA', description: 'Testez vos connaissances en IA/ML', time_limit_minutes: 15, passing_score: 70, max_attempts: 3 },
  { id: uuidv4(), category_id: categories[1].id, title: 'Quiz DevOps Bases', description: 'Concepts fondamentaux DevOps', time_limit_minutes: 15, passing_score: 70, max_attempts: 3 },
  { id: uuidv4(), category_id: categories[2].id, title: 'Quiz System Design', description: 'Principes de conception de systemes', time_limit_minutes: 20, passing_score: 60, max_attempts: 2 },
  { id: uuidv4(), category_id: categories[3].id, title: 'Quiz Patterns DSA', description: 'Patterns de structures de donnees et algorithmes', time_limit_minutes: 20, passing_score: 70, max_attempts: 3 },
  { id: uuidv4(), category_id: categories[5].id, title: 'Quiz Problemes DSA Niveau Facile', description: 'Problemes DSA de niveau facile', time_limit_minutes: 15, passing_score: 60, max_attempts: 3 },
  { id: uuidv4(), category_id: categories[0].id, title: 'Quiz Deep Learning Avance', description: 'Conceptes avances en deep learning', time_limit_minutes: 25, passing_score: 75, max_attempts: 2 },
];

const insertQuiz = db.prepare('INSERT OR IGNORE INTO quizzes (id, category_id, title, description, time_limit_minutes, passing_score, max_attempts) VALUES (?, ?, ?, ?, ?, ?, ?)');
for (const q of quizzes) {
  insertQuiz.run(q.id, q.category_id, q.title, q.description, q.time_limit_minutes, q.passing_score, q.max_attempts);
}

const questions = [
  // Quiz IA Fondamentaux
  { quiz_id: quizzes[0].id, question_text: 'Qu\'est-ce que le Machine Learning ?', question_type: 'multiple_choice', options: JSON.stringify(['Un sous-ensemble de l\'IA', 'Un type de base de donnees', 'Un langage de programmation', 'Un systeme d\'exploitation']), correct_answer: 'Un sous-ensemble de l\'IA', explanation: 'Le Machine Learning est un sous-ensemble de l\'intelligence artificielle qui permet aux systemes d\'apprendre a partir de donnees.', points: 1, sort_order: 1 },
  { quiz_id: quizzes[0].id, question_text: 'Quelle est la difference entre supervision et non-supervision ?', question_type: 'multiple_choice', options: JSON.stringify(['Supervision = donnees etiquetees, Non-supervision = pas d\'etiquettes', 'Supervision = rapide, Non-supervision = lent', 'Aucune difference', 'Supervision = test, Non-supervision = entrainement']), correct_answer: 'Supervision = donnees etiquetees, Non-supervision = pas d\'etiquettes', explanation: 'L\'apprentissage supervise utilise des donnees etiquetées, tandis que l\'apprentissage non supervise decouvre des patterns dans des donnees non etiquetees.', points: 1, sort_order: 2 },
  { quiz_id: quizzes[0].id, question_text: 'Qu\'est-ce qu\'un reseau de neurones ?', question_type: 'multiple_choice', options: JSON.stringify(['Un modele compose de couches de neurones artificiels', 'Un reseau informatique', 'Un type de base de donnees', 'Un algorithme de tri']), correct_answer: 'Un modele compose de couches de neurones artificiels', explanation: 'Un reseau de neurones est un modele computationnel inspire du cerveau humain, compose de neurones artificiels organises en couches.', points: 1, sort_order: 3 },
  { quiz_id: quizzes[0].id, question_text: 'Le surapprentissage (overfitting) est un bon resultat.', question_type: 'true_false', options: JSON.stringify(['Vrai', 'Faux']), correct_answer: 'Faux', explanation: 'Le surapprentissage signifie que le modele memorise les donnees d\'entrainement au lieu d\'apprendre les patterns generaux.', points: 1, sort_order: 4 },
  { quiz_id: quizzes[0].id, question_text: 'Quel est le role de la fonction de perte ?', question_type: 'multiple_choice', options: JSON.stringify(['Mesurer l\'erreur du modele', 'Generer des donnees', 'Accelerer l\'entrainement', 'Stocker les poids']), correct_answer: 'Mesurer l\'erreur du modele', explanation: 'La fonction de perte mesure l\'ecart entre les predictions du modele et les valeurs reelles.', points: 1, sort_order: 5 },

  // Quiz DevOps
  { quiz_id: quizzes[1].id, question_text: 'Qu\'est-ce que le CI/CD ?', question_type: 'multiple_choice', options: JSON.stringify(['Integration Continue / Deploiement Continu', 'Code Info / Code Data', 'Central Input / Central Output', 'Cloud Infrastructure / Cloud Deployment']), correct_answer: 'Integration Continue / Deploiement Continu', explanation: 'CI/CD est une methode de developpement logiciel permettant des livraisons frequentes et automatisees.', points: 1, sort_order: 1 },
  { quiz_id: quizzes[1].id, question_text: 'Docker est un outil de virtualisation.', question_type: 'true_false', options: JSON.stringify(['Vrai', 'Faux']), correct_answer: 'Faux', explanation: 'Docker est un outil de conteneurisation, pas de virtualisation. Les conteneurs partagent le noyau de l\'OS hote.', points: 1, sort_order: 2 },
  { quiz_id: quizzes[1].id, question_text: 'Quel est le role de Kubernetes ?', question_type: 'multiple_choice', options: JSON.stringify(['Orchestration de conteneurs', 'Controle de version', 'Compilation de code', 'Gestion de bases de donnees']), correct_answer: 'Orchestration de conteneurs', explanation: 'Kubernetes est une plateforme d\'orchestration de conteneurs qui automatise le deploiement, la mise a l\'echelle et la gestion des applications conteneurisees.', points: 1, sort_order: 3 },
  { quiz_id: quizzes[1].id, question_text: 'Qu\'est-ce qu\'Infrastructure as Code (IaC) ?', question_type: 'multiple_choice', options: JSON.stringify(['Gestion de l\'infrastructure via du code', 'Ecrire du code sur l\'infrastructure', 'Un type de cloud', 'Un framework JavaScript']), correct_answer: 'Gestion de l\'infrastructure via du code', explanation: 'IaC est la pratique de gerer et de provisionner l\'infrastructure informatique via du code plutot que manuellement.', points: 1, sort_order: 4 },
  { quiz_id: quizzes[1].id, question_text: 'Quel outil est utilise pour le monitoring ?', question_type: 'multiple_choice', options: JSON.stringify(['Prometheus', 'Git', 'npm', 'Webpack']), correct_answer: 'Prometheus', explanation: 'Prometheus est un outil de surveillance et d\'alerte open source populaire dans l\'ecosysteme DevOps.', points: 1, sort_order: 5 },

  // Quiz System Design
  { quiz_id: quizzes[2].id, question_text: 'Qu\'est-ce qu\'un systeme distribue ?', question_type: 'multiple_choice', options: JSON.stringify(['Un systeme dont les composants communiquent via un reseau', 'Un systeme avec un seul serveur', 'Un systeme sans base de donnees', 'Un systeme monolithique']), correct_answer: 'Un systeme dont les composants communiquent via un reseau', explanation: 'Un systeme distribue est compose de composants autonomes qui communiquent via un reseau pour former un systeme coherent.', points: 2, sort_order: 1 },
  { quiz_id: quizzes[2].id, question_text: 'Qu\'est-ce que le CAP Theorem ?', question_type: 'multiple_choice', options: JSON.stringify(['Consistence, Disponibilite, Partition tolerance', 'Code, API, Protocol', 'Cache, Auth, Performance', 'Cloud, Application, Platform']), correct_answer: 'Consistence, Disponibilite, Partition tolerance', explanation: 'Le theoreme CAP stipule qu\'un systeme distribue ne peut garantir simultanement Consistence, Disponibilite et Partition tolerance.', points: 2, sort_order: 2 },
  { quiz_id: quizzes[2].id, question_text: 'Un load balancer distribue le trafic sur plusieurs serveurs.', question_type: 'true_false', options: JSON.stringify(['Vrai', 'Faux']), correct_answer: 'Vrai', explanation: 'Un equilibreur de charge repartit les requetes entrantes sur plusieurs serveurs pour ameliorer la disponibilite et les performances.', points: 2, sort_order: 3 },
  { quiz_id: quizzes[2].id, question_text: 'Quel est le role du caching ?', question_type: 'multiple_choice', options: JSON.stringify(['Stocker des donnees frequently accessibles pour une reponse rapide', 'Sauvegarder des donnees sur le disque', 'Encrypter les donnees', 'Nettoyer les bases de donnees']), correct_answer: 'Stocker des donnees frequently accessibles pour une reponse rapide', explanation: 'Le caching stocke des copies de donnees dans un acces rapide pour reduire la latence et la charge sur les systemes sous-jacents.', points: 2, sort_order: 4 },

  // Quiz DSA Patterns
  { quiz_id: quizzes[3].id, question_text: 'Quel pattern utiliser pour trouver deux nombres dont la somme est cible ?', question_type: 'multiple_choice', options: JSON.stringify(['Two Pointers / Hash Map', 'BFS', 'Divide and Conquer', 'Dynamic Programming']), correct_answer: 'Two Pointers / Hash Map', explanation: 'Le pattern Two Pointers est ideal pour les problemes de paire, et le Hash Map permet une resolution en O(n).', points: 2, sort_order: 1 },
  { quiz_id: quizzes[3].id, question_text: 'Le pattern Sliding Window est utile pour les problemes de sous-tableaux contigus.', question_type: 'true_false', options: JSON.stringify(['Vrai', 'Faux']), correct_answer: 'Vrai', explanation: 'Le Sliding Window est utilise pour traiter des sous-ensembles contigus d\'elements, comme les fenetres glissantes.', points: 2, sort_order: 2 },
  { quiz_id: quizzes[3].id, question_text: 'Quand utiliser le pattern Binary Search ?', question_type: 'multiple_choice', options: JSON.stringify(['Quand le tableau est trie et on cherche un element', 'Toujours', 'Uniquement pour les listes liees', 'Pour trier un tableau']), correct_answer: 'Quand le tableau est trie et on cherche un element', explanation: 'Binary Search est applicable quand les donnees sont triees, permettant une recherche en O(log n).', points: 2, sort_order: 3 },
  { quiz_id: quizzes[3].id, question_text: 'Quel pattern pour resoudre les problemes de plus longue sous-sequence commune ?', question_type: 'multiple_choice', options: JSON.stringify(['Dynamic Programming', 'Greedy', 'Backtracking', 'DFS']), correct_answer: 'Dynamic Programming', explanation: 'Le LCS (Longest Common Subsequence) est un problem classique de programmation dynamique.', points: 2, sort_order: 4 },

  // Quiz DSA Facile
  { quiz_id: quizzes[4].id, question_text: 'Quelle est la complexite temporelle de la recherche dans un tableau trie ?', question_type: 'multiple_choice', options: JSON.stringify(['O(log n)', 'O(n)', 'O(n^2)', 'O(1)']), correct_answer: 'O(log n)', explanation: 'La recherche binaire dans un tableau trie a une complexite O(log n).', points: 1, sort_order: 1 },
  { quiz_id: quizzes[4].id, question_text: 'Une pile (stack) suit le principe LIFO.', question_type: 'true_false', options: JSON.stringify(['Vrai', 'Faux']), correct_answer: 'Vrai', explanation: 'LIFO = Last In, First Out. Le dernier element empile est le premier a etre depile.', points: 1, sort_order: 2 },
  { quiz_id: quizzes[4].id, question_text: 'Quelle structure de donnees pour implementer une file (queue) ?', question_type: 'multiple_choice', options: JSON.stringify(['Linked List ou tableau circulaire', 'Pile', 'Arbre binaire', 'Graphe']), correct_answer: 'Linked List ou tableau circulaire', explanation: 'Une file (FIFO) peut etre implementee efficacement avec une liste liee ou un tableau circulaire.', points: 1, sort_order: 3 },

  // Quiz Deep Learning
  { quiz_id: quizzes[5].id, question_text: 'Qu\'est-ce qu\'une couche de convolution ?', question_type: 'multiple_choice', options: JSON.stringify(['Une couche qui applique des filtres pour extraire des caracteristiques', 'Une couche de sortie', 'Une couche de regularisation', 'Une couche d\'activation']), correct_answer: 'Une couche qui applique des filtres pour extraire des caracteristiques', explanation: 'Les couches de convolution appliquent des filtres (kernels) pour detecter des motifs dans les donnees d\'entree.', points: 2, sort_order: 1 },
  { quiz_id: quizzes[5].id, question_text: 'Qu\'est-ce que le Transfer Learning ?', question_type: 'multiple_choice', options: JSON.stringify(['Utiliser un modele pre-entraine comme point de depart', 'Transferer des donnees entre serveurs', 'Deplacer un modele d\'un ordinateur a un autre', 'Un type de regularisation']), correct_answer: 'Utiliser un modele pre-entraine comme point de depart', explanation: 'Le Transfer Learning reutilise les connaissances d\'un modele pre-entraine pour resoudre un probleme similaire.', points: 2, sort_order: 2 },
  { quiz_id: quizzes[5].id, question_text: 'Le learning rate trop eleve peut empecher la convergence.', question_type: 'true_false', options: JSON.stringify(['Vrai', 'Faux']), correct_answer: 'Vrai', explanation: 'Un learning rate trop eleve peut faire diverger l\'optimisation au lieu de converger vers un minimum.', points: 2, sort_order: 3 },
];

const insertQuestion = db.prepare('INSERT OR IGNORE INTO questions (id, quiz_id, question_text, question_type, options, correct_answer, explanation, points, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
for (const q of questions) {
  insertQuestion.run(uuidv4(), q.quiz_id, q.question_text, q.question_type, q.options, q.correct_answer, q.explanation, q.points, q.sort_order);
}

// Tests notes
const tests = [
  { id: uuidv4(), category_id: categories[0].id, title: 'Test IA Complet', description: 'Evaluation complete sur les fondamentaux de l\'IA', time_limit_minutes: 45, total_points: 100, passing_score: 60, max_attempts: 2 },
  { id: uuidv4(), category_id: categories[3].id, title: 'Test DSA Patterns - Niveau Intermédiaire', description: 'Evaluation sur les patterns DSA avances', time_limit_minutes: 60, total_points: 100, passing_score: 70, max_attempts: 1 },
];

const insertTest = db.prepare('INSERT OR IGNORE INTO tests (id, category_id, title, description, time_limit_minutes, total_points, passing_score, max_attempts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
for (const t of tests) {
  insertTest.run(t.id, t.category_id, t.title, t.description, t.time_limit_minutes, t.total_points, t.passing_score, t.max_attempts);
}

const testQuestions = [
  // Test IA Complet
  { test_id: tests[0].id, question_text: 'Expliquez la difference entre apprentissage supervise et non-supervise.', question_type: 'multiple_choice', options: JSON.stringify(['Supervise: donnees etiquetees, Non-supervise: pas d\'etiquettes', 'Supervise: plus rapide, Non-supervise: plus lent', 'Aucune difference']), correct_answer: 'Supervise: donnees etiquetees, Non-supervise: pas d\'etiquettes', explanation: 'L\'apprentissage supervise utilise des paires (entree, sortie) etiquetees.', points: 10, sort_order: 1 },
  { test_id: tests[0].id, question_text: 'Qu\'est-ce que le Regularization dans le Deep Learning ?', question_type: 'multiple_choice', options: JSON.stringify(['Technique pour eviter le surapprentissage', 'Un type d\'activation', 'Un optimiseur', 'Un type de donnees']), correct_answer: 'Technique pour eviter le surapprentissage', explanation: 'La regularisation (Dropout, L1, L2) aide a prevenir le surapprentissage.', points: 10, sort_order: 2 },
  { test_id: tests[0].id, question_text: 'Quel est le role du gradient dans l\'optimisation ?', question_type: 'multiple_choice', options: JSON.stringify(['Indiquer la direction de descente', 'Calculer l\'erreur', 'Generer des donnees', 'Mesurer la performance']), correct_answer: 'Indiquer la direction de descente', explanation: 'Le gradient indique la direction de la pente maximale pour mettre a jour les poids.', points: 10, sort_order: 3 },

  // Test DSA Patterns
  { test_id: tests[1].id, question_text: 'Quel algorithme pour trouver le plus court chemin dans un graphe non pese ?', question_type: 'multiple_choice', options: JSON.stringify(['BFS (Breadth-First Search)', 'DFS', 'Dijkstra', 'Bellman-Ford']), correct_answer: 'BFS (Breadth-First Search)', explanation: 'BFS trouve le plus court chemin dans un graphe non pese en explorant couche par couche.', points: 15, sort_order: 1 },
  { test_id: tests[1].id, question_text: 'Expliquez le concept de Backtracking avec un exemple.', question_type: 'multiple_choice', options: JSON.stringify(['Resolution de problemes par essais-erroirs avec retour arriere', 'Trier un tableau', 'Rechercher un element', 'Parcourir un graphe']), correct_answer: 'Resolution de problemes par essais-erroirs avec retour arriere', explanation: 'Le Backtracking explore toutes les solutions possibles en revenant en arriere quand une solution partielle est invalide.', points: 15, sort_order: 2 },
  { test_id: tests[1].id, question_text: 'Quand utiliser Divide and Conquer vs Dynamic Programming ?', question_type: 'multiple_choice', options: JSON.stringify(['Divide and Conquer: sous-problemes independants, DP: sous-problemes se recouvrent', 'Toujours utiliser DP', 'Toujours utiliser Divide and Conquer', 'Aucune difference']), correct_answer: 'Divide and Conquer: sous-problemes independants, DP: sous-problemes se recouvrent', explanation: 'D&C est optimal quand les sous-problemes sont independants, DP quand ils partagent des sous-problemes.', points: 15, sort_order: 3 },
];

const insertTestQuestion = db.prepare('INSERT OR IGNORE INTO test_questions (id, test_id, question_text, question_type, options, correct_answer, explanation, points, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
for (const q of testQuestions) {
  insertTestQuestion.run(uuidv4(), q.test_id, q.question_text, q.question_type, q.options, q.correct_answer, q.explanation, q.points, q.sort_order);
}

// Create admin user
const adminPassword = bcrypt.hashSync('admin123', 12);
db.prepare('INSERT OR IGNORE INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), 'admin', 'admin@cortexllms.io', adminPassword, 'admin');

console.log('Seed termine !');
console.log('- 6 categories creees');
console.log('- 6 quizzes avec questions');
console.log('- 2 tests notes avec questions');
console.log('- Compte admin: admin@cortexllms.io / admin123');
