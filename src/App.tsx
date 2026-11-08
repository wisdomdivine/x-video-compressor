import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from './components/Header'
import { Card } from './components/Card'
import { Dropzone } from './components/Dropzone'
import { SelectedFileBar } from './components/SelectedFileBar'
import { CompressionSettings } from './components/CompressionSettings'
import { ProgressBar } from './components/ProgressBar'
import { VideoPreview } from './components/VideoPreview'
import type {
  CompressionOptions,
  CompressionResult
} from './utils/compressor'
import { VideoCompressorService } from './utils/compressor'

export default function App() {
  const [logoType, setLogoType] = useState<'cone' | 'monitor'>('cone')
  const [logoVariant, setLogoVariant] = useState<'color' | 'bw'>('color')

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState<
    'idle' | 'selected' | 'compressing' | 'completed' | 'error'
  >('idle')
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const [result, setResult] = useState<CompressionResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [options, setOptions] = useState<CompressionOptions>({
    resolutionScale: 0.75,
    targetBitrateKbps: 2500,
    fps: 30,
    includeAudio: true,
    outputFormat: 'mp4'
  })

  const compressorRef = useRef<VideoCompressorService | null>(null)

  const handleToggleLogoType = () => {
    setLogoType((prev) => (prev === 'cone' ? 'monitor' : 'cone'))
  }

  const handleToggleLogoVariant = () => {
    setLogoVariant((prev) => (prev === 'color' ? 'bw' : 'color'))
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setStatus('selected')
    setResult(null)
    setErrorMessage(null)
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setStatus('idle')
    setResult(null)
    setErrorMessage(null)
  }

  const handleStartCompress = async () => {
    if (!selectedFile) return

    setStatus('compressing')
    setProgress(0)
    setStatusMessage('Starting video compression')
    setErrorMessage(null)

    const compressor = new VideoCompressorService()
    compressorRef.current = compressor

    try {
      const res = await compressor.compress(
        selectedFile,
        options,
        (pct, msg) => {
          setProgress(pct)
          setStatusMessage(msg)
        }
      )
      setResult(res)
      setStatus('completed')
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Compression stopped') {
        setStatus('selected')
      } else {
        setStatus('error')
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Something went wrong while compressing the video'
        )
      }
    } finally {
      compressorRef.current = null
    }
  }

  const handleCancelCompress = () => {
    if (compressorRef.current) {
      compressorRef.current.cancel()
    }
    setStatus('selected')
    setProgress(0)
  }

  const handleReset = () => {
    if (result?.url) {
      URL.revokeObjectURL(result.url)
    }
    setSelectedFile(null)
    setResult(null)
    setStatus('idle')
    setProgress(0)
    setErrorMessage(null)
  }

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1C1917] flex flex-col font-light selection:bg-[#EAE5DB]">
      <Header
        logoType={logoType}
        logoVariant={logoVariant}
        onToggleLogoType={handleToggleLogoType}
        onToggleLogoVariant={handleToggleLogoVariant}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-6 sm:py-10 flex flex-col justify-center">
        <Card>
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Dropzone onFileSelect={handleFileSelect} />
              </motion.div>
            )}

            {status === 'selected' && selectedFile && (
              <motion.div
                key="selected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <SelectedFileBar
                  file={selectedFile}
                  onClear={handleClearFile}
                  onStartCompress={handleStartCompress}
                />

                <CompressionSettings
                  options={options}
                  onChange={setOptions}
                />
              </motion.div>
            )}

            {status === 'compressing' && selectedFile && (
              <motion.div
                key="compressing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ProgressBar
                  progress={progress}
                  statusMessage={statusMessage}
                  fileName={selectedFile.name}
                  onCancel={handleCancelCompress}
                />
              </motion.div>
            )}

            {status === 'completed' && result && selectedFile && (
              <motion.div
                key="completed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <VideoPreview
                  result={result}
                  originalFile={selectedFile}
                  onReset={handleReset}
                />
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-center py-6"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-normal text-[#1C1917] m-0">
                    Could not complete compression
                  </h3>
                  <p className="text-sm text-[#78716C] font-light max-w-md mx-auto m-0">
                    {errorMessage || 'An error occurred during video processing'}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStatus('selected')}
                    className="text-sm font-light px-5 py-2.5 rounded-xl bg-[#EAE5DB] text-[#1C1917] hover:bg-[#DFD9CE] cursor-pointer transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Informational footer with ample whitespace */}
        <div className="mt-12 text-center space-y-3">
          <p className="text-xs text-[#78716C] font-light m-0">
            Free and open tool. Videos stay on your computer and never upload anywhere.
          </p>
          <p className="text-xs text-[#A8A29E] font-light m-0">
            Works completely offline in your browser.
          </p>
        </div>
      </main>
    </div>
  )
}
