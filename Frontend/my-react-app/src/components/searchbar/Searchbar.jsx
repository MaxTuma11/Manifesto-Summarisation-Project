import React, { useState, useEffect, useRef } from 'react';
import { FaSpinner, FaQuestionCircle, FaTimes } from 'react-icons/fa'; //import search icon, spinner icon, question circle icon, and X icon
import './Searchbar.css';
import  { manifesto_layout } from './text_format.jsx'
import { TbListSearch } from "react-icons/tb";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha, styled } from '@mui/material/styles';



//list of topics that are used for the dropdown
const topics = [
  "Entire Manifesto",
  "Crime",
  "Economy",
  "Education",
  "Environment",
  "Healthcare",
  "Housing",
  "Immigration",
  "Defence",
  "Brexit"
];

const parties = [
  "Labour Party",
  "Conservative and Unionist Party",
  "Scottish National Party (SNP)",
  "Liberal Democrat Party",
  "Sinn Féin",
  "Plaid Cymru",
  "Green Party of England and Wales",
  "Reform UK",
  "Democratic Unionist Party (DUP)",
  "Alliance Party",
  "Traditional Unionist Voice (TUV)",
  "Ulster Unionist Party (UUP)",
  "Social Democratic and Labour Party (SDLP)",
]

const Searchbar = ({ onChartsUpdate }) => {
  const [result, setResult] = useState(null); //state for results
  const [selectedParty, setSelectedParty] = useState('Select Party'); //state for selected party
  const [selectedTopic, setSelectedTopic] = useState("Select Topic"); //default the selected topic to summary
  const [loading, setLoading] = useState(false); //loading state for manifesto loading spinner
  const [showHelp, setShowHelp] = useState(false); //show help popup state
  const [displayedTopic, setDisplayedTopic] = useState("Select Topic");

  const PinkSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#04001f',
      '&:hover': {
        backgroundColor: alpha('#04001f', theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#04001f',
    },
  }));
  
  const fetchManifestoSummary =  () => {
    setLoading(true);
    setResult(null);

    setDisplayedTopic(selectedTopic);

    //get manifesto summary from summarised_manifestos.json
    fetch('/summarised_manifestos.json')
      .then((response) => response.json())
      .then((data) => {
        //find the manifesto summary for the selected party
        const partyObj = data.party[0];

        const matchingParties = Object.keys(partyObj).find(key => key.toLowerCase() === selectedParty.toLowerCase());

        if (!matchingParties) {
          setResult('Party not found. Please select a valid party.');
          return;
        }

        const topicsObj = partyObj[matchingParties][0];

        const matchingTopics = Object.keys(topicsObj).find(key => key.toLowerCase() === selectedTopic.toLowerCase());

        if (!matchingTopics) {
          setResult('Topic not found. Please select a valid topic.');
          return;
        }

        setResult(topicsObj[matchingTopics]);

      })
      .catch((error) => {
        console.error('Error fetching manifesto summary:', error);
        setResult('Error fetching manifesto summary. Please try again later.');
      })
      .finally(() => {
        //wait 2-4 seconds to show loading spinner
        setTimeout(() => setLoading(false), 2000 + Math.random() * 2000);
      });

  }

  //toggle help
  const toggleHelp = () => setShowHelp(!showHelp);

  return (
    <div className="search-bar">

      <div className="search-icon-holder" onClick={fetchManifestoSummary}>
        <TbListSearch id="search-icon" />
      </div>
    
      <select className="party-dropdown" value={selectedParty} onChange={(e) => setSelectedParty(e.target.value)}>
        <option value="Select Party" disabled hidden>Select Party</option>
        {parties.map((party) => (
          <option key={party} value={party}>
            {party}
          </option>
        ))}
      </select>

      <select className="topic-dropdown" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
        <option value="Select Topic" disabled hidden>Select Topic</option>
        {topics.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>

      <FormControlLabel control={<PinkSwitch color="secondary" />} label="Compare Summaries:" labelPlacement="start"/>

      <button className="help-button" onClick={toggleHelp}>
        <FaQuestionCircle id="question"/>
      </button>

      {showHelp && (
        <div className="help-popup">
          <button className="close-button" onClick={toggleHelp}>
            <FaTimes />
          </button>
          <h3>How to Use the Searchbar</h3>
          <p>Select the name of the party whos maifesto you want to summarise in the party dropdown.</p>
          <p>Select a topic by which you want to summarise the manifesto (can be the whole thing).</p>
          <p>Press the search button on the left side of the searchbar.</p>
        </div>
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
          <h2>{displayedTopic}:</h2>
          {manifesto_layout(result).map((block, i) => {
            if (block.type === 'heading') {
              return <h3 key={i}>{block.text}</h3>;
            }

            if (block.type === 'list') {
              return (
                <ul key={i}>
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            }

            if (block.type === 'separator') {
              return (
                <div key={i} className="separator">
                  {block.text}
                </div>
              );
            }

            return <p key={i}>{block.text}</p>;
          })}
        </div>
        )
      )}
    </div>
  );
};

export default Searchbar;