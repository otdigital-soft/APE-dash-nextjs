declare namespace Connection {
  interface Entity {
    _id: string
    appName: string
    user: string
    __v: number
    createdAt: number
    expiresIn: number
    grantedAt: number
    refreshTokenExpiresIn?: number
  }
  interface RequestRCTokenDto {
    code: string
    redirect_uri: string
  }
}
