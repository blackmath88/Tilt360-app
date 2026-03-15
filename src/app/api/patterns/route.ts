import { NextResponse } from 'next/server'
import { getPatternSummary } from '@/lib/storage'

export async function GET() {
  const summary = getPatternSummary()
  return NextResponse.json(summary)
}
