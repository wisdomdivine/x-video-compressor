import React from 'react'
import { motion } from 'framer-motion'
import { Button } from './Button'

export interface ProgressBarProps {
  progress: number
  statusMessage: string
  fileName: string
  onCancel: () => void
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  statusMessage,
  fileName,
  onCancel
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#FAF7F2] rounded-xl p-5 sm:p-8 space-y-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="overflow-hidden min-w-0">
          <p className="text-sm font-medium text-[#1C1917] truncate m-0">
            {fileName}
          </p>
          <p className="text-xs font-normal text-[#78716C] mt-1 m-0">
            {statusMessage}
          </p>
        </div>

        <span className="text-base font-medium text-[#1C1917] shrink-0">
          {progress}%
        </span>
      </div>

      {/* Solid progress bar track and smooth motion fill */}
      <div className="w-full h-2.5 bg-[#EAE5DB] rounded-lg overflow-hidden">
        <motion.div
          className="h-full bg-[#E05A38]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ ease: 'easeOut', duration: 0.2 }}
        />
      </div>

      <div className="flex justify-end pt-1">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </motion.div>
  )
}
