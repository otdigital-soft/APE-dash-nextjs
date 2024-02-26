'use client'
import { ReceiptIcon, UsersIcon } from '@/components/common'
import { Card } from '@/components/common/card'

import { Churn } from './churn'
import { Customers } from './customers'
import { Revenue } from './revenue'
import { WebsiteView } from './website-view'

export const OverviewCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
      <Customers />
      <WebsiteView />
      <Revenue />
      <Card
        title="Followers (Coming soon)"
        headerElement={<UsersIcon className="mt-1 lg:mt-0" color="#DD4444" />}
        className="opacity-50">
        <h1 className="text-4xl text-#8843CD font-semibold">--</h1>
      </Card>
      <Churn />
      <Card
        title="Email Open rate (Coming soon)"
        headerElement={<ReceiptIcon className="mt-1 lg:mt-0" color="#8843CD" />}
        className="opacity-50">
        <h1 className="text-4xl text-#8843CD font-semibold">--</h1>
      </Card>
    </div>
  )
}
