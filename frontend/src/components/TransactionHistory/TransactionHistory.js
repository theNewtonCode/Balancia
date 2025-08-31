import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, selectedYear]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/transactions?month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>Month</label>
            <select 
              className="form-control" 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Array.from({length: 12}, (_, i) => (
                <option key={i+1} value={i+1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Year</label>
            <select 
              className="form-control" 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {Array.from({length: 3}, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
        </div>
      </div>

      <div className="history-table-section">
        <div className="table-wrapper">
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.description}</td>
                    <td>{formatCurrency(transaction.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-state">
                    No transactions found for the selected period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;