import MorningRoutine from './MorningRoutine'
import QuoteOfDay from './QuoteOfDay'
import Icon from './Icon'
import { getUnlockedAchievements } from '../utils/achievements'

const greetingByHour = () => {
  const h = new Date().getHours()
  if (h < 6) return 'Bonne nuit'
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

export default function Dashboard({ data, setActiveView }) {
  const { tasks, objectives, habits, finances, health, streak, stats } = data
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const activeTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0
  const balance = (finances?.transactions || []).reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
  const recentAchievements = getUnlockedAchievements(data).slice(-4).reverse()

  // Trends - tasks completed in last 7 days vs previous 7 days
  const now = new Date()
  const last7days = completedTasks.filter(t => {
    const date = new Date(t.createdAt)
    return (now - date) < 7 * 24 * 60 * 60 * 1000
  }).length
  const prev7days = completedTasks.filter(t => {
    const date = new Date(t.createdAt)
    const diff = now - date
    return diff >= 7 * 24 * 60 * 60 * 1000 && diff < 14 * 24 * 60 * 60 * 1000
  }).length
  const trendPercent = prev7days > 0 ? Math.round(((last7days - prev7days) / prev7days) * 100) : 0

  // Monthly expenses
  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthlyExpenses = (finances?.transactions || [])
    .filter(t => t.type === 'expense' && t.date && t.date.startsWith(thisMonth))
    .reduce((sum, t) => sum + t.amount, 0)

  // Habits completion rate
  const habitCompletionRate = habits.length > 0
    ? Math.round((habits.filter(h => h.completedToday).length / habits.length) * 100)
    : 0

  // Books progress
  const readingBooks = (data.books || []).filter(b => b.status === 'reading')
  const totalPages = readingBooks.reduce((s, b) => s + (b.pages || 0), 0)
  const readPages = readingBooks.reduce((s, b) => s + (b.progress || 0), 0)

  const isMorning = new Date().getHours() < 12

  return (
    <div className="space-y-6">
      <header className="relative border-b border-white/10 dark:border-white/5 pb-6 group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <p className="text-xs text-indigo-400/70 mb-2 capitalize tracking-widest font-bold">{today}</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 dark:from-white dark:via-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
            {greetingByHour()}.
          </h1>
          <p className="text-sm text-neutral-400 mt-2 group-hover:text-neutral-300 transition-colors">Aperçu de votre journée et de votre progression globale.</p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Série en cours"
          value={streak}
          unit="jours"
          trend={streak > 0 ? 'up' : null}
          sub={streak === 0 ? 'Démarrez aujourd\'hui' : streak === 1 ? 'Premier jour' : 'Continuez ainsi'}
        />
        <StatCard
          label="Tâches actives"
          value={activeTasks.length}
          unit={`/ ${tasks.length}`}
          trend={trendPercent > 0 ? 'up' : trendPercent < 0 ? 'down' : null}
          trendValue={trendPercent !== 0 ? `${trendPercent > 0 ? '+' : ''}${trendPercent}%` : null}
          sub={`${completedTasks.length} terminées`}
        />
        <StatCard
          label="Objectifs"
          value={objectives.length}
          unit={`${objectives.filter(o => o.progress === 100).length} ✓`}
          sub={objectives.length === 0 ? 'À définir' : `${Math.round(objectives.reduce((s, o) => s + o.progress, 0) / objectives.length)}% moyen`}
        />
        <StatCard
          label="Niveau"
          value={stats.level}
          unit={`${stats.xp}/100 XP`}
          sub={`${stats.completed} tâches accomplies`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {isMorning ? <MorningRoutine /> : (
          <Card title="Priorités du jour" action="Voir tout" onAction={() => setActiveView('tasks')}>
            {activeTasks.length === 0 ? (
              <EmptyState>Aucune tâche en cours. Profitez de cette accalmie pour préparer demain.</EmptyState>
            ) : (
              <ul className="divide-y divide-neutral-100 dark:divide-neutral-900">
                {activeTasks.slice(0, 5).map(task => (
                  <li key={task.id} className="flex items-center gap-3 py-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                    <span className="flex-1 text-sm">{task.title}</span>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500">{task.category}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        <Card title="Progression globale" action="Analyser" onAction={() => setActiveView('analytics')} className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ProgressTile label="Tâches" value={completionRate} sub={`${completedTasks.length}/${tasks.length}`} />
            <ProgressTile label="Niveau" value={stats.xp} sub={`${100 - stats.xp} XP restants`} />
            <ProgressTile label="Habitudes" value={habitCompletionRate} sub={`${habits.filter(h => h.completedToday).length}/${habits.length} aujourd'hui`} />
          </div>
          <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-900 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Metric label="Tâches cette semaine" value={last7days} />
            <Metric label="Semaine précédente" value={prev7days} />
            <Metric label="Trophées" value={getUnlockedAchievements(data).length} sub="/ 25" />
            <Metric label="Total complété" value={completedTasks.length} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          title="Finances"
          icon="wallet"
          value={`${balance.toFixed(2)} €`}
          sub={`${monthlyExpenses.toFixed(0)} € de dépenses ce mois`}
          metaLabel={(finances?.transactions || []).length === 0 ? 'Aucune transaction' : `${(finances?.transactions || []).length} transactions`}
          onClick={() => setActiveView('finances')}
          tone={balance >= 0 ? 'positive' : 'negative'}
        />
        <SummaryCard
          title="Hydratation"
          icon="droplet"
          value={`${health?.water || 0}`}
          sub={`Objectif quotidien : 8 verres`}
          metaLabel={`${Math.round(((health?.water || 0) / 8) * 100)}% atteint`}
          onClick={() => setActiveView('health')}
        />
        <SummaryCard
          title="Lecture"
          icon="book"
          value={`${readingBooks.length}`}
          sub={totalPages > 0 ? `${readPages} / ${totalPages} pages` : 'Aucun livre en cours'}
          metaLabel={`${(data.books || []).filter(b => b.status === 'finished').length} lus`}
          onClick={() => setActiveView('library')}
        />
        <SummaryCard
          title="Watchlist"
          icon="film"
          value={`${(data.watchlist || []).filter(w => w.status !== 'finished').length}`}
          sub={`${(data.watchlist || []).filter(w => w.status === 'finished').length} terminés`}
          metaLabel={`${(data.watchlist || []).length} au total`}
          onClick={() => setActiveView('watchlist')}
        />
      </div>

      {!isMorning && activeTasks.length > 0 && (
        <Card title="Toutes les tâches en cours" action="Gérer" onAction={() => setActiveView('tasks')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {activeTasks.slice(0, 8).map(task => (
              <div key={task.id} className="flex items-center gap-3 px-3 py-2 rounded-md bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-900">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100 flex-shrink-0" />
                <span className="flex-1 text-sm truncate">{task.title}</span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 flex-shrink-0">{task.category}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {recentAchievements.length > 0 && (
        <Card title="Réussites récentes" action="Toutes les réussites" onAction={() => setActiveView('achievements')}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recentAchievements.map(a => (
              <div key={a.id} className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="award" size={14} className="text-neutral-700 dark:text-neutral-400" />
                  <p className="text-xs font-medium truncate">{a.name}</p>
                </div>
                <p className="text-[11px] text-neutral-500 leading-snug">{a.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <QuoteOfDay />
    </div>
  )
}

function StatCard({ label, value, unit, sub, trend, trendValue }) {
  return (
    <div className="group rounded-xl border border-white/10 dark:border-white/5 bg-gradient-to-br from-white/5 to-white/2 dark:from-white/5 dark:to-white/2 backdrop-blur-md p-4 hover:border-indigo-500/20 hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 transition-all duration-300">
      <p className="text-[11px] text-indigo-400/70 uppercase tracking-wider mb-3 font-bold">{label}</p>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all">{value}</span>
        {unit && <span className="text-xs text-neutral-400 group-hover:text-neutral-300 transition">{unit}</span>}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-neutral-400 group-hover:text-neutral-300 transition">{sub}</p>
        {trend && trendValue && (
          <span className={`flex items-center gap-1 text-[10px] font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            <Icon name={trend === 'up' ? 'trending' : 'trending_down'} size={11} />
            {trendValue}
          </span>
        )}
      </div>
    </div>
  )
}

function Card({ title, action, onAction, children, className = '' }) {
  return (
    <div className={`group rounded-xl border border-white/10 dark:border-white/5 bg-gradient-to-br from-white/5 to-white/2 dark:from-white/5 dark:to-white/2 backdrop-blur-lg p-5 hover:border-indigo-500/20 hover:bg-gradient-to-br hover:from-indigo-500/5 hover:to-purple-500/5 transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {action && (
          <button onClick={onAction} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-indigo-400 transition-all group/btn">
            {action} <Icon name="arrow_right" size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function ProgressTile({ label, value, sub }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs text-neutral-400 font-medium">{label}</span>
        <span className="text-base font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{value}%</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden mb-2">
        <div className="bg-gradient-to-r from-indigo-400 to-purple-400 h-full transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
      <p className="text-[10px] text-neutral-500">{sub}</p>
    </div>
  )
}

function Metric({ label, value, sub }) {
  return (
    <div className="group">
      <p className="text-[10px] uppercase tracking-widest text-indigo-400/60 mb-2 font-bold group-hover:text-indigo-400 transition-colors">{label}</p>
      <p className="text-lg font-bold text-white">{value}<span className="text-xs text-neutral-400 font-normal">{sub}</span></p>
    </div>
  )
}

function SummaryCard({ title, icon, value, sub, metaLabel, onClick, tone }) {
  return (
    <button
      onClick={onClick}
      className="text-left group rounded-xl border border-white/10 dark:border-white/5 bg-gradient-to-br from-white/5 to-white/2 dark:from-white/5 dark:to-white/2 backdrop-blur-md p-4 hover:border-indigo-500/30 hover:bg-gradient-to-br hover:from-indigo-500/10 hover:to-purple-500/10 transition-all duration-300 active:scale-95"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-wider text-indigo-400/70 font-bold group-hover:text-indigo-400 transition-colors">{title}</span>
        <Icon name={icon} size={16} className="text-neutral-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
      </div>
      <p className={`text-2xl font-bold mb-1 ${
        tone === 'negative' ? 'text-red-400' : tone === 'positive' ? 'text-emerald-400' : 'text-white'
      }`}>{value}</p>
      <p className="text-[11px] text-neutral-400 group-hover:text-neutral-300 transition mb-1">{sub}</p>
      <p className="text-[10px] text-neutral-500 group-hover:text-neutral-400 transition">{metaLabel}</p>
    </button>
  )
}

function EmptyState({ children }) {
  return (
    <div className="py-6 text-center">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{children}</p>
    </div>
  )
}
