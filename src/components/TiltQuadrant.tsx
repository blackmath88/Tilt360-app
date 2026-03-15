'use client'

import { TiltDimension } from '@/types'

interface TiltQuadrantProps {
  dimensionCounts: Record<TiltDimension, number>
  activeDimension?: TiltDimension | null
  onSelect?: (dim: TiltDimension) => void
}

const DIMENSIONS = [
  { key: 'resilience' as TiltDimension, label: 'Resilience', color: '#3B82F6', lightColor: '#DBEAFE', metaphor: 'Water & Lake', position: 'top-left' },
  { key: 'wisdom' as TiltDimension, label: 'Wisdom', color: '#8B5CF6', lightColor: '#EDE9FE', metaphor: 'Observatory', position: 'top-right' },
  { key: 'humanity' as TiltDimension, label: 'Humanity', color: '#10B981', lightColor: '#D1FAE5', metaphor: 'Forest & Community', position: 'bottom-left' },
  { key: 'courage' as TiltDimension, label: 'Courage', color: '#F59E0B', lightColor: '#FEF3C7', metaphor: 'Arena & Mountain', position: 'bottom-right' },
]

export default function TiltQuadrant({ dimensionCounts, activeDimension, onSelect }: TiltQuadrantProps) {
  const total = Object.values(dimensionCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="w-full max-w-md mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-auto">
        {DIMENSIONS.map((dim, i) => {
          const x = i % 2 === 0 ? 0 : 155
          const y = i < 2 ? 0 : 155
          const isActive = activeDimension === dim.key
          const count = dimensionCounts[dim.key]
          const size = total > 0 ? 30 + (count / total) * 40 : 30

          return (
            <g key={dim.key} onClick={() => onSelect?.(dim.key)} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
              <rect
                x={x + 2}
                y={y + 2}
                width={143}
                height={143}
                rx={8}
                fill={isActive ? dim.color : dim.lightColor}
                opacity={isActive ? 0.9 : 0.7}
                stroke={isActive ? dim.color : '#E5E7EB'}
                strokeWidth={isActive ? 2 : 1}
              />
              <circle
                cx={x + 72}
                cy={y + 72}
                r={size / 2}
                fill={dim.color}
                opacity={0.3}
              />
              <text
                x={x + 72}
                y={y + 55}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill={isActive ? 'white' : '#374151'}
              >
                {dim.label}
              </text>
              <text
                x={x + 72}
                y={y + 72}
                textAnchor="middle"
                fontSize="10"
                fill={isActive ? 'white' : '#6B7280'}
              >
                {dim.metaphor}
              </text>
              <text
                x={x + 72}
                y={y + 90}
                textAnchor="middle"
                fontSize="16"
                fontWeight="700"
                fill={isActive ? 'white' : dim.color}
              >
                {count}
              </text>
            </g>
          )
        })}
        <circle cx={150} cy={150} r={12} fill="white" stroke="#E5E7EB" strokeWidth={1} />
        <text x={150} y={154} textAnchor="middle" fontSize="8" fill="#9CA3AF">TILT</text>
      </svg>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {DIMENSIONS.map(dim => (
          <button
            key={dim.key}
            onClick={() => onSelect?.(dim.key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
              activeDimension === dim.key
                ? 'ring-2 ring-offset-1'
                : 'hover:bg-gray-50'
            }`}
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: dim.color }}
            />
            <span className="font-medium text-gray-700">{dim.label}</span>
            <span className="ml-auto text-gray-500">{dimensionCounts[dim.key]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
