const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// SQLite database connection
const db = new sqlite3.Database('./balancia.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

// Initialize tables
function initializeTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS income (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      total_income REAL NOT NULL,
      permanent_saving REAL NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS planned_expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS actual_expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS daily_expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      amount REAL NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS debts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      person TEXT NOT NULL,
      amount REAL NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      shared_expense_id INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS shared_expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      expense_id INTEGER NOT NULL,
      person TEXT NOT NULL,
      share_amount REAL NOT NULL
    )`
  ];

  tables.forEach(sql => {
    db.run(sql, (err) => {
      if (err) console.error('Error creating table:', err.message);
    });
  });
}

// API is running route
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// Add planned expense
app.post('/planned-expenses', (req, res) => {
  const { category, amount } = req.body;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  db.run('INSERT INTO planned_expenses (category, amount, month, year) VALUES (?, ?, ?, ?)',
    [category, amount, month, year], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, category, amount, month, year });
      }
    });
});

// Get planned expenses for specified or current month
app.get('/planned-expenses', (req, res) => {
  const now = new Date();
  const month = req.query.month || (now.getMonth() + 1);
  const year = req.query.year || now.getFullYear();

  db.all('SELECT * FROM planned_expenses WHERE month = ? AND year = ?',
    [month, year], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    });
});

// Add actual expense
app.post('/actual-expenses', (req, res) => {
  const { category, amount } = req.body;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  db.run('INSERT INTO actual_expenses (category, amount, month, year) VALUES (?, ?, ?, ?)',
    [category, amount, month, year], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, category, amount, month, year });
      }
    });
});

// Get actual expenses for specified or current month
app.get('/actual-expenses', (req, res) => {
  const now = new Date();
  const month = req.query.month || (now.getMonth() + 1);
  const year = req.query.year || now.getFullYear();

  db.all('SELECT * FROM actual_expenses WHERE month = ? AND year = ?',
    [month, year], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    });
});

// Get monthly summary
app.get('/summary/monthly', (req, res) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Get income
  db.get('SELECT total_income, permanent_saving FROM income WHERE month = ? AND year = ?',
    [month, year], (err, income) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const total_income = income ? income.total_income : 0;
      const permanent_saving = income ? income.permanent_saving : 0;

      // Get planned expenses total
      db.get('SELECT SUM(amount) as planned_total FROM planned_expenses WHERE month = ? AND year = ?',
        [month, year], (err, planned) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          const planned_total = planned ? planned.planned_total || 0 : 0;

          // Get actual expenses total
          db.get('SELECT SUM(amount) as actual_total FROM actual_expenses WHERE month = ? AND year = ?',
            [month, year], (err, actual) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }

              const actual_total = actual ? actual.actual_total || 0 : 0;
              const spendable_balance = total_income - planned_total - permanent_saving;

              res.json({
                total_income,
                planned_total,
                actual_total,
                permanent_saving,
                spendable_balance
              });
            });
        });
    });
});

// Get daily summary
app.get('/summary/daily', (req, res) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const today = now.getDate();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysLeft = daysInMonth - today + 1;

  // Get spendable balance from monthly summary
  db.get('SELECT total_income, permanent_saving FROM income WHERE month = ? AND year = ?',
    [month, year], (err, income) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const total_income = income ? income.total_income : 0;
      const permanent_saving = income ? income.permanent_saving : 0;

      db.get('SELECT SUM(amount) as planned_total FROM planned_expenses WHERE month = ? AND year = ?',
        [month, year], (err, planned) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          const planned_total = planned ? planned.planned_total || 0 : 0;
          const spendable_balance = total_income - planned_total - permanent_saving;

          // Get actual spent so far this month
          db.get('SELECT SUM(amount) as actual_total FROM actual_expenses WHERE month = ? AND year = ?',
            [month, year], (err, actual) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }

              const actual_total = actual ? actual.actual_total || 0 : 0;
              const remaining_balance = total_income - actual_total;
              const todays_allowance = daysLeft > 0 ? remaining_balance / daysLeft : 0;

              res.json({
                remaining_balance,
                days_left: daysLeft,
                todays_allowance: Math.max(0, todays_allowance)
              });
            });
        });
    });
});

// Add daily expense
app.post('/daily-expense', (req, res) => {
  const { amount, category, description, people } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  db.run('INSERT INTO daily_expenses (date, category, description, amount) VALUES (?, ?, ?, ?)',
    [today, category, description, amount], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const expenseId = this.lastID;

      if (people && people.length > 0) {
        // Insert shared expenses and debts
        people.forEach(person => {
          db.run('INSERT INTO shared_expenses (expense_id, person, share_amount) VALUES (?, ?, ?)',
            [expenseId, person.name, person.amount]);
          
          db.run('INSERT INTO debts (person, amount, month, year, shared_expense_id) VALUES (?, ?, ?, ?, ?)',
            [person.name, person.amount, month, year, expenseId]);
        });
      }

      res.json({ id: expenseId, date: today, category, description, amount });
    });
});

// Get daily expenses for a specific date
app.get('/daily-expenses', (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];

  db.all('SELECT * FROM daily_expenses WHERE date = ? ORDER BY id DESC',
    [date], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    });
});

// Get category summary for specified or current month
app.get('/summary/categories', (req, res) => {
  const now = new Date();
  const year = req.query.year || now.getFullYear();
  const month = String(req.query.month || (now.getMonth() + 1)).padStart(2, '0');
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;

  db.all('SELECT LOWER(category) as category, SUM(amount) as total FROM daily_expenses WHERE date >= ? AND date <= ? GROUP BY LOWER(category) ORDER BY total DESC',
    [startDate, endDate], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    });
});

// Get debts summary
app.get('/debts', (req, res) => {
  const now = new Date();
  const month = req.query.month || (now.getMonth() + 1);
  const year = req.query.year || now.getFullYear();

  db.all('SELECT person, SUM(amount) as total_debt FROM debts WHERE month = ? AND year = ? GROUP BY person ORDER BY total_debt DESC',
    [month, year], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    });
});

// Get transaction history
app.get('/transactions', (req, res) => {
  const now = new Date();
  const year = req.query.year || now.getFullYear();
  const month = String(req.query.month || (now.getMonth() + 1)).padStart(2, '0');
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;

  db.all('SELECT * FROM daily_expenses WHERE date >= ? AND date <= ? ORDER BY date DESC',
    [startDate, endDate], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    });
});

// Get user profile
app.get('/profile', (req, res) => {
  // For simplicity, return a default profile
  res.json({ username: 'User', email: 'user@example.com' });
});

// Update user profile
app.post('/profile', (req, res) => {
  const { username, email } = req.body;
  // In a real app, save to database
  res.json({ username, email });
});

// Add/Update income
app.post('/income', (req, res) => {
  const { total_income, permanent_saving } = req.body;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  db.run('INSERT OR REPLACE INTO income (month, year, total_income, permanent_saving) VALUES (?, ?, ?, ?)',
    [month, year, total_income, permanent_saving], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ month, year, total_income, permanent_saving });
      }
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});