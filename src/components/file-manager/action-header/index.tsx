import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { MdChevronLeft } from 'react-icons/md'

import { Button } from '@/components/ui'

import { UploadAction } from './upload-action'

interface ActionHeaderProps {
  title?: string
  initialFolder?: string
}
export const ActionHeader: React.FC<ActionHeaderProps> = ({ initialFolder }) => {
  const { push } = useRouter()
  const params = useParams()
  const folder = (params?.folder as any)?.split('/')
  const path = useMemo(() => {
    if (!folder) return ''
    if (folder.length === 1) return ''
    const paths = [...folder].slice(0, folder.length - 1)
    return paths.join('/')
  }, [folder])
  return (
    <header className="sticky z-10 flex flex-col space-y-3">
      {folder && folder?.length > 0 && (
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => push('/marketing/drive/' + path)} size="sm">
            <MdChevronLeft />
            <span>{[...folder].join('/')}</span>
          </Button>
        </div>
      )}
      <UploadAction initialFolder={initialFolder} />
    </header>
  )
}
