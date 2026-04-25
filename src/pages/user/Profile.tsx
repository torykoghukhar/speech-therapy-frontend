import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { CircleUserRound, Baby, Heart } from 'lucide-react'
import './Auth.css'
import type {
  UserProfile,
  ChildProfile,
  Therapist,
  TherapistChild,
} from '../../types/user'

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [child, setChild] = useState<ChildProfile | null>(null)
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [children, setChildren] = useState<TherapistChild[]>([])
  const [openId, setOpenId] = useState<number | null>(null)
  const [donationAmount, setDonationAmount] = useState(500)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, childRes] = await Promise.all([
          api.get('users/profile/'),
          api.get('users/child/'),
        ])

        setProfile(profileRes.data)
        setChild(childRes.data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load profile', error)
      }
    }

    loadData()
  }, [])

  const handleDonate = async (amount = 500) => {
    try {
      const res = await api.post('users/payments/create-checkout/', {
        amount,
      })

      window.location.href = res.data.url
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Payment error', e)
      alert('Щось пішло не так під час оплати')
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const success = params.get('success')
    const canceled = params.get('canceled')

    if (success) {
      alert('💛 Дякуємо за вашу підтримку!')
    }

    if (canceled) {
      alert('Оплату скасовано')
    }

    if (success || canceled) {
      window.history.replaceState({}, '', '/profile')
    }
  }, [])

  useEffect(() => {
    const loadTherapists = async () => {
      try {
        const res = await api.get('users/therapists/')
        setTherapists(res.data)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load therapists', e)
      }
    }

    loadTherapists()
  }, [])

  useEffect(() => {
    if (profile?.role === 'speech_therapist') {
      api.get('users/therapist/children/').then((res) => setChildren(res.data))
    }
  }, [profile])

  const updateProfile = async () => {
    await api.patch('users/profile/', profile)
    alert('Профіль оновлено')
  }

  const saveChild = async () => {
    if (!child) return

    try {
      if (child.id) {
        await api.patch(`users/children/${child.id}/update/`, child)
      } else {
        const response = await api.post('users/children/create/', child)
        setChild(response.data)
      }

      alert('Профіль дитини збережено')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save child', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')

    delete api.defaults.headers.common['Authorization']

    navigate('/')
  }

  if (!profile) return null

  return (
    <>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-form-card">
            <h2>Профіль</h2>

            <div className="input-group">
              <label>Ім'я</label>
              <input value={profile.first_name} disabled />
            </div>

            <div className="input-group">
              <label>Електронна адреса</label>
              <input value={profile.email} disabled />
            </div>

            <div className="input-group">
              <label>Дата народження</label>
              <input
                type="date"
                value={profile.birth_date || ''}
                onChange={(e) =>
                  setProfile({ ...profile, birth_date: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label>Телефон</label>
              <input
                value={profile.phone_number || ''}
                onChange={(e) =>
                  setProfile({ ...profile, phone_number: e.target.value })
                }
              />
            </div>

            <button className="primary-btn" onClick={updateProfile}>
              Зберегти зміни
            </button>
            {profile.role === 'parent' && (
              <>
                <hr style={{ margin: '40px 0' }} />
                <h3>Профіль дитини</h3>

                {!child && (
                  <button
                    className="primary-btn"
                    onClick={() =>
                      setChild({ name: '', age: '', difficulty_level: 1 })
                    }
                  >
                    + Додати дитину
                  </button>
                )}

                {child && (
                  <>
                    <div className="input-group">
                      <label>Ім'я дитини</label>
                      <input
                        value={child.name || ''}
                        onChange={(e) =>
                          setChild({ ...child, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="input-group">
                      <label>Вік</label>
                      <input
                        type="number"
                        value={child.age || ''}
                        onChange={(e) =>
                          setChild({ ...child, age: e.target.value })
                        }
                      />
                    </div>

                    <div className="input-group">
                      <label>Логопед (необов'язково)</label>
                      <select
                        className="custom-select"
                        value={child?.speech_therapist || ''}
                        onChange={(e) =>
                          setChild({
                            ...child,
                            speech_therapist: e.target.value || null,
                          })
                        }
                      >
                        <option value="">Без логопеда</option>

                        {therapists.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Рівень складності</label>

                      <select
                        className="custom-select"
                        value={child.difficulty_level || 1}
                        onChange={(e) =>
                          setChild({
                            ...child,
                            difficulty_level: Number(e.target.value),
                          })
                        }
                      >
                        <option value={1}>1 — Значні труднощі мовлення</option>
                        <option value={2}>2 — Середній рівень</option>
                        <option value={3}>
                          3 — Просунутий рівень мовлення
                        </option>
                      </select>

                      <div className="difficulty-info">
                        <p>
                          Оберіть рівень складності залежно від мовленнєвого
                          розвитку вашої дитини:
                        </p>

                        <ul>
                          <li>
                            <strong>1</strong> — Вправи будуть простішими
                          </li>
                          <li>
                            <strong>2</strong> — Збалансована складність
                          </li>
                          <li>
                            <strong>3</strong> — Вищий рівень мовлення
                          </li>
                        </ul>
                      </div>
                    </div>

                    <button className="primary-btn" onClick={saveChild}>
                      Зберегти дані дитини
                    </button>
                  </>
                )}
              </>
            )}
            {profile.role === 'speech_therapist' && (
              <>
                <hr style={{ margin: '40px 0' }} />
                <h3>Ваші учні</h3>

                {children.length === 0 && (
                  <p className="empty-text">
                    Поки немає призначених дітей
                    <Baby className="baby-icon" />
                  </p>
                )}

                {children.map((c) => (
                  <div
                    key={c.id}
                    className={`child-card ${openId === c.id ? 'open' : ''}`}
                  >
                    <div
                      className="child-header"
                      onClick={() => setOpenId(openId === c.id ? null : c.id)}
                    >
                      <span>{c.name}</span>
                      <span className="arrow">
                        {openId === c.id ? '▲' : '▼'}
                      </span>
                    </div>

                    {openId === c.id && (
                      <div className="child-details">
                        <p>
                          <strong>Вік:</strong> {c.age}
                        </p>
                        <p>
                          <strong>Складність:</strong> {c.difficulty}
                        </p>
                        <p>
                          <strong>Контакт:</strong> {c.parent_contact}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="profile-side-card">
            <CircleUserRound size={120} />
            <h3>{profile.first_name}</h3>
            <p style={{ color: '#64748B' }}>
              {profile.role === 'parent'
                ? 'Обліковий запис батьків'
                : 'Обліковий запис логопеда'}
            </p>
            <div className="profile-buttons">
              <div className="donate-block">
                <div className="donate-buttons">
                  <button onClick={() => setDonationAmount(500)}>$5</button>
                  <button onClick={() => setDonationAmount(1000)}>$10</button>
                  <button onClick={() => setDonationAmount(2000)}>$20</button>
                </div>

                <button
                  className="secondary-btn"
                  onClick={() => handleDonate(donationAmount)}
                >
                  Підтримати на ${donationAmount / 100}{' '}
                  <Heart className="heart-icon" />
                </button>
              </div>
              <button className="secondary-btn" onClick={logout}>
                Вийти
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
