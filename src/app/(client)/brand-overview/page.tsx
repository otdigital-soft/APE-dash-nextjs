import { Fragment } from 'react'

import { ColorPlaceholder, FileWrapper } from '@/components/common'
import { Button } from '@/components/ui'
import { useServerSession } from '@/hooks/use-server-session'
import { addHttp, getFilename, getTagCopies, replaceBulk } from '@/lib/utils'
import { getBusinesses } from '@/restapi/businesses/mutation'

const BrandOverview = async () => {
  const session = await useServerSession()
  const business = await getBusinesses({
    _id: session?.user?.business?.[0]
  })?.then((res) => res?.data[0])

  const { copyFrom, copyTo } = getTagCopies(business)

  return (
    <main className="my-5">
      <h1 className="block lg:hidden text-3xl mb-5">Brand Overview</h1>

      <div className="bg-dark-gray min-h-80vh w-full rounded-2xl divide-y divide-stoke mt-5">
        <div className="grid lg:grid-cols-2 gap-y-5 lg:gap-y-0 lg:gap-x-10 p-5">
          <div className="grid lg:grid-cols-2 lg:gap-x-5 gap-y-5 lg:gap-y-0">
            {business?.logo?.url && (
              <FileWrapper
                src={business?.logo?.url}
                fileID={business?.logo?._id}
                filename={getFilename(business?.logo?.url?.split('/')?.[business?.logo?.url?.split('/')?.length - 1])}
                eTag={business?.logo?.ETag?.replace(/"/g, '')}
              />
            )}
            {business?.favicon?.url && (
              <FileWrapper
                src={business?.favicon?.url}
                fileID={business?.favicon?._id}
                filename={getFilename(business?.favicon?.url?.split('/')?.[business?.favicon?.url?.split('/')?.length - 1])}
                eTag={business?.favicon?.ETag?.replace(/"/g, '')}
              />
            )}
          </div>
          <div className="text-center">
            <span className="uppercase block mb-3">Brand Color</span>
            <div className="grid grid-cols-2 gap-x-3 lg:gap-x-5">
              <ColorPlaceholder color={business?.primaryColor || '#181818'} name="Primary" height={152} />
              <ColorPlaceholder color={business?.secondaryColor || '#181818'} name="Secondary Color" height={152} />
            </div>
          </div>
        </div>
        <div className="text-center flex flex-col space-y-5 py-5 px-8">
          <div>
            <h6 className="uppercase">Welcome Text</h6>
            <p className="text-sm">{replaceBulk(business?.niche?.customFields?.welcomeText, copyFrom, copyTo) || '-'}</p>
          </div>
          <div>
            <h6 className="uppercase">Social Media BIO</h6>
            <p className="text-sm">{replaceBulk(business?.niche?.customFields?.socialMediaBio, copyFrom, copyTo) || '-'}</p>
          </div>
          <div>
            <h6 className="uppercase">My customers</h6>
            <p className="text-sm">{replaceBulk(business?.niche?.customFields?.myCustomersText, copyFrom, copyTo) || '-'}</p>
          </div>
        </div>
        <div className="p-5">
          <h6 className="uppercase text-center">Suggested Tags</h6>
          <div className="flex flex-wrap space-x-2 space-y-2 -ml-2 justify-center">
            {business?.niche?.suggestedHastags?.map((hastag: any, index: number) => (
              <Fragment key={index}>
                <div />
                {hastag?.split(' ')?.length > 0 ? (
                  hastag
                    ?.split(' ')
                    .map((h: string, i: number) => <Button key={i} text={h} variant="none" className="bg-dark" size="sm" />)
                ) : (
                  <Button key={index} text={hastag} variant="none" className="bg-dark" size="sm" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-x-3 grid-cols-2 mt-5 lg:w-1/4 lg:ml-auto">
        <Button
          url={addHttp(business?.domain)}
          external
          variant="outline"
          className="border-primary border-opacity-20 text-primary">
          View Website
        </Button>
        <Button
          url={addHttp(business?.user?.productUrl)}
          external
          variant="outline"
          className="border-primary border-opacity-20 text-primary">
          View Product
        </Button>
      </div>
    </main>
  )
}

export default BrandOverview
