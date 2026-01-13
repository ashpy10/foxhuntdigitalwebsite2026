import { useEffect, useRef } from 'react'
import Logo from './logo'
import HeaderNav from './headernav'
import RotatingTitle from './rotating-title'
import './global-header.css'

function GlobalHeader() {
  const headerRef = useRef(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    // Measure header height and set as CSS variable
    const updateHeaderHeight = () => {
      const height = header.offsetHeight
      document.documentElement.style.setProperty('--header-height', `${height}px`)
    }

    // Initial measurement
    updateHeaderHeight()

    // Update on resize
    window.addEventListener('resize', updateHeaderHeight)
    
    // Also update after a small delay to catch any async content loading
    const timeoutId = setTimeout(updateHeaderHeight, 100)

    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <header className="global-header" ref={headerRef}>
      <div className="global-header-logo">
        <Logo />
      </div>
      <div className="global-header-bottom-row">
        <div className="global-header-nav">
          <HeaderNav />
        </div>
        <div className="global-header-title">
          <RotatingTitle />
        </div>
      </div>
    </header>
  )
}

export default GlobalHeader

