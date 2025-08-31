import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '../../contexts/CurrencyContext';
import './Reports.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Reports = ({ categoryData, summary }) => {
  const { formatCurrency } = useCurrency();
  const getBarChartData = () => {
    return [{
      name: 'Monthly Comparison',
      planned: summary.planned_total || 0,
      actual: summary.actual_total || 0
    }];
  };

  return (
    <div className="reports">
      <h3>Reports</h3>
      
      <div className="charts-section">
        <div className="chart-card">
          <h5>Category-wise Spending</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
                label={({category, total}) => `${category}: ${formatCurrency(total)}`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-card">
          <h5>Planned vs Actual</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getBarChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="planned" fill="#8884d8" name="Planned" />
              <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="table-section">
        <h5>Spending by Category (Current Month)</h5>
        <div className="table-wrapper">
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item, index) => (
                <tr key={index}>
                  <td>{item.category}</td>
                  <td>{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;