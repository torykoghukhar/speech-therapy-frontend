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
}

export type { UserProfile, ChildProfile }
