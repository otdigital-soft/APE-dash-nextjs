import api from '@/services/api'

import {
  ADD_COURSE_CHAPTER,
  ADD_COURSE_TOPIC,
  ADD_COURSES,
  EDIT_COURSE,
  EDIT_COURSE_CHAPTER,
  EDIT_COURSE_TOPIC,
  TRACE_TOPIC_PROGRESS
} from './constant'

export const createCourse = async (body?: Record<string, any>) => {
  const response = await api.post(ADD_COURSES, body).then(({ data }) => data)
  return response
}
export const editCourse = async (id: string, body?: Record<string, any>) => {
  const response = await api.patch(EDIT_COURSE(id), body).then(({ data }) => data)
  return response
}

export const deleteCourse = async (id: string) => {
  const response = await api.delete(EDIT_COURSE(id)).then(({ data }) => data)
  return response
}

export const createChapter = async (id: string, body?: Record<string, any>) => {
  const response = await api.post(ADD_COURSE_CHAPTER(id), body).then(({ data }) => data)
  return response
}

export const editChapter = async (id: string, chapterId: string, body?: Record<string, any>) => {
  const response = await api.patch(EDIT_COURSE_CHAPTER(id, chapterId), body).then(({ data }) => data)
  return response
}
export const deleteChapter = async (id: string, chapterId: string) => {
  const response = await api.delete(EDIT_COURSE_CHAPTER(id, chapterId)).then(({ data }) => data)
  return response
}

export const createTopic = async (id: string, chapterId: string, body?: Record<string, any>) => {
  const response = await api.post(ADD_COURSE_TOPIC(id, chapterId), body).then(({ data }) => data)
  return response
}

export const editTopic = async (id: string, chapterId: string, topicId: string, body?: Record<string, any>) => {
  const response = await api.patch(EDIT_COURSE_TOPIC(id, chapterId, topicId), body).then(({ data }) => data)
  return response
}

export const deleteTopic = async (id: string, chapterId: string, topicId: string) => {
  const response = await api.delete(EDIT_COURSE_TOPIC(id, chapterId, topicId)).then(({ data }) => data)
  return response
}

export const saveProgress = async (courseId: string, topicId: string, body?: Record<string, any>) => {
  const response = await api
    .post(`/course-participants`, {
      course_id: courseId,
      topic_id: topicId,
      completion_data: body
    })
    .then(({ data }) => data)
  return response
}

export const traceProgress = async (courseId: string, body?: Record<string, any>) => {
  const response = await api.patch(TRACE_TOPIC_PROGRESS(courseId), body).then(({ data }) => data)
  return response
}
