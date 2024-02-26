'use client'
import { useCallback, useMemo, useState } from 'react'
import { MdChevronLeft } from 'react-icons/md'
import { useDebounce } from 'react-use'
import useSWR from 'swr'

// import { Button } from '@/components/ui'
import Button, { Loading } from '@/components/ui/button'
import { SearchInput, Select } from '@/components/ui/forms'
import { cn } from '@/lib/utils'
import { GET_COURSES } from '@/restapi/course/constant'
import { Disclosure, Transition } from '@headlessui/react'

// import { CircularProgressBar } from '../chart'
import { CourseModal } from '../modals/course'

export const PublicCourseList: React.FC = () => {
  const { data, isLoading } = useSWR<RestApi.Response<Course.Course[]>>(GET_COURSES)
  const [search, setSearch] = useState<string>()
  const [searchQuery, setSearchQuery] = useState<string>()

  const [selectedTopic, setSelectedTopic] = useState<{
    state: boolean
    disabled?: boolean
    data?: any
  }>({
    state: false
  })

  useDebounce(
    () => {
      setSearch(searchQuery)
    },
    500,
    [searchQuery]
  )

  const courses = useMemo(() => {
    if (!data?.data) return []
    if (!search) return data?.data
    return data?.data?.filter((c) => c?.title?.toLowerCase().includes(search?.toLowerCase()))
  }, [data?.data, search])

  const getTopic = useCallback((chapter?: Course.Chapter[]) => {
    // get topics and set chapter title
    const topics: (Course.Topic & {
      chapter: string
    })[] = []
    chapter?.forEach((c) => {
      c?.topics?.forEach((t) => {
        topics.push({ ...t, chapter: c?.title })
      })
    })
    return topics
  }, [])

  const renderProgressButton = useCallback((props?: { topic?: Course.Topic; courseId?: string }) => {
    if (!props?.topic?._id) return <></>
    return (
      <Button
        onClick={() =>
          setSelectedTopic({
            state: true,
            data: {
              ...props?.topic,
              courseId: props?.courseId
            }
          })
        }>
        Preview
      </Button>
    )
  }, [])

  return (
    <div>
      {/* filter */}
      <div className="flex justify-between">
        <SearchInput
          onChange={(evt) => setSearchQuery(evt.currentTarget?.value)}
          onKeyUp={(evt) => {
            if (evt.key === 'Enter') {
              setSearch(evt.currentTarget?.value)
            }
          }}
        />
        <div>
          <Select
            size="sm"
            items={[
              {
                label: 'All Coaches',
                value: 'all'
              }
            ]}
            bgColor="!bg-dark-gray"
            placeholder="All Coaches"
          />
        </div>
      </div>
      {isLoading && (
        <div className="h-32rem flex justify-center items-center">
          <Loading />
        </div>
      )}
      {!isLoading && (
        <div className="flex flex-col mt-5 space-y-5">
          {courses?.length > 0 ? (
            <>
              {courses?.map((course) => (
                <Disclosure key={course._id} defaultOpen>
                  {({ open }) => (
                    <div className="bg-dark-gray rounded-xl p-1">
                      <Disclosure.Button
                        className={cn(
                          'flex px-3 md:px-5 space-x-3 py-3 transition-all items-center justify-between w-full'
                        )}>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{course.title}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12">
                            {/* <CircularProgressBar
                              value={getCourseProgress(course?._id)?.progress || 0}
                              {...progressColor(getCourseProgress(course?._id)?.progress || 0)}
                            /> */}
                          </div>
                          <MdChevronLeft
                            className={cn('text-2xl transform transition-transform', open ? 'rotate-90' : '-rotate-90')}
                          />
                        </div>
                      </Disclosure.Button>

                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                        className={cn('flex flex-col space-y-2 p-5', open && 'border-t border-t-stoke')}>
                        {getTopic(course?.chapters)?.map((topic, i) => (
                          <Disclosure.Panel
                            key={i}
                            as="div"
                            className="rounded-xl border border-stoke py-3 px-5 flex justify-between items-center">
                            <div className="flex flex-col space-y-3">
                              <div className="flex space-x-3 items-center">
                                <h1 className="text-lg font-semibold">
                                  <span className="text-white text-opacity-60">{topic?.chapter}</span>
                                  <span className="mr-3">:</span>
                                  <span>{topic?.title}</span>
                                </h1>
                                <span className="text-white text-opacity-60">({topic?.completion_time})</span>
                              </div>
                              {/* {topic?.reward > 0 && <span>Reward: {topic?.reward}HSL</span>} */}
                            </div>
                            <div className="flex space-x-3 items-center">
                              <div>
                                {renderProgressButton({
                                  topic,
                                  courseId: course?._id
                                })}
                              </div>
                            </div>
                          </Disclosure.Panel>
                        ))}
                      </Transition>
                    </div>
                  )}
                </Disclosure>
              ))}
            </>
          ) : (
            <div className="h-32rem flex justify-center items-center">
              <span>No courses found.</span>
            </div>
          )}
        </div>
      )}
      <CourseModal
        show={selectedTopic.state}
        onClose={() =>
          setSelectedTopic({
            state: false,
            data: undefined,
            disabled: false
          })
        }
        data={selectedTopic?.data}
        disabled={selectedTopic?.disabled}
        width="70%"
        isPublic
      />
    </div>
  )
}
