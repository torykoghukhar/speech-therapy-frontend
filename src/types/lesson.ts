type Exercise = {
  id: number
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
}

export type { Exercise, Lesson }
