import { useState } from 'react'
import Icon from './Icon'

const categories = [
  { id: 'general', label: 'Général' },
  { id: 'health', label: 'Santé' },
  { id: 'work', label: 'Travail' },
  { id: 'learning', label: 'Apprentissage' },
  { id: 'creativity', label: 'Créativité' },
  { id: 'social', label: 'Social' },
  { id: 'home', label: 'Maison' },
  { id: 'finance', label: 'Finance' },
]

const priorities = [
  { id: 'low', label: 'Basse', color: 'text-neutral-500 bg-neutral-100 dark:bg-neutral-900' },
  { id: 'normal', label: 'Normale', color: 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950' },
  { id: 'high', label: 'Haute', color: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950' },
  { id: 'urgent', label: 'Urgente', color: 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950' },
]

export default function TaskManager({ tasks, onAdd, onComplete, onDelete }) {
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('general')
  const [priority, setPriority] = useState('normal')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('created')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTask.trim()) {
      onAdd({ title: newTask, category, priority, dueDate: dueDate || null })
      setNewTask('')
      setDueDate('')
    }
  }

  const filterTasks = (list) => {
    return list.filter(t => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      if (filter === 'today') {
        if (!t.dueDate) return false
        return t.dueDate === new Date().toISOString().split('T')[0]
      }
      if (filter === 'week') {
        if (!t.dueDate) return false
        const date = new Date(t.dueDate)
        const now = new Date()
        const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        return date >= now && date <= week
      }
      if (filter === 'overdue') {
        if (!t.dueDate || t.completed) return false
        return new Date(t.dueDate) < new Date()
      }
      if (filter !== 'all' && filter !== 'today' && filter !== 'week' && filter !== 'overdue') {
        return t.category === filter
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { urgent: 0, high: 1, normal: 2, low: 3 }
        return (order[a.priority] || 2) - (order[b.priority] || 2)
      }
      if (sortBy === 'due') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }

  const activeTasks = filterTasks(tasks.filter(t => !t.completed))
  const completedTasks = filterTasks(tasks.filter(t => t.completed))
  const getCategoryLabel = (id) => categories.find(c => c.id === id)?.label || 'Général'
  const getPriority = (id) => priorities.find(p => p.id === id) || priorities[1]

  const overdue = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
  const dueToday = tasks.filter(t => !t.completed && t.dueDate === new Date().toISOString().split('T')[0]).length

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Tâches</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">
              Organisez et suivez vos tâches avec priorités et échéances.
            </p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-2xl font-semibold">{activeTasks.length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Actives</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-amber-600 dark:text-amber-500">{dueToday}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Aujourd'hui</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-500">{overdue}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">En retard</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{completedTasks.length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Terminées</p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Ajouter une tâche..."
          className="w-full bg-transparent text-sm focus:outline-none placeholder-neutral-400 mb-3"
        />
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
              {priorities.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800" />
          </div>
          <button type="submit" className="flex items-center gap-1.5 text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium hover:opacity-90 transition">
            <Icon name="plus" size={12} /> Ajouter
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'today', label: 'Aujourd\'hui' },
            { id: 'week', label: 'Cette semaine' },
            { id: 'overdue', label: 'En retard' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-2.5 py-1 rounded-md text-xs transition ${
                filter === f.id
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Icon name="search" size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-7 pr-3 py-1 text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md focus:outline-none border border-neutral-200 dark:border-neutral-800 w-48"
            />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
            <option value="created">Date de création</option>
            <option value="priority">Priorité</option>
            <option value="due">Échéance</option>
          </select>
        </div>
      </div>

      {activeTasks.length > 0 && (
        <section>
          <h2 className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">En cours · {activeTasks.length}</h2>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 divide-y divide-neutral-100 dark:divide-neutral-900">
            {activeTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                priorityInfo={getPriority(task.priority)}
                categoryLabel={getCategoryLabel(task.category)}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section>
          <h2 className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">Terminées · {completedTasks.length}</h2>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 divide-y divide-neutral-100 dark:divide-neutral-900">
            {completedTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                priorityInfo={getPriority(task.priority)}
                categoryLabel={getCategoryLabel(task.category)}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {tasks.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <p className="text-sm text-neutral-500">Aucune tâche. Commencez par en ajouter une pour structurer votre journée.</p>
        </div>
      )}
    </div>
  )
}

function TaskRow({ task, priorityInfo, categoryLabel, onComplete, onDelete }) {
  const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
  const isDueToday = !task.completed && task.dueDate === new Date().toISOString().split('T')[0]

  return (
    <div className="group flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition">
      <button
        onClick={() => onComplete(task.id)}
        className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition flex-shrink-0 ${
          task.completed
            ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100'
            : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100'
        }`}
      >
        {task.completed && <Icon name="check" size={10} className="text-white dark:text-neutral-900" strokeWidth={3} />}
      </button>

      <span className={`flex-1 text-sm ${task.completed ? 'line-through text-neutral-400 dark:text-neutral-600' : ''}`}>
        {task.title}
      </span>

      {task.priority && task.priority !== 'normal' && (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${priorityInfo.color}`}>
          {priorityInfo.label}
        </span>
      )}

      {task.dueDate && (
        <span className={`flex items-center gap-1 text-[11px] ${isOverdue ? 'text-red-600 dark:text-red-500' : isDueToday ? 'text-amber-600 dark:text-amber-500' : 'text-neutral-500'}`}>
          <Icon name="calendar" size={10} />
          {new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
        </span>
      )}

      <span className="text-[10px] uppercase tracking-wider text-neutral-500 hidden md:inline">{categoryLabel}</span>

      <button onClick={() => onDelete(task.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
        <Icon name="x" size={12} />
      </button>
    </div>
  )
}
