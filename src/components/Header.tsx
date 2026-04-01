import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { CircleUserRound } from 'lucide-react'
import api from '../api/axios'
import './Header.css'

export default function Header() {
  const [points, setPoints] = useState<number>(0)

  useEffect(() => {
    const loadPoints = async () => {
      try {
        const res = await api.get('users/child/')
        setPoints(res.data?.points || 0)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load points', error)
      }
    }

    loadPoints()
  }, [])

  return (
    <header className="header">
      <Link to="/dashboard">
        <img src={logo} alt="SoundSteps Logo" className="logo" />
      </Link>

      <div className="nav-wrapper">
        <nav className="nav">
          <Link to="/lessons" className="nav-link">
            Lessons
          </Link>
          <Link to="/progress" className="nav-link">
            Progress
          </Link>
          <Link to="/achievements" className="nav-link">
            Achievements
          </Link>
        </nav>

        <div className="header-right">
          <div className="points-badge">⭐ {points}</div>

          <Link to="/profile" className="profile">
            <CircleUserRound size={48} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </header>
  )
}
