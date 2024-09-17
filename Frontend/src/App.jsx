/*
  Frontend only for testing backend. This backend is primarily for the application Opinio 
  (GitHub repo is available) and not for this frontend. Used for admin purpose also.
*/
import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import SignUp from './pages/SignUp';
import Homepage from './pages/Homepage';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path='/login' element={<LoginPage/>}/>
        <Route exact path='/signup' element={<SignUp/>}/>
        <Route exact path='/home' element={<Homepage/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App