'use client'
import moment from 'moment'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { MdCancel, MdDelete, MdEdit, MdRemoveRedEye, MdVerified } from 'react-icons/md'
import useSWR from 'swr'

import { confirm } from '@/components/alerts/confirmation'
import { Loading } from '@/components/ui/button'
import { Toggler } from '@/components/ui/forms'
import { useMe } from '@/hooks/use-me'
import { addHttp } from '@/lib/utils'
import { WEBSITE_BLOG_LIST } from '@/restapi/blogs/constants'
import { deleteBlogPost, editBlogPost } from '@/restapi/blogs/mutation'

import { DataTable } from '../'
import { AddBlogModal } from '../../modals/blog/add'
import { EditBlogModal } from '../../modals/blog/edit'
import { BlogCompactTable } from './compact'

export const BlogListTable: React.FC = () => {
  const { me } = useMe()
  const fetchKey = me?.websiteKey ? WEBSITE_BLOG_LIST + `&landingpage_id=${me?.websiteKey}` : null
  const { data: blogs, isLoading, mutate } = useSWR<RestApi.WebHuslPaginate<Blog.Data[]>>(fetchKey)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editBlog, setEditBlog] = useState<{
    state: boolean
    data?: Blog.Data | null
  }>({
    state: false,
    data: null
  })

  const handleDeleteBlog = async (blogId: number) => {
    const confirmation = await confirm('Are you sure you want to delete this post?', 'Delete', 'Cancel')
    if (confirmation) {
      try {
        await deleteBlogPost(blogId, me?.websiteKey)
        toast.success('Blog post deleted successfully.')
        mutate()
      } catch (error: any) {
        toast.error(error?.message || 'Something went wrong while deleting user. Please try again later.')
      }
    }
  }
  const changePublishState = async (data: Blog.Data, isPublished: boolean) => {
    if (data.is_published == isPublished) return
    try {
      const { id, is_featured } = data
      const formData = new FormData()
      if (isPublished == true) {
        formData.append('is_published', 'true')
      } else {
        formData.append('is_published', 'false')
      }
      if (is_featured) {
        formData.append('is_featured', 'true')
      } else {
        formData.append('is_featured', 'false')
      }
      formData.append('is_active', 'true')
      formData.append('_method', 'PATCH')
      await editBlogPost(id, formData)
      toast.success(`Blog post ${isPublished ? 'published' : 'un-published'} successfully.`)
      mutate()
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong while deleting user. Please try again later.')
    }
  }
  const columns = useMemo(() => {
    return [
      {
        Header: 'Title',
        accessor: 'title',
        width: '40%',
        Cell: (c: any) => {
          const row = c?.row?.original
          return <div>{row?.title}</div>
        }
      },
      {
        Header: 'Category',
        accessor: 'category.name'
      },
      {
        Header: 'Website',
        accessor: 'landing_page.custom_domain'
      },
      {
        Header: 'Active',
        accessor: 'is_active',
        width: 60,
        disableSortBy: true,
        centered: true,
        Cell: (c: any) => {
          const row = c?.row?.original
          if (row?.is_active) return <MdVerified className="text-2xl text-green mx-auto" />
          return <MdCancel className="text-2xl text-red mx-auto" />
        }
      },
      {
        Header: 'Published',
        accessor: 'is_published',
        disableSortBy: true,
        Cell: (c: any) => {
          const row = c?.row?.original
          // return <Toggler defaultChecked={row?.is_published} onSwitch={(state) => changePublishState(row, state)} />
          return <Toggler defaultChecked={row?.is_published} onSwitch={(state) => changePublishState(row, state)} />
        }
      },
      {
        Header: 'Publish Date',
        accessor: 'created_at',
        disableSortBy: true,
        Cell: (c: any) => {
          const row = c?.row?.original
          // return <Toggler defaultChecked={row?.is_published} onSwitch={(state) => changePublishState(row, state)} />
          return <span>{moment(row?.created_at).format('LL L')}</span>
        }
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        width: 100,
        disableSortBy: true,
        Cell: (c: any) => {
          const row = c?.row?.original
          return (
            <div className="flex space-x-2 items-center">
              <button
                className="w-8 h-8 flex items-center justify-center bg-primary text-primary bg-opacity-10 rounded-full shadow text-center"
                onClick={() =>
                  setEditBlog({
                    state: true,
                    data: row
                  })
                }>
                <MdEdit />
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center bg-primary bg-opacity-10 rounded-full shadow"
                onClick={() => handleDeleteBlog(row?.id)}>
                <MdDelete />
              </button>
              <Link
                className="w-8 h-8 flex items-center justify-center bg-primary bg-opacity-10 rounded-full shadow"
                href={
                  addHttp(row?.landing_page?.custom_domain || row?.landing_page?.sub_domain) +
                  `/blog/${row?.slug}/${row?.id}`
                }
                target="_blank">
                <MdRemoveRedEye />
              </Link>
            </div>
          )
        }
      }
    ]
  }, [])
  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      )}
      {!isLoading && (
        <>
          <DataTable
            columns={columns}
            data={blogs?.data || []}
            showSearch
            searchOnHeader
            limitOptions={[5, 10, 15, 20]}
            totalData={0}
            initialState={{
              hiddenColumns: ['role']
            }}
            className="hidden lg:block min-h-500px"
            onAddRow={() => setShowAddModal(true)}
            showAddRow
            addRowText="Add Article"
          />
          <div className="lg:hidden">
            <BlogCompactTable
              data={blogs?.data}
              onDelete={handleDeleteBlog}
              onChangePublishState={changePublishState}
              onEdit={(v) => {
                setEditBlog({
                  state: true,
                  data: v
                })
              }}
            />
          </div>
        </>
      )}
      <AddBlogModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => mutate()}
        width="58rem"
        hideClose
      />
      <EditBlogModal
        data={editBlog?.data}
        show={editBlog?.state}
        onSuccess={() => mutate()}
        onClose={() =>
          setEditBlog({
            ...editBlog,
            state: false
          })
        }
        width="58rem"
        hideClose
      />
    </>
  )
}
