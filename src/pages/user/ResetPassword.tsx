import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { publicApi } from '../../api/axios'
import logo from '../../assets/logo.png'
import './Auth.css'
import { MESSAGES } from '../../constants/messages'

export default function ResetPassword() {
  const { uid, token } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    password: '',
    confirm: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = MESSAGES.REQUIRED
    } else if (formData.password.length < 6) {
      newErrors.password = MESSAGES.PASSWORD_TOO_SHORT
    }

    if (!formData.confirm) {
      newErrors.confirm = MESSAGES.REQUIRED
    } else if (formData.password !== formData.confirm) {
      newErrors.confirm = MESSAGES.PASSWORDS_NOT_MATCH
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })

    setErrors((prev) => {
      const updated = { ...prev }
      delete updated[name]
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setMessage('')

    if (!validate()) return

    setLoading(true)

    try {
      await publicApi.post('users/password-reset-confirm/', {
        uid,
        token,
        new_password: formData.password,
      })

      setMessage('Пароль успішно змінено!')

      setTimeout(() => navigate('/'), 2000)
    } catch {
      setMessage(MESSAGES.RESET_ERROR)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="SoundSteps" className="auth-logo" />

        <h2>Створіть новий пароль</h2>
        <p className="auth-subtitle">Введіть новий пароль нижче</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label>Новий пароль</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="input-group">
            <label>Підтвердіть пароль</label>
            <input
              type="password"
              value={formData.confirm}
              onChange={(e) => handleChange('confirm', e.target.value)}
              className={errors.confirm ? 'error' : ''}
            />
            {errors.confirm && (
              <span className="error-text">{errors.confirm}</span>
            )}
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Оновлення...' : 'Скинути пароль'}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: '20px',
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              fontSize: '14px',
            }}
          >
            {message}
          </div>
        )}

        <p className="auth-footer">
          Назад до <span onClick={() => navigate('/')}>входу</span>
        </p>
      </div>
    </div>
  )
}
