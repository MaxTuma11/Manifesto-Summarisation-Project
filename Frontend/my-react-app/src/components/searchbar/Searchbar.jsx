import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaSpinner, FaQuestionCircle, FaTimes } from 'react-icons/fa'; //import search icon, spinner icon, question circle icon, and X icon
import './Searchbar.css';
import axios from 'axios';

//list of topics that are used for the dropdown
const topics = [
  "Summary",
  "Crime",
  "Economy",
  "Education",
  "Environment",
  "Health",
  "Housing",
  "Immigration",
  "Transport",
];

const Searchbar = ({ onChartsUpdate }) => {
  const [query, setQuery] = useState(''); //state for query
  const [recommendations, setRecommendations] = useState([]); //state for dropdown recommendations
  const [result, setResult] = useState(null); //state for results
  const [selectedTopic, setSelectedTopic] = useState("Summary"); //default the selected topic to summary
  const [selectedIndex, setSelectedIndex] = useState(-1); //track selected recommendation
  const [loading, setLoading] = useState(false); //loading state for manifesto loading spinner
  const [showHelp, setShowHelp] = useState(false); //show help popup state
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

    setLoading(true); //start loading icon

    const manifestos = await fetchManifestos();
    const selectedManifesto = manifestos.find(
      (manifesto) => manifesto.name.toLowerCase() === query.toLowerCase()
    );
    if (selectedManifesto) {
      //get the summary for the selected topic
      const topicSummary = selectedManifesto[selectedTopic.toLowerCase()] || "No data available for this topic.";
      
      setTimeout(() => {
        setResult(topicSummary);
        setLoading(false); //stop loading after 2 seconds
      }, 2000);

      //load the corresponding JSON file for the selected manifesto
      try {
        const response = await fetch(`/common_${selectedManifesto.name}.json`);
        const data = await response.json();

        //load the party_averages.json file
        const statsResponse = await fetch('/party_averages.json');
        const statsData = await statsResponse.json();

        const triResponse = await fetch(`/common_${selectedManifesto.name}_trigrams.json`);
        const data2 = await triResponse.json();
        //console.log(data2);

        //extract the statistics for the selected party
        const partyStats = statsData.party_statistics[selectedManifesto.name];
        const overallAverageAttendance = statsData.overall_average_attendance_rate;
        const overallAverageRebellion = statsData.overall_average_rebellion_rate;
        //console.log(partyStats);

        //pass the data to the parent component
        onChartsUpdate(data, partyStats, overallAverageAttendance, data2, overallAverageRebellion);
      } catch (error) {
        console.error('Error loading chart data:', error);
        onChartsUpdate([], null, 0, [], 0); //reset data if there's an error
      }
    } else {
      setTimeout(() => {
        setResult(null);
        setLoading(false);
        onChartsUpdate([], null, 0, [], 0);
      }, 1000); //reset data if no manifesto is selected
    }
  };

  useEffect(() => {
    if (query) {
      fetchResult(query);
    }
  }, [selectedTopic]);

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

  //handling for search being clicked
  const handleSearchClick = () => {
    fetchResult(query);
    setRecommendations([]); //clear recommendations
  };

  //toggle help
  const toggleHelp = () => setShowHelp(!showHelp);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        //shift + Tab (move up)
        setSelectedIndex((prevIndex) =>
          prevIndex === 0 ? recommendations.length - 1 : prevIndex - 1
        );
      } else {
        //tab (move down)
        setSelectedIndex((prevIndex) =>
          prevIndex === recommendations.length - 1 ? 0 : prevIndex + 1
        );
      }
      e.preventDefault(); //prevent default tab behavior
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
      <select className="topic-dropdown" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
      </select>

      <button className="help-button" onClick={toggleHelp}>
        <FaQuestionCircle />
      </button>

      {showHelp && (
        <div className="help-popup">
          <button className="close-button" onClick={toggleHelp}>
            <FaTimes />
          </button>
          <h3>How to Use the Search</h3>
          <p>🔍 Type the name of a political party to see their manifesto summary.</p>
          <p>🎯 Use party names like "Labour", "SNP", or "Green" to get results.</p>
          <p>📊 Select a topic from the dropdown to filter manifesto details.</p>
        </div>
      )}

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
      {loading ? (
        <div className="result">
          {/* <h2>{selectedTopic}:</h2> */}
          <div className="loading">
            <FaSpinner className="spinner" /> Summarising manifesto...
          </div>
        </div>
      ) : (
      result !== null && (
        <div className="result">
          <h2>{selectedTopic}:</h2>
          <p>{result}</p>
        </div>
      )
      )}
    </div>
  );
};

export default Searchbar;