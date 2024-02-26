const API_URL = process.env.WEBHUSL_API_URL || 'http://localhost:8000/api/v1'
const API_TOKEN = process.env.WEBHUSL_API_MASTER_KEY

export const WEBSITE_BLOG_LIST = `${API_URL}/blogs?token=${API_TOKEN}`
export const WEBSITE_BLOG_CATEGORIES = `${API_URL}/blogs/categories?token=${API_TOKEN}`
export const ADD_BLOG_POST = `${API_URL}/blogs?token=${API_TOKEN}`
export const DELETE_BLOG_POST = (id: string | number) => {
  return `${API_URL}/blogs/${id}?token=${API_TOKEN}`
}
export const EDIT_BLOG_POST = (id: string | number) => {
  return `${API_URL}/blogs/${id}?token=${API_TOKEN}`
}
export const SINGLE_BLOG_POST = (id?: string | number | null) => {
  if (!id) return null
  return `${API_URL}/blogs/${id}?token=${API_TOKEN}`
}

export const SINGLE_BLOG_CATEGORY = (id?: string | number) => {
  return `${API_URL}/blogs/categories/${id}?token=${API_TOKEN}`
}
export const EDIT_BLOG_CATEGORY = (id: string | number) => {
  return `${API_URL}/blogs/categories/${id}?token=${API_TOKEN}`
}
export const DELETE_BLOG_CATEGORY = (id: string | number) => {
  return `${API_URL}/blogs/categories/${id}?token=${API_TOKEN}`
}
