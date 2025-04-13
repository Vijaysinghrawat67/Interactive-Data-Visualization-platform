import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Dummy paths */}
        <Route path="/features" element={<div>Features Page</div>} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/register" element={<div>Register Page</div>} />
        <Route path="/demo" element={<div>Demo Page</div>} />
      </Routes>
    </Router>
  )
}

export default App
