import React from 'react';
import './MonthYearSelector.css';

const MonthYearSelector = ({ selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
  return (
    <div className="month-year-selector">
      <div className="selector-group">
        <label>Month</label>
        <select 
          className="form-control" 
          value={selectedMonth} 
          onChange={(e) => onMonthChange(parseInt(e.target.value))}
        >
          <option value={1}>January</option>
          <option value={2}>February</option>
          <option value={3}>March</option>
          <option value={4}>April</option>
          <option value={5}>May</option>
          <option value={6}>June</option>
          <option value={7}>July</option>
          <option value={8}>August</option>
          <option value={9}>September</option>
          <option value={10}>October</option>
          <option value={11}>November</option>
          <option value={12}>December</option>
        </select>
      </div>
      <div className="selector-group">
        <label>Year</label>
        <select 
          className="form-control" 
          value={selectedYear} 
          onChange={(e) => onYearChange(parseInt(e.target.value))}
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
      </div>
    </div>
  );
};

export default MonthYearSelector;