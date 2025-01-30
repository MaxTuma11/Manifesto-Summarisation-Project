import React from 'react'

import './Searchresultslist.css'
import Searchresult from './Searchresult';

const Searchresultslist = ({results, setInput}) => {
    
  return (
    <div className='results-list'>
        {   
            results.map((result, id) => {
                return <Searchresult result={result} key={id} setInput={setInput} />
            })
        }
    </div>
  )
}

export default Searchresultslist
