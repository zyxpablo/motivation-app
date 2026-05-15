import { useState, useEffect } from 'react'
import Icon from './Icon'

const DEFAULT_ROUTINE = [
  { id: 'water', label: 'Boire un verre d\'eau', done: false },
  { id: 'stretch', label: 'Étirements pendant 5 minutes', done: false },
  { id: 'meditate', label: 'Méditation ou respiration consciente', done: false },
  { id: 'priorities', label: 'Définir les 3 priorités du jour', done: false },
  { id: 'gratitude', label: 'Noter une gratitude', done: false },
]

export default function MorningRoutine() {
  const [routine, setRoutine] = useState(DEFAULT_ROUTINE)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const saved = localStorage.getItem(`morning-${today}`)
    if (saved) {
      try { setRoutine(JSON.parse(saved)) } catch {}
    } else {
      setRoutine(DEFAULT_ROUTINE.map(r => ({ ...r, done: false })))
    }
  }, [today])

  const toggle = (id) => {
    const updated = routine.map(r => r.id === id ? { ...r, done: !r.done } : r)
    setRoutine(updated)
    localStorage.setItem(`morning-${today}`, JSON.stringify(updated))
  }

  const completed = routine.filter(r => r.done).length
  const percent = Math.round((completed / routine.length) * 100)

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Routine matinale</h3>
        <span className="text-xs text-neutral-500 tabular-nums">{completed}/{routine.length} · {percent}%</span>
      </div>

      <div className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-full h-1 overflow-hidden mb-4">
        <div className="bg-neutral-900 dark:bg-neutral-100 h-full transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>

      <div className="space-y-1">
        {routine.map(r => (
          <button
            key={r.id}
            onClick={() => toggle(r.id)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900 transition text-left"
          >
            <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition flex-shrink-0 ${
              r.done
                ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100'
                : 'border-neutral-300 dark:border-neutral-700'
            }`}>
              {r.done && <Icon name="check" size={10} className="text-white dark:text-neutral-900" strokeWidth={3} />}
            </div>
            <span className={`text-sm ${r.done ? 'line-through text-neutral-400 dark:text-neutral-600' : ''}`}>{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
