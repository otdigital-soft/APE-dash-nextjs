import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { PublicCourseList } from '@/components/common/courses/public-list'
import { authOptions } from '@/services/auth'

const Home = async () => {
  const session = await getServerSession(authOptions)

  if (session?.jwt) {
    redirect('/courses')
  }
  return (
    <main className="flex flex-col space-y-5">
      <h1 className="block lg:hidden text-3xl mb-5">Course</h1>
      <PublicCourseList />
    </main>
  )
}

export default Home
