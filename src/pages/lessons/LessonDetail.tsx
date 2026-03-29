import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './LessonDetail.css'
import type { Lesson } from '../../types/lesson'

export default function LessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [averageScore, setAverageScore] = useState<number | null>(null)

  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startedRef = useRef(false)

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    const recorder = new MediaRecorder(stream)
    // eslint-disable-next-line no-undef
    let chunks: BlobPart[] = []

    recorder.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      setAudioBlob(blob)
    }

    recorder.start()
    setMediaRecorder(recorder)
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorder?.stop()
    setIsRecording(false)
  }

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const loadLesson = async () => {
      const res = await api.get(`lessons/${id}/`)
      setLesson(res.data)

      const sessionRes = await api.post(`progress/start/${id}/`)
      setSessionId(sessionRes.data.session_id)
    }

    loadLesson()
  }, [id])

  useEffect(() => {
    if (!lesson || showFinishModal || averageScore !== null) return

    const exercise = lesson.exercises[currentIndex]
    if (!exercise) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    const audio = new Audio(exercise.audio_file)
    audioRef.current = audio

    let isCancelled = false

    const playWithPause = async () => {
      for (let i = 0; i < 5; i++) {
        if (isCancelled) return

        try {
          await audio.play()
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('Play error:', e)
        }

        await new Promise((resolve) => {
          audio.onended = resolve
        })

        if (i < 4) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }
    }

    playWithPause()

    return () => {
      isCancelled = true
      audio.pause()
      audio.currentTime = 0
    }
  }, [currentIndex, lesson, showFinishModal, averageScore])

  useEffect(() => {
    if (averageScore !== null) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [averageScore])

  const goNext = async () => {
    if (!lesson) return

    const exercise = lesson.exercises[currentIndex]

    if (sessionId && audioBlob) {
      const formData = new FormData()
      formData.append('session', String(sessionId))
      formData.append('exercise', String(exercise.id))
      formData.append('recorded_audio', audioBlob)

      const res = await api.post('progress/submit/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      // eslint-disable-next-line no-console
      console.log('AI RESULT:', res.data)
    }

    if (currentIndex === lesson.exercises.length - 1) {
      setShowFinishModal(true)
      return
    }

    setCurrentIndex((prev) => prev + 1)
  }

  const goBack = () => {
    if (currentIndex === 0) return
    setCurrentIndex((prev) => prev - 1)
  }

  const finishLesson = async () => {
    const res = await api.post(`progress/complete/${sessionId}/`)
    setAverageScore(res.data.average_score)
    setShowFinishModal(false)
  }

  if (!lesson) return null

  const exercise = lesson.exercises[currentIndex]

  return (
    <>
      <Header />

      <div className="lesson-player">
        <h2>{lesson.title}</h2>

        <div className="exercise-container">
          <img
            src={exercise.image}
            alt={exercise.title}
            className="exercise-image"
          />
          <div className="record-controls">
            {!isRecording ? (
              <button onClick={startRecording} className="record-btn">
                🎤 Start Recording
              </button>
            ) : (
              <button onClick={stopRecording} className="record-btn recording">
                ⏹ Stop Recording
              </button>
            )}
          </div>
        </div>

        <div className="nav-buttons">
          <button
            onClick={goBack}
            disabled={currentIndex === 0}
            className="nav-btn"
          >
            ←
          </button>

          <button onClick={goNext} className="nav-btn">
            →
          </button>
        </div>
      </div>

      {showFinishModal && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowFinishModal(false)}
            >
              ✕
            </button>

            <h3>Finish lesson?</h3>

            <div className="modal-actions">
              <button onClick={finishLesson} className="primary-btn">
                Yes, Finish
              </button>
            </div>
          </div>
        </div>
      )}

      {averageScore !== null && (
        <div className="modal">
          <div className="modal-content result-modal">
            <button
              className="modal-close"
              onClick={() => navigate('/lessons')}
            >
              ✕
            </button>

            <h2>Lesson Completed 🎉</h2>

            <p className="result-score">{averageScore.toFixed(1)}%</p>

            <button
              className="primary-btn"
              onClick={() => navigate('/lessons')}
            >
              Back to Lessons
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
