import { useState } from 'react'
import Icon from './Icon'

export default function HabitTracker({ habits, onUpdate }) {
  const [newHabit, setNewHabit] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [category, setCategory] = useState('health')

  const categories = [
    { id: 'health', label: 'Santé' },
    { id: 'productivity', label: 'Productivité' },
    { id: 'learning', label: 'Apprentissage' },
    { id: 'mindfulness', label: 'Bien-être' },
    { id: 'social', label: 'Social' },
  ]

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newHabit.trim()) return
    onUpdate([...habits, {
      id: Date.now(),
      title: newHabit,
      streak: 0,
      longestStreak: 0,
      completedToday: false,
      history: [],
      frequency,
      category,
      createdAt: new Date().toISOString()
    }])
    setNewHabit('')
  }

  const toggleHabit = (id) => {
    const today = new Date().toISOString().split('T')[0]
    onUpdate(habits.map(h => {
      if (h.id !== id) return h
      const wasCompleted = h.completedToday
      const history = wasCompleted
        ? h.history.filter(d => d !== today)
        : [...new Set([...h.history, today])]
      const newStreak = wasCompleted ? Math.max(0, h.streak - 1) : h.streak + 1
      return {
        ...h,
        completedToday: !wasCompleted,
        streak: newStreak,
        longestStreak: Math.max(h.longestStreak || 0, newStreak),
        history
      }
    }))
  }

  const remove = (id) => onUpdate(habits.filter(h => h.id !== id))

  const completedCount = habits.filter(h => h.completedToday).length
  const totalRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0
  const longestOverall = habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0)

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Habitudes</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">Bâtissez des routines durables et suivez votre régularité.</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-2xl font-semibold">{completedCount}<span className="text-base text-neutral-500">/{habits.length}</span></p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Aujourd'hui</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalRate}%</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Taux du jour</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{longestOverall}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Meilleur streak</p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleAdd} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Nouvelle habitude (ex: méditer 10 min)"
          className="w-full bg-transparent text-sm focus:outline-none placeholder-neutral-400 mb-3"
        />
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
              <option value="daily">Quotidienne</option>
              <option value="weekday">Semaine (lun-ven)</option>
              <option value="weekly">Hebdomadaire</option>
            </select>
          </div>
          <button type="submit" className="flex items-center gap-1.5 text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium hover:opacity-90 transition">
            <Icon name="plus" size={12} /> Ajouter
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {habits.map(habit => (
          <HabitRow
            key={habit.id}
            habit={habit}
            categoryLabel={categories.find(c => c.id === habit.category)?.label}
            onToggle={toggleHabit}
            onDelete={remove}
          />
        ))}
      </div>

      {habits.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <p className="text-sm text-neutral-500">Créez vos premières habitudes pour construire une routine durable.</p>
        </div>
      )}
    </div>
  )
}

function HabitRow({ habit, categoryLabel, onToggle, onDelete }) {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split('T')[0]
  })

  const completionCount = last30Days.filter(d => (habit.history || []).includes(d)).length
  const monthlyRate = Math.round((completionCount / 30) * 100)

  return (
    <div className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(habit.id)}
          className={`w-9 h-9 rounded-md flex items-center justify-center transition flex-shrink-0 ${
            habit.completedToday
              ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
              : 'border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100'
          }`}
        >
          {habit.completedToday && <Icon name="check" size={14} strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm">{habit.title}</h3>
          <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-0.5">
            <span className="uppercase tracking-wider">{categoryLabel}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Icon name="flame" size={11} /> {habit.streak} jours</span>
            <span>•</span>
            <span>Record : {habit.longestStreak || habit.streak}</span>
            <span>•</span>
            <span>{monthlyRate}% sur 30 jours</span>
          </div>
        </div>

        <div className="hidden md:flex gap-0.5">
          {last30Days.map(date => (
            <div
              key={date}
              className={`w-2 h-2 rounded-sm ${
                (habit.history || []).includes(date)
                  ? 'bg-neutral-900 dark:bg-neutral-100'
                  : 'bg-neutral-100 dark:bg-neutral-900'
              }`}
              title={date}
            />
          ))}
        </div>

        <button onClick={() => onDelete(habit.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
          <Icon name="x" size={14} />
        </button>
      </div>
    </div>
  )
}
