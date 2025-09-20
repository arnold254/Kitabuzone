// src/components/forms/ForgotPasswordForm.jsx

import { useState } from 'react'
import Button from '../ui/Button'
import '../../styles/forgot-password-form.css'

const ForgotPasswordForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Valid email required')
      return
    }
    setError('')
    setSuccess('Sending reset link...')
    onSubmit({ email })
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
        />
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}
      </div>
      <Button type="submit">Send Reset Link</Button>
    </form>
  )
}

export default ForgotPasswordForm