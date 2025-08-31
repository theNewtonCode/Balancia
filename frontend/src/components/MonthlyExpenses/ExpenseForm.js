import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';

const ExpenseForm = ({ title, category, amount, onCategoryChange, onAmountChange, onSubmit, buttonClass }) => {
  const { selectedCurrency } = useCurrency();
  return (
    <div className="expense-form-card">
      <h5>{title}</h5>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            placeholder="Enter category"
            required
          />
        </div>
        <div className="form-group">
          <label>Amount ({selectedCurrency.symbol})</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <button type="submit" className={`btn ${buttonClass}`}>Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;