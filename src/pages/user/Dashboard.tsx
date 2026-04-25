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
              Привіт, {profile?.first_name || 'друже'} 👋
            </h1>

            <p className="dashboard-subtitle">
              Цікаві мовленнєві вправи для дітей віком <b>2–7 років</b>. <br />
              Вивчайте звуки, покращуйте вимову та пізнавайте світ через гру 🌍{' '}
              <br />
              <span className="subtitle-soft">
                Від перших слів до впевненого мовлення — кожен крок важливий 💛
              </span>
            </p>

            <div className="dashboard-actions">
              <button
                className="btn-primary"
                onClick={() => navigate('/lessons')}
              >
                Почати навчання{' '}
              </button>
              <button
                className="btn-primary"
                onClick={() => navigate('/progress')}
              >
                Переглянути прогрес{' '}
              </button>
            </div>
          </div>

          <img
            src={childImg}
            alt="діти навчаються"
            className="dashboard-hero-img"
          />
        </div>

        <div className="dashboard-about">
          <div>
            <h2>🌟 Про SoundSteps</h2>
            <p>
              SoundSteps допомагає дітям розвивати мовлення через цікаві та
              інтерактивні вправи. <br />
              Діти вчаться вимовляти звуки, поповнювати словниковий запас і
              пізнавати навколишній світ 🌍 <br />
              <br />
              <span className="about-soft">
                Розроблений з турботою про ранній розвиток дитини, застосунок
                підтримує розвиток мовлення, навичок слухання та впевненості
                через навчання у грі.
              </span>
            </p>
          </div>
        </div>

        {role === 'speech_therapist' ? (
          <div className="dashboard-info big">
            <h2>
              <UserStar className="user-icon" /> Панель логопеда
            </h2>
            <p>
              Створюйте цікаві вправи, відстежуйте прогрес кожної дитини та
              м'яко супроводжуйте її крок за кроком у розвитку мовлення 💛{' '}
              <br />
              <br />
              Аналізуйте вимову звуків, переглядайте результати й підтримуйте
              розвиток за допомогою персоналізованої практики. Допоможіть кожній
              дитині набути впевненості та сформувати чітке природне мовлення у
              дружньому й структурованому середовищі.
            </p>
          </div>
        ) : (
          <>
            {isNoData ? (
              <div className="empty-state">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                  alt="старт"
                />
                <h2>Розпочнемо вашу подорож 🚀</h2>
                <p>
                  Поки що немає прогресу. Почніть перший урок і побачите
                  результати тут!
                </p>
                <button className="btn-primary">Почати перший урок</button>
              </div>
            ) : (
              <div className="stats-grid">
                <div className="stat-card">
                  <Star className="dashboard-icon" />
                  <h3>{stats?.summary?.total_points ?? 0}</h3>
                  <p>Бали ⭐</p>
                </div>

                <div className="stat-card">
                  <ChartSpline className="dashboard-icon" />
                  <h3>{stats?.summary?.average_score?.toFixed(1) ?? 0}%</h3>
                  <p>Середній бал</p>
                </div>

                <div className="stat-card">
                  <Trophy className="dashboard-icon" />
                  <h3>
                    {stats?.summary
                      ? Math.round(stats.summary.success_rate * 100)
                      : 0}
                    %
                  </h3>
                  <p>Рівень успішності</p>
                </div>
              </div>
            )}
          </>
        )}

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <BookOpen className="dashboard-icon" />
            <h3>Уроки</h3>
            <p>Цікаві мовленнєві вправи для дітей</p>
          </div>

          <div className="dashboard-card">
            <ChartSpline className="dashboard-icon" />
            <h3>Прогрес</h3>
            <p>Переглядайте, як покращуються навички</p>
          </div>

          <div className="dashboard-card">
            <Trophy className="dashboard-icon" />
            <h3>Досягнення</h3>
            <p>Відкривайте нагороди</p>
          </div>
        </div>

        <div className="dashboard-info">
          <h2>✨ Порада дня</h2>
          <p>
            Навіть 10 хвилин практики щодня допомагають дітям прогресувати
            швидше 💛
          </p>
        </div>
      </div>
    </>
  )
}
