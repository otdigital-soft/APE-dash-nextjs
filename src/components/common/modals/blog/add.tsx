import { Formik } from 'formik'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'

import { Button } from '@/components/ui'
import { Input, InputFile, Select, TextArea, TextEditor, Toggler } from '@/components/ui/forms'
import { useMe } from '@/hooks/use-me'
import { WEBSITE_BLOG_CATEGORIES } from '@/restapi/blogs/constants'
import { addBlogPost } from '@/restapi/blogs/mutation'
import { addBlogSchema } from '@/restapi/blogs/schema'

import { Modal, ModalProps } from '../'

interface AddBlogModalProps extends ModalProps {
  onSuccess?: (data: Blog.Data) => void
}
const blogInitial = {
  title: '',
  content_short: '',
  content: '',
  thumb: '',
  category_id: '',
  time_read: '0',
  is_featured: true,
  is_active: true,
  is_published: false,
  landingpage_id: '',
  title_seo: '',
  description_seo: '',
  keyword_seo: ''
}

export const AddBlogModal: React.FC<AddBlogModalProps> = ({ onClose, onSuccess, ...props }) => {
  const { me } = useMe()

  const { data: categories } = useSWR<Blog.Category[]>(WEBSITE_BLOG_CATEGORIES)
  const [thumb, setThumb] = useState<File | null | undefined>(null)
  const handleAddBlog = async (values: Record<string, any>) => {
    if (!thumb) {
      toast.error('Please upload a thumbnail.')
      return
    }
    try {
      const formData = new FormData()
      const data: Record<string, any> = {
        ...values,
        category_id: values?.category_id?.value,
        landingpage_id: me?.websiteKey
      }
      if (data?.is_active == false) {
        delete data.is_active
      }
      if (data?.is_published == false) {
        delete data.is_published
      }
      if (data?.is_featured == false) {
        delete data.is_featured
      }

      for (const key in data) {
        formData.append(key, data[key])
      }

      if (thumb) {
        formData.delete('thumb')
        formData.append('thumb', thumb)
      }
      const addedBlog = await addBlogPost(formData)
      toast.success('Blog post created successfully.')
      onSuccess?.(addedBlog)
      onClose?.()
      return addedBlog
    } catch (e: any) {
      toast.error(e?.message)
    }
  }

  const categoriesOptions = useMemo(() => {
    if (categories && categories?.length > 0) {
      return categories?.map((item) => ({
        label: item.name,
        value: item.id?.toString()
      }))
    } else {
      return []
    }
  }, [categories])

  return (
    <Modal {...props}>
      <Formik initialValues={blogInitial} onSubmit={handleAddBlog} validationSchema={addBlogSchema}>
        {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting, setFieldValue }) => (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3 lg:space-y-5">
            <h1 className="text-2xl font-semibold">Add Blog Article</h1>
            <div className="grid lg:grid-cols-3 gap-y-3 lg:gap-y-0 lg:gap-x-5">
              <Input
                label="Title"
                placeholder="title"
                name="title"
                size="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.title}
                error={errors?.title}
                required
              />
              <Select
                label="Category"
                size="sm"
                name="category_id"
                // value={values?.category_id}
                items={[
                  {
                    label: 'Select Category',
                    value: ''
                  },
                  ...categoriesOptions
                ]}
                setFieldValue={setFieldValue}
              />
              <Input
                label="Read Times"
                placeholder="time_read"
                size="sm"
                name="time_read"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.time_read}
                error={errors?.time_read}
              />
            </div>
            <div className="grid lg:grid-cols-3 gap-y-3 lg:gap-y-0 lg:gap-x-5">
              <TextArea
                label="SEO Keyword"
                placeholder="keyword"
                name="keyword_seo"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.keyword_seo}
                error={errors?.keyword_seo}
              />
              <TextArea
                label="Meta Title"
                placeholder="seo title"
                name="title_seo"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.title_seo}
                error={errors?.title_seo}
              />
              <TextArea
                label="Meta Description"
                placeholder="meta description"
                name="description_seo"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.description_seo}
                error={errors?.description_seo}
              />
            </div>
            <TextArea
              label="Excerpt"
              placeholder="excerpt"
              name="content_short"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.content_short}
              error={errors?.content_short}
            />
            <InputFile
              label="Thumbnail"
              name="thumb"
              hint="Recommended size: 100x100"
              accept="image/*"
              onChange={(evt) => setThumb(evt.currentTarget.files?.[0])}
              error={errors?.thumb}
            />
            <TextEditor label="Content" name="content" setFieldValue={setFieldValue} uploader="webhusl" />
            <div className="flex space-x-3 items-center">
              <label>Published</label>
              <Toggler
                name="is_published"
                defaultChecked={values?.is_published}
                onSwitch={(state) => setFieldValue('is_published', state)}
              />
            </div>
            <div>
              <div className="flex space-x-3 lg:space-x-5 mt-5">
                <Button type="submit" size="lg" loading={isSubmitting}>
                  Save Changes
                </Button>
                <Button size="lg" variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  )
}
