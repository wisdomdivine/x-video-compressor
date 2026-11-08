import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 md:p-14 text-center transition-colors ${
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

      <div className="flex flex-col items-center justify-center space-y-5 sm:space-y-6">
        <motion.div
          animate={isDragOver ? { scale: 1.08 } : { scale: 1 }}
          transition={{ duration: 0.15 }}
          className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-[#EAE5DB] text-[#1C1917] flex items-center justify-center"
        >
          <Upload01Icon size={24} className="sm:hidden" />
          <Upload01Icon size={26} className="hidden sm:block" />
        </motion.div>

        <div className="space-y-1.5 sm:space-y-2">
          <h2 className="text-lg sm:text-2xl font-medium text-[#1C1917] m-0">
            You can upload a video
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] font-normal max-w-md mx-auto m-0 px-2">
            Click on the button or drag and drop files here
          </p>
        </div>

        <div className="pt-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="primary"
            size="lg"
            icon={<Attachment01Icon size={18} />}
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="w-full sm:w-auto"
          >
            Upload Video
          </Button>
        </div>

        <p className="text-xs text-[#A8A29E] font-normal pt-1 sm:pt-2 m-0">
          MP4, MOV, WebM and MKV files supported
        </p>
      </div>
    </motion.div>
  )
}
