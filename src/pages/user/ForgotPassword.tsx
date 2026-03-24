import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { publicApi } from '../../api/publicApi'
import logo from '../../assets/logo.png'
import './Auth.css'
import { MESSAGES } from '../../constants/messages'

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = MESSAGES.REQUIRED
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = MESSAGES.INVALID_EMAIL
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setMessage('')

    if (!validate()) return

    setLoading(true)

    try {
      const res = await publicApi.post('users/password-reset/', { email })
      setMessage(res.data.message || MESSAGES.RESET_SUCCESS)
    } catch {
      setMessage(MESSAGES.RESET_ERROR)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (value: string) => {
    setEmail(value)

    setErrors((prev) => {
      const updated = { ...prev }
      delete updated.email
      return updated
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="SoundSteps" className="auth-logo" />

        <h2>Reset Password</h2>
        <p className="auth-subtitle">
          Enter your email and we’ll send you a reset link
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleChange(e.target.value)}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: '20px',
              fontSize: '14px',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#ecfdf5',
              color: '#065f46',
            }}
          >
            {message}
          </div>
        )}

        <p className="auth-footer">
          Remembered your password?{' '}
          <span onClick={() => navigate('/')}>Back to Login</span>
        </p>
      </div>
    </div>
  )
}
