import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path='/login' element={<LoginPage/>}/>
      </Routes>
      </Router>
    </>
  )
}

export default App
