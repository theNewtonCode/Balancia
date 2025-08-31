import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';

const TransactionsAndDebts = ({ dailyExpenses = [], debts, dailySummary, onEditExpense, onDeleteExpense }) => {
  const { formatCurrency } = useCurrency();
  const totalSpent = dailyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const todaysAllowance = dailySummary?.todays_allowance || 0;
  const isOverBudget = totalSpent > todaysAllowance;
  
  return (
    <div className="transactions-section">
      <div className="transactions-card">
        <div className="d-flex align-items-center mb-3">
          <h5 className="me-3 mb-0">Today's Transactions</h5>
          <div className={`rounded-circle d-flex align-items-center justify-content-center ${isOverBudget ? 'bg-danger' : 'bg-success'}`} 
               style={{width: '60px', height: '60px'}}>
            <div className="text-center text-white" style={{fontSize: '11px', fontWeight: 'bold'}}>
              {formatCurrency(totalSpent)}
            </div>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dailyExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{formatCurrency(expense.amount)}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDeleteExpense && onDeleteExpense(expense.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
      
      <div className="debts-card">
        <h5>People Owe You</h5>
        <div className="table-wrapper">
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th>Person</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {debts.map((debt, index) => (
                <tr key={index}>
                  <td>{debt.person}</td>
                  <td>{formatCurrency(debt.total_debt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsAndDebts;