import { ALL_ACHIEVEMENTS, getUnlockedAchievements } from '../utils/achievements'
import Icon from './Icon'

export default function Achievements({ data }) {
  const unlocked = getUnlockedAchievements(data)
  const unlockedIds = new Set(unlocked.map(a => a.id))
  const total = ALL_ACHIEVEMENTS.length
  const percent = Math.round((unlocked.length / total) * 100)

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Réussites</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">Suivez vos accomplissements et débloquez de nouveaux badges.</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold tabular-nums">{unlocked.length}<span className="text-base text-neutral-500">/{total}</span></p>
            <p className="text-[11px] uppercase tracking-wider text-neutral-500">{percent}% complété</p>
          </div>
        </div>
      </header>

      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Progression globale</span>
          <span className="text-xs text-neutral-500 tabular-nums">{unlocked.length}/{total}</span>
        </div>
        <div className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-full h-2 overflow-hidden">
          <div className="bg-neutral-900 dark:bg-neutral-100 h-full transition-all duration-700" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ALL_ACHIEVEMENTS.map(a => {
          const isUnlocked = unlockedIds.has(a.id)
          return (
            <div
              key={a.id}
              className={`rounded-lg border p-4 transition ${
                isUnlocked
                  ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950'
                  : 'border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${
                  isUnlocked
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-200 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600'
                }`}>
                  <Icon name="award" size={16} />
                </div>
                <div className={`flex-1 min-w-0 ${!isUnlocked ? 'opacity-60' : ''}`}>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium truncate">{a.name}</p>
                    {isUnlocked && <span className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-500 font-medium">Débloqué</span>}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{a.desc}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
