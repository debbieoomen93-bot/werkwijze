'use client'

interface SliderPoint {
  value: string
  label: string
  emoji: string
}

interface Props {
  points: SliderPoint[]
  value: string | null
  onChange: (v: string) => void
}

export default function SliderQuestion({ points, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 sm:flex-nowrap">
      {points.map((p) => {
        const selected = value === p.value
        return (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            className="flex-1 min-w-[80px] sm:min-w-0 flex flex-col items-center gap-2 px-3 py-4 rounded-xl border transition-all min-h-[88px] text-center"
            style={{
              background: selected ? 'var(--rose-pale)' : 'var(--card)',
              borderColor: selected ? 'var(--rose)' : 'var(--line)',
              color: selected ? 'var(--rose)' : 'var(--ink)',
              boxShadow: selected ? '0 0 0 1.5px var(--rose)' : 'none',
            }}
          >
            <span className="text-2xl leading-none">{p.emoji}</span>
            <span
              className="text-xs leading-snug font-medium"
              style={{ color: selected ? 'var(--rose)' : 'var(--muted)' }}
            >
              {p.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
