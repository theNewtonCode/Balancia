import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import './Settings.css';

const Settings = () => {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [income, setIncome] = useState({ total_income: '', permanent_saving: '' });
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/profile');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const updateIncome = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_income: parseFloat(income.total_income),
          permanent_saving: parseFloat(income.permanent_saving)
        })
      });
      if (response.ok) {
        alert('Income settings updated successfully!');
        setIncome({ total_income: '', permanent_saving: '' });
      }
    } catch (error) {
      console.error('Error updating income:', error);
    }
  };

  return (
    <div className="settings">
      <h3>Settings</h3>
      
      <div className="settings-grid">
        <div className="settings-card">
          <h5>Profile Settings</h5>
          <form onSubmit={updateProfile}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                value={profile.username}
                onChange={(e) => setProfile({...profile, username: e.target.value})}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                placeholder="Enter email"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        </div>
        
        <div className="settings-card">
          <h5>Currency Settings</h5>
          <div className="form-group">
            <label>Preferred Currency</label>
            <select
              className="form-control"
              value={selectedCurrency.code}
              onChange={(e) => {
                const currency = currencies.find(c => c.code === e.target.value);
                setSelectedCurrency(currency);
              }}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <div className="currency-info">
            <small>Selected: {selectedCurrency.symbol} - {selectedCurrency.name}</small>
          </div>
        </div>
        
        <div className="settings-card">
          <h5>Income Settings</h5>
          <form onSubmit={updateIncome}>
            <div className="form-group">
              <label>Total Monthly Income ({selectedCurrency.symbol})</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={income.total_income}
                onChange={(e) => setIncome({...income, total_income: e.target.value})}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label>Permanent Savings ({selectedCurrency.symbol})</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={income.permanent_saving}
                onChange={(e) => setIncome({...income, permanent_saving: e.target.value})}
                placeholder="0.00"
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Update Income</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;