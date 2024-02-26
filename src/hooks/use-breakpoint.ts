import { createBreakpoint } from 'react-use'

// create an endpoint based on tailwind breakpoints
// https://tailwindcss.com/docs/breakpoints
const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }
type UseBreakpoint = () => keyof typeof breakpoints

export const useBreakpoint: UseBreakpoint = createBreakpoint(breakpoints) as any
