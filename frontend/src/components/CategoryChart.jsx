// src/components/CategoryChart.jsx

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ summaryData }) => {
  // Prepare the data for the chart format
  const chartData = {
    labels: summaryData.map(item => item.category),
    datasets: [
      {
        label: 'Expenses by Category',
        data: summaryData.map(item => item.totalAmount),
        backgroundColor: [
          '#4f46e5', // Indigo
          '#10b981', // Emerald
          '#ef4444', // Red
          '#f97316', // Orange
          '#3b82f6', // Blue
          '#8b5cf6', // Violet
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Spending by Category (This Month)',
        font: {
          size: 18,
        }
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md" style={{ position: 'relative', height: '300px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default CategoryChart;