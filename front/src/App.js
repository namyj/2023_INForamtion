//import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
//import Footer from './components/Footer';
import Learning from './components/Learning';
//import Quiz from './components/Quiz';
import Register from './components/Register';
import Login from './components/Login';
import { Routes, Route } from 'react-router-dom'
//import { Navbar, Container, Nav } from 'react-bootstrap'
import React, { useEffect, useState } from "react";

function App() {

  return (
    <>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learning" element={<Learning />}>
          <Route path="hi" element={<p>안녕하세요</p>} />
          <Route path="good-to-see-you" element={<p>만나서 반갑습니다</p>} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        

      </Routes>

    </>
  );
}

export default App;

//<Navigation />