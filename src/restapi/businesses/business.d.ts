import { User } from '../users/user'

interface CreateBusinessDto {
  name: string
}
interface UpdateBusinessDto {
  name?: string
  product?: string
  generate?: boolean
  generatedGraphics?: string[]
  user?: string
  onboardingCompleted?: boolean
}
interface Business {
  name: string
  createdBy: string
  product?: Product
  niche?: Niche & string
  logo?: FileManager.FileResponse
  favicon?: FileManager.FileResponse
  generatedGraphics?: FileManager.FileResponse[]
  customFields?: Record<string, any>
  primaryColor?: string
  secondaryColor?: string
  domain?: string
  generated?: boolean
  onboardingCompleted?: boolean
  accounts?: {
    email?: {
      email: string
      password: string
      nftId?: string
    }
  }
  user?: User
  _id: string
  __v: number
}
