'use client'

import { useEffect, useState } from 'react'
import type { Question, Language } from '@/lib/types'
import OptionButton from './OptionButton'
import SliderQuestion from './SliderQuestion'
import MultiSelect from './MultiSelect'
import ChipSelect from './ChipSelect'
import OpenTextQuestion from './OpenTextQuestion'

interface Props {
  question: Question
  value: string | string[] | null
  onChange: (v: string | string[] | null) => void
  lang: Language
  blockColor?: 'rose' | 'peach' | 'sky' | 'sage'
}

const blockColorMap = {
  rose: 'var(--rose)',
  peach: 'var(--peach)',
  sky: 'var(--sky)',
  sage: 'var(--sage)',
}

const blockBgMap = {
  rose: 'var(--rose-pale)',
  peach: 'var(--peach-pale)',
  sky: 'var(--sky-light)',
  sage: 'var(--sage-pale)',
}

export default function QuestionCard({ question, value, onChange, lang, blockColor = 'rose' }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(t)
  }, [question.id])

  const questionText = lang === 'nl' ? question.question_nl : question.question_en
  const hintText = lang === 'nl' ? question.hint_nl : question.hint_en
  const placeholderText = lang === 'nl' ? question.placeholder_nl : question.placeholder_en
  const c = blockColorMap[blockColor]
  const bg = blockBgMap[blockColor]

  const buildOptions = () => {
    if (question.options) {
      return question.options.map((o) => ({
        value: o.value,
        label: lang === 'nl' ? o.label_nl : o.label_en,
        emoji: o.emoji,
      }))
    }
    if (question.options_nl && question.options_en) {
      const list = lang === 'nl' ? question.options_nl : question.options_en
      return list.map((l, i) => ({ value: String(i), label: l, emoji: undefined as string | undefined }))
    }
    return []
  }

  return (
    <div
      className="w-full rounded-2xl p-6 sm:p-8 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        background: 'var(--card)',
        boxShadow: '0 2px 16px rgba(30,26,46,0.08)',
      }}
    >
      <div className="flex items-start gap-3 mb-5">
        {question.emoji && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: bg }}
          >
            {question.emoji}
          </div>
        )}
        <div>
          <h2 className="text-lg sm:text-xl font-heading font-bold leading-snug" style={{ color: 'var(--ink)' }}>
            {questionText}
          </h2>
          {hintText && (
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              {hintText}
            </p>
          )}
        </div>
      </div>

      {question.type === 'single_select' && (
        <div className="flex flex-col gap-2">
          {buildOptions().map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              emoji={opt.emoji}
              selected={value === opt.value}
              onClick={() => onChange(value === opt.value ? null : opt.value)}
            />
          ))}
        </div>
      )}

      {question.type === 'multi_select' && (
        <MultiSelect
          options={buildOptions()}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          maxSelect={question.max_select}
        />
      )}

      {question.type === 'chip_select' && (
        <ChipSelect
          options={buildOptions()}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          maxSelect={question.max_select}
        />
      )}

      {question.type === 'slider' && (
        <SliderQuestion
          points={buildOptions().map((o) => ({
            value: o.value,
            label: o.label,
            emoji: o.emoji || '●',
          }))}
          value={typeof value === 'string' ? value : null}
          onChange={(v) => onChange(v)}
        />
      )}

      {question.type === 'open_text' && (
        <OpenTextQuestion
          value={typeof value === 'string' ? value : ''}
          onChange={(v) => onChange(v)}
          placeholder={placeholderText}
          large={question.id === 'F1' || question.id === 'F3' || question.id === 'G3'}
          tipBox={
            question.id === 'G3'
              ? lang === 'nl'
                ? '💡 Schrijf minstens 3-4 zinnen. Hoe meer context, hoe specifieker de matches.'
                : '💡 Write at least 3-4 sentences. More context means more specific matches.'
              : undefined
          }
        />
      )}
    </div>
  )
}
