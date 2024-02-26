import { useMemo } from 'react'

import { EyeIcon } from '@/components/common'
import { Card } from '@/components/common/card'
import { Loading } from '@/components/ui/button'
import { usePageViews } from '@/hooks/use-pageviews'

export const WebsiteView: React.FC = () => {
  const { data, isLoading } = usePageViews()
  const pageViews = useMemo(() => {
    if (!data) return 0
    return data?.data?.reduce((acc, curr) => acc + Number(curr.value), 0)
  }, [data])
  return (
    <Card title="Website View" headerElement={<EyeIcon className="mt-1 lg:mt-0" color="#826AF9" />}>
      <h1 className="text-4xl text-#826AF9 font-semibold">{isLoading ? <Loading /> : (pageViews || 0)?.toLocaleString()}</h1>
    </Card>
  )
}
