import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './equalizer.css'

const COLUMN_COUNT = 12
const MAX_BARS_PER_COLUMN = 5

// Generate a simple rectangle path without rounded corners
const createRectPath = (width, height) => {
  const w = width / 2
  const h = height / 2
  
  // Create simple rectangular path
  return `M ${-w},${h}
          L ${w},${h}
          L ${w},${-h}
          L ${-w},${-h}
          Z`
}

function Equalizer({ mode = 'chaos' }) {
  const barsRef = useRef({}) // Changed to object to store by column and bar index
  const waveAnimationRef = useRef(null) // Store reference to wave animation

  useEffect(() => {
    // Use a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const allBars = Object.values(barsRef.current).flat().filter(Boolean)
      
      if (allBars.length === 0) {
        // If bars aren't ready, try again on next frame
        requestAnimationFrame(() => {
          const retryBars = Object.values(barsRef.current).flat().filter(Boolean)
          if (retryBars.length === 0) return
          initializeAnimations(retryBars)
        })
        return
      }

      initializeAnimations(allBars)
    }, 0)

    function initializeAnimations(allBars) {
      // Kill any existing animations
      gsap.killTweensOf(allBars)
      if (waveAnimationRef.current) {
        waveAnimationRef.current.kill()
        waveAnimationRef.current = null
      }

    if (mode === 'chaos') {
      // Animate each column independently
      Array.from({ length: COLUMN_COUNT }).forEach((_, columnIndex) => {
        const columnBars = barsRef.current[columnIndex] || []
        
        columnBars.forEach((bar, barIndex) => {
          if (!bar) return
          
          // Random animation for each bar segment
          const activeBars = gsap.utils.random(1, MAX_BARS_PER_COLUMN)
          const isActive = barIndex < activeBars
          
          gsap.set(bar, {
            opacity: isActive ? 1 : 0,
            scaleY: isActive ? 1 : 0,
            transformOrigin: '50% 100%'
          })

          gsap.to(bar, {
            opacity: () => gsap.utils.random(0, 1) > 0.3 ? 1 : 0,
            scaleY: () => gsap.utils.random(0, 1),
            duration: gsap.utils.random(0.15, 0.4),
            repeat: -1,
            yoyo: true,
            ease: 'none',
            delay: (columnIndex * 0.02) + (barIndex * 0.05),
          })
        })
      })
    }

    if (mode === 'tuned') {
      // Initialize all bars to collapsed state first
      Array.from({ length: COLUMN_COUNT }).forEach((_, columnIndex) => {
        const columnBars = barsRef.current[columnIndex] || []
        columnBars.forEach((bar) => {
          if (bar) {
            gsap.set(bar, {
              opacity: 1,
              scaleY: 0,
              transformOrigin: '50% 100%'
            })
          }
        })
      })
      
      // Synchronized wave animation - continuous sine wave moving across columns
      // Similar to Cassette Music's smooth, harmonious wave motion
      const waveObj = { time: 0 }
      
      // Slower, smoother animation with continuous loop
      waveAnimationRef.current = gsap.to(waveObj, {
        time: Math.PI * 2, // One full cycle
        duration: 4, // Slower speed (increased from 2)
        repeat: -1,
        ease: 'none', // Linear for smooth continuous motion
        onUpdate: function() {
          // Create a continuous sine wave that moves across all columns
          // Each column has a phase offset to create the wave effect
          Array.from({ length: COLUMN_COUNT }).forEach((_, columnIndex) => {
            const columnBars = barsRef.current[columnIndex] || []
            
            // Phase offset creates the wave traveling effect
            // Wave moves from left to right continuously
            const phaseOffset = (columnIndex / COLUMN_COUNT) * Math.PI * 2
            const waveValue = Math.sin(waveObj.time + phaseOffset)
            
            // Normalize wave from -1,1 to 0,1
            const normalizedWave = (waveValue + 1) / 2
            
            columnBars.forEach((bar, barIndex) => {
              if (!bar) return
              
              // Each bar activates based on wave height and its threshold
              // Lower bars activate with less wave height
              // Higher bars need more wave height
              const threshold = (barIndex + 1) / MAX_BARS_PER_COLUMN
              
              // Smooth intensity calculation - bars scale gradually
              let targetScaleY = 0
              if (normalizedWave >= threshold) {
                // Calculate smooth scale based on how much wave exceeds threshold
                const excess = normalizedWave - threshold
                const range = 1 - threshold
                targetScaleY = Math.min(1, excess / range)
              }
              
              // Use set() for immediate updates - smoother than to() in onUpdate
              // The animation itself provides the smoothness through the continuous time update
              gsap.set(bar, {
                scaleY: targetScaleY,
                opacity: targetScaleY > 0.05 ? 1 : 0 // Fade out when very small
              })
            })
          })
        }
      })
    }
    }

    return () => {
      clearTimeout(timeoutId)
      if (waveAnimationRef.current) {
        waveAnimationRef.current.kill()
      }
    }
  }, [mode])

  // Calculate dimensions
  const barWidth = 40 // Increased from 20 to make columns wider
  const segmentHeight = 60 // Height of each stacked segment
  const segmentGap = 2 // Gap between segments
  const barSpacing = 48 // Increased from 24 to maintain spacing with fewer columns
  const totalWidth = COLUMN_COUNT * barSpacing
  const viewBoxWidth = totalWidth
  const viewBoxHeight = 250
  
  // Generate path for a single segment (simple rectangle)
  const segmentPath = createRectPath(barWidth, segmentHeight)

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      className="equalizer"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Texture patterns and filters */}
      <defs>
        {/* Noise texture pattern for vintage/analog feel */}
        <filter id="texture-noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="2" 
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix 
            in="noise" 
            type="saturate" 
            values="0"
            result="grayscale-noise"
          />
          <feComposite 
            in="SourceGraphic" 
            in2="grayscale-noise" 
            operator="overlay"
            result="textured"
          />
        </filter>
        
        {/* Halftone dot pattern for texture - more visible */}
        <pattern id="halftone" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1" fill="white" opacity="0.4"/>
        </pattern>
        
        {/* Gradient for depth */}
        <linearGradient id="bar-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.9"/>
        </linearGradient>
        
        {/* Noise texture using small dots - more visible */}
        <pattern id="noise-dots" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="transparent"/>
          <circle cx="1" cy="1" r="0.4" fill="white" opacity="0.3"/>
          <circle cx="3" cy="3" r="0.4" fill="white" opacity="0.3"/>
          <circle cx="1" cy="3" r="0.3" fill="white" opacity="0.2"/>
          <circle cx="3" cy="1" r="0.3" fill="white" opacity="0.2"/>
        </pattern>
        
        {/* Vertical line texture - more visible */}
        <pattern id="line-texture" x="0" y="0" width="4" height="60" patternUnits="userSpaceOnUse">
          <line x1="2" y1="0" x2="2" y2="60" stroke="white" strokeWidth="0.5" opacity="0.2"/>
        </pattern>
      </defs>
      
      {Array.from({ length: COLUMN_COUNT }).map((_, columnIndex) => {
        const centerX = columnIndex * barSpacing + barWidth / 2
        const baseY = viewBoxHeight - (segmentHeight + segmentGap)
        
        // Initialize ref array for this column if it doesn't exist
        if (!barsRef.current[columnIndex]) {
          barsRef.current[columnIndex] = []
        }
        
        return (
          <g key={columnIndex}>
            {Array.from({ length: MAX_BARS_PER_COLUMN }).map((_, barIndex) => {
              const segmentY = baseY - (barIndex * (segmentHeight + segmentGap))
              
              return (
                <g
                  key={barIndex}
                  ref={(el) => {
                    if (el) barsRef.current[columnIndex][barIndex] = el
                  }}
                  transform={`translate(${centerX}, ${segmentY + segmentHeight / 2})`}
                >
                  {/* Main bar with gradient and noise filter */}
                  <path
                    d={segmentPath}
                    fill="url(#bar-gradient)"
                    fillOpacity="1"
                    filter="url(#texture-noise)"
                    className="equalizer-bar"
                  />
                  {/* Texture overlay - halftone pattern */}
                  <path
                    d={segmentPath}
                    fill="url(#halftone)"
                    fillOpacity="0.7"
                    className="equalizer-bar-texture"
                  />
                  {/* Noise dots texture layer */}
                  <path
                    d={segmentPath}
                    fill="url(#noise-dots)"
                    fillOpacity="0.6"
                    className="equalizer-bar-texture"
                  />
                  {/* Line texture for additional detail */}
                  <path
                    d={segmentPath}
                    fill="url(#line-texture)"
                    fillOpacity="0.5"
                    className="equalizer-bar-lines"
                  />
                </g>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}

export default Equalizer



