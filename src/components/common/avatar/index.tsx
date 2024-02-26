'use client'
import Image from 'next/image'
import { useMemo } from 'react'

import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  name?: string | JSX.Element
  background?: string
  provider?: 'dicebear' | 'ui-avatar'
}
export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  rounded = 'full',
  size = 'md',
  background,
  className,
  provider = 'dicebear'
}) => {
  const avatarSize = useMemo(() => {
    switch (size) {
      case 'sm':
        return 20
      case 'md':
        return 40
      case 'lg':
        return 60
      default:
        return 40
    }
  }, [size])

  const url = useMemo(() => {
    if (src) {
      return src
    }
    if (provider === 'ui-avatar') {
      return `https://ui-avatars.com/api/?name=${name}&rounded=true&size=${avatarSize}&background=random`
    }
    return `https://api.dicebear.com/6.x/miniavs/svg/${name}.svg`
  }, [src, name, provider, avatarSize])

  const fontSize = useMemo(() => {
    switch (size) {
      case 'sm':
        return 'text-sm'
      case 'md':
        return 'text-base'
      case 'lg':
        return 'text-lg'
      default:
        return 'text-sm'
    }
  }, [size])
  return (
    <div className={cn('flex items-center space-x-3 w-full', `rounded-${rounded}`, className)}>
      <Image
        src={url}
        alt="user-avatar"
        width={avatarSize}
        height={avatarSize}
        className={cn(`rounded-${rounded}`)}
        style={{
          background: background || '#CD9D43'
        }}
      />
      {name && <span className={cn('text-white', fontSize)}>{name}</span>}
    </div>
  )
}
