import React, { useEffect, useState,  } from 'react'
import './Navbar.css'
import logo from '../../assets/MSPLogoN.png'
import { Link } from "react-router-dom"

const Navbar = () => {

  const [sticky, setSticky] = useState(false);

  useEffect(()=>{
    window.addEventListener('scroll', ()=>{
      window.scrollY > 100 ? setSticky(true) : setSticky(false)
    })
  },[]);

  return (
    <nav className={`container ${sticky? 'show-nav': ''}`}>
        <Link to="/"><img src={logo} alt="" className='logo'/></Link>
        <ul>
            <li><Link to="/"><a>Home</a></Link></li>
            <li><Link to="/Summaries"><a>Manifesto Summaries</a></Link></li>
            <li><Link to="/About" className='btn'><a id='about'>About Us</a></Link></li>
        </ul>
    </nav>
  )
}

export default Navbar
