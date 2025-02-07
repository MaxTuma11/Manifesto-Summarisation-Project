import React, { useEffect, useState } from 'react'
import './Summaries.css'
import Navbar from '../components/navbar/navbar'
import Searchbar from '../components/searchbar/Searchbar'
import Graphs from '../components/graphdisplay/Graphs'


const Summaries = () => {
  const [charts, setCharts] = useState([]); // State to hold chart data

  // Function to handle chart data updates (called from Searchbar)
  const handleChartsUpdate = (mainChartData) => {
    if (mainChartData && mainChartData.length > 0) {
      // For now, only the frequency chart is displayed
      setCharts([
        { data: mainChartData, title: 'Most Common Words' },
        // Add more charts here as needed
      ]);
    } else {
      setCharts([]); // Reset charts if no data is available
    }
  };

  return (
    <div className='Summaries'>
      <Navbar/>
      <div className='search-bar-container'>
        <Searchbar onChartsUpdate={handleChartsUpdate}/>
      </div>
      <div className='graph-container'>
        <Graphs charts={charts} />
      </div>
    </div>
  )
}

export default Summaries
