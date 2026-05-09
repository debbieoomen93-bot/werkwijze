'use client'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  large?: boolean
  tipBox?: string
}

export default function OpenTextQuestion({ value, onChange, placeholder, hint, large, tipBox }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {hint && (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {hint}
        </p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={large ? 5 : 3}
        className="w-full rounded-xl px-4 py-3 text-sm leading-relaxed resize-none outline-none transition-all border"
        style={{
          background: 'var(--card)',
          border: '1.5px solid var(--line)',
          color: 'var(--ink)',
          fontFamily: 'var(--font-mulish)',
          fontSize: '15px',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--rose)'
          e.currentTarget.style.boxShadow = '0 0 0 3px var(--rose-pale)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--line)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
      {tipBox && (
        <div
          className="text-sm px-4 py-3 rounded-xl"
          style={{
            background: 'var(--sage-pale)',
            color: 'var(--sage)',
            border: '1px solid var(--sage-light)',
          }}
        >
          {tipBox}
        </div>
      )}
    </div>
  )
}
