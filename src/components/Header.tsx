import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { CircleUserRound } from 'lucide-react'
import './Header.css'

export default function Header() {
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

        <Link to="/profile" className="profile">
          <CircleUserRound size={48} strokeWidth={2} />
        </Link>
      </div>
    </header>
  )
}
