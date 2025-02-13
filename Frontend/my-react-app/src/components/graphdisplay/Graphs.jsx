import React from 'react';
import './Graphs.css';
import BarChart from '../charts/BarChart';
import PartyStats from '../datadisplay/PartyStats';

const Graphs = ({ wordData, partyStats, overallAverageAttendance, trigramData, overallAverageRebellion }) => {
  if (!wordData || wordData.length === 0) {
    return <div className="no-charts">No charts to display.</div>;
  }

  return (
    <div className="graphs-container">
      {/* render the bar chart */}
      <div className="chart-item">
        <BarChart
          data={wordData}
          title="Most Common Words In The Manifesto"
        />
      </div>

      {/* render the PartyStats */}
      <div className="chart-item">
        <PartyStats partyStats={partyStats} overallAverageAttendance={overallAverageAttendance} overallAverageRebellion={overallAverageRebellion} />
      </div>

      {/* Render the trigram chart */}
      <div className="chart-item">
        <BarChart
          data={trigramData.map((trigram) => [trigram.trigram, trigram.count])}
          title="Most Common Trigrams In The Manifesto"
        />
      </div>
    </div>
  );
};

export default Graphs;