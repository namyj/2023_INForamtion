//import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Footer from './components/Footer';
import Learning from './components/Learning';
import Quiz from './components/Quiz';
import { Routes, Route } from 'react-router-dom'
//import { Navbar, Container, Nav } from 'react-bootstrap'

function App() {
  return (
    <>

      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learning" element={<Learning />}>
          <Route path="hi" element={<p>안녕하세요</p>} />
          <Route path="good-to-see-you" element={<p>만나서 반갑습니다</p>} />
          <Route path="thanks" element={<p>감사합니다</p>} />


        </Route>
      </Routes>

      <Footer />

    </>
  );
}

export default App;

//<Navigation />