import React from 'react'
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
    <div className="space-y-8">
      {/* Video Player */}
      <div className="bg-[#1C1917] rounded-xl overflow-hidden aspect-video flex items-center justify-center">
        <video
          src={result.url}
          controls
          playsInline
          className="w-full h-full object-contain"
        />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#FAF7F2] border border-[#E2DDD5] rounded-xl p-4 text-center">
          <p className="text-xs font-normal text-[#78716C] m-0">
            Original size
          </p>
          <p className="text-lg font-medium text-[#1C1917] mt-1.5 m-0">
            {formatBytes(result.originalSize)}
          </p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E2DDD5] rounded-xl p-4 text-center">
          <p className="text-xs font-normal text-[#78716C] m-0">
            Compressed size
          </p>
          <p className="text-lg font-medium text-[#E05A38] mt-1.5 m-0">
            {formatBytes(result.compressedSize)}
          </p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E2DDD5] rounded-xl p-4 text-center">
          <p className="text-xs font-normal text-[#78716C] m-0">
            Space saved
          </p>
          <p className="text-lg font-medium text-[#1C1917] mt-1.5 m-0">
            {result.savingsPercent}% smaller
          </p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E2DDD5] rounded-xl p-4 text-center">
          <p className="text-xs font-normal text-[#78716C] m-0">
            Resolution
          </p>
          <p className="text-lg font-medium text-[#1C1917] mt-1.5 m-0">
            {result.width} x {result.height}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
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
      </div>

      <div className="text-center pt-2">
        <p className="text-xs font-normal text-[#A8A29E] m-0">
          Video duration is {formatDuration(result.duration)}. Your file was processed locally in your browser.
        </p>
      </div>
    </div>
  )
}
