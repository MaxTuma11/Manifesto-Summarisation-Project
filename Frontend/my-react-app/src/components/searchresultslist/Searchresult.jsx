import React from 'react'

import'./Searchresult.css'

const Searchresult = ({result, setInput}) => {
    const handleSelect = () => {
        setInput(result.name); // Autofill search bar
        //setResults([]);
      };
  return (
    <div className='search-result' onClick={handleSelect}>
      {result.name}
    </div>
  )
}

export default Searchresult
