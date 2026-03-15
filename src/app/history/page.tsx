import Link from 'next/link'
import { TiltDimension } from '@/types'
import { readSessions } from '@/lib/storage'

const DIMENSION_COLORS: Record<TiltDimension, string> = {
  resilience: 'bg-blue-100 text-blue-700',
  humanity: 'bg-green-100 text-green-700',
  courage: 'bg-orange-100 text-orange-700',
  wisdom: 'bg-purple-100 text-purple-700',
}

export default async function HistoryPage() {
  const sessions = readSessions().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-1">
              ← Dashboard
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Reflection History</h1>
          </div>
          <Link href="/session" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium">
            New Session →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">✦</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No reflections yet</h2>
            <p className="text-gray-400 mb-6">Start your first 7-minute reflection session to begin your journey.</p>
            <Link href="/session" className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium text-sm">
              Start First Session
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded</p>
            {sessions.map(s => (
              <div key={s.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-800">
                      {new Date(s.timestamp).toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(s.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {s.activeTiltDimension && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${DIMENSION_COLORS[s.activeTiltDimension]}`}>
                        {s.activeTiltDimension}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      s.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {s.completed ? 'Complete' : `Step ${s.step}/5`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Energy</span>
                    <p className="text-gray-700 mt-0.5">{s.energyRating}/10</p>
                  </div>
                  {s.patternNote && (
                    <div className="col-span-2">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Pattern</span>
                      <p className="text-gray-700 mt-0.5 line-clamp-2">{s.patternNote}</p>
                    </div>
                  )}
                </div>

                {s.microAction && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Micro-Action</span>
                    <p className="text-sm text-gray-700 mt-0.5 flex items-start gap-1">
                      <span className="text-green-500 flex-shrink-0">→</span>
                      {s.microAction}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
