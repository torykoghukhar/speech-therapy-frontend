import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Headphones } from 'lucide-react'
import api from '../../api/axios'
import './LessonDetail.css'
import type { Lesson } from '../../types/lesson'

export default function LessonPreview() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [index, setIndex] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const exercise = lesson?.exercises[index]

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`lessons/${id}/`)
      setLesson(res.data)
    }

    load()
  }, [id])

  useEffect(() => {
    if (!exercise) return

    let isCancelled = false

    const audio = new Audio(exercise.audio_file)
    audioRef.current = audio

    const playTwice = async () => {
      for (let i = 0; i < 2; i++) {
        if (isCancelled) break

        await audio.play().catch(() => {})

        await new Promise((resolve) => {
          audio.onended = resolve
        })

        if (i === 0) {
          await new Promise((r) => setTimeout(r, 2000))
        }
      }
    }

    playTwice()

    return () => {
      isCancelled = true
      audio.pause()
      audio.currentTime = 0
    }
  }, [exercise])

  const goNext = () => {
    if (!lesson) return
    if (index < lesson.exercises.length - 1) {
      setIndex(index + 1)
    }
  }

  const goPrev = () => {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  if (!lesson || !exercise) return null

  return (
    <div className="lesson-player">
      <button className="preview-close" onClick={() => navigate('/lessons')}>
        ✕
      </button>

      <div className="exercise-layout">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="nav-btn side left"
        >
          ←
        </button>

        <div className="exercise-center">
          <img
            src={exercise.image}
            alt={exercise.title}
            className="exercise-image"
          />

          <div className="exercise-bottom">
            <div className="exercise-word">{exercise.word}</div>

            <button
              onClick={() => {
                if (!exercise) return
                const audio = new Audio(exercise.audio_file)
                audio.play()
              }}
              className="record-btn"
            >
              <Headphones className="audio-icon" />
            </button>
          </div>
        </div>

        <button
          onClick={goNext}
          disabled={index === lesson.exercises.length - 1}
          className="nav-btn side right active"
        >
          →
        </button>
      </div>
    </div>
  )
}
