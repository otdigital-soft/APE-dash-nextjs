declare namespace Course {
  interface Topic {
    _id: string
    chapter?: string
    title: string
    content: string
    video?: string
    attachment?: string
    linked_videos?: string[]
    reward: number
    completion_time: number
  }
  interface Chapter {
    _id: string
    title: string
    topics: Topic[]
  }
  interface Course {
    _id: string
    title: string
    chapters: Chapter[]
    published: boolean
    createdBy: string
    createdAt: Date
    deleted?: boolean
  }
  interface CompletionMeta {
    video_duration: number
    video_played_time: number
    attachment_downloaded: boolean
  }
  interface CompletionData {
    completion_time: number
    topic_id: string
    is_completed: boolean
    reward?: string
    reward_claimed?: boolean
  }
  interface Progress {
    _id: string
    user: string
    course: Course
    completed_topics?: string[]
    is_completed?: boolean
    completion_data?: CompletionData[]
    completion_meta?: CompletionMeta[]
    progress: number
    topic?: Topic
  }
}
