import Image from 'next/image'
import Link from 'next/link'
import { MdLogin } from 'react-icons/md'

import { Button } from '@/components/ui'

export const PublicNavbar: React.FC = () => {
  return (
    <nav className="fixed top-0 -translate-x-1/2 left-1/2 w-full border-b border-stoke bg-dark z-10">
      <div className="flex justify-between w-11/12 py-3 md:px-10 mx-auto items-center">
        <Link href="/">
          <Image src="/static/images/logo.svg" width={84} height={42} className="object-contain" alt="logo" />
        </Link>
        <div>
          <Button url="/auth?callbackUrl=%2Fcourses" className="space-x-2 text-primary" variant="outline" size="sm">
            <MdLogin />
            <span>Login</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
