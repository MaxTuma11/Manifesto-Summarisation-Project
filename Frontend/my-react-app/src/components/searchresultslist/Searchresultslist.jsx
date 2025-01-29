import React from 'react'

import './Searchresultslist.css'
import Searchresult from './Searchresult';

const Searchresultslist = (results) => {
    let res = results.results;
  return (
    <div className='results-list'>
        {
            res.map((result, id) => {
                return <Searchresult result={result} key={id} />
            })
        }
    </div>
  )
}

export default Searchresultslist
