import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './Lessons.css'
import type { Lesson } from '../../types/lesson'

export default function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const res = await api.get('lessons/')
        setLessons(res.data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load lessons', error)
      }
    }

    loadLessons()
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
      <Header />

      <div className="lessons-page">
        <div className="lessons-container">
          <div className="lessons-header">
            <h1 className="lessons-title">
              Interactive exercises tailored to your child’s speech level
            </h1>
            <div className="title-underline" />
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search lessons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {Object.entries(grouped).map(
            ([age, items]) =>
              items.length > 0 && (
                <div key={age} className="age-section">
                  <div className="age-header">
                    <h2 className="age-title">Age {age}</h2>
                    <div className="age-line" />
                  </div>

                  <div className="lessons-grid">
                    {items.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="lesson-card"
                        onClick={() => navigate(`/lessons/${lesson.id}`)}
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

                          <button className="primary-btn small-btn">
                            Start Lesson
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

      <Footer />
    </>
  )
}
