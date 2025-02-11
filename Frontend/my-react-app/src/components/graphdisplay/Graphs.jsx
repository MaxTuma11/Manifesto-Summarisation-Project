import React from 'react';
import './Graphs.css';
import BarChart from '../charts/BarChart';
import PartyStats from '../datadisplay/PartyStats';

const Graphs = ({ charts, partyStats, overallAverageAttendance }) => {
  if (!charts || charts.length === 0) {
    return <div className="no-charts">No charts to display.</div>;
  }

  return (
    <div className="graphs-container">
      {/* render the bar chart */}
      {charts.map((chart, index) => {
        if (!chart) return null; //skip undefined entries
        return (
          <div key={index} className="chart-item">
            <BarChart data={chart.data} title={chart.title} />
          </div>
        );
      })}

      {/* render the PartyStats */}
      <div className="chart-item">
        <PartyStats partyStats={partyStats} overallAverageAttendance={overallAverageAttendance} />
      </div>
    </div>
  );
};

export default Graphs;