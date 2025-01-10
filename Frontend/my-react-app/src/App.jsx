import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Summaries from './pages/Summaries'
import About from './pages/About'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Summaries" element={<Summaries/>}/>
        <Route path="/About" element={<About/>}/>
      </Routes>
    </Router>
  )
}

export default App

