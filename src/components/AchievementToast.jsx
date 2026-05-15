import { useEffect } from 'react'
import Icon from './Icon'

export default function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    if (!achievement) return
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [achievement, onClose])

  if (!achievement) return null

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className="flex items-center gap-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg px-4 py-3 max-w-sm">
        <div className="w-9 h-9 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center flex-shrink-0">
          <Icon name="award" size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Réussite débloquée</p>
          <p className="text-sm font-semibold truncate">{achievement.name}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{achievement.desc}</p>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition flex-shrink-0">
          <Icon name="x" size={14} />
        </button>
      </div>
    </div>
  )
}
