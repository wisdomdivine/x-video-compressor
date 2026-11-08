import React from 'react'
import { motion } from 'framer-motion'
import { Logo } from './Logo'

export interface HeaderProps {
  logoType: 'cone' | 'monitor'
  logoVariant: 'color' | 'bw'
  onToggleLogoType: () => void
  onToggleLogoVariant: () => void
}

export const Header: React.FC<HeaderProps> = ({
  logoType,
  logoVariant,
  onToggleLogoType,
  onToggleLogoVariant
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-4xl mx-auto pt-6 sm:pt-10 pb-6 sm:pb-8 px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3.5 sm:gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="cursor-pointer"
          onClick={onToggleLogoType}
        >
          <Logo
            type={logoType}
            variant={logoVariant}
            size="md"
          />
        </motion.div>
        <div>
          <h1 className="text-xl sm:text-2xl font-medium text-[#1C1917] tracking-tight m-0">
            Video Compressor
          </h1>
          <p className="text-xs text-[#78716C] font-normal mt-0.5 m-0">
            Private and free in browser compression
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          onClick={onToggleLogoType}
          className="text-xs font-normal px-3 py-1.5 rounded-lg bg-white text-[#57534E] hover:bg-[#EAE5DB] cursor-pointer transition-colors outline-none"
          title="Switch between Cone and Monitor logo"
        >
          {logoType === 'cone' ? 'Cone' : 'Monitor'}
        </motion.button>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          onClick={onToggleLogoVariant}
          className="text-xs font-normal px-3 py-1.5 rounded-lg bg-white text-[#57534E] hover:bg-[#EAE5DB] cursor-pointer transition-colors outline-none"
          title="Switch between color and black and white"
        >
          {logoVariant === 'color' ? 'Color' : 'Monochrome'}
        </motion.button>
      </div>
    </motion.header>
  )
}
