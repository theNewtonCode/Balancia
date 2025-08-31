const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Data file paths
const DATA_DIR = './data';
const FILES = {
  income: path.join(DATA_DIR, 'income.json'),
  plannedExpenses: path.join(DATA_DIR, 'planned_expenses.json'),
  actualExpenses: path.join(DATA_DIR, 'actual_expenses.json'),
  dailyExpenses: path.join(DATA_DIR, 'daily_expenses.json'),
  debts: path.join(DATA_DIR, 'debts.json'),
  sharedExpenses: path.join(DATA_DIR, 'shared_expenses.json')
};

// Initialize data directory and files
function initializeStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }
  
  Object.values(FILES).forEach(file => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '[]');
    }
  });
}

// Helper functions
function readData(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Initialize storage on startup
initializeStorage();

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
  
  const expenses = readData(FILES.plannedExpenses);
  const newExpense = { id: generateId(), category, amount, month, year };
  expenses.push(newExpense);
  writeData(FILES.plannedExpenses, expenses);
  
  res.json(newExpense);
});

// Get planned expenses for specified or current month
app.get('/planned-expenses', (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || (now.getMonth() + 1);
  const year = parseInt(req.query.year) || now.getFullYear();
  
  const expenses = readData(FILES.plannedExpenses);
  const filtered = expenses.filter(e => e.month === month && e.year === year);
  res.json(filtered);
});

// Add actual expense
app.post('/actual-expenses', (req, res) => {
  const { category, amount } = req.body;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  const expenses = readData(FILES.actualExpenses);
  const newExpense = { id: generateId(), category, amount, month, year };
  expenses.push(newExpense);
  writeData(FILES.actualExpenses, expenses);
  
  res.json(newExpense);
});

// Get actual expenses for specified or current month
app.get('/actual-expenses', (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || (now.getMonth() + 1);
  const year = parseInt(req.query.year) || now.getFullYear();
  
  const expenses = readData(FILES.actualExpenses);
  const filtered = expenses.filter(e => e.month === month && e.year === year);
  res.json(filtered);
});

// Get monthly summary
app.get('/summary/monthly', (req, res) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  const income = readData(FILES.income);
  const incomeData = income.find(i => i.month === month && i.year === year);
  const total_income = incomeData ? incomeData.total_income : 0;
  const permanent_saving = incomeData ? incomeData.permanent_saving : 0;
  
  const plannedExpenses = readData(FILES.plannedExpenses);
  const planned_total = plannedExpenses
    .filter(e => e.month === month && e.year === year)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const actualExpenses = readData(FILES.actualExpenses);
  const actual_total = actualExpenses
    .filter(e => e.month === month && e.year === year)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const spendable_balance = total_income - planned_total - permanent_saving;
  
  res.json({
    total_income,
    planned_total,
    actual_total,
    permanent_saving,
    spendable_balance
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
  
  const income = readData(FILES.income);
  const incomeData = income.find(i => i.month === month && i.year === year);
  const total_income = incomeData ? incomeData.total_income : 0;
  const permanent_saving = incomeData ? incomeData.permanent_saving : 0;
  
  const plannedExpenses = readData(FILES.plannedExpenses);
  const planned_total = plannedExpenses
    .filter(e => e.month === month && e.year === year)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const actualExpenses = readData(FILES.actualExpenses);
  const actual_total = actualExpenses
    .filter(e => e.month === month && e.year === year)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const remaining_balance = total_income - actual_total;
  const todays_allowance = daysLeft > 0 ? remaining_balance / daysLeft : 0;
  
  res.json({
    remaining_balance,
    days_left: daysLeft,
    todays_allowance: Math.max(0, todays_allowance)
  });
});

// Add daily expense
app.post('/daily-expense', (req, res) => {
  const { amount, category, description, people } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  const dailyExpenses = readData(FILES.dailyExpenses);
  const expenseId = generateId();
  const newExpense = { id: expenseId, date: today, category, description, amount };
  dailyExpenses.push(newExpense);
  writeData(FILES.dailyExpenses, dailyExpenses);
  
  if (people && people.length > 0) {
    const sharedExpenses = readData(FILES.sharedExpenses);
    const debts = readData(FILES.debts);
    
    people.forEach(person => {
      sharedExpenses.push({
        id: generateId(),
        expense_id: expenseId,
        person: person.name,
        share_amount: person.amount
      });
      
      debts.push({
        id: generateId(),
        person: person.name,
        amount: person.amount,
        month,
        year,
        shared_expense_id: expenseId
      });
    });
    
    writeData(FILES.sharedExpenses, sharedExpenses);
    writeData(FILES.debts, debts);
  }
  
  res.json(newExpense);
});

// Get daily expenses for a specific date
app.get('/daily-expenses', (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  
  const dailyExpenses = readData(FILES.dailyExpenses);
  const filtered = dailyExpenses
    .filter(e => e.date === date)
    .sort((a, b) => b.id.localeCompare(a.id));
  
  res.json(filtered);
});

// Get category summary for specified or current month
app.get('/summary/categories', (req, res) => {
  const now = new Date();
  const year = parseInt(req.query.year) || now.getFullYear();
  const month = String(req.query.month || (now.getMonth() + 1)).padStart(2, '0');
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;
  
  const dailyExpenses = readData(FILES.dailyExpenses);
  const filtered = dailyExpenses.filter(e => e.date >= startDate && e.date <= endDate);
  
  const categoryTotals = {};
  filtered.forEach(e => {
    const category = e.category.toLowerCase();
    categoryTotals[category] = (categoryTotals[category] || 0) + e.amount;
  });
  
  const result = Object.entries(categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
  
  res.json(result);
});

// Get debts summary
app.get('/debts', (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || (now.getMonth() + 1);
  const year = parseInt(req.query.year) || now.getFullYear();
  
  const debts = readData(FILES.debts);
  const filtered = debts.filter(d => d.month === month && d.year === year);
  
  const debtTotals = {};
  filtered.forEach(d => {
    debtTotals[d.person] = (debtTotals[d.person] || 0) + d.amount;
  });
  
  const result = Object.entries(debtTotals)
    .map(([person, total_debt]) => ({ person, total_debt }))
    .sort((a, b) => b.total_debt - a.total_debt);
  
  res.json(result);
});

// Get transaction history
app.get('/transactions', (req, res) => {
  const now = new Date();
  const year = parseInt(req.query.year) || now.getFullYear();
  const month = String(req.query.month || (now.getMonth() + 1)).padStart(2, '0');
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;
  
  const dailyExpenses = readData(FILES.dailyExpenses);
  const filtered = dailyExpenses
    .filter(e => e.date >= startDate && e.date <= endDate)
    .sort((a, b) => b.date.localeCompare(a.date));
  
  res.json(filtered);
});

// Get user profile
app.get('/profile', (req, res) => {
  res.json({ username: 'User', email: 'user@example.com' });
});

// Update user profile
app.post('/profile', (req, res) => {
  const { username, email } = req.body;
  res.json({ username, email });
});

// Add/Update income
app.post('/income', (req, res) => {
  const { total_income, permanent_saving } = req.body;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  const income = readData(FILES.income);
  const existingIndex = income.findIndex(i => i.month === month && i.year === year);
  
  const incomeData = { month, year, total_income, permanent_saving };
  
  if (existingIndex >= 0) {
    income[existingIndex] = incomeData;
  } else {
    incomeData.id = generateId();
    income.push(incomeData);
  }
  
  writeData(FILES.income, income);
  res.json(incomeData);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});