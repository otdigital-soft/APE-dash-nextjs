import Image from 'next/image'
import Link from 'next/link'

import { ConnectWallet } from '../connect-button'

export const AuthNavbar: React.FC = () => {
  return (
    <nav className="fixed top-0 flex justify-between w-11/12 py-6 -translate-x-1/2 md:px-10 md:py-14 left-1/2">
      <Link href="/">
        <Image src="/static/images/logo.svg" width={120} height={50} className="object-contain" alt="logo" />
      </Link>
      <div>
        <ConnectWallet />
      </div>
    </nav>
  )
}
