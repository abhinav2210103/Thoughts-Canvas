import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import SignUp from './pages/SignUp';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path='/login' element={<LoginPage/>}/>
        <Route exact path='/signup' element={<SignUp/>}/>
      </Routes>
      </Router>
    </>
  )
}

export default App
