import { useEffect, useState } from 'react'
import { Star, Repeat, ChartSpline, SquareCheckBig } from 'lucide-react'
import api from '../../api/axios'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './Progress.css'
import type { Stats, TooltipProps } from '../../types/progress'
import type { TherapistChild } from '../../types/user'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload || !payload.length) return null

  const item = payload[0]

  return (
    <div className="tooltip">
      <p className="tooltip-title">{label}</p>
      <p className="tooltip-label">{item.name}</p>
      <p className="tooltip-value">
        {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
      </p>
    </div>
  )
}

export default function Progress() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [period, setPeriod] = useState('7d')

  const [children, setChildren] = useState<TherapistChild[]>([])
  const [selectedChild, setSelectedChild] = useState<number | null>(null)
  const [role, setRole] = useState<string | null>(null)

  const [status, setStatus] = useState<
    'loading' | 'no_child' | 'no_data' | 'ok'
  >('loading')

  const downloadPDF = async () => {
    let url = `progress/pdf/?period=${period}`

    if (role === 'speech_therapist' && selectedChild) {
      url += `&child_id=${selectedChild}`
    }

    const response = await api.get(url, {
      responseType: 'blob',
    })

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = urlBlob
    link.setAttribute('download', 'progress.pdf')
    document.body.appendChild(link)
    link.click()
  }

  useEffect(() => {
    const loadStats = async () => {
      try {
        let url = `progress/stats/?period=${period}`

        if (role === 'speech_therapist' && selectedChild) {
          url += `&child_id=${selectedChild}`
        }

        const res = await api.get(url)

        setStatus(res.data.status || 'ok')
        setStats(res.data)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load stats', err)
        setStatus('no_child')
      }
    }

    if (role === 'speech_therapist' && !selectedChild) return

    loadStats()
  }, [period, role, selectedChild])

  useEffect(() => {
    api.get('users/profile/').then((res) => {
      setRole(res.data.role)

      if (res.data.role === 'speech_therapist') {
        api.get('users/therapist/children/').then((r) => {
          setChildren(r.data)
          if (r.data.length > 0) {
            setSelectedChild(r.data[0].id)
          }
        })
      }
    })
  }, [])

  if (status === 'no_child') {
    return (
      <>
        <Header />
        <div className="empty-state">
          <h2>No child profile 👶</h2>
          <p>
            You haven’t added a child yet. Add your child to start tracking
            progress.
          </p>

          <button
            className="pdf-btn"
            onClick={() => (window.location.href = '/profile')}
          >
            Go to Profile
          </button>
        </div>
        <Footer />
      </>
    )
  }

  if (status === 'loading' || !stats) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Header />
      <div className="progress-page">
        <div className="progress-container">
          <div className="progress-top-bar">
            <button
              className="pdf-btn"
              onClick={downloadPDF}
              disabled={
                status === 'no_data' ||
                (role === 'speech_therapist' && !selectedChild)
              }
            >
              Download PDF
            </button>
          </div>
          <div className="progress-header">
            <h1 className="progress-title">Child Progress Overview</h1>
            <div className="title-underline" />
          </div>

          <div className="filter">
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
            {role === 'speech_therapist' && (
              <select
                className="select"
                value={selectedChild || ''}
                onChange={(e) => setSelectedChild(Number(e.target.value))}
              >
                {children.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {status === 'no_data' ? (
            <div className="empty-state">
              <h2 className="empty-title">
                <ChartSpline className="empty-icon" />
                No progress yet
              </h2>
              <p>This child hasn’t completed any lessons yet.</p>
            </div>
          ) : (
            <>
              <div className="summary">
                <div className="card">
                  <Star className="card-icon" />
                  <p>{stats.summary?.total_points}</p>
                  <small>Total Points</small>
                </div>

                <div className="card">
                  <ChartSpline className="card-icon" />
                  <p>{stats.summary?.average_score.toFixed(1)}%</p>
                  <small>Avg Score</small>
                </div>

                <div className="card">
                  <SquareCheckBig className="card-icon" />
                  <p>{(stats.summary?.success_rate * 100).toFixed(0)}%</p>
                  <small>Success Rate</small>
                </div>

                <div className="card">
                  <Repeat className="card-icon" />
                  <p>{stats.summary?.avg_attempts.toFixed(2)}</p>
                  <small>Avg Attempts</small>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Progress Over Time</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={stats.progress}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.7} />

                      <XAxis
                        dataKey="date"
                        tickFormatter={(d) =>
                          new Date(d).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                          })
                        }
                      />

                      <YAxis domain={[0, 100]} />

                      <Tooltip content={<CustomTooltip />} />

                      <Line
                        type="monotone"
                        dataKey="score"
                        name="Average Score (%)"
                        stroke="#6366F1"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h3>Attempts per Exercise</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={stats.attempts}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.7} />

                      <XAxis
                        dataKey="exercise"
                        tick={{ fontSize: 13 }}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                      />

                      <YAxis />

                      <Tooltip content={<CustomTooltip />} />

                      <Bar
                        dataKey="avg_attempts"
                        name="Avg Attempts"
                        radius={[6, 6, 0, 0]}
                        fill="#F59E0B"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h3>Problem Sounds</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={stats.weak_phonemes}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.7} />

                      <XAxis dataKey="phoneme" />

                      <YAxis />

                      <Tooltip content={<CustomTooltip />} />

                      <Bar
                        dataKey="count"
                        name="Errors Count"
                        radius={[6, 6, 0, 0]}
                        fill="#4CAF50"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
