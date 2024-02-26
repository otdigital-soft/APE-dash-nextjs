import * as yup from 'yup'

export const addBlogSchema = yup.object({
  title: yup.string().required('Please enter blog title.'),
  content_short: yup.string().required('Please enter blog short content.'),
  content: yup.string().required('Please enter blog content.'),
  category: yup.object(),
  time_read: yup.string().required('Please enter time read.'),
  is_featured: yup.boolean(),
  is_active: yup.boolean(),
  title_seo: yup.string().required('Please enter meta title.'),
  description_seo: yup.string().required('Please enter meta description.'),
  keyword_seo: yup.string()
})
