import moment from 'moment'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { MdDownload } from 'react-icons/md'
import ReactPlayer from 'react-player'
import { useInterval } from 'react-use'
import { mutate } from 'swr'

import { Alert } from '@/components/alerts/alert'
import { SmallFileThumbnail } from '@/components/file-manager/misc/file-thumbnail'
import { Button } from '@/components/ui'
import { cn, cutString } from '@/lib/utils'
import { GET_ALL_USER_PROGRESS, GET_COURSES } from '@/restapi/course/constant'
import { saveProgress, traceProgress } from '@/restapi/course/mutations'

import { Modal, ModalProps } from '../'
import { VideoPlayer } from '../../video-player'

interface CourseModalProps extends ModalProps {
  data?: Course.Topic & {
    courseId?: string
  }
  topicProgress?: Course.CompletionMeta
  disabled?: boolean
  isPublic?: boolean
}

interface DefaultFileThumbnailProps {
  filename?: string
}
export const DefaultFileThumbnail: React.FC<DefaultFileThumbnailProps> = ({ filename }) => {
  const ext = useMemo(() => {
    if (!filename) return 'File'
    const ext = filename.split('.').pop()
    return ext?.toLowerCase()
  }, [filename])
  return (
    <div className="z-0 flex items-center justify-center">
      <span className="absolute inline-block mx-auto mt-1 overflow-hidden font-semibold text-center text-theme z-[5] w-7 text-ellipsis text-[9px]">
        {ext}
      </span>
      <div className="text-gray-800">
        <svg width={32} height={32} fill="currentColor" viewBox="0 0 38 51" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.1666667,13.546875 L22.1666667,0 L2.375,0 C1.05885417,0 0,1.06582031 0,2.390625 L0,48.609375 C0,49.9341797 1.05885417,51 2.375,51 L35.625,51 C36.9411458,51 38,49.9341797 38,48.609375 L38,15.9375 L24.5416667,15.9375 C23.2354167,15.9375 22.1666667,14.8617187 22.1666667,13.546875 Z M38,12.1423828 L38,12.75 L25.3333333,12.75 L25.3333333,0 L25.9369792,0 C26.5703125,0 27.1739583,0.249023438 27.6192708,0.697265625 L37.3072917,10.4589844 C37.7526042,10.9072266 38,11.5148437 38,12.1423828 Z"></path>
        </svg>
      </div>
    </div>
  )
}
export const CourseModal: React.FC<CourseModalProps> = ({ data, onClose, disabled, isPublic, topicProgress, ...props }) => {
  const videoRef = useRef<ReactPlayer>(null)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState<Course.CompletionMeta>()
  const [start, setStart] = useState<any>()
  const [submitting, setSubmitting] = useState(false)
  const [videoState, setVideoState] = useState({
    ended: false,
    played: false,
    duration: 0,
    progress: 0
  })
  const [attachmentDownloaded, setAttachmentDownloaded] = useState(false)

  const ableToComplete = useMemo(() => {
    // if attachment is exist and downloaded
    if (data?.attachment && attachmentDownloaded) return true
    // if user have watched 90% of the video
    return videoState?.progress >= 0.9
  }, [videoState?.progress, attachmentDownloaded, data?.attachment])

  const downloadAttachment = async (url?: string) => {
    if (!url || !data?.courseId) return
    setAttachmentDownloaded(true)
    window.open(url, '_blank')
    await traceProgress(data?.courseId, {
      topic_id: data?._id,
      is_attachment_downloaded: true
    })
    // create a new anchor tag, and download
    // const link = document.createElement('a')
    // link.href = url
    // link.download = url.split('/').pop() || ''
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)
  }

  const saveTopicProgress = async () => {
    // if user is not logged in yet
    if (isPublic) {
      toast.error('Please login first.')
      return
    }
    if (!data?.courseId) return
    if (disabled) {
      toast.error('You have completed this topic.')
      return
    }
    if (!ableToComplete) {
      toast.error('Please watch the video first')
      return
    }
    // if attachment is not downloaded
    if (data?.attachment && !attachmentDownloaded && !progress?.attachment_downloaded) {
      toast.error('Please download the attachment first')
      return
    }
    setSubmitting(true)
    try {
      await saveProgress(data?.courseId, data?._id, {
        completion_time: moment().diff(start, 'seconds'),
        topic_id: data?._id,
        is_completed: true
      })
      toast.success('You have completed this topic.')
      mutate(GET_ALL_USER_PROGRESS)
      mutate(GET_COURSES)
      onClose?.()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save progress')
    }
    setSubmitting(false)
  }

  const traceVideoProgress = async () => {
    if (!data?.courseId) return
    if (!videoState?.played) return
    // if user is not logged in yet
    if (isPublic) return
    // progress is decimal meaning 1 = 100%
    const playedTime = Math.round(videoState?.progress * videoState?.duration)
    // console.log(videoState.progress)
    await traceProgress(data?.courseId, {
      topic_id: data?._id,
      video_played_time: playedTime,
      video_duration: videoState?.duration
    })
  }

  useInterval(
    () => {
      traceVideoProgress()
    },

    videoState.played ? 1 * 10000 : null
  )

  useEffect(() => {
    setStart(moment())
    return () => {
      setStart(undefined)
    }
  }, [])

  useEffect(() => {
    setProgress(topicProgress)
    let timeout: any
    if (topicProgress?.video_played_time && ready) {
      videoRef.current?.seekTo(topicProgress?.video_played_time)
    }
    return () => {
      clearTimeout(timeout)
      setProgress(undefined)
    }
  }, [topicProgress, ready])
  return (
    <Modal onClose={onClose} {...props}>
      <div className="text-2xl flex space-x-3 items-center">
        <h1 className="font-semibold">
          <span className="text-white text-opacity-60">{data?.chapter}</span>
          <span className="mr-3">:</span>
          <span>{data?.title}</span>
        </h1>
        <span className="text-white text-opacity-60">({data?.completion_time})</span>
      </div>
      <div className="flex flex-col space-y-6 mt-7">
        {data?.video && (
          <div className="h-26rem">
            <VideoPlayer
              ref={videoRef}
              src={data?.video}
              onReady={() => setReady(true)}
              onDuration={(duration) =>
                setVideoState({
                  ...videoState,
                  duration
                })
              }
              onStart={() =>
                setVideoState({
                  ...videoState,
                  played: true
                })
              }
              onProgress={({ played }) => {
                setVideoState({
                  ...videoState,
                  progress: played
                })
              }}
              onEnded={() =>
                setVideoState({
                  ...videoState,
                  ended: true
                })
              }
              controls
            />
          </div>
        )}

        <div>
          <span className="uppercase text-white text-opacity-60">Content</span>
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: data?.content || ''
            }}
          />
        </div>

        {data?.linked_videos && data?.linked_videos?.length > 0 && (
          <div>
            <span className="uppercase text-white text-opacity-60 mb-3 block">Linked Videos</span>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
              {data?.linked_videos?.map((video, i) => (
                <a
                  key={i}
                  className={cn(
                    'flex items-center py-2 border-2 border-transparent border-dashed cursor-pointer select-none rounded-xl px-2.5 bg-dark'
                  )}
                  href={video}
                  target="_blank">
                  <div className="relative w-10 shrink-0">
                    <div className="text-primary">
                      <div className="relative w-10 mx-auto">
                        {/* If there's no File icon */}
                        <DefaultFileThumbnail filename={video} />
                      </div>
                    </div>
                  </div>
                  <div className="pl-3">
                    <span className="block overflow-hidden text-sm font-bold mb-0.5 text-ellipsis whitespace-nowrap">
                      {cutString(video, 20, 30)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {data?.attachment && (
          <div>
            <span className="uppercase text-white text-opacity-60">Attachment</span>
            <div className="flex items-center justify-between min-w-20rem bg-dark rounded-xl px-4 py-3 mt-1">
              <div className={cn('flex items-center cursor-pointer select-none')}>
                <div className="relative shrink-0">
                  <div className="text-primary">
                    <div className="relative w-12 mx-auto">
                      <SmallFileThumbnail width={24} height={38} filename={data?.attachment} />
                    </div>
                  </div>
                </div>
                <div>
                  <span className="block overflow-hidden text-sm font-bold text-ellipsis whitespace-nowrap">
                    {data?.attachment?.split('/').pop()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => downloadAttachment(data?.attachment)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-primary border-opacity-30 text-primary hover:border-opacity-100 transition-all">
                <MdDownload />
              </button>
            </div>
          </div>
        )}
        <div className="flex space-y-2 flex-col">
          {isPublic && <Alert title="Login to track and save your course progress." variant="warning" />}
          <div className="flex space-x-2 items-center">
            <Button
              onClick={saveTopicProgress}
              className={cn(!ableToComplete && 'bg-opacity-50')}
              loading={submitting}
              disabled={isPublic}>
              Mark as Complete
            </Button>
            <Button onClick={() => onClose?.()} className="underline" variant="none">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
