import React from 'react'
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
    <header className="w-full max-w-4xl mx-auto pt-10 pb-8 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Logo
          type={logoType}
          variant={logoVariant}
          size="md"
          onClick={onToggleLogoType}
          className="cursor-pointer transition-transform hover:scale-105"
        />
        <div>
          <h1 className="text-xl sm:text-2xl font-medium text-[#1C1917] tracking-tight m-0">
            Video Compressor
          </h1>
          <p className="text-xs text-[#78716C] font-normal mt-0.5 m-0">
            Private and free in browser compression
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleLogoType}
          className="text-xs font-normal px-3 py-1.5 rounded-lg border border-[#E2DDD5] bg-white text-[#57534E] hover:bg-[#F7F4EE] cursor-pointer transition-colors"
          title="Switch between Cone and Monitor logo"
        >
          {logoType === 'cone' ? 'Cone' : 'Monitor'}
        </button>

        <button
          onClick={onToggleLogoVariant}
          className="text-xs font-normal px-3 py-1.5 rounded-lg border border-[#E2DDD5] bg-white text-[#57534E] hover:bg-[#F7F4EE] cursor-pointer transition-colors"
          title="Switch between color and black and white"
        >
          {logoVariant === 'color' ? 'Color' : 'Monochrome'}
        </button>
      </div>
    </header>
  )
}
