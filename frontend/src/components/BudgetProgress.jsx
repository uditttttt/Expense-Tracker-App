// src/components/BudgetProgress.jsx

import React from 'react';

const BudgetProgress = ({ budgets, categorySpending }) => {
  // Create a quick lookup map for spending by category for efficiency
  const spendingMap = categorySpending.reduce((acc, item) => {
    acc[item.category] = item.totalAmount;
    return acc;
  }, {});

  // Only show budgets for which a limit has been set > 0
  const activeBudgets = budgets.filter(b => b.limit > 0);

  if (activeBudgets.length === 0) {
    return null; // Don't render the component if no budgets are set
  }

  const getProgressBarColor = (percentage) => {
    if (percentage > 100) return 'bg-red-500';
    if (percentage > 75) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Monthly Budget Progress</h2>
      <div className="space-y-4">
        {activeBudgets.map(budget => {
          const spent = spendingMap[budget.category] || 0;
          const limit = budget.limit;
          const percentage = limit > 0 ? (spent / limit) * 100 : 0;
          const clampedPercentage = Math.min(percentage, 100); // Cap the bar at 100% width

          return (
            <div key={budget.category}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">{budget.category}</span>
                <span className="text-sm text-gray-500">
                  ${spent.toFixed(2)} / ${limit.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${getProgressBarColor(percentage)}`}
                  style={{ width: `${clampedPercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgress;