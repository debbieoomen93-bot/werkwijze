'use client'

import { useEffect, useReducer, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/lib/translations'
import { storage } from '@/lib/storage'
import type { Question, WizardAnswers } from '@/lib/types'
import ProgressBar from '@/components/ProgressBar'
import QuestionCard from '@/components/QuestionCard'
import {
  BLOCK_A_QUESTIONS,
  BLOCK_C_QUESTIONS,
  BLOCK_D_QUESTIONS,
  BLOCK_E_QUESTIONS,
  BLOCK_F_QUESTIONS,
  BLOCK_G_QUESTIONS,
  BLOCK_DEFINITIONS,
} from '@/lib/questions'

type BlockColor = 'rose' | 'peach' | 'sky' | 'sage'

interface WizardState {
  allQuestions: Question[]
  currentIndex: number
  answers: WizardAnswers
  loadingBlock: boolean
  blockBGenerated: boolean
}

type WizardAction =
  | { type: 'SET_ANSWER'; id: string; value: string | string[] | null }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SET_LOADING'; v: boolean }
  | { type: 'ADD_BLOCK_B'; questions: Question[] }
  | { type: 'SKIP_BLOCK_B' }

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_ANSWER':
      return { ...state, answers: { ...state.answers, [action.id]: action.value } }
    case 'NEXT':
      return { ...state, currentIndex: Math.min(state.currentIndex + 1, state.allQuestions.length - 1) }
    case 'PREV':
      return { ...state, currentIndex: Math.max(state.currentIndex - 1, 0) }
    case 'SET_LOADING':
      return { ...state, loadingBlock: action.v }
    case 'ADD_BLOCK_B':
      return {
        ...state,
        allQuestions: [
          ...state.allQuestions.slice(0, 4),
          ...action.questions,
          ...state.allQuestions.slice(4),
        ],
        blockBGenerated: true,
        loadingBlock: false,
        currentIndex: 4, // auto-advance past A4
      }
    case 'SKIP_BLOCK_B':
      return {
        ...state,
        blockBGenerated: true,
        loadingBlock: false,
        currentIndex: state.currentIndex + 1,
      }
    default:
      return state
  }
}

const STATIC_QUESTIONS: Question[] = [
  ...BLOCK_A_QUESTIONS,
  ...BLOCK_C_QUESTIONS,
  ...BLOCK_D_QUESTIONS,
  ...BLOCK_E_QUESTIONS,
  ...BLOCK_F_QUESTIONS,
  ...BLOCK_G_QUESTIONS,
]

function getBlockColor(blockId: string): BlockColor {
  const def = BLOCK_DEFINITIONS.find((b) => b.id === blockId)
  return def?.color ?? 'rose'
}

function getBlockName(blockId: string, lang: 'nl' | 'en'): string {
  const def = BLOCK_DEFINITIONS.find((b) => b.id === blockId)
  if (!def) return blockId
  return lang === 'nl' ? def.name_nl : def.name_en
}

export default function WizardPage() {
  const { lang } = useLanguage()
  const router = useRouter()
  const tr = translations.wizard

  const [state, dispatch] = useReducer(reducer, {
    allQuestions: STATIC_QUESTIONS,
    currentIndex: 0,
    answers: storage.getAnswers(),
    loadingBlock: false,
    blockBGenerated: false,
  })

  const currentQ = state.allQuestions[state.currentIndex]
  const currentValue = state.answers[currentQ?.id] ?? null
  const isLastQuestion = state.currentIndex === state.allQuestions.length - 1

  const totalQuestions = state.allQuestions.length
  const pct = Math.round(((state.currentIndex + 1) / totalQuestions) * 100)
  const blockId = currentQ?.block ?? 'A'
  const blockColor = getBlockColor(blockId)
  const blockName = getBlockName(blockId, lang)

  async function fetchBlockB() {
    dispatch({ type: 'SET_LOADING', v: true })
    try {
      const res = await fetch('/api/next-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: state.answers['A3'],
          answers_so_far: state.answers,
          language: lang,
        }),
      })
      const data = await res.json()
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        const mapped: Question[] = data.questions.map((q: {
          id: string
          emoji?: string
          question_nl: string
          question_en: string
          type: string
          options_nl?: string[]
          options_en?: string[]
          skippable?: boolean
          placeholder_nl?: string
          placeholder_en?: string
        }) => ({
          id: q.id,
          block: 'B',
          emoji: q.emoji,
          question_nl: q.question_nl,
          question_en: q.question_en,
          type: q.type as Question['type'],
          options_nl: q.options_nl ?? undefined,
          options_en: q.options_en ?? undefined,
          skippable: q.skippable ?? false,
          placeholder_nl: q.placeholder_nl ?? undefined,
          placeholder_en: q.placeholder_en ?? undefined,
        }))
        dispatch({ type: 'ADD_BLOCK_B', questions: mapped })
      } else {
        // No questions returned — skip Block B and continue
        dispatch({ type: 'SKIP_BLOCK_B' })
      }
    } catch {
      // API unavailable or key missing — skip Block B and continue
      dispatch({ type: 'SKIP_BLOCK_B' })
    }
  }

  function handleNext() {
    const isEndOfBlockA = currentQ?.id === 'A4' && !state.blockBGenerated
    storage.setAnswers(state.answers)
    if (isEndOfBlockA) {
      fetchBlockB()
      return
    }
    dispatch({ type: 'NEXT' })
  }

  function handleFinish() {
    storage.setAnswers(state.answers)
    router.push('/loading')
  }

  function handleAnswer(v: string | string[] | null) {
    dispatch({ type: 'SET_ANSWER', id: currentQ.id, value: v })
  }

  const canProceed = () => {
    if (!currentQ) return false
    if (currentQ.skippable) return true
    const val = currentValue
    if (Array.isArray(val)) return val.length > 0
    if (typeof val === 'string') return val.trim().length > 0
    return val !== null && val !== undefined
  }

  if (!currentQ) return null

  if (state.loadingBlock) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div
          className="text-center rounded-2xl p-8 max-w-sm w-full"
          style={{ background: 'var(--card)', boxShadow: '0 4px 24px rgba(30,26,46,0.1)' }}
        >
          <div className="flex justify-center gap-3 mb-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  background: 'var(--rose)',
                  animation: `bounce-dot 1.4s ease infinite`,
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
            {tr.personalising[lang]}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center px-4 py-8 pb-24">
      <div className="w-full max-w-[660px]">
        <div className="mb-6">
          <ProgressBar blockName={blockName} percentage={pct} color={blockColor} />
        </div>

        <div className="mb-4 text-right">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {state.currentIndex + 1} {tr.question_of[lang]} {totalQuestions}
          </span>
        </div>

        <QuestionCard
          key={currentQ.id}
          question={currentQ}
          value={currentValue as string | string[] | null}
          onChange={handleAnswer}
          lang={lang}
          blockColor={blockColor}
        />

        {currentQ.type === 'multi_select' && currentQ.max_select && (
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--muted)' }}>
            {tr.max_select[lang]} {currentQ.max_select} —{' '}
            {Array.isArray(currentValue) ? currentValue.length : 0} {tr.options_selected[lang]}
          </p>
        )}
      </div>

      {/* Sticky bottom nav */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 py-4 flex gap-3"
        style={{
          background: 'rgba(240,235,248,0.92)',
          backdropFilter: 'blur(12px)',
          borderTop: '1.5px solid var(--line)',
        }}
      >
        <div className="max-w-[660px] mx-auto w-full flex gap-3">
          {state.currentIndex > 0 && (
            <button
              onClick={() => dispatch({ type: 'PREV' })}
              className="flex-1 sm:flex-none text-sm font-semibold px-5 py-3 rounded-xl border min-h-[44px]"
              style={{ borderColor: 'var(--line)', color: 'var(--muted)', background: 'transparent' }}
            >
              {tr.back[lang]}
            </button>
          )}

          {currentQ.skippable && (
            <button
              onClick={() => isLastQuestion ? handleFinish() : dispatch({ type: 'NEXT' })}
              className="text-sm font-medium px-4 py-3 rounded-xl min-h-[44px]"
              style={{ color: 'var(--muted)', background: 'transparent' }}
            >
              {tr.skip[lang]}
            </button>
          )}

          {isLastQuestion ? (
            <button
              onClick={handleFinish}
              disabled={!canProceed()}
              className="flex-1 text-sm font-bold px-6 py-3 rounded-xl min-h-[44px] transition-all"
              style={{
                background: canProceed() ? 'var(--sage)' : 'var(--line)',
                color: canProceed() ? '#fff' : 'var(--muted)',
              }}
            >
              {tr.start_analysis[lang]}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 text-sm font-bold px-6 py-3 rounded-xl min-h-[44px] transition-all"
              style={{
                background: canProceed() ? 'var(--rose)' : 'var(--line)',
                color: canProceed() ? '#fff' : 'var(--muted)',
              }}
            >
              {tr.next[lang]}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
