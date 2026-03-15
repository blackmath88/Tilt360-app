'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SessionChat from '@/components/SessionChat'
import { ReflectionSession } from '@/types'

export default function SessionContent() {
  const router = useRouter()
  const [session, setSession] = useState<ReflectionSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function createSession() {
      try {
        const res = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
        const newSession = await res.json() as ReflectionSession
        setSession(newSession)
      } finally {
        setIsLoading(false)
      }
    }
    createSession()
  }, [])

  async function handleUpdate(updates: Partial<ReflectionSession>) {
    if (!session) return
    const updated = { ...session, ...updates }
    setSession(updated)

    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }

  function handleComplete() {
    router.push('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Preparing your session...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Failed to create session. Please try again.</p>
      </div>
    )
  }

  return <SessionChat session={session} onUpdate={handleUpdate} onComplete={handleComplete} />
}
