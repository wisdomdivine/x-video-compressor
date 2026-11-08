export interface VideoMetadata {
  name: string
  originalSize: number
  duration: number
  width: number
  height: number
  type: string
}

export interface CompressionOptions {
  resolutionScale: number // 1 for original, 0.75 for 1080p, 0.5 for 720p, etc
  targetBitrateKbps: number // e.g. 2500
  fps: number // 30 or 60
  includeAudio: boolean
  outputFormat: 'mp4' | 'webm'
}

export interface CompressionResult {
  blob: Blob
  url: string
  compressedSize: number
  originalSize: number
  savingsPercent: number
  duration: number
  width: number
  height: number
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2))
  return `${value} ${sizes[i]}`
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export function getOptimalMimeType(preferredFormat: 'mp4' | 'webm'): string {
  if (typeof window === 'undefined' || !window.MediaRecorder) {
    return 'video/webm'
  }

  const mp4Types = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4;codecs=avc1',
    'video/mp4'
  ]

  const webmTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm'
  ]

  if (preferredFormat === 'mp4') {
    for (const type of mp4Types) {
      if (MediaRecorder.isTypeSupported(type)) return type
    }
  }

  for (const type of webmTypes) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }

  for (const type of mp4Types) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }

  return ''
}

export async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const objectUrl = URL.createObjectURL(file)
    video.src = objectUrl

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({
        name: file.name,
        originalSize: file.size,
        duration: video.duration || 0,
        width: video.videoWidth || 1920,
        height: video.videoHeight || 1080,
        type: file.type
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Unable to read video file'))
    }
  })
}

export class VideoCompressorService {
  private activeVideo: HTMLVideoElement | null = null
  private activeRecorder: MediaRecorder | null = null
  private animationFrameId: number | null = null
  private isCancelled = false

  public cancel() {
    this.isCancelled = true
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    if (this.activeRecorder && this.activeRecorder.state !== 'inactive') {
      try {
        this.activeRecorder.stop()
      } catch {
        // ignore on cancel
      }
    }
    if (this.activeVideo) {
      this.activeVideo.pause()
      this.activeVideo.src = ''
      this.activeVideo = null
    }
  }

  public async compress(
    file: File,
    options: CompressionOptions,
    onProgress: (percent: number, message: string) => void
  ): Promise<CompressionResult> {
    this.isCancelled = false
    onProgress(2, 'Preparing video')

    const metadata = await extractVideoMetadata(file)
    if (this.isCancelled) throw new Error('Compression stopped')

    let targetWidth = Math.round(metadata.width * options.resolutionScale)
    let targetHeight = Math.round(metadata.height * options.resolutionScale)

    // Dimensions must be even for video encoders
    if (targetWidth % 2 !== 0) targetWidth -= 1
    if (targetHeight % 2 !== 0) targetHeight -= 1

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight
    const ctx = canvas.getContext('2d', { alpha: false })

    if (!ctx) {
      throw new Error('Canvas 2D context unavailable')
    }

    const video = document.createElement('video')
    this.activeVideo = video
    video.preload = 'auto'
    video.playsInline = true
    video.crossOrigin = 'anonymous'

    const videoUrl = URL.createObjectURL(file)
    video.src = videoUrl

    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve()
      video.onerror = () => reject(new Error('Could not load video data'))
    })

    if (this.isCancelled) {
      URL.revokeObjectURL(videoUrl)
      throw new Error('Compression stopped')
    }

    const canvasStream = canvas.captureStream(options.fps)

    let combinedStream = canvasStream
    let audioContext: AudioContext | null = null
    let audioSource: MediaElementAudioSourceNode | null = null

    if (options.includeAudio) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioCtx) {
          audioContext = new AudioCtx()
          audioSource = audioContext.createMediaElementSource(video)
          const destination = audioContext.createMediaStreamDestination()
          audioSource.connect(destination)
          audioSource.connect(audioContext.destination)

          const audioTracks = destination.stream.getAudioTracks()
          if (audioTracks.length > 0) {
            combinedStream = new MediaStream([
              ...canvasStream.getVideoTracks(),
              audioTracks[0]
            ])
          }
        }
      } catch {
        // Fallback to video only if audio capture cannot attach
        combinedStream = canvasStream
      }
    } else {
      video.muted = true
    }

    const mimeType = getOptimalMimeType(options.outputFormat)
    const recorderOptions: MediaRecorderOptions = {
      videoBitsPerSecond: options.targetBitrateKbps * 1000
    }
    if (mimeType) {
      recorderOptions.mimeType = mimeType
    }

    const recordedChunks: Blob[] = []
    const recorder = new MediaRecorder(combinedStream, recorderOptions)
    this.activeRecorder = recorder

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data)
      }
    }

    const compressionPromise = new Promise<CompressionResult>((resolve, reject) => {
      recorder.onstop = () => {
        if (this.isCancelled) {
          URL.revokeObjectURL(videoUrl)
          if (audioContext) audioContext.close()
          reject(new Error('Compression stopped'))
          return
        }

        const outputBlob = new Blob(recordedChunks, {
          type: mimeType || 'video/mp4'
        })
        const outputUrl = URL.createObjectURL(outputBlob)
        const compressedSize = outputBlob.size
        const savings = Math.max(0, Math.round(((metadata.originalSize - compressedSize) / metadata.originalSize) * 100))

        URL.revokeObjectURL(videoUrl)
        if (audioContext) audioContext.close()

        onProgress(100, 'Compression complete')
        resolve({
          blob: outputBlob,
          url: outputUrl,
          compressedSize,
          originalSize: metadata.originalSize,
          savingsPercent: savings,
          duration: metadata.duration,
          width: targetWidth,
          height: targetHeight
        })
      }

      recorder.onerror = () => {
        URL.revokeObjectURL(videoUrl)
        if (audioContext) audioContext.close()
        reject(new Error('Encoding error encountered during recording'))
      }
    })

    recorder.start(250)
    video.currentTime = 0

    // Set playback speed up to 2x if audio is muted for faster compression
    if (!options.includeAudio) {
      video.playbackRate = 2.0
    } else {
      video.playbackRate = 1.0
    }

    await video.play()

    const drawFrame = () => {
      if (this.isCancelled) return

      if (video.paused || video.ended) {
        if (video.ended) {
          if (recorder.state === 'recording') {
            recorder.stop()
          }
        }
        return
      }

      ctx.drawImage(video, 0, 0, targetWidth, targetHeight)

      if (metadata.duration > 0) {
        const progress = Math.min(99, Math.round((video.currentTime / metadata.duration) * 100))
        onProgress(progress, `Compressing video ${progress}%`)
      }

      this.animationFrameId = requestAnimationFrame(drawFrame)
    }

    this.animationFrameId = requestAnimationFrame(drawFrame)

    video.onended = () => {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = null
      }
      if (recorder.state === 'recording') {
        recorder.stop()
      }
    }

    return compressionPromise
  }
}
