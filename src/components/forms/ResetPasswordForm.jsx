// src/components/forms/ResetPasswordForm.jsx
import { useState } from 'react'
import '../../styles/reset-password-form.css'

const ResetPasswordForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  const validate = () => {
    const newErrors = {}
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 chars'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      setSuccess('Resetting password...')
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
        <label htmlFor="password" className="form-label">New Password</label>
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
        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
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
        Reset Password
      </button>
    </form>
  )
}

export default ResetPasswordForm
