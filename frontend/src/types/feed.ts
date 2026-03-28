export interface Circle {
  id: string
  name: string
  initial: string
  color: string
}

export interface Flair {
  label: string
  bg: string
  text: string
}

export interface Story {
  id: string
  circleId: string
  title: string
  body: string
  tags: string[]
  flair: Flair | null
  votes: number
  comments: number
  createdAt: Date
}
