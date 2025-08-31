import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';

const ExpenseComparison = ({ data }) => {
  const { formatCurrency } = useCurrency();
  return (
    <table className="table table-striped table-dark">
      <thead>
        <tr>
          <th>Category</th>
          <th>Planned</th>
          <th>Actual</th>
          <th>Difference</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.category}</td>
            <td>{formatCurrency(item.planned)}</td>
            <td>{formatCurrency(item.actual)}</td>
            <td className={item.actual > item.planned ? 'text-danger' : 'text-success'}>
              {formatCurrency(item.actual - item.planned)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpenseComparison;