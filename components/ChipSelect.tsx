'use client'

interface Option {
  value: string
  label: string
  emoji?: string
}

interface Props {
  options: Option[]
  value: string[]
  onChange: (v: string[]) => void
  maxSelect?: number
}

export default function ChipSelect({ options, value, onChange, maxSelect }: Props) {
  function toggle(v: string) {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v))
    } else {
      if (maxSelect && value.length >= maxSelect) return
      onChange([...value, v])
    }
  }

  const atMax = !!maxSelect && value.length >= maxSelect

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const sel = value.includes(opt.value)
        const disabled = atMax && !sel
        return (
          <button
            key={opt.value}
            onClick={() => !disabled && toggle(opt.value)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border transition-all min-h-[40px]"
            style={{
              background: sel ? 'var(--rose-pale)' : 'var(--card)',
              borderColor: sel ? 'var(--rose)' : 'var(--line)',
              color: sel ? 'var(--rose)' : disabled ? 'var(--muted)' : 'var(--ink)',
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'default' : 'pointer',
            }}
          >
            {opt.emoji && <span>{opt.emoji}</span>}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
