import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ColorProvider } from './contexts/ColorContext'
import './App.css'

// Layout Components
import GlobalHeader from './components/global-header'
import Footer from './components/footer'

// Page Imports
import Home from './pages/home/home'
import About from './pages/about/about'
import Services from './pages/services/services'
import Experience from './pages/experience/experience'
import Contact from './pages/contact/contact'

function App() {
  return (
    <ColorProvider>
      {/* SVG filter definition for global noise */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="noise-filter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.9" 
              numOctaves="4" 
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix 
              in="noise" 
              type="saturate" 
              values="0"
              result="grayscale-noise"
            />
          </filter>
        </defs>
      </svg>
      <Router>
        <div className="app">
          <GlobalHeader />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ColorProvider>
  )
}

export default App
