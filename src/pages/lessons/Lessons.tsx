import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import './Lessons.css'
import type { Lesson } from '../../types/lesson'

export default function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [lessonsRes, profileRes] = await Promise.all([
          api.get('lessons/'),
          api.get('users/profile/'),
        ])

        setLessons(lessonsRes.data)
        setRole(profileRes.data.role)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load data', error)
      }
    }

    loadData()
  }, [])

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = {
    '2-3': filteredLessons.filter((l) => l.age_category === '2-3'),
    '4-5': filteredLessons.filter((l) => l.age_category === '4-5'),
    '6-7': filteredLessons.filter((l) => l.age_category === '6-7'),
  }

  return (
    <>
      <div className="lessons-page">
        <div className="lessons-container">
          <div className="lessons-header">
            <h1 className="lessons-title">
              Інтерактивні вправи, адаптовані до рівня мовлення вашої дитини
            </h1>
            <div className="title-underline" />
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Пошук уроків..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {role === 'speech_therapist' && (
            <div className="therapist-banner">
              <h2>Режим логопеда</h2>
              <p>
                Тут ви можете переглядати уроки саме так, як їх бачать діти.
                Перевіряйте вправи, зображення та звуки перед призначенням.
              </p>

              <div className="therapist-actions">
                <button
                  className="primary-btn"
                  onClick={() =>
                    window.open(
                      'http://127.0.0.1:8000/admin/lessons/lesson/add/',
                      '_blank'
                    )
                  }
                >
                  + Створити новий урок
                </button>
              </div>
            </div>
          )}

          {Object.entries(grouped).map(
            ([age, items]) =>
              items.length > 0 && (
                <div key={age} className="age-section">
                  <div className="age-header">
                    <h2 className="age-title">Вік {age}</h2>
                    <div className="age-line" />
                  </div>

                  <div className="lessons-grid">
                    {items.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="lesson-card"
                        onClick={() =>
                          navigate(
                            role === 'speech_therapist'
                              ? `/lessons/${lesson.id}/preview`
                              : `/lessons/${lesson.id}`
                          )
                        }
                      >
                        <div className="lesson-image-wrapper">
                          <img
                            src={lesson.image}
                            alt={lesson.title}
                            className="lesson-image"
                          />
                        </div>

                        <div className="lesson-content">
                          <h3>{lesson.title}</h3>
                          <p>{lesson.description}</p>
                          {role !== 'speech_therapist' &&
                            lesson.is_completed &&
                            lesson.best_score !== null && (
                              <div className="lesson-score">
                                ⭐ {lesson.best_score}%
                              </div>
                            )}
                          <button className="primary-btn small-btn">
                            {role === 'speech_therapist'
                              ? 'Переглянути урок'
                              : lesson.is_completed
                                ? 'Повторити урок'
                                : 'Почати урок'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </>
  )
}
