import React from 'react';

const DailyExpenseForm = ({
  dailyAmount,
  dailyCategory,
  dailyDescription,
  splitWithPeople,
  people,
  setDailyAmount,
  setDailyCategory,
  setDailyDescription,
  setSplitWithPeople,
  addDailyExpense,
  addPerson,
  updatePerson
}) => {
  return (
    <form onSubmit={addDailyExpense} className="mb-4">
      <div className="row mb-2">
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Amount"
            value={dailyAmount}
            onChange={(e) => setDailyAmount(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Category"
            value={dailyCategory}
            onChange={(e) => setDailyCategory(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={dailyDescription}
            onChange={(e) => setDailyDescription(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary">Add</button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-12">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={splitWithPeople}
              onChange={(e) => setSplitWithPeople(e.target.checked)}
            />
            <label className="form-check-label">Split with people</label>
          </div>
        </div>
      </div>
      
      {splitWithPeople && (
        <div className="mt-2">
          {people.map((person, index) => (
            <div key={index} className="row mb-2">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Person name"
                  value={person.name}
                  onChange={(e) => updatePerson(index, 'name', e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount they owe"
                  value={person.amount}
                  onChange={(e) => updatePerson(index, 'amount', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-sm" onClick={addPerson}>
            Add Person
          </button>
        </div>
      )}
    </form>
  );
};

export default DailyExpenseForm;