import { Formik } from 'formik'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'

import { Button } from '@/components/ui'
import { Input, InputFile, Select, TextArea, TextEditor, Toggler } from '@/components/ui/forms'
import { useMe } from '@/hooks/use-me'
import { huslWebStorageUrl } from '@/lib/utils'
import { WEBSITE_BLOG_CATEGORIES } from '@/restapi/blogs/constants'
import { editBlogPost } from '@/restapi/blogs/mutation'
import { addBlogSchema } from '@/restapi/blogs/schema'

import { Modal, ModalProps } from '../'

interface EditBlogModalProps extends ModalProps {
  data?: Blog.Data | null
  onSuccess?: (data: Blog.Data) => void
}

export const EditBlogModal: React.FC<EditBlogModalProps> = ({ onClose, data, onSuccess, ...props }) => {
  const { me } = useMe()
  const { data: categories } = useSWR<Blog.Category[]>(WEBSITE_BLOG_CATEGORIES)

  const [thumb, setThumb] = useState<File | null | undefined>(null)
  const handleEditBlog = async (values: Record<string, any>) => {
    if (!data?.id) {
      toast.error('Blog post id not found.')
      return
    }
    try {
      const formData = new FormData()
      const body: Record<string, any> = {
        ...values,
        landingpage_id: me?.websiteKey
      }
      if (body?.is_active == false) {
        delete body.is_active
      }
      if (body?.is_published == false) {
        delete body.is_published
      }
      if (body?.is_featured == false) {
        delete body.is_featured
      }
      for (const key in body) {
        formData.append(key, body[key])
      }

      if (thumb) {
        formData.append('thumb', thumb)
      }
      formData.append('_method', 'PATCH')
      const editedBlog = await editBlogPost(data?.id, formData)
      toast.success('Blog post edited successfully.')
      onSuccess?.(editedBlog)
      onClose?.()
      return editedBlog
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

  const initialData = useMemo(() => {
    return {
      title: data?.title || '',
      content_short: data?.content_short || '',
      content: data?.content || '',
      thumb: data?.thumb || '',
      category_id: data?.category_id || '',
      time_read: data?.time_read || '0',
      is_featured: data?.is_featured,
      is_active: data?.is_active,
      is_published: data?.is_published,
      title_seo: data?.title_seo || '',
      description_seo: data?.description_seo || '',
      keyword_seo: data?.keyword_seo || ''
    }
  }, [data])
  return (
    <Modal {...props}>
      <Formik initialValues={initialData} onSubmit={handleEditBlog} validationSchema={addBlogSchema}>
        {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting, setFieldValue }) => (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3 lg:space-y-5">
            <h1 className="text-2xl font-semibold">Edit Blog Article</h1>
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
            {!thumb && values?.thumb !== '' && (
              <Image
                alt="thumbnail"
                src={huslWebStorageUrl('/blogs/thumbnails/' + values?.thumb)}
                width={150}
                height={150}
                className="object-contain"
              />
            )}
            <InputFile
              label="Thumbnail"
              name="thumb"
              hint="Recommended size: 100x100"
              accept="image/*"
              onChange={(evt) => setThumb(evt.currentTarget.files?.[0])}
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
