import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import UserRegistrationLogin from './Components/UserRegistrationLogin.jsx'
import Dashboard from './Components/Dashboard.jsx'
import Manage from './Components/Manage.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<UserRegistrationLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage/:id" element={<Manage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
