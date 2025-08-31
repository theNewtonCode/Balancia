import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';

const MonthlySummary = ({ summary }) => {
  const { formatCurrency } = useCurrency();
  return (
    <div className="summary-section">
      <h5>Monthly Summary</h5>
      <div className="summary-grid">
        <div className="summary-item">
          <strong>Total Income</strong>
          <div className="value">{formatCurrency(summary.total_income || 0)}</div>
        </div>
        <div className="summary-item">
          <strong>Planned Total</strong>
          <div className="value">{formatCurrency(summary.planned_total || 0)}</div>
        </div>
        <div className="summary-item">
          <strong>Actual Total</strong>
          <div className="value">{formatCurrency(summary.actual_total || 0)}</div>
        </div>
        <div className="summary-item">
          <strong>Permanent Saving</strong>
          <div className="value">{formatCurrency(summary.permanent_saving || 0)}</div>
        </div>
        <div className="summary-item">
          <strong>Spendable Balance</strong>
          <div className={`value ${summary.spendable_balance >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(summary.spendable_balance || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;