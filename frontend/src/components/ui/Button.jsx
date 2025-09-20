// src/components/ui/Button.jsx
import { useState } from 'react'
import '../../styles/button.css'

const Button = ({ children, onClick, type = "button", variant = 'primary', disabled = false }) => {
  const [loading, setLoading] = useState(false)

  const handleClick = async (e) => {
    if (disabled) return
    if (!onClick) return  // ✅ allow forms to use type="submit"
    setLoading(true)
    try {
      await onClick(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type={type}  // ✅ supports "submit" now
      className={`button button-${variant}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default Button
