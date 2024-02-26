declare namespace StripeApi {
  interface Auth0Dto {
    code: string
    grant_type: string
  }
  interface Auth0Response {
    token_type: string
    scope: string
    live_mode: boolean
    stripe_user_id: string
  }
}
