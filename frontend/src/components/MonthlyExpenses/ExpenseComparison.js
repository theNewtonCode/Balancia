import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';

const ExpenseComparison = ({ data, onDeletePlanned, onDeleteActual }) => {
  const { formatCurrency } = useCurrency();
  return (
    <table className="table table-striped table-dark align-middle">
      <thead>
        <tr>
          <th>Category</th>
          <th>Planned</th>
          <th>Actual</th>
          <th>Difference</th>
          <th>Actions</th>
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
            <td>
              {(item.plannedId || item.actualId) && (
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    if (item.plannedId) onDeletePlanned(item.plannedId);
                    if (item.actualId) onDeleteActual(item.actualId);
                  }}
                >
                  🗑️
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpenseComparison;