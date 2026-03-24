import React from 'react'
import { useState } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import './Auth.css'
import { MESSAGES } from '../../constants/messages'
import { AxiosError } from 'axios'

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    password: '',
    password_confirm: '',
    is_parent: false,
    is_therapist: false,
    birth_date: '',
    phone_number: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = MESSAGES.REQUIRED
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = MESSAGES.INVALID_EMAIL
    }

    if (!formData.first_name) {
      newErrors.first_name = MESSAGES.REQUIRED
    }

    if (!formData.birth_date) {
      newErrors.birth_date = MESSAGES.REQUIRED
    }

    if (!formData.phone_number) {
      newErrors.phone_number = MESSAGES.REQUIRED
    } else if (!/^\d+$/.test(formData.phone_number)) {
      newErrors.phone_number = MESSAGES.INVALID_PHONE
    }

    if (!formData.password) {
      newErrors.password = MESSAGES.REQUIRED
    } else if (formData.password.length < 6) {
      newErrors.password = MESSAGES.PASSWORD_TOO_SHORT
    }

    if (!formData.password_confirm) {
      newErrors.password_confirm = MESSAGES.REQUIRED
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = MESSAGES.PASSWORDS_NOT_MATCH
    }

    if (!formData.is_parent && !formData.is_therapist) {
      newErrors.role = MESSAGES.SELECT_ROLE
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    const newValue = type === 'checkbox' ? checked : value

    setFormData({
      ...formData,
      [name]: newValue,
    })

    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      await api.post('users/register/', formData)
      navigate('/')
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const backendErrors = error.response?.data

        if (backendErrors) {
          const formattedErrors: Record<string, string> = {}

          Object.keys(backendErrors).forEach((key) => {
            formattedErrors[key] = backendErrors[key][0]
          })

          setErrors(formattedErrors)
        }
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <img src={logo} alt="SoundSteps" className="auth-logo" />
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <div className="form-grid">
            <div className="input-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                name="phone_number"
                onChange={handleChange}
                className={errors.phone_number ? 'error' : ''}
              />
              {errors.phone_number && (
                <span className="error-text">{errors.phone_number}</span>
              )}
            </div>

            <div className="input-group">
              <label>Full Name</label>
              <input
                name="first_name"
                onChange={handleChange}
                className={errors.first_name ? 'error' : ''}
              />
              {errors.first_name && (
                <span className="error-text">{errors.first_name}</span>
              )}
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="input-group">
              <label>Birth Date</label>
              <input
                name="birth_date"
                type="date"
                onChange={handleChange}
                className={errors.birth_date ? 'error' : ''}
              />
              {errors.birth_date && (
                <span className="error-text">{errors.birth_date}</span>
              )}
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                name="password_confirm"
                type="password"
                onChange={handleChange}
                className={errors.password_confirm ? 'error' : ''}
              />
              {errors.password_confirm && (
                <span className="error-text">{errors.password_confirm}</span>
              )}
            </div>
          </div>

          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="is_parent" onChange={handleChange} />
              Parent
            </label>
            <label>
              <input
                type="checkbox"
                name="is_therapist"
                onChange={handleChange}
              />
              Therapist
            </label>
          </div>
          {errors.role && (
            <span className="error-text role-error">{errors.role}</span>
          )}

          <button type="submit" className="primary-btn">
            Create Account
          </button>
        </form>
        <p className="auth-footer">
          Already have an account?{' '}
          <span onClick={() => navigate('/')}>Login</span>
        </p>
      </div>
    </div>
  )
}
