'use client'

interface ProgressBarProps {
  blockName: string
  percentage: number
  color?: 'rose' | 'peach' | 'sky' | 'sage'
}

const colorMap = {
  rose: 'var(--rose)',
  peach: 'var(--peach)',
  sky: 'var(--sky)',
  sage: 'var(--sage)',
}

export default function ProgressBar({ blockName, percentage, color = 'rose' }: ProgressBarProps) {
  const c = colorMap[color]

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: c + '22', color: c, fontSize: '11px' }}
        >
          {blockName}
        </span>
        <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
          {percentage}%
        </span>
      </div>
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--line)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%`, background: c }}
        />
      </div>
    </div>
  )
}
