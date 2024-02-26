'use client'

import { Toaster } from 'react-hot-toast'

export const Toast: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: '#181818',
          color: '#fff',
          border: '1px solid #3A3A3A',
          borderRadius: '12px'
        }
      }}
    />
  )
}
