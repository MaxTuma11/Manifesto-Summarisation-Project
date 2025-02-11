import React, { useEffect, useState } from 'react'
import './Summaries.css'
import Navbar from '../components/navbar/navbar'
import Searchbar from '../components/searchbar/Searchbar'
import Graphs from '../components/graphdisplay/Graphs'


const Summaries = () => {
  //states for chart and party data
  const [charts, setCharts] = useState([]);
  const [partyStats, setPartyStats] = useState(null);
  const [overallAverageAttendance, setOverallAverageAttendance] = useState(0);

  //function to handle chart data updates (called from Searchbar)
  const handleChartsUpdate = (mainChartData, stats, overallAttendance) => {
    if (mainChartData && mainChartData.length > 0) {
      setCharts([
        { data: mainChartData, title: 'Most Common Words In The Manifesto' },
        //set stats and attendance
        setPartyStats(stats),
        setOverallAverageAttendance(overallAttendance),
      ]);
    } else {
      setCharts([]); //reset charts if no data is available
      setPartyStats(null); //reset party stats and overall attendance
      setOverallAverageAttendance(0); 
    }
  };

  return (
    <div className='Summaries'>
      <Navbar/>
      <div className='search-bar-container'>
        <Searchbar onChartsUpdate={handleChartsUpdate}/>
      </div>
      <div className='graph-container'>
        <Graphs 
          charts={charts}
          partyStats={partyStats}
          overallAverageAttendance={overallAverageAttendance} 
          />
      </div>
    </div>
  )
}

export default Summaries
