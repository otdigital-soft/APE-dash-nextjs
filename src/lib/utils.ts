import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { Business } from '@/restapi/businesses/business'

const WEBHUSL_URL = process.env.WEBHUSL_URL || 'https://web.husl.app'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
export const monthsSimple = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const toCurrency = (amount: number, cent = true, currency = 'USD') => {
  if (cent) {
    amount = amount / 100
  }
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency
  })
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const getExt = (path?: string) => {
  if (!path) return ''
  const ext = path.split('.').pop()
  if (!ext) return ''
  return ext
}

/**
 * Get filename, remove extension
 */
export const getFilename = (filename?: string) => {
  const ext = getExt(filename)
  return filename?.replace(`.${ext}`, '')
}

export const getFilePrefix = (filename: string) => {
  if (filename?.endsWith('/')) {
    return filename?.replace('/', '')
  } else {
    return filename
  }
}

export const sumFormatBytes = (bytes: number[], decimals = 2) => {
  // sum all bytes
  const sum = bytes.reduce((a, b) => a + b, 0)

  return formatBytes(sum, decimals)
}

export const isPreviewable = (filename: string) => {
  const exts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'ico', 'tiff', 'tif', 'jfif', 'pjpeg', 'pjp']
  const fileExt = filename.split('.').pop()
  if (!fileExt) return false
  return exts.includes(fileExt)
}

export const omitObject = (obj: Record<string, any>, omitKeys: string[]) => {
  const newObj = { ...obj }
  omitKeys.forEach((key) => delete newObj[key])
  return newObj
}

export const cutString = (str: string, cutStart: number, cutEnd: number) => {
  if (str.length <= 10) return str
  const first = str.slice(0, cutStart)
  const last = str.slice(-cutEnd)
  return first + '...' + last
}

export const replaceBulk = (str?: string, findArray?: string[], replaceArray?: string[]) => {
  if (!str || !findArray || !replaceArray) return str
  let i,
    regex: any = []
  const map: any = {}
  for (i = 0; i < findArray.length; i++) {
    regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, '\\$1'))
    map[findArray[i]] = replaceArray[i]
  }
  regex = regex.join('|')
  str = str?.replace(new RegExp(regex, 'g'), function (matched) {
    return map[matched]
  })
  return str
}

export const getTagCopies = (business?: Business) => {
  const tagCopy = business?.niche?.tagCopy
  const copyFrom: any = tagCopy?.map((v: any) => v.key)
  const copyTo: any = tagCopy?.map((v: any) => v.value)
  // this is default copy, you might want to make it dynamic
  copyFrom?.push(
    '[niche]',
    '[company]',
    '[primary color]',
    '[secondary color]',
    '[logo]',
    '[favicon]',
    '[domain]',
    '[product url]',
    '[url]',
    '[pain point]'
  )
  copyTo?.push(
    business?.niche?.name?.toString(),
    business?.name,
    business?.primaryColor,
    business?.secondaryColor,
    business?.logo?.url,
    business?.favicon?.url,
    business?.domain,
    business?.user?.productUrl,
    business?.domain,
    business?.niche?.tagCopy?.find((p: any) => p.key === '[pain-point]')?.value?.toString()
  )
  return { copyFrom, copyTo }
}

export const social = {
  // facebook: 'https://www.facebook.com/',
  twitter: 'https://twitter.com/',
  instagram: 'https://www.instagram.com/'
}

export const socialTypes = {
  // 'https://www.facebook.com/': 'facebook',
  'https://twitter.com/': 'twitter',
  'https://www.instagram.com/': 'instagram'
}

// add https to string if it doesn't exist
export const addHttp = (url?: string, ssl = true) => {
  if (url) {
    if (url.indexOf('http') === -1) {
      return ssl ? 'https://' + url : 'http://' + url
    }
  }
  return url
}

export const huslWebStorageUrl = (path: string) => {
  return `${WEBHUSL_URL}/storage${path}`
}

export const nCurrencyFormatter = (num: number, digits = 2) => {
  if (num < 1e3) return num
  if (num >= 1e3 && num < 1e6) return +(num / 1e3).toFixed(digits) + 'K'
  if (num >= 1e6 && num < 1e9) return +(num / 1e6).toFixed(digits) + 'M'
  if (num >= 1e9 && num < 1e12) return +(num / 1e9).toFixed(digits) + 'B'
  if (num >= 1e12) return +(num / 1e12).toFixed(digits) + 'T'
  return num
}
