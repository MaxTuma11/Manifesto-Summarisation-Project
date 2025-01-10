import React from 'react'
import './Guide.css'
import img1 from '../../assets/msLogo.png'

const Guide = () => {
  return (
    <div className='guides'>
        <div className='guide'>
            <img src={img1} alt=''/>
        </div>
        <div className='guide'>
            <img src={img1} alt=''/>
        </div>
        <div className='guide'>
            <img src={img1} alt=''/>
        </div>
    </div>
  )
}

export default Guide
