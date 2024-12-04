import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Home from './pages/Home';
import Borrows from './pages/Borrows';
import PageLayout from './components/Layout/PageLayout';
import './index.css'
import LearnMore from './pages/LearnMore';
import Profile from './pages/Profile';
import { AuthProvider } from './utils/AuthContext';



const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<PageLayout childPage={<LandingPage />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/more" element={<LearnMore />} />
          <Route path="/home" element={<PageLayout navElements={[{ label: 'A' }, { label: 'B' }]} childPage={<Home />} />}>
            <Route path='borrowed' element={<PageLayout childPage={<Borrows />} />} />
          </Route>
          <Route path="/profile" element={<PageLayout childPage={<Profile />} />} />
          <Route path='/borrowed' element={<PageLayout childPage={<Borrows />} />} />



        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

const root = createRoot(document.getElementById("root"));
root.render(<App />);