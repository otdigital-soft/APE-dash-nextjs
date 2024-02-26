import moment from 'moment'
import { MdCheckCircle, MdOutlineLogin } from 'react-icons/md'

import { Alert } from '@/components/alerts/alert'
import { Button } from '@/components/ui'
import { useRingCentral } from '@/hooks/use-ringcentral'

export const RingCentralConnect = () => {
  const { data, openAuthWindow, isExpired } = useRingCentral()
  return (
    <div>
      {data?.data?.appName === 'ringcentral' && (
        <>
          {!isExpired && (
            <Alert
              title="RingCentral Connected"
              variant="success"
              className="mb-5"
              icon={<MdCheckCircle />}
              description={
                <div>
                  <p>You have successfully connected your RingCentral account.</p>
                  <p>Expires {moment.unix((data?.data?.refreshTokenExpiresIn || 0) + data?.data?.grantedAt).fromNow()}</p>
                </div>
              }
            />
          )}
          {isExpired && (
            <Alert
              title="RingCentral Connection Expired"
              variant="danger"
              className="mb-5"
              icon={<MdCheckCircle />}
              description={
                <div>
                  <p>Your RingCentral connection has expired.</p>
                </div>
              }
            />
          )}
        </>
      )}
      <Button type="submit" variant="outline" className="border-secondary space-x-1 font-semibold" onClick={openAuthWindow}>
        <MdOutlineLogin />
        <span className="text-sm">Login by RingCentral</span>
      </Button>
    </div>
  )
}
