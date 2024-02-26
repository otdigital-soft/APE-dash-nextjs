import { CourseList } from '@/components/common/courses/list'

const Home = async () => {
  return (
    <main className="flex flex-col space-y-5">
      <h1 className="block lg:hidden text-3xl mb-5">Course</h1>
      <CourseList />
    </main>
  )
}

export default Home
