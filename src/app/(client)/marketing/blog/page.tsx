import { BlogListTable } from '@/components/common/datatable/blog'

export default function BlogPage() {
  return (
    <main className="mt-5 flex flex-col space-y-8">
      <h1 className="block lg:hidden text-3xl">Blog</h1>
      <BlogListTable />
    </main>
  )
}
