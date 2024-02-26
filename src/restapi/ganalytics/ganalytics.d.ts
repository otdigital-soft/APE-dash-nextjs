declare namespace GAnalytic {
  interface Config {
    _id: string
    propertyId: string
    clientId: string
    user?: string
    gaToken?: string
    pageViews?: {
      data?: {
        month: number
        monthShort: string
        pageViews: number
      }[]
      lastUpdatedAt?: Date | string
    }
    browser?: {
      data?: {
        device: string
        sessions?: number
      }[]
      lastUpdatedAt?: Date | string
    }
  }
  interface ConfigDto {
    propertyId: string
    clientId: string
    user?: string
  }
  interface PageView {
    label: number
    value: number
  }

  interface Device {
    device: string
    sessions: number
  }
}
