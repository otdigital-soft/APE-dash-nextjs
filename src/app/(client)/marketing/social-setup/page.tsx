import Link from 'next/link'

import { SocialAccountSetup } from '@/components/social-account-setup'

export default function BrandOverview() {
  return (
    <main className="my-5 flex flex-col space-y-8">
      <h1 className="block lg:hidden text-3xl">Social Account Setup</h1>

      <div className="flex flex-col space-y-8 lg:w-3/4">
        <span>
          Due to Meta/Instagram policies, we cannot create all the social accounts for businesses any longer. But don&apos;t
          worry, it&apos;s an easy and fun process to set up your business accounts! Feel free to reach out to support
          through the chat widget if you&apos;re facing any issues.
        </span>
        <ul>
          <li>
            1) Click:{' '}
            <Link
              href="https://www.instagram.com/accounts/emailsignup/"
              target="_blank"
              className="text-primary underline font-bold">
              Create an instagram account
            </Link>
          </li>
          <li>2) Click: Setup your instagram as a Business Account </li>
          <li>3) Add your bio: &quot;Turn your [niche] website into an app in 5 minutes. Try it free now&quot;</li>
          <li className="mt-8">
            4) Click:{' '}
            <Link href="https://twitter.com/signup" target="_blank" className="text-primary underline font-bold">
              Create your twitter account
            </Link>
          </li>
          <li>
            5) Add your social logins to your Husl Dashboard below so you never lose them, we&apos;ll map them to your social
            logins manager. You can choose different accounts with the arrow to add the logins.
          </li>
          <li>
            6) If you&apos;d like Husl to manage your organic marketing, you&apos;ll need to add us to your Meta account.
            You&apos;ll complete this in “Setup a Meta Business Account.” step.
          </li>
        </ul>
      </div>
      <SocialAccountSetup />
    </main>
  )
}
