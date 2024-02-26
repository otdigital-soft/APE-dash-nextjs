declare namespace Blog {
  interface Category {
    id: number
    name?: string
    thumb?: string
    is_featured?: boolean
    is_active: boolean
    created_at: Date | string
    updated_at?: Date | string
  }
  interface Data {
    id: number
    title?: string
    slug: string
    content_short?: string
    social?: 'facebook' | 'linkedin' | 'twitter' | 'mail'
    content?: string
    thumb?: string
    title_seo?: string
    description_seo?: string
    keyword_seo?: string
    time_read?: number
    category_id?: number
    facebook_share?: number
    linkedin_share?: number
    twitter_share?: number
    mail_share?: number
    is_featured?: boolean
    is_active: boolean
    is_published: boolean
    created_at: Date | string
    updated_at?: Date | string
    landingpage_id?: number
    landing_page?: Record<string, any>
    category: Category
  }
}
