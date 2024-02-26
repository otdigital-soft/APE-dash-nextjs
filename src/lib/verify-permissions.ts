export const whitelabelRss = ['/', '/stats/revenue']

export const verifyPermissions = (resource: string, permissions?: string[], isPath?: boolean) => {
  // if isPath is true, then resource is a pathname, otherwise resource is a permission
  // we need to transform path and remove unuseful parts
  let rss = resource
  // we need to allow if there is no permissions to prevent old users to be blocked
  if (!permissions) return true
  // if permissions is all, then return true
  if (permissions.includes('all')) return true

  if (isPath) {
    // if rss is in whitelabelRss, then return true
    if (whitelabelRss.includes(rss)) return true

    // remove leading slash
    rss = rss.replace('/', '')
    // remove query string
    if (rss.includes('?')) rss = rss.split('?')[0]
    // remove trailing slash
    if (rss.endsWith('/')) rss = rss.slice(0, -1)
  }
  // check if rss is in permissions
  if (!permissions?.includes(rss)) return false
  // if rss is in permissions, then return true
  return true
}
