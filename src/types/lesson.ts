type Exercise = {
  id: number
  word: string
  title: string
  image: string
  audio_file: string
}

type Lesson = {
  id: number
  title: string
  image: string
  description: string
  age_category: string
  exercises: Exercise[]
  is_completed: boolean
  best_score: number | null
}

type ResultResponse = {
  passed: boolean
  attempt_number: number
}

export type { Exercise, Lesson, ResultResponse }
