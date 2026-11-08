import { forwardRef, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    type = 'button',
    icon,
    children,
    className = '',
    disabled,
    ...props
  },
  ref
) {
  const baseClasses =
    'inline-flex items-center justify-center font-normal transition-colors select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 rounded-xl outline-none'

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
      'bg-[#FAF7F2] text-[#1C1917] hover:bg-[#F0EBE1] active:bg-[#EAE5DB]',
    danger:
      'bg-[#FDF2F0] text-[#E74C3C] hover:bg-[#FBE8E5] active:bg-[#F8DCD8]'
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </motion.button>
  )
})
