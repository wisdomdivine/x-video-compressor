import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-normal transition-colors select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 rounded-xl'

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-2 gap-2',
    md: 'text-sm px-5 py-2.5 gap-2.5',
    lg: 'text-base px-6 py-3 gap-3'
  }

  const variantClasses = {
    primary:
      'bg-[#E05A38] text-white hover:bg-[#CF4F30] active:bg-[#B84428]',
    secondary:
      'bg-[#EAE5DB] text-[#1C1917] hover:bg-[#DFD9CE] active:bg-[#D4CDBF]',
    outline:
      'bg-transparent border border-[#E2DDD5] text-[#1C1917] hover:bg-[#F0EBE1] active:bg-[#EAE5DB]',
    danger:
      'bg-transparent border border-[#E74C3C] text-[#E74C3C] hover:bg-[#FDF2F0] active:bg-[#FBE8E5]'
  }

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  )
}
