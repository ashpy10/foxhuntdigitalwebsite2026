import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useColor } from '../../contexts/ColorContext'
import Equalizer from '../../components/equalizer'
import './hero.css'

function Hero() {
  const [mode, setMode] = useState('chaos')
  const heroSignRef = useRef(null)
  const tunedText1Ref = useRef(null)
  const tunedText2Ref = useRef(null)
  const text1Ref = useRef(null)
  const text2Ref = useRef(null)
  const text3Ref = useRef(null)
  const text4Ref = useRef(null)
  const fillColor = useColor()
  
  // Calculate stroke color (next color in rotation, same as logo)
  const colors = [
    '#1FFFC0', // CHARGED MINT
    '#FF1E56', // HOT SHOCK RED
    '#00FF87', // TROPICAL VOLT GREEN
    '#FF5100', // BURNT CIRCUIT
    '#FF007F', // ROSE FIRE
    '#00D4FF', // TROPICAL BLUE
    '#F9FF00', // ZAPPED YELLOW
    '#9F00FF', // CORRUPT PINK
    '#7FFF00', // GREEN POWER
    '#FF008C', // RAVE MAGENTA
  ]
  const colorIndex = colors.indexOf(fillColor)
  const strokeColor = colors[(colorIndex + 1) % colors.length]

  useEffect(() => {
    const sign = heroSignRef.current
    const tunedText1 = tunedText1Ref.current
    const tunedText2 = tunedText2Ref.current
    const text1 = text1Ref.current
    const text2 = text2Ref.current
    const text3 = text3Ref.current
    const text4 = text4Ref.current
    
    if (!sign || !tunedText1 || !tunedText2 || !text1 || !text2 || !text3 || !text4) return

    // Set initial states - texts start hidden
    gsap.set([sign, tunedText1, tunedText2, text1, text2, text3, text4], { autoAlpha: 0, y: 20 })

    // Create looping timeline - each state lasts 10 seconds
    const tl = gsap.timeline({ repeat: -1 })

    // Chaos mode: 10 seconds with staggered text appearances
    // Text 1 fades in at 0s
    tl.to(text1, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    })
    // Text 2 fades in at 2s
    .to(text2, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '+=1.6') // 2 seconds from previous
    // Text 3 fades in at 4s
    .to(text3, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '+=2') // 2 seconds after text2 starts
    // Text 4 fades in at 6s
    .to(text4, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '+=2') // 2 seconds after text3 starts
    // All texts fade out at 10s (4 seconds after text4 starts)
    .to([text1, text2, text3, text4], {
      autoAlpha: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.in',
    }, '+=3.6') // Total: 0 + 2 + 2 + 2 + 4 = 10 seconds
    // // Show transition text
    .to(sign, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    })
    // Keep text visible briefly, then switch to tuned
    .to({}, {
      duration: 0.8,
      onComplete: () => setMode('tuned')
    })
    // Hide text
    .to(sign, {
      autoAlpha: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.in',
    })
    // Tuned mode: 10 seconds - show tuned text, ensure chaos texts stay hidden
    .to([text1, text2, text3, text4], {
      autoAlpha: 0,
      duration: 0,
      immediateRender: false
    }, 0)
    // First tuned text fades in
    .to(tunedText1, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    })
    // First text fades out at 5 seconds
    .to(tunedText1, {
      autoAlpha: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.in',
    }, '+=4.6') // 5 seconds total (0.4s fade in + 4.6s visible)
    // Second tuned text fades in
    .to(tunedText2, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    })
    .to({}, {
      duration: 4.6, // Remaining time for tuned mode (10s total - 5s for first text - 0.4s fade in)
      onComplete: () => {
        setMode('chaos')
        gsap.set([tunedText1, tunedText2], { autoAlpha: 0 })
      }
    })
  }, [])

  // Ensure texts are hidden/shown based on mode
  useEffect(() => {
    const tunedText1 = tunedText1Ref.current
    const tunedText2 = tunedText2Ref.current
    const text1 = text1Ref.current
    const text2 = text2Ref.current
    const text3 = text3Ref.current
    const text4 = text4Ref.current
    
    if (!tunedText1 || !tunedText2 || !text1 || !text2 || !text3 || !text4) return

    if (mode === 'chaos') {
      gsap.set([tunedText1, tunedText2], { autoAlpha: 0 })
    } else if (mode === 'tuned') {
      gsap.set([text1, text2, text3, text4], { autoAlpha: 0 })
    }
  }, [mode])

  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="hero-equalizer-wrapper" style={{ color: fillColor }}>
        <Equalizer mode={mode} />
        <div className="hero-transition-text hero-sign" ref={heroSignRef}>
          Tune the madness
        </div>
        <div className="hero-tuned-text-1 hero-sign" ref={tunedText1Ref} style={{ color: strokeColor }}>
          Bring your business into rhythm
        </div>
        <div className="hero-tuned-text-2 hero-sign" ref={tunedText2Ref} style={{ color: strokeColor }}>
          with operational clarity
        </div>
        <div className="hero-text-1 hero-staggered-text" ref={text1Ref} style={{ color: strokeColor }}>
          Unknown business<br />metrics
        </div>
        <div className="hero-text-2 hero-staggered-text" ref={text2Ref} style={{ color: strokeColor }}>
          Too many spreadsheets<br />to update
        </div>
        <div className="hero-text-3 hero-staggered-text" ref={text3Ref} style={{ color: strokeColor }}>
          Decisions without<br />facts
        </div>
        <div className="hero-text-4 hero-staggered-text" ref={text4Ref} style={{ color: strokeColor }}>
          Silence the<br />chaos
        </div>
      </div>
    </section>
  )
}

export default Hero

