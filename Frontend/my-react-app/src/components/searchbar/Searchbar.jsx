import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import './Searchbar.css';
import axios from 'axios';

const Searchbar = ({ onChartsUpdate }) => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [result, setResult] = useState(null);
  const isRecommendationClicked = useRef(false); //track if a recommendation was clicked

  //log recommendations state whenever it changes
  // useEffect(() => {
  //   console.log('Recommendations state updated:', recommendations);
  // }, [recommendations]);

  //fetch all manifestos from the API using axios
  const fetchManifestos = async () => {
    try {
      const response = await axios.get('https://manifesto-backend-3bacb381e493.herokuapp.com/api/manifestos/');
      return response.data.manifestos;
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

        //load the party_averages.json file
        const statsResponse = await fetch('/party_averages.json');
        const statsData = await statsResponse.json();

        //extract the statistics for the selected party
        const partyStats = statsData.party_statistics[selectedManifesto.name];
        const overallAverageAttendance = statsData.overall_average_attendance_rate;

        //pass the data to the parent component
        onChartsUpdate(data, partyStats, overallAverageAttendance);
      } catch (error) {
        console.error('Error loading chart data:', error);
        onChartsUpdate([], null, 0); //reset data if there's an error
      }
    } else {
      setResult(null);
      onChartsUpdate([], null, 0); //reset data if no manifesto is selected
    }
  };

  useEffect(() => {
    //console.log('Query updated:', query); // Debugging
    if (!isRecommendationClicked.current) {
      getRecommendations(query);
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    isRecommendationClicked.current = false; //reset the flag when typing
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchResult(query);
      setRecommendations([]); //clear recommendations on Enter
    }
  };

  const handleRecommendationClick = (recommendation) => {
    //console.log('Clearing recommendations...');
    isRecommendationClicked.current = true; //set the flag to true
    setQuery(recommendation.name);
    setRecommendations([]); //clear recommendations
    fetchResult(recommendation.name);
  };

  return (
    <div className="search-bar">
      <FaSearch id="search-icon" />
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

export default Searchbar;