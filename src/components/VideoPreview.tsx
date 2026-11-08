import React from 'react'
import { motion } from 'framer-motion'
import type { CompressionResult } from '../utils/compressor'
import { formatBytes, formatDuration } from '../utils/compressor'
import { Button } from './Button'
import { Download01Icon } from 'hugeicons-react'

export interface VideoPreviewProps {
  result: CompressionResult
  originalFile: File
  onReset: () => void
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  result,
  originalFile,
  onReset
}) => {
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = result.url
    const baseName = originalFile.name.replace(/\.[^/.]+$/, '')
    const ext = result.blob.type.includes('mp4') ? 'mp4' : 'webm'
    a.download = `${baseName} compressed.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Video Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="bg-[#1C1917] rounded-xl overflow-hidden aspect-video flex items-center justify-center"
      >
        <video
          src={result.url}
          controls
          playsInline
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Metrics Row with responsive 2 column on mobile and 4 column on tablet up */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-[#FAF7F2] rounded-xl p-3.5 sm:p-4 text-center"
        >
          <p className="text-xs font-normal text-[#78716C] m-0">
            Original size
          </p>
          <p className="text-base sm:text-lg font-medium text-[#1C1917] mt-1 m-0">
            {formatBytes(result.originalSize)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-[#FAF7F2] rounded-xl p-3.5 sm:p-4 text-center"
        >
          <p className="text-xs font-normal text-[#78716C] m-0">
            Compressed size
          </p>
          <p className="text-base sm:text-lg font-medium text-[#E05A38] mt-1 m-0">
            {formatBytes(result.compressedSize)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-[#FAF7F2] rounded-xl p-3.5 sm:p-4 text-center"
        >
          <p className="text-xs font-normal text-[#78716C] m-0">
            Space saved
          </p>
          <p className="text-base sm:text-lg font-medium text-[#1C1917] mt-1 m-0">
            {result.savingsPercent}% smaller
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-[#FAF7F2] rounded-xl p-3.5 sm:p-4 text-center"
        >
          <p className="text-xs font-normal text-[#78716C] m-0">
            Resolution
          </p>
          <p className="text-base sm:text-lg font-medium text-[#1C1917] mt-1 m-0">
            {result.width} x {result.height}
          </p>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.25 }}
        className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-1 sm:pt-2"
      >
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onReset}
          className="w-full sm:w-auto"
        >
          Compress another video
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          icon={<Download01Icon size={18} />}
          onClick={handleDownload}
          className="w-full sm:w-auto"
        >
          Download compressed video
        </Button>
      </motion.div>

      <div className="text-center pt-1 sm:pt-2">
        <p className="text-xs font-normal text-[#A8A29E] m-0 px-2">
          Video duration is {formatDuration(result.duration)}. Your file was processed locally in your browser.
        </p>
      </div>
    </motion.div>
  )
}
