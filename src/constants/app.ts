// export const ADDRESS_USDH = '0x7BAB3781D9A238CdeA4f4925f9322C5a73f9C8cd'
export const ADDRESS_USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
export const ADDRESS_CONTRACT = ADDRESS_USDC
export const ADDRESS_RECEIVER = '0xaCBb3587a13239942D9B81db1d6874F9b06c88cB'
export const ADDRESS_FOUNDERSCARD = '0xbbeb904272fa9888c50da37d16b9099fcae78244'
export const ADDRESS_STAKING = '0x3b84eb6e2149a63e3ed790d22d1d13167d5d2625'
export const ADDRESS_NFT = '0x4cB1420AA77B731acbe258F8CA0f0b9ad4aDbD09'
export const ADDRESS_LUKAS = '0x663Ae8DE42D59C074e2ceA7e02f63Cd0f5dcC52c'
export const ADDRESS_OWNING_FOUNDERCARDS_AND_BUSINESS_NFTS = '0x8941e58CA4240E26D46142A4a114e29A3B8249d9'
export const PRIVATE_RSS_COOKIE_NAME = 'Husl-auth.token'

export const TOKEN_DECIMALS = 18
export const CENTS_PER_USD = 100

// calls reward per 100 calls
export const TRACKER_CALLS_REWARD = 10
export const TRACKER_CALLS_REWARD_PER_UNIT = Number((TRACKER_CALLS_REWARD / 100).toFixed(2))
// sales reward per unit
export const TRACKER_SALES_REWARD_PER_UNIT = 15

export const repetitionOptions = [
  {
    label: 'Weekly',
    value: 'weekly'
  },
  {
    label: 'Monthly',
    value: 'monthly'
  },
  {
    label: 'Yearly',
    value: 'yearly'
  }
]

export const socialOptions = [
  {
    label: 'Instagram',
    value: 'instagram'
  },
  {
    label: 'Twitter',
    value: 'twitter'
  }
]

export const socials = ['instagram', 'twitter']
export const stripe0authUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${process.env.STRIPE_REDIRECT_URI}`

export const permissionOptions = [
  {
    label: 'All Permissions',
    value: 'all'
  },
  {
    label: 'Switch NFT Accounts',
    value: 'switch-nft-accounts'
  },
  {
    label: 'Training Center',
    value: 'courses'
  },
  {
    label: 'Access Manager',
    value: 'access-manager'
  },
  {
    label: 'Brand Overview',
    value: 'brand-overview'
  },
  {
    label: 'My Drive',
    value: 'marketing/my-drive'
  },
  {
    label: 'Social Account Setups',
    value: 'marketing/social-setup'
  },
  {
    label: 'Blog',
    value: 'marketing/blog'
  },
  {
    label: 'Leaderboard',
    value: 'leaderboard'
  },
  {
    label: 'Connections',
    value: 'settings/connection-setting'
  },
  {
    label: 'Auto Pilot',
    value: 'auto-pilot'
  }
] as const

export const RINGCENTRAL_AUTH_URL = `https://platform.devtest.ringcentral.com/restapi/oauth/authorize?response_type=code&client_id=${process.env.RINGCENTRAL_CLIENT_ID}&redirect_uri=${process.env.APP_URL}/api/connect/socials/ringcentral/callback`
