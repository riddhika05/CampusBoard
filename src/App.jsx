import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Login from './Pages/Login.jsx'
import Home from './Pages/Home.jsx'
import AdminDashBoard from './Pages/AdminDashBoard.jsx'
import StudentDashBoard from './Pages/StudentDashBoard.jsx'
import Analytics from './Pages/Analytics.jsx'
import StudentAnnouncements from './Pages/StudentAnnouncements.jsx'
import StudentApplications from './Pages/StudentApplications.jsx'
function App() {
 

  return (
    <>
      <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/admin' element={<AdminDashBoard/>}/>
        <Route path='/student' element={<StudentDashBoard/>}/>
        <Route path='/analytics' element={<Analytics/>}/>
        <Route path='/student/announcements' element={<StudentAnnouncements/>}/>
        <Route path='/student/applications' element={<StudentApplications/>}/>
       
        {/* add more routes */}
      </Routes>
    </Router>   
    </>
  )
}

export default App
