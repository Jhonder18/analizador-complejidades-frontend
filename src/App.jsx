import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Docs from './pages/Docs';
import Results from './pages/Results';
import Examples from './pages/Examples';
import './App.css'
import './styles/global.css'

function App() {
  return (
    <Router>
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark font-display">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/results" element={<Results />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/examples" element={<Examples />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
