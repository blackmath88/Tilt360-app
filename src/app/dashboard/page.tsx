import Link from 'next/link'
import TiltQuadrant from '@/components/TiltQuadrant'
import { readSessions, getPatternSummary } from '@/lib/storage'

export default async function Dashboard() {
  const patterns = getPatternSummary()
  const allSessions = readSessions()
  const sessions = allSessions.slice(-5).reverse()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Your Tilt Journey</h1>
            <p className="text-sm text-gray-500">Dashboard overview</p>
          </div>
          <div className="flex gap-2">
            <Link href="/history" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              History
            </Link>
            <Link href="/session" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium">
              New Session →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Sessions', value: patterns.totalSessions },
            { label: 'Completed', value: patterns.completedSessions },
            { label: 'Avg Energy', value: patterns.averageEnergy > 0 ? patterns.averageEnergy.toFixed(1) : '—' },
            { label: 'Day Streak', value: patterns.streak },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tilt Dimension Activity</h2>
            <TiltQuadrant dimensionCounts={patterns.dimensionCounts} />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Micro-Actions</h2>
              {patterns.recentMicroActions.length > 0 ? (
                <ul className="space-y-2">
                  {patterns.recentMicroActions.map((action, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span className="text-green-500 flex-shrink-0">→</span>
                      {action}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">Complete sessions to see your micro-actions here.</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Sessions</h2>
              {sessions.length > 0 ? (
                <ul className="space-y-3">
                  {sessions.map(s => (
                    <li key={s.id} className="text-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600">{new Date(s.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <div className="flex gap-1">
                          {s.activeTiltDimension && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs capitalize">{s.activeTiltDimension}</span>
                          )}
                          {s.completed && (
                            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs">done</span>
                          )}
                        </div>
                      </div>
                      {s.summary && <p className="text-gray-400 text-xs mt-1 truncate">{s.summary}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No sessions yet. Start your first reflection!</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
