import { NextRequest, NextResponse } from 'next/server'
import { readSessions, writeSessions } from '@/lib/storage'
import { ReflectionSession } from '@/types'

export async function GET() {
  const sessions = readSessions()
  return NextResponse.json(sessions)
}

export async function POST(request: NextRequest) {
  const body = await request.json() as Partial<ReflectionSession>
  const sessions = readSessions()
  
  const now = new Date().toISOString()
  
  if (body.id) {
    const idx = sessions.findIndex(s => s.id === body.id)
    if (idx !== -1) {
      sessions[idx] = { ...sessions[idx], ...body }
      writeSessions(sessions)
      return NextResponse.json(sessions[idx])
    }
  }
  
  const newSession: ReflectionSession = {
    id: `session_${Date.now()}`,
    userId: 'default',
    timestamp: now,
    step: 1,
    entryText: '',
    energyRating: 5,
    activeTiltDimension: null,
    patternNote: '',
    microAction: '',
    summary: '',
    completed: false,
    messages: [],
    ...body,
  }
  
  sessions.push(newSession)
  writeSessions(sessions)
  return NextResponse.json(newSession, { status: 201 })
}
