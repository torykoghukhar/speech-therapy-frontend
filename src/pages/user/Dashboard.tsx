import { BookOpen, ChartSpline, Trophy, Star, UserStar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import './Dashboard.css'
import childImg from '../../assets/child.png'
import type { UserProfile } from '../../types/user'
import type { Stats } from '../../types/progress'

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<(Stats & { status?: string }) | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('users/profile/').then((res) => {
      setProfile(res.data)
      setRole(res.data.role)
    })

    api
      .get('progress/stats/?period=7d')
      .then((res) => setStats(res.data))
      .catch(() => {})
  }, [])

  const isNoData = !stats || stats.status === 'no_data'

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-hero">
          <div>
            <h1 className="dashboard-title">
              Hello, {profile?.first_name || 'friend'} 👋
            </h1>

            <p className="dashboard-subtitle">
              Fun speech exercises for children aged <b>2–7 years</b>. <br />
              Learn sounds, improve pronunciation and explore the world through
              play 🌍 <br />
              <span className="subtitle-soft">
                From first words to confident speech — every step matters 💛
              </span>
            </p>

            <div className="dashboard-actions">
              <button
                className="btn-primary"
                onClick={() => navigate('/lessons')}
              >
                Start Learning{' '}
              </button>
              <button
                className="btn-primary"
                onClick={() => navigate('/progress')}
              >
                View Progress{' '}
              </button>
            </div>
          </div>

          <img
            src={childImg}
            alt="kids learning"
            className="dashboard-hero-img"
          />
        </div>

        <div className="dashboard-about">
          <div>
            <h2>🌟 About SoundSteps</h2>
            <p>
              SoundSteps helps children develop speech through fun and
              interactive exercises. <br />
              Kids learn to pronounce sounds, build vocabulary and explore the
              world around them 🌍 <br />
              <br />
              <span className="about-soft">
                Designed with care for early childhood development, the app
                supports language growth, listening skills and confidence
                through playful learning
              </span>
            </p>
          </div>
        </div>

        {role === 'speech_therapist' ? (
          <div className="dashboard-info big">
            <h2>
              <UserStar className="user-icon" /> Therapist Dashboard
            </h2>
            <p>
              Create engaging exercises, follow each child’s progress and gently
              guide them as they improve their speech step by step 💛 <br />
              <br />
              Track how children pronounce sounds, review their results and
              support their development with personalized practice. Help each
              child build confidence and develop clear, natural speech in a
              supportive and structured way.
            </p>
          </div>
        ) : (
          <>
            {isNoData ? (
              <div className="empty-state">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                  alt="start"
                />
                <h2>Let’s start your journey 🚀</h2>
                <p>
                  No progress yet. Start your first lesson and see your results
                  here!
                </p>
                <button className="btn-primary">Start First Lesson</button>
              </div>
            ) : (
              <div className="stats-grid">
                <div className="stat-card">
                  <Star className="dashboard-icon" />
                  <h3>{stats?.summary?.total_points ?? 0}</h3>
                  <p>Points ⭐</p>
                </div>

                <div className="stat-card">
                  <ChartSpline className="dashboard-icon" />
                  <h3>{stats?.summary?.average_score?.toFixed(1) ?? 0}%</h3>
                  <p>Average Score</p>
                </div>

                <div className="stat-card">
                  <Trophy className="dashboard-icon" />
                  <h3>
                    {stats?.summary
                      ? Math.round(stats.summary.success_rate * 100)
                      : 0}
                    %
                  </h3>
                  <p>Success Rate</p>
                </div>
              </div>
            )}
          </>
        )}

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <BookOpen className="dashboard-icon" />
            <h3>Lessons</h3>
            <p>Fun speech exercises for kids</p>
          </div>

          <div className="dashboard-card">
            <ChartSpline className="dashboard-icon" />
            <h3>Progress</h3>
            <p>See how skills improve</p>
          </div>

          <div className="dashboard-card">
            <Trophy className="dashboard-icon" />
            <h3>Achievements</h3>
            <p>Unlock rewards</p>
          </div>
        </div>

        <div className="dashboard-info">
          <h2>✨ Daily tip</h2>
          <p>
            Even 10 minutes of practice every day helps children improve faster
            💛
          </p>
        </div>
      </div>
    </>
  )
}
