type Stats = {
  summary: {
    total_points: number
    average_score: number
    success_rate: number
    avg_attempts: number
  }
  progress: { date: string; score: number }[]
  attempts: { exercise: string; avg_attempts: number }[]
  weak_phonemes: { phoneme: string; count: number }[]
  lesson_time: { lesson: string; duration: number }[]
}

type TooltipProps = {
  active?: boolean
  payload?: {
    value: number
    name: string
  }[]
  label?: string
}

export type { Stats, TooltipProps }
