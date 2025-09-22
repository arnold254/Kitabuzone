// src/components/forms/SignupForm.jsx
import { useState } from 'react'
import '../../styles/signup-form.css'

const SignupForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  const validate = () => {
    const newErrors = {}
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email required'
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 chars'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      setSuccess('Creating account...')
      onSubmit(formData)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
    setSuccess('')
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-input"
        />
        {errors.password && <p className="form-error">{errors.password}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="form-input"
        />
        {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
      </div>
      {success && <p className="form-success">{success}</p>}

      <button type="submit" className="button button-primary full-width">
        Sign Up
      </button>
    </form>
  )
}

export default SignupForm
