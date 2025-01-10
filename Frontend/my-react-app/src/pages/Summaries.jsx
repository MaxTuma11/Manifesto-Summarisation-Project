import React, { useEffect, useState } from 'react'
import './Summaries.css'
import Navbar from '../components/navbar/navbar'
import Searchbar from '../components/searchbar/Searchbar'


const Summaries = () => {

  const [manifestos, setManifestos] = useState();

  useEffect(() => {
    console.log('Fetching...');
    fetch('http://localhost:8000/api/manifestos/')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setManifestos(data.manifestos);
    })
  }, []);

  return (
    <div className='Summaries'>
      <Navbar/>
      <div className='search-bar-container'>
        <Searchbar/>
        <div>
          <p>SearchResults</p>
          <>
          {manifestos ? manifestos.map((manifesto) => {
            return <p>{manifesto.name}</p>
          }) : null}
          </>
        </div>
      </div>
    </div>
  )
}

export default Summaries
