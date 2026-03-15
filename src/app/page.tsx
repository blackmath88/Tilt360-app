import Link from 'next/link'

const DIMENSIONS = [
  { label: 'Resilience', color: 'bg-blue-50 border-blue-200', icon: '💧', desc: 'Stability & Recovery' },
  { label: 'Humanity', color: 'bg-green-50 border-green-200', icon: '🌿', desc: 'Connection & Empathy' },
  { label: 'Courage', color: 'bg-orange-50 border-orange-200', icon: '⛰️', desc: 'Boldness & Action' },
  { label: 'Wisdom', color: 'bg-purple-50 border-purple-200', icon: '🔭', desc: 'Insight & Clarity' },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span>✦</span> Tilt Journey Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Reflect. Learn. Grow.
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            Short, guided reflection sessions (~7 minutes) that help you learn from real work situations and act on your Tilt knowledge over time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/session"
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              Start Reflecting →
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-white text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">How a session works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { step: '1', label: 'Check-in', desc: 'Rate your energy and mood' },
              { step: '2', label: 'Situation', desc: 'Share what happened' },
              { step: '3', label: 'Tilt Lens', desc: 'Choose a dimension' },
              { step: '4', label: 'Pattern', desc: 'Notice what recurs' },
              { step: '5', label: 'Micro-Action', desc: 'Commit to one step' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-2">
                  {s.step}
                </div>
                <div className="font-semibold text-gray-700 text-sm">{s.label}</div>
                <div className="text-gray-400 text-xs mt-1">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">The Four Tilt Dimensions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {DIMENSIONS.map(d => (
              <div key={d.label} className={`p-4 rounded-xl border-2 ${d.color} text-center`}>
                <div className="text-3xl mb-2">{d.icon}</div>
                <div className="font-semibold text-gray-800">{d.label}</div>
                <div className="text-xs text-gray-500 mt-1">{d.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16 text-sm text-gray-400">
          A reflective companion — not a coach or therapist. Just a space to think.
        </div>
      </div>
    </main>
  )
}
