import React, {useState} from 'react'
import { FaSearch } from 'react-icons/fa'
import './Searchbar.css'

const Searchbar = ({ setResults }) => {

  const [input, setInput] = useState("");
  
  const fetchData = (value) => {
    fetch('https://manifesto-backend-3bacb381e493.herokuapp.com/api/manifestos/')
      .then((response) => response.json())
      .then(json => {
        //console.log(json);

        let dataArray = json.manifestos;

        //console.log(dataArray);

        const results = dataArray.filter((manifestos) => {
          return value && manifestos && manifestos.name && manifestos.name.toLowerCase().includes(value)
        });

        setResults(results);
        console.log(results);
    });
  }

  const handleChange = (value) => {
    setInput(value)
    fetchData(value)
  }

  return (
    <div className='input-wrapper'>
      <FaSearch id='search-icon'/>
      <input placeholder="Type to search..." value={input} onChange={(e) => handleChange(e.target.value)}/>
    </div>
  )
}

export default Searchbar
