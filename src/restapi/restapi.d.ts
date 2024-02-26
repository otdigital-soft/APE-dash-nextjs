declare namespace RestApi {
  interface Response<T> {
    code: number
    data: T
    message: string
    status: 'success' | 'error'
  }
  interface WebHuslPaginate<T> {
    data: T
    current_page: number
    first_page_url: number
    from: number
    last_page: number
    last_page_url: number
    links: {
      url: string
      label: string
      active: boolean
    }[]
    next_page_url?: number
    path: string
    per_page: number
    prev_page_url?: number
    to: number
    total: number
  }
}
