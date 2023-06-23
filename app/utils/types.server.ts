export type RegisterForm = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type LoginForm = {
  email: string
  password: string
}

export type Post = {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  published: boolean
  content: string
  creator: string
  link: string
  guid: number
}
