// src/components/Summary.jsx

import React from 'react';

const Summary = ({ totalAmount, count }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">This Month's Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Expenses Card */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-blue-600">Total Spent</p>
          <p className="text-3xl font-bold text-blue-800 mt-1">
            ${totalAmount.toFixed(2)}
          </p>
        </div>
        {/* Number of Transactions Card */}
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-green-600">Transactions</p>
          <p className="text-3xl font-bold text-green-800 mt-1">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;