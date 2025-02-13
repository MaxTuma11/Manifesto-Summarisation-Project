import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import './Searchbar.css';
import axios from 'axios';

const Searchbar = ({ onChartsUpdate }) => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [result, setResult] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1); //track selected recommendation
  const isRecommendationClicked = useRef(false); //track if a recommendation was clicked

  //mapping shortform names to full names
  const shortFormToFullName = {
    'snp': 'Scottish National Party',
    'tories': 'Conservative Party',
    'tory': 'Conservative Party',
    'labour': 'Labour Party',
    'tuv': 'Traditional Unionist Voice',
    'uup': 'Ulster Unionist Party',
    'dup': 'Democratic Unionist Party',
    'lib dem': 'Liberal Democrat Party',
    'green': 'Green Party',
    'sdlp': 'Social Democratic and Labour Party',
    'conservative': 'Conservative Party',
    'alliance': 'Alliance Party',
    'reform uk': 'Reform',
    'sinn féin': "Sinn Fein"
  }

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
    let displayQuery = query;

    //check if the query matches any short form and map it to the full name
    if (shortFormToFullName[query.toLowerCase()]) {
      displayQuery = shortFormToFullName[query.toLowerCase()];
    }

    if (displayQuery) {
      const manifestos = await fetchManifestos();
      const filtered = manifestos.filter((manifesto) =>
        manifesto.name.toLowerCase().includes(displayQuery.toLowerCase())
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

        const triResponse = await fetch(`/common_${selectedManifesto.name}_trigrams.json`);
        const data2 = await triResponse.json();
        console.log(data2);

        //extract the statistics for the selected party
        const partyStats = statsData.party_statistics[selectedManifesto.name];
        const overallAverageAttendance = statsData.overall_average_attendance_rate;
        const overallAverageRebellion = statsData.overall_average_rebellion_rate;
        console.log(partyStats);

        //pass the data to the parent component
        onChartsUpdate(data, partyStats, overallAverageAttendance, data2, overallAverageRebellion);
      } catch (error) {
        console.error('Error loading chart data:', error);
        onChartsUpdate([], null, 0, [], 0); //reset data if there's an error
      }
    } else {
      setResult(null);
      onChartsUpdate([], null, 0, [], 0); //reset data if no manifesto is selected
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
      //if key press is when there is only one element in the drop down then automatically select that
      if (recommendations.length === 1) {
        handleRecommendationClick(recommendations[0]);
      } 
      else if (selectedIndex >=0) {
        handleRecommendationClick(recommendations[selectedIndex]);
      } else {
        fetchResult(query);
        setRecommendations([]); //clear recommendations on Enter
      }
    }
  };

  const handleRecommendationClick = (recommendation) => {
    //console.log('Clearing recommendations...');
    isRecommendationClicked.current = true; //set the flag to true
    setQuery(recommendation.name);
    setRecommendations([]); //clear recommendations
    fetchResult(recommendation.name);
  };

  const handleSearchClick = () => {
    fetchResult(query);
    setRecommendations([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab (move up)
        setSelectedIndex((prevIndex) =>
          prevIndex === 0 ? recommendations.length - 1 : prevIndex - 1
        );
      } else {
        // Tab (move down)
        setSelectedIndex((prevIndex) =>
          prevIndex === recommendations.length - 1 ? 0 : prevIndex + 1
        );
      }
      e.preventDefault(); // Prevent default tab behavior
    }
  };

  return (
    <div className="search-bar">
      <div className="search-icon-holder" onClick={handleSearchClick}>
        <FaSearch id="search-icon"/>
      </div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyUp={handleKeyPress}
        onKeyDown={handleKeyDown}
        placeholder="Search for a party..."
      />
      {recommendations.length > 0 && (
        <ul className="recommendations">
          {recommendations.map((manifesto, index) => (
            <li
              key={manifesto.id}
              onClick={() => handleRecommendationClick(manifesto)}
              style={{
                backgroundColor: selectedIndex === index ? '#e0e0e0' : 'transparent', //highlight selected recommendation
                cursor: 'pointer',
              }}
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