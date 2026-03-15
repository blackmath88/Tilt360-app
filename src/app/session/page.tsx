import { Suspense } from 'react'
import Link from 'next/link'
import SessionContent from './SessionContent'

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading session...</p>
      </div>
    </div>
  )
}

export default function SessionPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center flex-shrink-0">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
          ← Dashboard
        </Link>
        <h1 className="text-base font-semibold text-gray-900">Reflection Session</h1>
        <div className="w-20" />
      </header>
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<LoadingFallback />}>
          <SessionContent />
        </Suspense>
      </div>
    </div>
  )
}
