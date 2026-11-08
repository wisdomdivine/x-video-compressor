import React, { useRef, useState } from 'react'
import { Upload01Icon, Attachment01Icon } from 'hugeicons-react'
import { Button } from './Button'

export interface DropzoneProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|webm|mkv|avi)$/i)) {
        onFileSelect(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0])
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center transition-colors ${
        isDragOver
          ? 'border-[#E05A38] bg-[#FDF8F5]'
          : 'border-[#E2DDD5] bg-[#FAF7F2]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*,.mp4,.mov,.webm,.mkv"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="w-14 h-14 rounded-xl bg-[#EAE5DB] text-[#1C1917] flex items-center justify-center">
          <Upload01Icon size={26} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-light text-[#1C1917] m-0">
            You can upload a video
          </h2>
          <p className="text-sm text-[#78716C] font-light max-w-md mx-auto m-0">
            Click on the button or drag and drop files here
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            icon={<Attachment01Icon size={18} />}
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            Upload Video
          </Button>
        </div>

        <p className="text-xs text-[#A8A29E] font-light pt-2 m-0">
          MP4, MOV, WebM and MKV files supported
        </p>
      </div>
    </div>
  )
}
