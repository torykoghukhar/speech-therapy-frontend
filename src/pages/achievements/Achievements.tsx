import { useEffect, useState } from 'react'
import { Trophy, LockKeyhole, Star } from 'lucide-react'
import api from '../../api/axios'
import './Achievements.css'
import type { Achievement } from '../../types/achievement'

export default function Achievements() {
  const [items, setItems] = useState<Achievement[]>([])

  useEffect(() => {
    api.get('progress/achievements/').then((res) => setItems(res.data))
  }, [])

  const columns = 4
  const filled = [...items]

  const remainder = filled.length % columns

  if (remainder !== 0) {
    const toAdd = columns - remainder
    for (let i = 0; i < toAdd; i++) {
      filled.push(null as unknown as Achievement)
    }
  }

  const extraRows = 2 * columns

  for (let i = 0; i < extraRows; i++) {
    filled.push(null as unknown as Achievement)
  }

  return (
    <>
      <div className="achievements-wrapper">
        <div className="achievements-page">
          <h1 className="achievements-title">
            {' '}
            <Trophy className="trophy-icon" /> Ваші досягнення
          </h1>

          <div className="achievements-grid">
            {filled.map((item, index) => {
              if (!item) {
                return (
                  <div key={index} className="achievement-card empty">
                    <Trophy size={48} strokeWidth={1.5} />
                    <div className="empty-text">Незабаром</div>
                  </div>
                )
              }

              return (
                <div
                  key={item.id}
                  className={`achievement-card ${
                    item.unlocked ? 'unlocked' : 'locked'
                  }`}
                >
                  <img
                    src={`http://localhost:8000${item.image}`}
                    alt={item.name}
                  />

                  <div className="achievement-name">
                    {item.name}{' '}
                    <span className="points-inline">
                      <Star className="star-icon" /> {item.required_points}
                    </span>
                  </div>

                  {!item.unlocked && (
                    <div className="achievement-overlay">
                      <LockKeyhole className="icon" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
