import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './LessonDetail.css'
import type { Lesson, ResultResponse } from '../../types/lesson'

export default function LessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [averageScore, setAverageScore] = useState<number | null>(null)

  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const [isCurrentPassed, setIsCurrentPassed] = useState(false)
  const [passedExercises, setPassedExercises] = useState<number[]>([])
  const [pendingPass, setPendingPass] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const startedRef = useRef(false)

  const audioLoopRef = useRef(false)

  const remainingExercises =
    lesson?.exercises.filter((_, index) => !passedExercises.includes(index)) ||
    []

  const exercise = remainingExercises[0]

  const startRecording = async () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    audioLoopRef.current = true

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    const recorder = new MediaRecorder(stream)
    let chunks: Blob[] = []

    recorder.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      const formData = new FormData()
      formData.append('recorded_audio', blob)
    }

    recorder.start()
    mediaRecorderRef.current = recorder
    setIsRecording(true)
  }

  const stopRecording = async () => {
    const recorder = mediaRecorderRef.current
    if (!recorder || !lesson || !sessionId || !exercise) return

    let chunks: Blob[] = []

    recorder.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })

      const formData = new FormData()
      formData.append('session', String(sessionId))
      formData.append('exercise', String(exercise.id))
      formData.append('recorded_audio', blob)

      const res = await api.post('progress/submit/', formData)
      handleResult(res.data)
    }

    recorder.stop()
    setIsRecording(false)
  }

  const playSuccess = () => new Audio('/sounds/success.mp3').play()
  const playFail = () => new Audio('/sounds/fail.mp3').play()

  const handleResult = (data: ResultResponse) => {
    const { passed } = data

    if (!exercise || !lesson) return

    const realIndex = lesson.exercises.findIndex((ex) => ex.id === exercise.id)

    if (passed) {
      playSuccess()

      setIsCurrentPassed(true)
      setPendingPass(realIndex)

      // 🔥 ОСТАНАВЛИВАЕМ аудио полностью
      audioLoopRef.current = true
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    } else {
      playFail()
      setIsCurrentPassed(false)

      // 🔥 ПЕРЕЗАПУСК цикла аудио
      audioLoopRef.current = false
    }
  }

  useEffect(() => {
    if (!exercise || showFinishModal || averageScore !== null) return
    if (isRecording || isCurrentPassed) return

    let isCancelled = false
    audioLoopRef.current = false

    const audio = new Audio(exercise.audio_file)
    audioRef.current = audio

    const playLoop = async () => {
      while (!isCancelled && !audioLoopRef.current) {
        await audio.play().catch(() => {})

        await new Promise((resolve) => {
          audio.onended = resolve
        })

        // 🔥 ПАУЗА 1.5 секунды
        await new Promise((r) => setTimeout(r, 1500))
      }
    }

    playLoop()

    return () => {
      isCancelled = true
      audio.pause()
      audio.currentTime = 0
    }
  }, [exercise, isRecording, isCurrentPassed, showFinishModal, averageScore])

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const load = async () => {
      const res = await api.get(`lessons/${id}/`)
      setLesson(res.data)

      const sessionRes = await api.post(`progress/start/${id}/`)
      setSessionId(sessionRes.data.session_id)
    }

    load()
  }, [id])

  const goNext = () => {
    if (!lesson || !isCurrentPassed || pendingPass === null) return

    const updatedPassed = [...passedExercises, pendingPass]

    setPassedExercises(updatedPassed)
    setPendingPass(null)
    setIsCurrentPassed(false)

    const remaining = lesson.exercises.filter(
      (_, index) => !updatedPassed.includes(index)
    )

    if (remaining.length === 0) {
      setShowFinishModal(true)
    }
  }

  const finishLesson = async () => {
    const res = await api.post(`progress/complete/${sessionId}/`)
    setAverageScore(res.data.average_score)
    setShowFinishModal(false)
  }

  if (!lesson) return null

  if (!exercise && !showFinishModal && averageScore === null) {
    return null
  }

  return (
    <>
      <Header />

      <div className="lesson-player">
        {exercise && (
          <div className="exercise-layout">
            <button disabled className="nav-btn side left">
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
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`record-btn ${isRecording ? 'recording' : ''}`}
                >
                  {!isRecording ? '▶' : '❚❚'}
                </button>
              </div>
            </div>

            <button
              onClick={goNext}
              disabled={!isCurrentPassed}
              className={`nav-btn side right ${isCurrentPassed ? 'active' : ''}`}
            >
              →
            </button>
          </div>
        )}
      </div>

      {showFinishModal && (
        <div className="modal">
          <div className="modal-content">
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
