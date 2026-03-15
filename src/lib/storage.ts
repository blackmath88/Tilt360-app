import fs from 'fs'
import path from 'path'
import { ReflectionSession, TiltDimension, PatternSummary } from '@/types'

const DATA_FILE = path.join(process.cwd(), 'data', 'sessions.json')

export function readSessions(): ReflectionSession[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
      fs.writeFileSync(DATA_FILE, '[]')
      return []
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw) as ReflectionSession[]
  } catch {
    return []
  }
}

export function writeSessions(sessions: ReflectionSession[]): void {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(sessions, null, 2))
}

function calculateStreak(sessions: ReflectionSession[]): number {
  const completed = sessions
    .filter(s => s.completed)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  if (completed.length === 0) return 0

  let streak = 1
  let lastDate = new Date(completed[0].timestamp)
  lastDate.setHours(0, 0, 0, 0)

  for (let i = 1; i < completed.length; i++) {
    const sessionDate = new Date(completed[i].timestamp)
    sessionDate.setHours(0, 0, 0, 0)
    const diffDays = (lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
    if (diffDays <= 1) {
      streak++
      lastDate = sessionDate
    } else {
      break
    }
  }

  return streak
}

export function getPatternSummary(): PatternSummary {
  const sessions = readSessions()
  const completed = sessions.filter(s => s.completed)

  const dimensionCounts: Record<TiltDimension, number> = {
    resilience: 0,
    humanity: 0,
    courage: 0,
    wisdom: 0,
  }

  let totalEnergy = 0
  const recentMicroActions: string[] = []

  for (const session of completed) {
    if (session.activeTiltDimension) {
      dimensionCounts[session.activeTiltDimension]++
    }
    totalEnergy += session.energyRating
    if (session.microAction) {
      recentMicroActions.push(session.microAction)
    }
  }

  return {
    totalSessions: sessions.length,
    completedSessions: completed.length,
    dimensionCounts,
    averageEnergy: completed.length > 0 ? totalEnergy / completed.length : 0,
    recentMicroActions: recentMicroActions.slice(-5).reverse(),
    streak: calculateStreak(sessions),
  }
}
