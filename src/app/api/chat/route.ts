import { NextRequest, NextResponse } from 'next/server'
import { Message, TiltDimension } from '@/types'

const DIMENSION_CONTEXT: Record<TiltDimension, string> = {
  resilience: "Resilience (water/lake metaphor) - stability, recovery, grounding, staying present under pressure",
  humanity: "Humanity (forest/social metaphor) - connection, empathy, belonging, caring for others",
  courage: "Courage (arena/mountain metaphor) - boldness, action, speaking truth, taking risk",
  wisdom: "Wisdom (observatory/high ground metaphor) - insight, clarity, perspective, learning from patterns",
}

const SYSTEM_PROMPT = `You are a reflective companion for the Tilt Journey Platform. Your role is to support short guided reflection sessions (~7 minutes) helping users learn from real work situations.

Guidelines:
- You are NOT a coach or therapist. You are a reflection companion.
- Use curious, open, non-judgmental questions.
- Keep responses concise (2-4 sentences max).
- Reference the Tilt dimension when relevant.
- Encourage specificity and insight, not advice.
- Language should feel psychologically safe.
- Ask one focused question at a time.
- Never diagnose, prescribe, or give direct advice.`

const FALLBACK_RESPONSES: Record<number, string[]> = {
  1: [
    "Thank you for checking in. It sounds like you're bringing some thoughtful energy to this reflection. What feels most alive for you right now?",
    "I appreciate you sharing where you're at. Noticing your energy is a great starting point. What's been occupying your attention lately?",
  ],
  2: [
    "That's an interesting situation to reflect on. What part of it feels most significant to you?",
    "Thank you for sharing that. As you describe it, what stands out most about how you showed up in that moment?",
  ],
  3: [
    "Connecting your experience to a Tilt dimension is a powerful practice. What does that connection reveal to you?",
    "Interesting choice. How did you notice that dimension showing up in the situation you described?",
  ],
  4: [
    "Noticing patterns is one of the most valuable things we can do. What feels true about this pattern for you?",
    "Patterns often hold important information. What do you make of this one?",
  ],
  5: [
    "A small, specific action can make a real difference. What would make this micro-action feel doable?",
    "Great reflection. What support or conditions would help you follow through on this?",
  ],
}

function getFallbackResponse(step: number): string {
  const responses = FALLBACK_RESPONSES[step] ?? FALLBACK_RESPONSES[4]
  return responses[Math.floor(Math.random() * responses.length)]
}

interface ChatRequestBody {
  messages: Message[]
  sessionContext: {
    step: number
    energyRating: number
    activeTiltDimension: TiltDimension | null
    entryText: string
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json() as ChatRequestBody
  const { messages, sessionContext } = body

  if (!process.env.OPENAI_API_KEY) {
    const fallback = getFallbackResponse(sessionContext.step)
    return NextResponse.json({ content: fallback })
  }

  try {
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const dimensionContext = sessionContext.activeTiltDimension
      ? `\nActive Tilt Dimension: ${DIMENSION_CONTEXT[sessionContext.activeTiltDimension]}`
      : ''

    const contextualSystem = `${SYSTEM_PROMPT}${dimensionContext}
Current session step: ${sessionContext.step}/5
User's energy rating: ${sessionContext.energyRating}/10`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: contextualSystem },
        ...messages,
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content ?? getFallbackResponse(sessionContext.step)
    return NextResponse.json({ content })
  } catch {
    const fallback = getFallbackResponse(sessionContext.step)
    return NextResponse.json({ content: fallback })
  }
}
