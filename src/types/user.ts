type UserProfile = {
  first_name: string
  email: string
  birth_date?: string
  phone_number?: string
  role: string
}

type ChildProfile = {
  id?: number
  name: string
  age: number | string
  difficulty_level: number
  speech_therapist?: string | null
}

type Therapist = {
  id: number
  name: string
}

type TherapistChild = {
  id: number
  name: string
  age: number
  difficulty: number
  parent_contact: string | null
}

export type { UserProfile, ChildProfile, Therapist, TherapistChild }
