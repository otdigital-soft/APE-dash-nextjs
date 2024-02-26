import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

import { createStripeConfig } from '@/restapi/finances/mutation'
import { auth0 } from '@/restapi/stripe/mutation'
import api from '@/services/api'
import { authOptions } from '@/services/auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const session = await getServerSession(authOptions)
    if (!session) throw new Error('No session found')
    // save jwt to api
    api.defaults.headers.Authorization = `Bearer ${session?.jwt}`
    if (code) {
      const auth = await auth0({
        code,
        grant_type: 'authorization_code'
      })
      // Update user config
      const updateUserConfig = await createStripeConfig({
        publishableKey: auth?.stripe_publishable_key,
        secretKey: auth?.access_token,
        stripeUserId: auth?.stripe_user_id,
        refreshToken: auth?.refresh_token
      })
      // check if user config is updated
      if (!updateUserConfig) throw new Error('Failed to update user config')
      // return new Response(JSON.stringify(updateUserConfig))
      return NextResponse.redirect(process.env.APP_URL + '/redirect?success=true')
    }

    return NextResponse.redirect(process.env.APP_URL + '/redirect?success=true')
  } catch (error: any) {
    console.error(error)
    return NextResponse.redirect(process.env.APP_URL + '/redirect?success=false')
    // return new Response(error)
  }
}
// http://localhost:3000/api/connect/socials/stripe/callback?scope=read_write&code=ac_OW2czaeVqJ0gE6vDM2QMZRYLFrJh5udv
