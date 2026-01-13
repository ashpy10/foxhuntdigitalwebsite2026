import { createContext, useContext, useState, useEffect } from 'react'

const ColorContext = createContext()

export function ColorProvider({ children }) {
  const [color, setColor] = useState('#FFFFFF')

  useEffect(() => {
    // Generate a random color on page load (same logic as logo)
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
    
    const randomIndex = Math.floor(Math.random() * colors.length)
    const selectedColor = colors[randomIndex]
    
    setColor(selectedColor)
  }, [])

  return (
    <ColorContext.Provider value={color}>
      {children}
    </ColorContext.Provider>
  )
}

export function useColor() {
  return useContext(ColorContext)
}

