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
