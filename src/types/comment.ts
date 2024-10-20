export interface Replies {
  id: number
  content: string
  createdAt: Date
  userId: number
  username: string
  userAvatar: string
  replyCreatedAt: string
}

export interface Comment {
  id: number
  novelId: number
  content: string
  createdAt: string // ISO string format
  userId: number
  username: string
  userAvatar: string
  replies: Replies[]
}