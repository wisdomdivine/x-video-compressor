import React from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white border border-[#E2DDD5] rounded-2xl p-8 sm:p-10 ${className}`}
    >
      {children}
    </div>
  )
}
