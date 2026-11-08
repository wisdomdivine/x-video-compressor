import React from 'react'
import { motion } from 'framer-motion'

export interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`bg-white border border-[#E2DDD5] rounded-2xl p-5 sm:p-8 md:p-10 ${className}`}
    >
      {children}
    </motion.div>
  )
}
