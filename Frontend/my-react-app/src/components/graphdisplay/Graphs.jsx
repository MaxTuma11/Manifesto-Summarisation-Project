import React from 'react';
import './Graphs.css';
import BarChart from '../charts/BarChart';

const Graphs = ({ charts }) => {
  if (!charts || charts.length === 0) {
    return <div className="no-charts">No charts to display.</div>;
  }

  return (
    <div className="graphs-container">
      {charts.map((chart, index) => (
        <div key={index} className="chart-item">
          <BarChart data={chart.data} title={chart.title} />
        </div>
      ))}
    </div>
  );
};

export default Graphs;