import React, { useState, useEffect } from 'react';
import MonthYearSelector from './components/common/MonthYearSelector';
import MonthlyExpenses from './components/MonthlyExpenses/MonthlyExpenses';
import TodayExpenses from './components/TodayExpenses/TodayExpenses';
import Reports from './components/Reports/Reports';
import Debts from './components/Debts/Debts';
import TransactionHistory from './components/TransactionHistory/TransactionHistory';
import Settings from './components/Settings/Settings';
import { CurrencyProvider } from './contexts/CurrencyContext';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('monthly');
  const [plannedExpenses, setPlannedExpenses] = useState([]);
  const [actualExpenses, setActualExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [actualCategory, setActualCategory] = useState('');
  const [actualAmount, setActualAmount] = useState('');
  const [summary, setSummary] = useState({});
  const [dailySummary, setDailySummary] = useState({});
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [dailyAmount, setDailyAmount] = useState('');
  const [dailyCategory, setDailyCategory] = useState('');
  const [dailyDescription, setDailyDescription] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [splitWithPeople, setSplitWithPeople] = useState(false);
  const [people, setPeople] = useState([{ name: '', amount: '' }]);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    if (activeTab === 'monthly') {
      fetchPlannedExpenses();
      fetchActualExpenses();
      fetchSummary();
    } else if (activeTab === 'today') {
      fetchDailySummary();
      fetchDailyExpenses();
      fetchDebts();
    } else if (activeTab === 'reports') {
      fetchCategoryData();
      fetchSummary();
    } else if (activeTab === 'debts') {
      fetchDebts();
    } else if (activeTab === 'settings') {
      // Settings component handles its own data fetching
    }
  }, [activeTab, selectedMonth, selectedYear]);

  const fetchPlannedExpenses = async () => {
    try {
      const response = await fetch(`http://localhost:5000/planned-expenses?month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      setPlannedExpenses(data);
    } catch (error) {
      console.error('Error fetching planned expenses:', error);
    }
  };

  const fetchActualExpenses = async () => {
    try {
      const response = await fetch(`http://localhost:5000/actual-expenses?month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      setActualExpenses(data);
    } catch (error) {
      console.error('Error fetching actual expenses:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch('http://localhost:5000/summary/monthly');
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchDailySummary = async () => {
    try {
      const response = await fetch('http://localhost:5000/summary/daily');
      const data = await response.json();
      setDailySummary(data);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }
  };

  const fetchDailyExpenses = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`http://localhost:5000/daily-expenses?date=${today}`);
      const data = await response.json();
      setDailyExpenses(data);
    } catch (error) {
      console.error('Error fetching daily expenses:', error);
    }
  };

  const addDailyExpense = async (e) => {
    e.preventDefault();
    try {
      const requestBody = { 
        amount: parseFloat(dailyAmount), 
        category: dailyCategory, 
        description: dailyDescription 
      };

      if (splitWithPeople) {
        requestBody.people = people.filter(p => p.name && p.amount).map(p => ({
          name: p.name,
          amount: parseFloat(p.amount)
        }));
      }

      const response = await fetch('http://localhost:5000/daily-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      if (response.ok) {
        setDailyAmount('');
        setDailyCategory('');
        setDailyDescription('');
        setSplitWithPeople(false);
        setPeople([{ name: '', amount: '' }]);
        fetchDailyExpenses();
        fetchDailySummary();
        fetchDebts();
      }
    } catch (error) {
      console.error('Error adding daily expense:', error);
    }
  };

  const fetchDebts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/debts?month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      setDebts(data);
    } catch (error) {
      console.error('Error fetching debts:', error);
    }
  };

  const addPerson = () => {
    setPeople([...people, { name: '', amount: '' }]);
  };

  const updatePerson = (index, field, value) => {
    const updatedPeople = people.map((person, i) => 
      i === index ? { ...person, [field]: value } : person
    );
    setPeople(updatedPeople);
  };

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/summary/categories?month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      setCategoryData(data);
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  const addPlannedExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/planned-expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount: parseFloat(amount) })
      });
      if (response.ok) {
        setCategory('');
        setAmount('');
        fetchPlannedExpenses();
        fetchSummary();
      }
    } catch (error) {
      console.error('Error adding planned expense:', error);
    }
  };

  const addActualExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/actual-expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: actualCategory, amount: parseFloat(actualAmount) })
      });
      if (response.ok) {
        setActualCategory('');
        setActualAmount('');
        fetchActualExpenses();
        fetchSummary();
      }
    } catch (error) {
      console.error('Error adding actual expense:', error);
    }
  };

  const getComparisonData = () => {
    const categories = [...new Set([...plannedExpenses.map(e => e.category), ...actualExpenses.map(e => e.category)])];
    return categories.map(category => {
      const planned = plannedExpenses.find(e => e.category === category)?.amount || 0;
      const actual = actualExpenses.find(e => e.category === category)?.amount || 0;
      return { category, planned, actual };
    });
  };

  return (
    <CurrencyProvider>
      <div className="container app">
      <h1 className="app-title">Balancia</h1>
      <p className="app-subtitle">by NewtonCode</p>
      
      <div className="month-year-container">
        <div className="col-md-6 offset-md-3">
          <MonthYearSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </div>
      </div>
      
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly Expenses
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            Today's Expenses
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'debts' ? 'active' : ''}`}
            onClick={() => setActiveTab('debts')}
          >
            Debts
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'monthly' && (
          <MonthlyExpenses
            plannedExpenses={plannedExpenses}
            actualExpenses={actualExpenses}
            summary={summary}
            category={category}
            setCategory={setCategory}
            amount={amount}
            setAmount={setAmount}
            actualCategory={actualCategory}
            setActualCategory={setActualCategory}
            actualAmount={actualAmount}
            setActualAmount={setActualAmount}
            addPlannedExpense={addPlannedExpense}
            addActualExpense={addActualExpense}
            getComparisonData={getComparisonData}
          />
        )}
        {activeTab === 'today' && (
          <TodayExpenses
            dailySummary={dailySummary}
            dailyAmount={dailyAmount}
            dailyCategory={dailyCategory}
            dailyDescription={dailyDescription}
            splitWithPeople={splitWithPeople}
            people={people}
            dailyExpenses={dailyExpenses}
            debts={debts}
            setDailyAmount={setDailyAmount}
            setDailyCategory={setDailyCategory}
            setDailyDescription={setDailyDescription}
            setSplitWithPeople={setSplitWithPeople}
            addDailyExpense={addDailyExpense}
            addPerson={addPerson}
            updatePerson={updatePerson}
          />
        )}
        {activeTab === 'reports' && (
          <Reports
            categoryData={categoryData}
            summary={summary}
          />
        )}
        {activeTab === 'debts' && (
          <Debts debts={debts} />
        )}
        {activeTab === 'history' && (
          <TransactionHistory />
        )}
        {activeTab === 'settings' && (
          <Settings />
        )}
      </div>
    </div>
    </CurrencyProvider>
  );
}

export default App;