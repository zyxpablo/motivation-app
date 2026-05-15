import { useState } from 'react'
import Icon from './Icon'

const categories = [
  { id: 'personal', label: 'Personnel' },
  { id: 'professional', label: 'Professionnel' },
  { id: 'health', label: 'Santé' },
  { id: 'learning', label: 'Apprentissage' },
  { id: 'financial', label: 'Financier' },
  { id: 'creative', label: 'Créatif' },
]

export default function ObjectiveManager({ objectives, onUpdate }) {
  const [newTitle, setNewTitle] = useState('')
  const [duration, setDuration] = useState('month')
  const [category, setCategory] = useState('personal')
  const [deadline, setDeadline] = useState('')
  const [expanded, setExpanded] = useState(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    onUpdate([...objectives, {
      id: Date.now(),
      title: newTitle,
      duration,
      category,
      deadline: deadline || null,
      progress: 0,
      description: '',
      milestones: [],
      createdAt: new Date().toISOString()
    }])
    setNewTitle('')
    setDeadline('')
  }

  const updateObjective = (id, updates) => onUpdate(objectives.map(o => o.id === id ? { ...o, ...updates } : o))
  const remove = (id) => onUpdate(objectives.filter(o => o.id !== id))

  const addMilestone = (objId, text) => {
    if (!text.trim()) return
    onUpdate(objectives.map(o => o.id === objId
      ? { ...o, milestones: [...(o.milestones || []), { id: Date.now(), text, done: false }] }
      : o
    ))
  }

  const toggleMilestone = (objId, mId) => {
    onUpdate(objectives.map(o => {
      if (o.id !== objId) return o
      const milestones = (o.milestones || []).map(m => m.id === mId ? { ...m, done: !m.done } : m)
      const progress = milestones.length > 0
        ? Math.round((milestones.filter(m => m.done).length / milestones.length) * 100)
        : o.progress
      return { ...o, milestones, progress }
    }))
  }

  const removeMilestone = (objId, mId) => {
    onUpdate(objectives.map(o => {
      if (o.id !== objId) return o
      const milestones = (o.milestones || []).filter(m => m.id !== mId)
      const progress = milestones.length > 0
        ? Math.round((milestones.filter(m => m.done).length / milestones.length) * 100)
        : 0
      return { ...o, milestones, progress }
    }))
  }

  const groups = [
    { id: 'week', label: 'Court terme (semaine)', objs: objectives.filter(o => o.duration === 'week') },
    { id: 'month', label: 'Moyen terme (mois)', objs: objectives.filter(o => o.duration === 'month') },
    { id: 'year', label: 'Long terme (année)', objs: objectives.filter(o => o.duration === 'year') },
  ]

  const completed = objectives.filter(o => o.progress === 100).length
  const avgProgress = objectives.length > 0
    ? Math.round(objectives.reduce((s, o) => s + o.progress, 0) / objectives.length)
    : 0

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Objectifs</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">Décomposez vos ambitions en étapes mesurables.</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-2xl font-semibold">{objectives.length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Actifs</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{completed}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Accomplis</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{avgProgress}%</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Progression moy.</p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleAdd} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nouvel objectif"
          className="w-full bg-transparent text-sm focus:outline-none placeholder-neutral-400 mb-3"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
              <option value="year">Année</option>
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800" />
          </div>
          <button type="submit" className="flex items-center gap-1.5 text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium hover:opacity-90 transition">
            <Icon name="plus" size={12} /> Créer
          </button>
        </div>
      </form>

      {groups.map(group => group.objs.length > 0 && (
        <section key={group.id}>
          <h2 className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">{group.label} · {group.objs.length}</h2>
          <div className="space-y-2">
            {group.objs.map(obj => (
              <ObjectiveCard
                key={obj.id}
                obj={obj}
                isExpanded={expanded === obj.id}
                onToggleExpand={() => setExpanded(expanded === obj.id ? null : obj.id)}
                onUpdate={updateObjective}
                onDelete={remove}
                onAddMilestone={addMilestone}
                onToggleMilestone={toggleMilestone}
                onRemoveMilestone={removeMilestone}
                categoryLabel={categories.find(c => c.id === obj.category)?.label}
              />
            ))}
          </div>
        </section>
      ))}

      {objectives.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <p className="text-sm text-neutral-500">Aucun objectif. Définissez-en pour donner une direction à vos actions.</p>
        </div>
      )}
    </div>
  )
}

function ObjectiveCard({ obj, isExpanded, onToggleExpand, onUpdate, onDelete, onAddMilestone, onToggleMilestone, onRemoveMilestone, categoryLabel }) {
  const [milestoneInput, setMilestoneInput] = useState('')

  const handleAddMilestone = (e) => {
    e.preventDefault()
    onAddMilestone(obj.id, milestoneInput)
    setMilestoneInput('')
  }

  const daysLeft = obj.deadline ? Math.ceil((new Date(obj.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null
  const isOverdue = daysLeft !== null && daysLeft < 0 && obj.progress < 100
  const completedMilestones = (obj.milestones || []).filter(m => m.done).length
  const totalMilestones = (obj.milestones || []).length

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
      <div className="p-4 group">
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="font-semibold">{obj.title}</h3>
              {obj.progress === 100 && <span className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-500 font-medium">Accompli</span>}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 flex-wrap">
              <span className="uppercase tracking-wider">{categoryLabel}</span>
              {totalMilestones > 0 && <><span>·</span><span>{completedMilestones}/{totalMilestones} étapes</span></>}
              {obj.deadline && (
                <>
                  <span>·</span>
                  <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-500' : daysLeft !== null && daysLeft < 7 ? 'text-amber-600 dark:text-amber-500' : ''}`}>
                    <Icon name="calendar" size={11} />
                    {isOverdue ? `${Math.abs(daysLeft)}j en retard` : daysLeft === 0 ? 'Aujourd\'hui' : `${daysLeft}j restants`}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={onToggleExpand} className="text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
              {isExpanded ? 'Réduire' : 'Détails'}
            </button>
            <button onClick={() => onDelete(obj.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition px-1">
              <Icon name="x" size={14} />
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-neutral-500">Progression</span>
            <span className="text-sm font-semibold tabular-nums">{obj.progress}%</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-full h-1.5 overflow-hidden mb-2">
            <div className="bg-neutral-900 dark:bg-neutral-100 h-full transition-all duration-500" style={{ width: `${obj.progress}%` }} />
          </div>
          {totalMilestones === 0 && (
            <input
              type="range"
              min="0" max="100"
              value={obj.progress}
              onChange={(e) => onUpdate(obj.id, { progress: parseInt(e.target.value) })}
              className="w-full accent-neutral-900 dark:accent-neutral-100"
            />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-neutral-100 dark:border-neutral-900 p-4 space-y-3">
          <div>
            <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Description</label>
            <textarea
              value={obj.description || ''}
              onChange={(e) => onUpdate(obj.id, { description: e.target.value })}
              rows="2"
              placeholder="Précisez votre objectif, le pourquoi, les critères de réussite..."
              className="w-full mt-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none placeholder-neutral-400 border border-neutral-200 dark:border-neutral-800 resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Étapes / Jalons</label>
            <form onSubmit={handleAddMilestone} className="flex gap-2 mt-1">
              <input type="text" value={milestoneInput} onChange={(e) => setMilestoneInput(e.target.value)} placeholder="Ajouter une étape..." className="flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <button type="submit" className="text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium">Ajouter</button>
            </form>
            {(obj.milestones || []).length > 0 && (
              <div className="mt-2 space-y-1">
                {(obj.milestones || []).map(m => (
                  <div key={m.id} className="group flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-md">
                    <button
                      onClick={() => onToggleMilestone(obj.id, m.id)}
                      className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition flex-shrink-0 ${
                        m.done
                          ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100'
                          : 'border-neutral-300 dark:border-neutral-700'
                      }`}
                    >
                      {m.done && <Icon name="check" size={10} className="text-white dark:text-neutral-900" strokeWidth={3} />}
                    </button>
                    <span className={`flex-1 text-sm ${m.done ? 'line-through text-neutral-400' : ''}`}>{m.text}</span>
                    <button onClick={() => onRemoveMilestone(obj.id, m.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                      <Icon name="x" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
