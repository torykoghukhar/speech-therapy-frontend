import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { CircleUserRound } from 'lucide-react'
import api from '../api/axios'
import './Header.css'

export default function Header() {
  const [points, setPoints] = useState<number>(0)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [childRes, profileRes] = await Promise.all([
          api.get('users/child/'),
          api.get('users/profile/'),
        ])

        setPoints(childRes.data?.points || 0)
        setRole(profileRes.data?.role)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load header data', error)
      }
    }

    loadData()
  }, [])

  return (
    <header className="header">
      <Link to="/dashboard">
        <img src={logo} alt="SoundSteps Logo" className="logo" />
      </Link>

      <div className="nav-wrapper">
        <nav className="nav">
          <Link to="/lessons" className="nav-link">
            Уроки
          </Link>
          <Link to="/progress" className="nav-link">
            Прогрес
          </Link>
          {role !== 'speech_therapist' && (
            <Link to="/achievements" className="nav-link">
              Досягнення
            </Link>
          )}
        </nav>

        <div className="header-right">
          {role !== 'speech_therapist' && (
            <div className="points-badge">⭐ {points}</div>
          )}

          <Link to="/profile" className="profile">
            <CircleUserRound size={48} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </header>
  )
}
