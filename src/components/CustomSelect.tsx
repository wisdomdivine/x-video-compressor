import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown01Icon, Tick01Icon } from 'hugeicons-react'

export interface SelectOption<T = string | number> {
  value: T
  label: string
}

export interface CustomSelectProps<T = string | number> {
  label?: string
  value: T
  options: SelectOption<T>[]
  onChange: (value: T) => void
  disabled?: boolean
}

export function CustomSelect<T extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value) || options[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (val: T) => {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-medium text-[#57534E]">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="w-full bg-white text-xs font-normal text-[#1C1917] rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-[#F2ECE1] transition-colors disabled:opacity-40 disabled:cursor-not-allowed outline-none select-none text-left"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="shrink-0 text-[#78716C]"
        >
          <ArrowDown01Icon size={14} />
        </motion.span>
      </button>

      {/* Dropdown Menu Panel without any borders or shadows */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 2 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 left-0 right-0 top-full mt-1 bg-[#FAF7F2] rounded-xl p-1.5 space-y-1 max-h-56 overflow-y-auto"
          >
            {options.map((option) => {
              const isSelected = option.value === value
              return (
                <div
                  key={String(option.value)}
                  onClick={() => handleSelect(option.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-normal cursor-pointer flex items-center justify-between gap-2 transition-colors select-none ${
                    isSelected
                      ? 'bg-[#EAE5DB] text-[#1C1917]'
                      : 'text-[#57534E] hover:bg-[#F2ECE1] hover:text-[#1C1917]'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <span className="text-[#E05A38] shrink-0">
                      <Tick01Icon size={14} />
                    </span>
                  )}
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
