import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './equalizer.css'

const COLUMN_COUNT = 24
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

  useEffect(() => {
    const allBars = Object.values(barsRef.current).flat().filter(Boolean)
    
    if (allBars.length === 0) return

    // Kill any existing animations
    gsap.killTweensOf(allBars)

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
      // Smooth wave animation moving across columns
      Array.from({ length: COLUMN_COUNT }).forEach((_, columnIndex) => {
        const columnBars = barsRef.current[columnIndex] || []
        
        // Phase offset creates the wave effect across columns
        const phaseOffset = (columnIndex / COLUMN_COUNT) * Math.PI * 2
        
        columnBars.forEach((bar, barIndex) => {
          if (!bar) return
          
          // Each bar activates when wave height exceeds its threshold
          const threshold = (barIndex + 1) / MAX_BARS_PER_COLUMN
          
          gsap.set(bar, {
            opacity: 1,
            scaleY: 0,
            transformOrigin: '50% 100%'
          })

          // Create a smooth wave animation using onUpdate
          const waveObj = { progress: 0 }
          
          gsap.to(waveObj, {
            progress: 1,
            duration: 2,
            repeat: -1,
            ease: 'none',
            onUpdate: function() {
              const time = waveObj.progress * Math.PI * 2
              const wave = Math.sin(time + phaseOffset)
              const normalizedWave = (wave + 1) / 2 // Convert -1,1 to 0,1
              const isActive = normalizedWave >= threshold
              
              gsap.set(bar, {
                scaleY: isActive ? 1 : 0,
                opacity: isActive ? 1 : 0
              })
            }
          })
        })
      })
    }
  }, [mode])

  // Calculate dimensions
  const barWidth = 20
  const segmentHeight = 20 // Height of each stacked segment
  const segmentGap = 2 // Gap between segments
  const barSpacing = 24
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
                  <path
                    d={segmentPath}
                    fill="currentColor"
                    fillOpacity="1"
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

