import React, { useEffect, useState } from 'react'
import './Summaries.css'
import Navbar from '../components/navbar/navbar'
import Searchbar from '../components/searchbar/Searchbar'
import Graphs from '../components/graphdisplay/Graphs'


const Summaries = () => {
  //states for chart and party data
  const [wordData, setWordData] = useState([]);
  const [trigramData, setTrigramData] = useState([]);
  const [partyStats, setPartyStats] = useState(null);
  const [sentimentData, setSentimentData] = useState([]);
  const [pronounData, setpronounData] = useState([]);
  const [policyData, setpolicyData] = useState([]);
  const [overallAverageAttendance, setOverallAverageAttendance] = useState(0);
  const [overallAverageRebellion, setOverallAverageRebellion] = useState(0);

  //function to handle chart data updates (called from Searchbar)
  const handleChartsUpdate = (wordData, stats, overallAttendance, trigramData, overallRebellion, sentimentData, pronounData, policyData ) => {
    if (wordData && wordData.length > 0 && trigramData && trigramData.length > 0) {
      setWordData(wordData);
      setTrigramData(trigramData);
      setPartyStats(stats);
      setOverallAverageAttendance(overallAttendance);
      setOverallAverageRebellion(overallRebellion);
      setSentimentData(sentimentData);
      setpronounData(pronounData);
      setpolicyData(policyData);
    } else {
      setWordData([]); //reset charts if no data is available
      setTrigramData([]);
      setPartyStats(null); //reset party stats and overall attendance
      setOverallAverageAttendance(0);
      setOverallAverageRebellion(0);
      setSentimentData([]);
      setpronounData([]);
      setpolicyData([]);
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
          wordData={wordData}
          partyStats={partyStats}
          overallAverageAttendance={overallAverageAttendance}
          overallAverageRebellion={overallAverageRebellion}
          trigramData={trigramData}
          sentimentData={sentimentData}
          pronounData={pronounData}
          policyData={policyData}
          />
      </div>
    </div>
  )
}

export default Summaries
