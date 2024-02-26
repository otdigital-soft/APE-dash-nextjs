import useSWR from 'swr'

import { UsersIcon } from '@/components/common'
import { Card } from '@/components/common/card'
import { Loading } from '@/components/ui/button'
import { GET_INFLUENCE } from '@/restapi/leaderboard/constants'

export const Followers: React.FC = () => {
  const { data, isLoading } = useSWR<RestApi.Response<number>>(GET_INFLUENCE)
  return (
    <Card title="Followers" headerElement={<UsersIcon className="mt-1 lg:mt-0" color="#DD4444" />}>
      <h1 className="text-4xl text-#DD4444 font-semibold min-h-10 flex items-center">
        {isLoading ? <Loading /> : (data?.data || 0)?.toLocaleString()}
      </h1>
    </Card>
  )
}
