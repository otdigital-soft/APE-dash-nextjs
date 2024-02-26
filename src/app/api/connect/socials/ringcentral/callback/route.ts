import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

import { requestRingcentralToken } from '@/restapi/connections/mutations'
import api from '@/services/api'
import { authOptions } from '@/services/auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const redirectUri = searchParams.get('redirect_uri')
    const defaultRedirectUri = process.env.APP_URL + '/api/connect/socials/ringcentral/callback'
    console.log(redirectUri || defaultRedirectUri)
    const session = await getServerSession(authOptions)
    if (!session) throw new Error('No session found')
    // save jwt to api
    api.defaults.headers.Authorization = `Bearer ${session?.jwt}`
    if (code) {
      await requestRingcentralToken({
        code,
        redirect_uri: redirectUri || defaultRedirectUri
      })
    }
    // close tab
    return new Response(
      `
      <script>
        window.close()
      </script>
      `,
      {
        headers: {
          'content-type': 'text/html;charset=UTF-8'
        }
      }
    )
  } catch (error: any) {
    return NextResponse.redirect(process.env.APP_URL + '/redirect?success=false')
    // return new Response(error)
  }
}
// http://localhost:3000/api/connect/socials/stripe/callback?scope=read_write&code=ac_OW2czaeVqJ0gE6vDM2QMZRYLFrJh5udv
