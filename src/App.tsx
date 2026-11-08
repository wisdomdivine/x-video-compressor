import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Video01Icon, Upload01Icon, SparklesIcon } from 'hugeicons-react'

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
            <SparklesIcon size={16} />
            <span>100% In-Browser & Private • No Server Needed</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            x-video-compress
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Fast, free, and open-source video compression right in your browser.
          </p>
        </div>

        {/* Dropzone Placeholder */}
        <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-12 bg-slate-900/50 backdrop-blur-sm transition-all cursor-pointer group flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Upload01Icon size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-200">
              Drop your video here, or <span className="text-indigo-400">browse</span>
            </p>
            <p className="text-xs text-slate-500">
              Supports MP4, MOV, WebM, and MKV
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Video01Icon size={14} /> Zero upload time
          </span>
          <span>•</span>
          <span>Unlimited file size</span>
          <span>•</span>
          <span>No accounts or watermarks</span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
