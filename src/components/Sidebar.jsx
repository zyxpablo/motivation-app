import Weather from './Weather'
import Icon from './Icon'

const menuGroups = [
  {
    label: 'Principal',
    items: [
      { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
      { id: 'analytics', icon: 'analytics', label: 'Analytics' },
    ]
  },
  {
    label: 'Productivité',
    items: [
      { id: 'tasks', icon: 'check', label: 'Tâches' },
      { id: 'objectives', icon: 'target', label: 'Objectifs' },
      { id: 'habits', icon: 'repeat', label: 'Habitudes' },
    ]
  },
  {
    label: 'Vie quotidienne',
    items: [
      { id: 'journal', icon: 'pencil', label: 'Journal' },
      { id: 'finances', icon: 'wallet', label: 'Finances' },
      { id: 'health', icon: 'heart', label: 'Santé' },
    ]
  },
  {
    label: 'Centres d\'intérêt',
    items: [
      { id: 'library', icon: 'book', label: 'Bibliothèque' },
      { id: 'watchlist', icon: 'film', label: 'Watchlist' },
      { id: 'travel', icon: 'plane', label: 'Voyages' },
      { id: 'career', icon: 'briefcase', label: 'Carrière' },
    ]
  },
  {
    label: 'Système',
    items: [
      { id: 'achievements', icon: 'award', label: 'Réussites' },
      { id: 'settings', icon: 'settings', label: 'Paramètres' },
    ]
  },
]

export default function Sidebar({ activeView, setActiveView, theme, toggleTheme, stats, onOpenPalette }) {
  return (
    <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col h-screen sticky top-0">
      <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 font-semibold text-sm">
            L
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold tracking-tight truncate">Life OS</h1>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-500 -mt-0.5 tracking-wide">PERSONAL SYSTEM</p>
          </div>
          <Weather />
        </div>
      </div>

      <button
        onClick={onOpenPalette}
        className="mx-3 mt-3 flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-neutral-500 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition border border-neutral-200 dark:border-neutral-800"
      >
        <Icon name="search" size={14} />
        <span className="flex-1 text-left text-xs">Rechercher</span>
        <kbd className="text-[10px] px-1 py-0.5 bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800">⌘K</kbd>
      </button>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {menuGroups.map(group => (
          <div key={group.label}>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600 font-medium px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    activeView === item.id
                      ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
                  }`}
                >
                  <Icon name={item.icon} size={15} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-neutral-200 dark:border-neutral-900 space-y-2">
        <div className="px-3 py-2 rounded-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider">Niveau {stats.level}</span>
            <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">{stats.xp}/100</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1 overflow-hidden">
            <div
              className="bg-neutral-900 dark:bg-neutral-100 h-full transition-all"
              style={{ width: `${stats.xp}%` }}
            />
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
          <span>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
        </button>
      </div>
    </aside>
  )
}
