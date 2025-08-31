import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import './Debts.css';

const Debts = ({ debts }) => {
  const { formatCurrency } = useCurrency();
  return (
    <div className="debts">
      <h3>Debts</h3>
      
      <div className="debts-card">
        <h5>People Who Owe You Money</h5>
        <div className="table-wrapper">
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th>Person</th>
                <th>Total Amount Owed</th>
              </tr>
            </thead>
            <tbody>
              {debts.map((debt, index) => (
                <tr key={index}>
                  <td>{debt.person}</td>
                  <td className="text-success">{formatCurrency(debt.total_debt)}</td>
                </tr>
              ))}
              {debts.length === 0 && (
                <tr>
                  <td colSpan="2" className="no-debts">
                    No outstanding debts
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {debts.length > 0 && (
          <div className="total-debt">
            <strong>Total Amount Owed to You:</strong>
            <span className="text-success amount">
              {formatCurrency(debts.reduce((sum, debt) => sum + debt.total_debt, 0))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Debts;