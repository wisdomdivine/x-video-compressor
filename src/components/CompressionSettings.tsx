import React from 'react'
import { motion } from 'framer-motion'
import type { CompressionOptions } from '../utils/compressor'

export interface CompressionSettingsProps {
  options: CompressionOptions
  onChange: (options: CompressionOptions) => void
  disabled?: boolean
}

export const CompressionSettings: React.FC<CompressionSettingsProps> = ({
  options,
  onChange,
  disabled
}) => {
  const setPreset = (preset: 'balanced' | 'small' | 'hq') => {
    if (disabled) return
    if (preset === 'balanced') {
      onChange({
        ...options,
        resolutionScale: 0.75,
        targetBitrateKbps: 2500,
        fps: 30
      })
    } else if (preset === 'small') {
      onChange({
        ...options,
        resolutionScale: 0.5,
        targetBitrateKbps: 1200,
        fps: 30
      })
    } else if (preset === 'hq') {
      onChange({
        ...options,
        resolutionScale: 1.0,
        targetBitrateKbps: 4500,
        fps: 60
      })
    }
  }

  const isPresetActive = (preset: 'balanced' | 'small' | 'hq') => {
    if (preset === 'balanced') {
      return options.resolutionScale === 0.75 && options.targetBitrateKbps === 2500
    }
    if (preset === 'small') {
      return options.resolutionScale === 0.5 && options.targetBitrateKbps === 1200
    }
    if (preset === 'hq') {
      return options.resolutionScale === 1.0 && options.targetBitrateKbps === 4500
    }
    return false
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.05 }}
      className="bg-[#FAF7F2] border border-[#E2DDD5] rounded-xl p-4 sm:p-6 space-y-5 sm:space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-medium text-[#1C1917] m-0">
            Compression settings
          </h3>
          <p className="text-xs font-normal text-[#78716C] mt-1 m-0">
            Choose a quick mode or fine tune the options below
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => setPreset('small')}
            disabled={disabled}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              isPresetActive('small')
                ? 'bg-[#1C1917] text-white border-[#1C1917]'
                : 'bg-white text-[#57534E] border-[#E2DDD5] hover:bg-[#F2ECE1]'
            }`}
          >
            Smallest size
          </motion.button>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => setPreset('balanced')}
            disabled={disabled}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              isPresetActive('balanced')
                ? 'bg-[#1C1917] text-white border-[#1C1917]'
                : 'bg-white text-[#57534E] border-[#E2DDD5] hover:bg-[#F2ECE1]'
            }`}
          >
            Balanced
          </motion.button>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => setPreset('hq')}
            disabled={disabled}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              isPresetActive('hq')
                ? 'bg-[#1C1917] text-white border-[#1C1917]'
                : 'bg-white text-[#57534E] border-[#E2DDD5] hover:bg-[#F2ECE1]'
            }`}
          >
            High quality
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-1">
        {/* Resolution Scale */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#57534E]">
            Resolution
          </label>
          <select
            value={options.resolutionScale}
            disabled={disabled}
            onChange={(e) =>
              onChange({ ...options, resolutionScale: parseFloat(e.target.value) })
            }
            className="w-full bg-white border border-[#E2DDD5] text-xs font-normal text-[#1C1917] rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:border-[#E05A38]"
          >
            <option value="1.0">Original size 100%</option>
            <option value="0.75">Scaled 75%</option>
            <option value="0.5">Scaled 50%</option>
            <option value="0.35">Scaled 35%</option>
          </select>
        </div>

        {/* Bitrate */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#57534E]">
            Target bit rate
          </label>
          <select
            value={options.targetBitrateKbps}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                ...options,
                targetBitrateKbps: parseInt(e.target.value, 10)
              })
            }
            className="w-full bg-white border border-[#E2DDD5] text-xs font-normal text-[#1C1917] rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:border-[#E05A38]"
          >
            <option value="800">800 kbps (Very compact)</option>
            <option value="1500">1500 kbps (Compact)</option>
            <option value="2500">2500 kbps (Standard)</option>
            <option value="4000">4000 kbps (Sharp)</option>
            <option value="6000">6000 kbps (High fidelity)</option>
          </select>
        </div>

        {/* Audio */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#57534E]">
            Audio track
          </label>
          <select
            value={options.includeAudio ? 'yes' : 'no'}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                ...options,
                includeAudio: e.target.value === 'yes'
              })
            }
            className="w-full bg-white border border-[#E2DDD5] text-xs font-normal text-[#1C1917] rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:border-[#E05A38]"
          >
            <option value="yes">Keep audio track</option>
            <option value="no">Mute audio track</option>
          </select>
        </div>

        {/* Output Format */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#57534E]">
            Output format
          </label>
          <select
            value={options.outputFormat}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                ...options,
                outputFormat: e.target.value as 'mp4' | 'webm'
              })
            }
            className="w-full bg-white border border-[#E2DDD5] text-xs font-normal text-[#1C1917] rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:border-[#E05A38]"
          >
            <option value="mp4">MP4 format</option>
            <option value="webm">WebM format</option>
          </select>
        </div>
      </div>
    </motion.div>
  )
}
