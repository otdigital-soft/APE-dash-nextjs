import { forwardRef } from 'react'
import ReactPlayer, { ReactPlayerProps } from 'react-player'

interface VideoPlayerProps extends ReactPlayerProps {
  src: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = forwardRef(({ src, ...props }, ref) => {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <ReactPlayer ref={ref as any} className="react-player" url={src} width="100%" height="100%" {...props} />
    </div>
  )
})
VideoPlayer.displayName = 'VideoPlayer'
