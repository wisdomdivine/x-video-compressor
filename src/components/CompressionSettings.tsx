import React from 'react'
import { motion } from 'framer-motion'
import type { CompressionOptions } from '../utils/compressor'
import { CustomSelect } from './CustomSelect'

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

  const resolutionOptions = [
    { value: 1.0, label: 'Original size 100%' },
    { value: 0.75, label: 'Scaled 75%' },
    { value: 0.5, label: 'Scaled 50%' },
    { value: 0.35, label: 'Scaled 35%' }
  ]

  const bitrateOptions = [
    { value: 800, label: '800 kbps (Very compact)' },
    { value: 1500, label: '1500 kbps (Compact)' },
    { value: 2500, label: '2500 kbps (Standard)' },
    { value: 4000, label: '4000 kbps (Sharp)' },
    { value: 6000, label: '6000 kbps (High fidelity)' }
  ]

  const audioOptions = [
    { value: 'yes', label: 'Keep audio track' },
    { value: 'no', label: 'Mute audio track' }
  ]

  const formatOptions = [
    { value: 'mp4', label: 'MP4 format' },
    { value: 'webm', label: 'WebM format' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.05 }}
      className="bg-[#FAF7F2] rounded-xl p-4 sm:p-6 space-y-5 sm:space-y-6"
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

        {/* Preset Selector without any borders */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => setPreset('small')}
            disabled={disabled}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer outline-none ${
              isPresetActive('small')
                ? 'bg-[#1C1917] text-white'
                : 'bg-white text-[#57534E] hover:bg-[#EAE5DB]'
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
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer outline-none ${
              isPresetActive('balanced')
                ? 'bg-[#1C1917] text-white'
                : 'bg-white text-[#57534E] hover:bg-[#EAE5DB]'
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
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer outline-none ${
              isPresetActive('hq')
                ? 'bg-[#1C1917] text-white'
                : 'bg-white text-[#57534E] hover:bg-[#EAE5DB]'
            }`}
          >
            High quality
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-1">
        {/* Custom Resolution Dropdown */}
        <CustomSelect
          label="Resolution"
          value={options.resolutionScale}
          options={resolutionOptions}
          disabled={disabled}
          onChange={(val) =>
            onChange({ ...options, resolutionScale: val as number })
          }
        />

        {/* Custom Bitrate Dropdown */}
        <CustomSelect
          label="Target bit rate"
          value={options.targetBitrateKbps}
          options={bitrateOptions}
          disabled={disabled}
          onChange={(val) =>
            onChange({ ...options, targetBitrateKbps: val as number })
          }
        />

        {/* Custom Audio Dropdown */}
        <CustomSelect
          label="Audio track"
          value={options.includeAudio ? 'yes' : 'no'}
          options={audioOptions}
          disabled={disabled}
          onChange={(val) =>
            onChange({ ...options, includeAudio: val === 'yes' })
          }
        />

        {/* Custom Format Dropdown */}
        <CustomSelect
          label="Output format"
          value={options.outputFormat}
          options={formatOptions}
          disabled={disabled}
          onChange={(val) =>
            onChange({ ...options, outputFormat: val as 'mp4' | 'webm' })
          }
        />
      </div>
    </motion.div>
  )
}
