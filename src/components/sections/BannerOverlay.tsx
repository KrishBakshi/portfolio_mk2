'use client'

interface BannerOverlayProps {
  position: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export default function BannerOverlay({ position, className = '' }: BannerOverlayProps) {
  const overlayClasses = {
    top: 'absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-b from-background to-transparent',
    bottom: 'absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-background to-transparent',
    left: 'absolute top-0 left-0 w-[20px] sm:w-[60px] h-full bg-gradient-to-r from-background/20 sm:from-background to-transparent',
    right: 'absolute top-0 right-0 w-[20px] sm:w-[60px] h-full bg-gradient-to-l from-background/20 sm:from-background to-transparent'
  }

  return <div className={`${overlayClasses[position]} ${className}`} />
}