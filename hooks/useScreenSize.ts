'use client'

import { useState, useEffect } from 'react'

export type ScreenSize = 'mobile' | 'tablet' | 'desktop'

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 1024
} as const

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const handleResize = () => {
      const width = window.innerWidth
      
      // Mobile: 0 - 479px
      // Tablet: 480px - 1023px
      // Desktop: 1024px+
      if (width < BREAKPOINTS.mobile) {
        setScreenSize('mobile')
      } else if (width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    handleResize()

    let resizeTimer: NodeJS.Timeout
    const resizeListener = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleResize, 100)
    }
    
    window.addEventListener('resize', resizeListener)

    return () => {
      window.removeEventListener('resize', resizeListener)
      clearTimeout(resizeTimer)
    }
  }, [])

  return {
    screenSize,
    isClient,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop'
  }
}

export default useScreenSize
