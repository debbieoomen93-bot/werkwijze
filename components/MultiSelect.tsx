'use client'

import OptionButton from './OptionButton'

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

export default function MultiSelect({ options, value, onChange, maxSelect }: Props) {
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
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <OptionButton
          key={opt.value}
          label={opt.label}
          emoji={opt.emoji}
          selected={value.includes(opt.value)}
          onClick={() => toggle(opt.value)}
          disabled={atMax}
        />
      ))}
    </div>
  )
}
