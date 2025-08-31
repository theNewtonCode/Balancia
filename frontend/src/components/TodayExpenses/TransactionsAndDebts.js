import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';

const TransactionsAndDebts = ({ dailyExpenses, debts }) => {
  const { formatCurrency } = useCurrency();
  return (
    <div className="transactions-section">
      <div className="transactions-card">
        <h5>Today's Transactions</h5>
        <div className="table-wrapper">
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {dailyExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{formatCurrency(expense.amount)}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
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