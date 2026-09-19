const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'cortexllms.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('user','admin','moderator')),
    avatar TEXT DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'code',
    color TEXT DEFAULT '#3b82f6',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    difficulty TEXT DEFAULT 'medium' CHECK(difficulty IN ('easy','medium','hard')),
    duration_minutes INTEGER DEFAULT 30,
    sort_order INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    course_id TEXT,
    category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER DEFAULT 15,
    passing_score INTEGER DEFAULT 70,
    max_attempts INTEGER DEFAULT 3,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    quiz_id TEXT NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice' CHECK(question_type IN ('multiple_choice','true_false','code_analysis','fill_blank')),
    options TEXT,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
  );

  CREATE TABLE IF NOT EXISTS tests (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER DEFAULT 60,
    total_points INTEGER DEFAULT 100,
    passing_score INTEGER DEFAULT 60,
    max_attempts INTEGER DEFAULT 1,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS test_questions (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice' CHECK(question_type IN ('multiple_choice','true_false','code_analysis','fill_blank','open_ended')),
    options TEXT,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 10,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (test_id) REFERENCES tests(id)
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT,
    quiz_id TEXT,
    test_id TEXT,
    status TEXT DEFAULT 'not_started' CHECK(status IN ('not_started','in_progress','completed')),
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    FOREIGN KEY (test_id) REFERENCES tests(id)
  );

  CREATE TABLE IF NOT EXISTS quiz_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    quiz_id TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    answers TEXT,
    time_spent_seconds INTEGER DEFAULT 0,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
  );

  CREATE TABLE IF NOT EXISTS test_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    test_id TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    earned_points INTEGER DEFAULT 0,
    answers TEXT,
    time_spent_seconds INTEGER DEFAULT 0,
    status TEXT DEFAULT 'in_progress' CHECK(status IN ('in_progress','submitted','graded')),
    feedback TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    graded_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (test_id) REFERENCES tests(id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT,
    quiz_id TEXT,
    test_id TEXT,
    parent_id TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    is_approved INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    FOREIGN KEY (test_id) REFERENCES tests(id),
    FOREIGN KEY (parent_id) REFERENCES comments(id)
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT,
    quiz_id TEXT,
    test_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    FOREIGN KEY (test_id) REFERENCES tests(id)
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
  CREATE INDEX IF NOT EXISTS idx_quizzes_category ON quizzes(category_id);
  CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions(quiz_id);
  CREATE INDEX IF NOT EXISTS idx_tests_category ON tests(category_id);
  CREATE INDEX IF NOT EXISTS idx_test_questions_test ON test_questions(test_id);
  CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
  CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
  CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id);
  CREATE INDEX IF NOT EXISTS idx_comments_course ON comments(course_id);
  CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);
`);

module.exports = db;
