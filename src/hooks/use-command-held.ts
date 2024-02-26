import { useEffect, useState } from 'react'

/**
 * Detects if a command key is held down.
 */
export const useCommandHeld = () => {
  const [commandHeld, setCommandHeld] = useState(false)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey) {
      setCommandHeld(true)
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Meta') {
      setCommandHeld(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  return commandHeld
}
