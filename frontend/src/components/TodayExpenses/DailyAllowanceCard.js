import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';

const DailyAllowanceCard = ({ dailySummary }) => {
  const { formatCurrency } = useCurrency();
  return (
    <div className="allowance-card">
      <h5>Today's Allowance</h5>
      <div className="allowance-grid">
        <div className="allowance-item">
          <strong>Remaining Balance</strong>
          <div className={`value ${dailySummary.remaining_balance >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(dailySummary.remaining_balance || 0)}
          </div>
        </div>
        <div className="allowance-item">
          <strong>Days Left</strong>
          <div className="value">{dailySummary.days_left || 0} days</div>
        </div>
        <div className="allowance-item">
          <strong>Today's Allowance</strong>
          <div className="value text-primary">
            {formatCurrency(dailySummary.todays_allowance || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyAllowanceCard;