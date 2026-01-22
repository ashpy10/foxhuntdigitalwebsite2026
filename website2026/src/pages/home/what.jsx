import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './what.css'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

function What() {
  const [activeToggle, setActiveToggle] = useState('auto')
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const imageBoxRef = useRef(null)
  const scrollTriggerRef = useRef(null)
  
  // Break the sentence into highlightable parts
  const highlightableParts = [
    { text: 'tools', image: 'tools' },
    { text: 'data', image: 'data' },
    { text: 'workflows', image: 'workflows' },
    { text: 'steady', image: 'steady' },
    { text: 'customized', image: 'customized' },
    { text: 'system', image: 'system' }
  ]
  
  const sentenceParts = [
    { text: 'We align your ', highlight: false },
    { text: 'tools', highlight: true, image: 'tools' },
    { text: ', ', highlight: false },
    { text: 'data', highlight: true, image: 'data' },
    { text: ', and ', highlight: false },
    { text: 'workflows', highlight: true, image: 'workflows' },
    { text: ' into one ', highlight: false },
    { text: 'steady', highlight: true, image: 'steady' },
    { text: ' ', highlight: false },
    { text: 'customized', highlight: true, image: 'customized' },
    { text: ' ', highlight: false },
    { text: 'system', highlight: true, image: 'system' },
    { text: '.', highlight: false }
  ]

  // Handle manual toggle changes
  useEffect(() => {
    const title = titleRef.current
    const imageBox = imageBoxRef.current
    
    if (!title || !imageBox) return
    
    if (activeToggle !== 'auto') {
      // Kill any existing scroll triggers
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
        scrollTriggerRef.current = null
      }
      
      // Reset all words
      const allWords = title.querySelectorAll('.highlightable-word')
      allWords.forEach(word => {
        gsap.to(word, {
          fontWeight: 400,
          color: 'inherit',
          duration: 0.3
        })
      })
      
      // Highlight the selected word
      const selectedPart = highlightableParts.find(part => part.text === activeToggle)
      if (selectedPart) {
        allWords.forEach(word => {
          if (word.textContent.trim() === selectedPart.text) {
            gsap.to(word, {
              fontWeight: 700,
              color: '#1FFFC0',
              duration: 0.3
            })
            imageBox.style.backgroundImage = `url('/placeholder-${selectedPart.image}.jpg')`
            gsap.to(imageBox, {
              opacity: 1,
              scale: 1,
              duration: 0.5
            })
          }
        })
      }
    }
  }, [activeToggle])

  // Setup scroll triggers for auto mode
  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const imageBox = imageBoxRef.current
    
    if (!section || !title || !imageBox) return
    
    // Only setup scroll triggers in auto mode
    if (activeToggle !== 'auto') return

    // Kill existing triggers
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
    }

    const highlightableWords = title.querySelectorAll('.highlightable-word')
    
    // Create a single scroll trigger that handles all highlighting
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        const totalWords = highlightableWords.length
        const activeIndex = Math.min(Math.floor(progress * totalWords), totalWords - 1)
        
        // Reset all words first
        highlightableWords.forEach((word, index) => {
          if (index === activeIndex) {
            gsap.to(word, {
              fontWeight: 700,
              color: '#1FFFC0',
              duration: 0.2,
              ease: 'power2.out'
            })
            
            // Update image
            const wordText = word.textContent.trim()
            const wordData = highlightableParts.find(part => part.text === wordText)
            if (wordData) {
              imageBox.style.backgroundImage = `url('/placeholder-${wordData.image}.jpg')`
              gsap.to(imageBox, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: 'power2.out'
              })
            }
          } else {
            gsap.to(word, {
              fontWeight: 400,
              color: 'inherit',
              duration: 0.2,
              ease: 'power2.out'
            })
          }
        })
        
        // Show image box if we're in the scroll range
        if (progress > 0) {
          gsap.to(imageBox, {
            opacity: 1,
            scale: 1,
            duration: 0.4
          })
        } else {
          gsap.to(imageBox, {
            opacity: 0,
            scale: 0.95,
            duration: 0.4
          })
        }
      }
    })

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
        scrollTriggerRef.current = null
      }
    }
  }, [activeToggle])

  const handleToggle = (value) => {
    setActiveToggle(value)
    // Kill scroll triggers when switching to manual mode
    if (value !== 'auto' && scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
      scrollTriggerRef.current = null
    }
  }

  return (
    <section className="what-section" ref={sectionRef}>
      <div className="what-container">
        <h3 className="what-title" ref={titleRef}>
          {sentenceParts.map((part, index) => {
            if (part.highlight) {
              return (
                <span key={index} className="highlightable-word">
                  {part.text}
                </span>
              )
            }
            return <span key={index}>{part.text}</span>
          })}
        </h3>
        
        <div className="what-toggle">
          <button
            className={`toggle-btn ${activeToggle === 'auto' ? 'active' : ''}`}
            onClick={() => handleToggle('auto')}
          >
            Auto
          </button>
          <button
            className={`toggle-btn ${activeToggle === 'tools' ? 'active' : ''}`}
            onClick={() => handleToggle('tools')}
          >
            Tools
          </button>
          <button
            className={`toggle-btn ${activeToggle === 'data' ? 'active' : ''}`}
            onClick={() => handleToggle('data')}
          >
            Data
          </button>
          <button
            className={`toggle-btn ${activeToggle === 'workflows' ? 'active' : ''}`}
            onClick={() => handleToggle('workflows')}
          >
            Workflows
          </button>
          <button
            className={`toggle-btn ${activeToggle === 'steady' ? 'active' : ''}`}
            onClick={() => handleToggle('steady')}
          >
            Steady
          </button>
          <button
            className={`toggle-btn ${activeToggle === 'customized' ? 'active' : ''}`}
            onClick={() => handleToggle('customized')}
          >
            Customized
          </button>
          <button
            className={`toggle-btn ${activeToggle === 'system' ? 'active' : ''}`}
            onClick={() => handleToggle('system')}
          >
            System
          </button>
        </div>

        <div className="what-image-box" ref={imageBoxRef}>
          <div className="image-placeholder">
            {/* Image will be set via background-image in CSS */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default What
