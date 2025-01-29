import React, { useEffect, useState } from 'react'
import './Summaries.css'
import Navbar from '../components/navbar/navbar'
import Searchbar from '../components/searchbar/Searchbar'
import Searchresultslist from '../components/searchresultslist/Searchresultslist'


const Summaries = () => {

  // const [manifestos, setManifestos] = useState();

  const [results, setResults] = useState([]);

  // useEffect(() => {
  //   //console.log('Fetching...');
  //   fetch('https://manifesto-backend-3bacb381e493.herokuapp.com/api/manifestos/')
  //   .then((response) => response.json())
  //   .then((data) => {
  //     //console.log(data);
  //     setManifestos(data.manifestos);
  //   })
  // }, []);

  return (
    <div className='Summaries'>
      <Navbar/>
      <div className='search-bar-container'>
        <Searchbar setResults={setResults}/>

        <Searchresultslist results={results} />

        {/* <div>
          <>
          {manifestos ? manifestos.map((manifesto) => {
            return <p>{manifesto.name}</p>
          }) : null}
          </>
        </div> */}
      </div>
    </div>
  )
}

export default Summaries
