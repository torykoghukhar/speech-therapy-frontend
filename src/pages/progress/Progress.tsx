import { useEffect, useState } from 'react'
import { Star, Repeat, ChartSpline, SquareCheckBig } from 'lucide-react'
import api from '../../api/axios'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import './Progress.css'
import type { Stats, TooltipProps } from '../../types/progress'

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

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get(`progress/stats/?period=${period}`)
        setStats(res.data)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load stats', err)
      }
    }

    loadStats()
  }, [period])

  if (!stats) return <div>Loading...</div>

  return (
    <>
      <Header />
      <div className="progress-page">
        <div className="progress-container">
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
          </div>

          <div className="summary">
            <div className="card">
              <Star className="card-icon" />
              <p>{stats.summary.total_points}</p>
              <small>Total Points</small>
            </div>

            <div className="card">
              <ChartSpline className="card-icon" />
              <p>{stats.summary.average_score.toFixed(1)}%</p>
              <small>Avg Score</small>
            </div>

            <div className="card">
              <SquareCheckBig className="card-icon" />
              <p>{(stats.summary.success_rate * 100).toFixed(0)}%</p>
              <small>Success Rate</small>
            </div>

            <div className="card">
              <Repeat className="card-icon" />
              <p>{stats.summary.avg_attempts.toFixed(2)}</p>
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
        </div>
      </div>
      <Footer />
    </>
  )
}
