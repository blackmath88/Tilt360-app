'use client'

import { useState, useRef, useEffect } from 'react'
import { Message, TiltDimension, ReflectionSession } from '@/types'

interface SessionChatProps {
  session: ReflectionSession
  onUpdate: (updates: Partial<ReflectionSession>) => void
  onComplete: () => void
}

const STEPS = [
  { number: 1, label: 'Check-in', description: 'How are you?' },
  { number: 2, label: 'Situation', description: 'What happened?' },
  { number: 3, label: 'Tilt Lens', description: 'Which dimension?' },
  { number: 4, label: 'Pattern', description: 'What do you notice?' },
  { number: 5, label: 'Action', description: 'What follows?' },
]

const DIMENSIONS: Array<{ key: TiltDimension; label: string; color: string; emoji: string }> = [
  { key: 'resilience', label: 'Resilience', color: 'bg-blue-100 border-blue-300 text-blue-800', emoji: '💧' },
  { key: 'humanity', label: 'Humanity', color: 'bg-green-100 border-green-300 text-green-800', emoji: '🌿' },
  { key: 'courage', label: 'Courage', color: 'bg-orange-100 border-orange-300 text-orange-800', emoji: '⛰️' },
  { key: 'wisdom', label: 'Wisdom', color: 'bg-purple-100 border-purple-300 text-purple-800', emoji: '🔭' },
]

const STEP_PROMPTS: Record<number, string> = {
  1: "Welcome to your reflection session. How are you showing up right now? Use the slider to rate your energy (1 = depleted, 10 = energized), then share a word or two about how you're feeling.",
  2: "Thanks for checking in. What's one situation from your recent work that felt meaningful, challenging, or worth exploring?",
  3: "As you think about that situation, which Tilt dimension felt most active for you?",
  4: "Looking at this through a Tilt lens — what pattern do you notice? This might be something about how you typically respond, what you tend to prioritize, or something recurring.",
  5: "Given what you've reflected on, what's one small action that feels meaningful to take? Something specific and doable within the next few days.",
}

export default function SessionChat({ session, onUpdate, onComplete }: SessionChatProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [localEnergy, setLocalEnergy] = useState(session.energyRating)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session.messages])

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    if (session.messages.length === 0) {
      onUpdate({
        messages: [{ role: 'assistant', content: STEP_PROMPTS[1] }],
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getAIResponse(messages: Message[], context: ReflectionSession) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        sessionContext: {
          step: context.step,
          energyRating: context.energyRating,
          activeTiltDimension: context.activeTiltDimension,
          entryText: context.entryText,
        },
      }),
    })
    const data = await res.json() as { content: string }
    return data.content
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const updatedMessages = [...session.messages, userMessage]
    
    let updates: Partial<ReflectionSession> = { messages: updatedMessages }

    if (session.step === 1) {
      updates = { ...updates, entryText: input.trim(), energyRating: localEnergy }
    } else if (session.step === 2) {
      updates = { ...updates, entryText: (session.entryText ? session.entryText + '\n' : '') + input.trim() }
    } else if (session.step === 4) {
      updates = { ...updates, patternNote: input.trim() }
    } else if (session.step === 5) {
      updates = { ...updates, microAction: input.trim() }
    }

    onUpdate(updates)
    setInput('')
    setIsLoading(true)

    try {
      const nextStep = session.step + 1

      if (session.step === 5) {
        const aiResponse = await getAIResponse(updatedMessages, { ...session, ...updates })
        const completionMessage: Message = {
          role: 'assistant',
          content: aiResponse + "\n\n✨ You've completed this reflection session. Well done for taking the time to reflect.",
        }
        onUpdate({
          ...updates,
          messages: [...updatedMessages, completionMessage],
          completed: true,
          summary: `Energy: ${updates.energyRating ?? session.energyRating}/10 | Dimension: ${session.activeTiltDimension ?? 'Not set'} | Action: ${input.trim()}`,
        })
        setTimeout(onComplete, 2000)
      } else {
        const aiResponse = await getAIResponse(updatedMessages, { ...session, ...updates })
        const assistantMessage: Message = { role: 'assistant', content: aiResponse }
        const stepPrompt: Message = { role: 'assistant', content: STEP_PROMPTS[nextStep] }
        
        onUpdate({
          ...updates,
          step: nextStep,
          messages: [...updatedMessages, assistantMessage, stepPrompt],
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  function handleDimensionSelect(dim: TiltDimension) {
    if (session.step !== 3) return
    
    const userMessage: Message = { role: 'user', content: `I'm focusing on ${dim.charAt(0).toUpperCase() + dim.slice(1)}` }
    const updatedMessages = [...session.messages, userMessage]
    
    onUpdate({
      activeTiltDimension: dim,
      messages: updatedMessages,
      step: 4,
    })

    setIsLoading(true)
    getAIResponse(updatedMessages, { ...session, activeTiltDimension: dim, step: 4 })
      .then(aiResponse => {
        const assistantMessage: Message = { role: 'assistant', content: aiResponse }
        const stepPrompt: Message = { role: 'assistant', content: STEP_PROMPTS[4] }
        onUpdate({
          activeTiltDimension: dim,
          step: 4,
          messages: [...updatedMessages, assistantMessage, stepPrompt],
        })
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="flex items-center gap-1 p-4 bg-white border-b">
        {STEPS.map((step) => (
          <div key={step.number} className="flex items-center gap-1 flex-1">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
              step.number < session.step
                ? 'bg-green-500 text-white'
                : step.number === session.step
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {step.number < session.step ? '✓' : step.number}
            </div>
            <span className={`text-xs hidden sm:block ${
              step.number === session.step ? 'text-blue-600 font-medium' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
            {step.number < 5 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {session.messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-white text-gray-700 shadow-sm rounded-bl-sm border border-gray-100'
            }`}>
              {msg.content.split('\n').map((line, j) => (
                <p key={j} className={j > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
        {session.step === 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energy level: <span className="text-blue-600 font-bold">{localEnergy}/10</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={localEnergy}
              onChange={e => setLocalEnergy(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Depleted</span>
              <span>Energized</span>
            </div>
          </div>
        )}

        {session.step === 3 && !session.activeTiltDimension && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {DIMENSIONS.map(dim => (
              <button
                key={dim.key}
                onClick={() => handleDimensionSelect(dim.key)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all hover:opacity-90 ${dim.color}`}
              >
                {dim.emoji} {dim.label}
              </button>
            ))}
          </div>
        )}

        {!(session.step === 3 && !session.activeTiltDimension) && !session.completed && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Share your reflection..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              →
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
