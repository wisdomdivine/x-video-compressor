import React from 'react'
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
    <div className="bg-[#FAF7F2] border border-[#E2DDD5] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 overflow-hidden">
        <div className="w-10 h-10 rounded-lg bg-[#EAE5DB] text-[#1C1917] flex items-center justify-center shrink-0">
          <Attachment01Icon size={20} />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-normal text-[#1C1917] truncate m-0">
            {file.name}
          </p>
          <p className="text-xs font-light text-[#78716C] mt-0.5 m-0">
            {formatBytes(file.size)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={disabled}
        >
          Change
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onStartCompress}
          disabled={disabled}
        >
          Compress Now
        </Button>
      </div>
    </div>
  )
}
