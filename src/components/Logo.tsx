import React from 'react'

export interface LogoProps {
  type?: 'cone' | 'monitor'
  variant?: 'color' | 'bw'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
}

export const Logo: React.FC<LogoProps> = ({
  type = 'cone',
  variant = 'color',
  size = 'md',
  className = '',
  onClick
}) => {
  const fileName = `${type}-${variant}.svg`
  const src = `/logos/${fileName}`

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <img
        src={src}
        alt="Video Compressor Logo"
        className={`${sizeMap[size]} object-contain select-none`}
        draggable={false}
      />
    </div>
  )
}

