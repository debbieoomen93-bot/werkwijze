'use client'

interface Props {
  label: string
  emoji?: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
}

export default function OptionButton({ label, emoji, selected, onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled && !selected}
      className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all min-h-[52px] font-medium text-sm"
      style={{
        background: selected ? 'var(--rose-pale)' : 'var(--card)',
        borderColor: selected ? 'var(--rose)' : 'var(--line)',
        color: selected ? 'var(--rose)' : 'var(--ink)',
        fontWeight: selected ? 600 : 400,
        boxShadow: selected ? '0 0 0 1.5px var(--rose)' : 'none',
        opacity: disabled && !selected ? 0.45 : 1,
      }}
    >
      {emoji && <span className="text-lg leading-none flex-shrink-0">{emoji}</span>}
      <span>{label}</span>
      {selected && (
        <span className="ml-auto text-base leading-none" style={{ color: 'var(--rose)' }}>
          ✓
        </span>
      )}
    </button>
  )
}
