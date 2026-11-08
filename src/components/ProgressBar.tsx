import React from 'react'
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
    <div className="bg-[#FAF7F2] border border-[#E2DDD5] rounded-xl p-6 sm:p-8 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="overflow-hidden">
          <p className="text-sm font-normal text-[#1C1917] truncate m-0">
            {fileName}
          </p>
          <p className="text-xs font-light text-[#78716C] mt-1 m-0">
            {statusMessage}
          </p>
        </div>

        <span className="text-base font-light text-[#1C1917] shrink-0">
          {progress}%
        </span>
      </div>

      {/* Solid progress bar track and fill */}
      <div className="w-full h-2.5 bg-[#EAE5DB] rounded-lg overflow-hidden">
        <div
          className="h-full bg-[#E05A38] transition-all duration-200"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      <div className="flex justify-end pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
