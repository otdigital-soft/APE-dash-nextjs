import { useLayoutEffect, useState } from 'react'

export const useLayout = () => {
  const [sidebarWidth, setSidebarWidth] = useState(240)

  useLayoutEffect(() => {
    const sidebar = document.getElementById('MAIN_SIDEBAR')
    if (sidebar) {
      setSidebarWidth(sidebar.offsetWidth)
    }
  }, [])
  return { sidebarWidth }
}
