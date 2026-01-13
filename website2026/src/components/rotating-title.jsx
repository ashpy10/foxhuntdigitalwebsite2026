import { useState, useEffect } from 'react'
import './rotating-title.css'

function RotatingTitle() {
  const [title, setTitle] = useState('')

  useEffect(() => {
    // Array of titles that rotate on page load
    const titles = [
      'CRM & Client Data',
      'Strategic Consulting',
      'Web Development Excellence',
      'Custom Operational Systems',
      'Software Solutions Agency',
      'Reporting & Visibility',
    ]
    
    const randomTitle = titles[Math.floor(Math.random() * titles.length)]
    setTitle(randomTitle)
  }, [])

  return (
    <div className="rotating-title">
      <h3>{title}</h3>
    </div>
  )
}

export default RotatingTitle

