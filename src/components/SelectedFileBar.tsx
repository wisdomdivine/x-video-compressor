import React from 'react'
import { motion } from 'framer-motion'
import { Attachment01Icon } from 'hugeicons-react'
import { Button } from './Button'
import { formatBytes } from '../utils/compressor'

export interface SelectedFileBarProps {
  file: File
  onClear: () => void
  onStartCompress: () => void
  disabled?: boolean
}

export const SelectedFileBar: React.FC<SelectedFileBarProps> = ({
  file,
  onClear,
  onStartCompress,
  disabled
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#FAF7F2] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3 sm:gap-3.5 overflow-hidden min-w-0">
        <div className="w-10 h-10 rounded-lg bg-[#EAE5DB] text-[#1C1917] flex items-center justify-center shrink-0">
          <Attachment01Icon size={20} />
        </div>
        <div className="overflow-hidden min-w-0">
          <p className="text-sm font-medium text-[#1C1917] truncate m-0">
            {file.name}
          </p>
          <p className="text-xs font-normal text-[#78716C] mt-0.5 m-0">
            {formatBytes(file.size)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onClear}
          disabled={disabled}
          className="flex-1 sm:flex-initial"
        >
          Change
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onStartCompress}
          disabled={disabled}
          className="flex-1 sm:flex-initial"
        >
          Compress Now
        </Button>
      </div>
    </motion.div>
  )
}
