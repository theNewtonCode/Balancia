import React from 'react';
import DailyAllowanceCard from './DailyAllowanceCard';
import DailyExpenseForm from './DailyExpenseForm';
import TransactionsAndDebts from './TransactionsAndDebts';
import './TodayExpenses.css';

const TodayExpenses = ({
  dailySummary,
  dailyAmount,
  dailyCategory,
  dailyDescription,
  splitWithPeople,
  people,
  dailyExpenses,
  debts,
  setDailyAmount,
  setDailyCategory,
  setDailyDescription,
  setSplitWithPeople,
  addDailyExpense,
  addPerson,
  updatePerson
}) => {
  return (
    <div className="today-expenses">
      <h3>Today's Expenses</h3>
      
      <DailyAllowanceCard dailySummary={dailySummary} />
      
      <DailyExpenseForm
        dailyAmount={dailyAmount}
        dailyCategory={dailyCategory}
        dailyDescription={dailyDescription}
        splitWithPeople={splitWithPeople}
        people={people}
        setDailyAmount={setDailyAmount}
        setDailyCategory={setDailyCategory}
        setDailyDescription={setDailyDescription}
        setSplitWithPeople={setSplitWithPeople}
        addDailyExpense={addDailyExpense}
        addPerson={addPerson}
        updatePerson={updatePerson}
      />
      
      <TransactionsAndDebts dailyExpenses={dailyExpenses} debts={debts} />
    </div>
  );
};

export default TodayExpenses;