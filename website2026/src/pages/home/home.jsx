import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from './hero'
import What from './what'
import './home.css'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

function Home() {
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const whatRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const hero = heroRef.current
    const what = whatRef.current

    if (!container || !hero || !what) return

    // Set initial states for reveal animations
    const setupReveals = () => {
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0
      
      // Hero section reveal animation (appears on initial load)
      const heroSection = hero.querySelector('.hero')
      const heroBackground = hero.querySelector('.hero-background')
      const heroEqualizer = hero.querySelector('.hero-equalizer-wrapper')
      
      // Hero is already visible on initial load, so we skip the reveal animation
      // or we can add a subtle fade-in on page load
      if (heroSection) {
        // Set initial state (slightly hidden for reveal effect)
        gsap.set(heroSection, {
          opacity: 0,
          y: 20,
          scale: 0.98
        })
        
        // Immediate reveal on page load (no scroll trigger needed for hero)
        gsap.to(heroSection, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        })
      }
      
      if (heroBackground) {
        gsap.set(heroBackground, {
          opacity: 0
        })
        gsap.to(heroBackground, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        })
      }
      
      if (heroEqualizer) {
        gsap.set(heroEqualizer, {
          opacity: 0,
          y: 15
        })
        gsap.to(heroEqualizer, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 0.3
        })
      }

      // What section reveal animation - scroll-triggered with staggered animations
      const whatSection = what.querySelector('.what-section')
      const whatContainer = what.querySelector('.what-container')
      const whatTitle = what?.querySelector('.what-title')
      const whatToggle = what?.querySelector('.what-toggle')
      const whatImageBox = what?.querySelector('.what-image-box')

      // Set initial states for what section elements
      if (whatSection) {
        gsap.set(whatSection, {
          opacity: 0,
          y: 50
        })
      }

      if (whatContainer) {
        gsap.set(whatContainer, {
          opacity: 0,
          y: 40,
          scale: 0.96
        })
      }

      if (whatTitle) {
        gsap.set(whatTitle, {
          opacity: 0,
          y: 30
        })
      }

      if (whatToggle) {
        const toggleButtons = whatToggle.querySelectorAll('.toggle-btn')
        gsap.set(toggleButtons, {
          opacity: 0,
          y: 20,
          scale: 0.95
        })
      }

      if (whatImageBox) {
        gsap.set(whatImageBox, {
          opacity: 0,
          y: 50,
          scale: 0.94
        })
      }

      // What section scroll-triggered reveal with staggered animations
      const whatTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: what,
          start: 'top 90%', // Start reveal when section enters viewport
          end: 'top 60%',
          toggleActions: 'play none none none',
          scrub: false, // Play animation once, not tied to scroll position
          markers: false, // Set to true for debugging
          invalidateOnRefresh: true // Recalculate on resize
        }
      })

      // Reveal what section with subtle parallax offset
      if (whatSection) {
        whatTimeline.to(whatSection, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out'
        }, 0)
      }

      // Reveal container with scale-in for emphasis
      if (whatContainer) {
        whatTimeline.to(whatContainer, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        }, 0.1)
      }

      // Staggered reveal for title with vertical translation
      if (whatTitle) {
        whatTimeline.to(whatTitle, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        }, 0.3)
      }

      // Staggered reveal for toggle buttons with scale-in emphasis
      if (whatToggle) {
        const toggleButtons = whatToggle.querySelectorAll('.toggle-btn')
        whatTimeline.to(toggleButtons, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: {
            amount: 0.3, // Total stagger duration
            from: 'start'
          }
        }, 0.5)
      }

      // Reveal image box with subtle scale-in and parallax offset
      if (whatImageBox) {
        whatTimeline.to(whatImageBox, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        }, 0.6)
      }

      return () => {
        // Cleanup scroll triggers
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.vars.trigger === hero || trigger.vars.trigger === what) {
            trigger.kill()
          }
        })
      }
    }

    // Small delay to ensure elements are rendered
    const timeoutId = setTimeout(() => {
      const cleanup = setupReveals()
      // Refresh ScrollTrigger after setup to ensure proper calculations
      ScrollTrigger.refresh()
      return cleanup
    }, 100)

    // Handle resize - refresh scroll triggers
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)
    
    // Initial refresh after a short delay to ensure layout is settled
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(refreshTimeout)
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === hero || trigger.vars.trigger === what) {
          trigger.kill()
        }
      })
    }
  }, [])

  return (
    <div className="home-scroll-container" ref={containerRef}>
      <div className="home-section hero-section" ref={heroRef}>
        <Hero />
      </div>
      <div className="home-section what-section-wrapper" ref={whatRef}>
        <What />
      </div>
    </div>
  )
}

export default Home
