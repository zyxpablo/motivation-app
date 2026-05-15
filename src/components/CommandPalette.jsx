import { useState, useEffect, useRef } from 'react'
import Icon from './Icon'

export default function CommandPalette({ isOpen, onClose, setActiveView }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)

  const commands = [
    { id: 'go-dashboard', icon: 'dashboard', label: 'Dashboard', category: 'Navigation', action: () => setActiveView('dashboard') },
    { id: 'go-analytics', icon: 'analytics', label: 'Analytics', category: 'Navigation', action: () => setActiveView('analytics') },
    { id: 'go-tasks', icon: 'check', label: 'Tâches', category: 'Navigation', action: () => setActiveView('tasks') },
    { id: 'go-objectives', icon: 'target', label: 'Objectifs', category: 'Navigation', action: () => setActiveView('objectives') },
    { id: 'go-habits', icon: 'repeat', label: 'Habitudes', category: 'Navigation', action: () => setActiveView('habits') },
    { id: 'go-journal', icon: 'pencil', label: 'Journal', category: 'Navigation', action: () => setActiveView('journal') },
    { id: 'go-finances', icon: 'wallet', label: 'Finances', category: 'Navigation', action: () => setActiveView('finances') },
    { id: 'go-health', icon: 'heart', label: 'Santé & Bien-être', category: 'Navigation', action: () => setActiveView('health') },
    { id: 'go-library', icon: 'book', label: 'Bibliothèque', category: 'Navigation', action: () => setActiveView('library') },
    { id: 'go-watchlist', icon: 'film', label: 'Watchlist', category: 'Navigation', action: () => setActiveView('watchlist') },
    { id: 'go-travel', icon: 'plane', label: 'Voyages', category: 'Navigation', action: () => setActiveView('travel') },
    { id: 'go-career', icon: 'briefcase', label: 'Carrière', category: 'Navigation', action: () => setActiveView('career') },
    { id: 'go-achievements', icon: 'award', label: 'Réussites', category: 'Navigation', action: () => setActiveView('achievements') },
    { id: 'go-settings', icon: 'settings', label: 'Paramètres', category: 'Navigation', action: () => setActiveView('settings') },
  ]

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelected(0)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected(s => Math.min(s + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected(s => Math.max(s - 1, 0))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[selected]) {
          filtered[selected].action()
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, filtered, selected, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-neutral-900/30 dark:bg-neutral-950/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-neutral-200 dark:border-neutral-900 px-4 py-3 flex items-center gap-3">
          <Icon name="search" size={14} className="text-neutral-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0) }}
            placeholder="Tapez une commande ou recherchez..."
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder-neutral-400"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800">ESC</kbd>
        </div>

        <div className="max-h-96 overflow-auto py-1">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-neutral-500">Aucun résultat</div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onMouseEnter={() => setSelected(i)}
                onClick={() => { cmd.action(); onClose() }}
                className={`w-full px-4 py-2 flex items-center gap-3 text-left text-sm transition ${
                  selected === i ? 'bg-neutral-100 dark:bg-neutral-900' : ''
                }`}
              >
                <Icon name={cmd.icon} size={14} className="text-neutral-500" />
                <span className="flex-1">{cmd.label}</span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500">{cmd.category}</span>
              </button>
            ))
          )}
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-900 px-4 py-2 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex gap-3">
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800">↑↓</kbd> Naviguer</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800">↵</kbd> Sélectionner</span>
          </div>
          <span>{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  )
}
