import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useColor } from '../contexts/ColorContext'
import foxIcon from '../assets/2026-icon-filled-white.svg'
import './headernav.css'

function HeaderNav() {
  const iconRef = useRef(null)
  const fillColor = useColor()

  useEffect(() => {
    if (iconRef.current) {
      const icon = iconRef.current

    //   // Option 2: Floating effect
    //   const animation = gsap.to(icon, {
    //     y: -8,
    //     duration: 2,
    //     repeat: -1,
    //     yoyo: true,
    //     ease: 'power1.inOut'
    //   })

      // Alternative animation options (uncomment to try):
      
      // Option 1: Gentle pulse with subtle rotation (most performant)
      // const tl = gsap.timeline({ repeat: -1, yoyo: true })
      // tl.to(icon, {
      //   scale: 1.1,
      //   rotation: 5,
      //   duration: 2,
      //   ease: 'power2.inOut'
      // })
      // .to(icon, {
      //   scale: 1,
      //   rotation: 0,
      //   duration: 2,
      //   ease: 'power2.inOut'
      // }, '-=1.5')

      // Option 3: Scale pulse only (simplest, most performant)
      const animation = gsap.to(icon, {
        scale: 1.15,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      })

      // Option 4: Opacity glow effect
      // const animation = gsap.to(icon, {
      //   opacity: 0.7,
      //   duration: 1.5,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: 'power2.inOut'
      // })

      // Option 5: Combined floating + pulse
      // const floatTl = gsap.timeline({ repeat: -1, yoyo: true })
      // floatTl.to(icon, {
      //   y: -6,
      //   scale: 1.08,
      //   duration: 2,
      //   ease: 'power1.inOut'
      // })

      return () => {
        animation.kill()
      }
    }
  }, [])

  return (
    <header className="header-nav">
      <nav style={{ '--fill-color': fillColor }}>
        <div className="nav-animation" ref={iconRef}>
          <img 
            src={foxIcon} 
            alt="Fox icon" 
            className="fox-icon"
          />
        </div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/experience">Experience</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  )
}

export default HeaderNav

