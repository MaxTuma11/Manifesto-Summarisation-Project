import React, {useState, useEffect} from 'react'
import { FaSearch } from 'react-icons/fa'
import './Searchbar.css'
import axios from 'axios';


const Searchbar = ({ onChartsUpdate }) => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [result, setResult] = useState(null);

  //fetch all manifestos from the API using axios
  const fetchManifestos = async () => {
    try {
      const response = await axios.get('https://manifesto-backend-3bacb381e493.herokuapp.com/api/manifestos/');
      return response.data.manifestos;
    //set up catch if data cannot be fetched
    } catch (error) {
      console.error('Error fetching manifestos:', error);
      return [];
    }
  };

  //filter recommendations based on the query
  const getRecommendations = async (query) => {
    if (query) {
      const manifestos = await fetchManifestos();
      const filtered = manifestos.filter((manifesto) =>
        manifesto.name.toLowerCase().includes(query.toLowerCase())
      );
      setRecommendations(filtered);
    } else {
      setRecommendations([]);
    }
  };

  //fetch the result (summary) based on the selected manifesto
  const fetchResult = async (query) => {
    const manifestos = await fetchManifestos();
    const selectedManifesto = manifestos.find(
      (manifesto) => manifesto.name.toLowerCase() === query.toLowerCase()
    );
    if (selectedManifesto) {
      setResult(selectedManifesto.summary);
      //load the corresponding JSON file for the selected manifesto
      try {
        const response = await fetch(`/common_${selectedManifesto.name}.json`);
        const data = await response.json();

        const statsResponse = await fetch('/party_averages.json');
        const statsData = await statsResponse.json();

        const partyStats = statsData.party_statistics[selectedManifesto.name];
        const overallAverageAttendance = statsData.overall_average_attendance_rate;

        console.log(partyStats);
        console.log(overallAverageAttendance);

        onChartsUpdate(data, partyStats, overallAverageAttendance); //set chart data
      } catch (error) {
        console.error('Error loading chart data:', error);
        onChartsUpdate([], null, 0); //reset chart data if there's an error
      }
    } else {
      setResult(null);
      onChartsUpdate([], null, 0);
    }
  };

  useEffect(() => {
    getRecommendations(query);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchResult(query);
      setRecommendations([]); //clear recommendations on Enter
    }
  };

  const handleRecommendationClick = (recommendation) => {
    setQuery(recommendation.name);
    fetchResult(recommendation.name);
    setRecommendations([]); //clear recommendations on selection
  };

  return (
    <div className="search-bar">
      <FaSearch id='search-icon'/>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyUp={handleKeyPress}
        placeholder="Search for a party..."
      />
      {recommendations.length > 0 && (
        <ul className="recommendations">
          {recommendations.map((manifesto) => (
            <li
              key={manifesto.id}
              onClick={() => handleRecommendationClick(manifesto)}
            >
              {manifesto.name}
            </li>
          ))}
        </ul>
      )}
      {result !== null && (
        <div className="result">
          <h2>Summary:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default Searchbar
