declare namespace Account {
  export interface Account {
    _id: string & {
      $oid: string
    }
    websiteKey: string
    username: string
    password?: string
    user?: {
      $oid?: string
    }
    social?: boolean
    verified: boolean
    __v: number
  }
  export interface Dto {
    websiteKey: string
    username: string
    password?: string
    verified?: boolean
    social?: boolean
  }
  // export interface Social {
  //   _id: string & {
  //     $oid: string
  //   }
  //   websiteList?: string
  //   username: string
  //   password?: string
  //   user?: {
  //     $oid?: string
  //   }
  //   social?: 'fb' | 'ig' | 'twitter' | 'tiktok'
  //   verified: boolean
  //   __v: number
  // }

  export interface SocialDto {
    websiteList?: string
    username?: string
    password?: string
    social?: 'fb' | 'ig' | 'twitter' | 'tiktok'
  }
}
