import React, { useState, useMemo } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import "./styles.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ChartComponent({ transactions }) {
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Unique categories and months
  const categories = useMemo(
    () => [...new Set(transactions.map(t => t.tag))],
    [transactions]
  );
  const months = useMemo(
    () => [...new Set(transactions.map(t => new Date(t.date).toLocaleString('default', { month: 'short' })))],
    [transactions]
  );

  // Apply filters
  const filtered = transactions.filter(({ date, tag }) => {
    const month = new Date(date).toLocaleString('default', { month: 'short' });
    return (
      (selectedMonth === 'All' || month === selectedMonth) &&
      (selectedCategory === 'All' || tag === selectedCategory)
    );
  });

  // Data for Pie chart (expenses by category)
  const categoryTotals = {};
  filtered.forEach(t => {
    if (t.type === 'expense') {
      categoryTotals[t.tag] = (categoryTotals[t.tag] || 0) + parseFloat(t.amount);
    }
  });

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  // Data for Bar chart (net cash flow by month)
  const monthTotals = {};
  transactions.forEach(t => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' });
    const amount = parseFloat(t.amount);
    monthTotals[month] = monthTotals[month] || 0;
    monthTotals[month] += t.type === 'income' ? amount : -amount;
  });

  const barData = {
    labels: Object.keys(monthTotals),
    datasets: [
      {
        label: 'Net Cash Flow',
        data: Object.values(monthTotals),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  return (
    <div className="chart-wrapper">
      {/* Filters */}
      <div className="chart-filters">
        <div className="chart-filter-group">
          <label>Filter by Month:</label>
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            <option value="All">All</option>
            {months.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="chart-filter-group">
          <label>Filter by Category:</label>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="All">All</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts side-by-side */}
      <div className="chart-row">
        <div className="chart-section pie-chart-section">
          <h3>Expenses by Category</h3>
          {Object.keys(categoryTotals).length > 0 ? (
            <Pie data={pieData} width={300} height={300}  />
          ) : (
            <p>No expense data to show</p>
          )}
        </div>

        <div className="chart-section bar-chart-section">  {/* Added class here */}
    <h3>Net Flow by Month</h3>
    <Bar data={barData} />
  </div>
</div>
    </div>
  );
}
