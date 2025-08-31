import React from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseComparison from './ExpenseComparison';
import MonthlySummary from './MonthlySummary';
import './MonthlyExpenses.css';

const MonthlyExpenses = ({
  plannedExpenses,
  actualExpenses,
  summary,
  category,
  setCategory,
  amount,
  setAmount,
  actualCategory,
  setActualCategory,
  actualAmount,
  setActualAmount,
  addPlannedExpense,
  addActualExpense,
  getComparisonData
}) => {
  return (
    <div className="monthly-expenses">
      <h3>Monthly Expenses</h3>
      
      <div className="expense-forms">
        <ExpenseForm
          title="Planned Expenses"
          category={category}
          amount={amount}
          onCategoryChange={setCategory}
          onAmountChange={setAmount}
          onSubmit={addPlannedExpense}
          buttonClass="btn-primary"
        />
        
        <ExpenseForm
          title="Actual Expenses"
          category={actualCategory}
          amount={actualAmount}
          onCategoryChange={setActualCategory}
          onAmountChange={setActualAmount}
          onSubmit={addActualExpense}
          buttonClass="btn-success"
        />
      </div>

      <div className="comparison-section">
        <h5>Expense Comparison</h5>
        <div className="table-container">
          <ExpenseComparison data={getComparisonData()} />
        </div>
      </div>
      
      <MonthlySummary summary={summary} />
    </div>
  );
};

export default MonthlyExpenses;