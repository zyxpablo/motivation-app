import { useState } from 'react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleViewChange = (id) => {
    setActiveView(id)
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 left-6 z-40 md:hidden w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
      >
        <Icon name={sidebarOpen ? 'x' : 'menu'} size={20} />
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-30 md:z-0
        w-64 transition-transform duration-300 ease-smooth
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        border-r border-white/10 dark:border-white/5
        bg-gradient-to-b from-neutral-950/95 to-neutral-900/95 dark:from-black/95 dark:to-neutral-900/95
        backdrop-blur-lg flex flex-col
      `}>
        <div className="px-5 py-4 border-b border-white/10 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              L
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-bold tracking-tight truncate text-white">Life OS</h1>
              <p className="text-[10px] text-indigo-400 -mt-0.5 tracking-wider font-medium">PERSONAL SYSTEM</p>
            </div>
            <Weather />
          </div>
        </div>

        <button
          onClick={onOpenPalette}
          className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-300 bg-white/5 hover:bg-white/10 transition-all border border-white/10 group"
        >
          <Icon name="search" size={14} className="group-hover:text-indigo-400 transition-colors" />
          <span className="flex-1 text-left text-xs">Rechercher</span>
          <kbd className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-neutral-400">⌘K</kbd>
        </button>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {menuGroups.map(group => (
            <div key={group.label}>
              <p className="text-[10px] uppercase tracking-widest text-indigo-400/60 font-bold px-3 mb-2">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleViewChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                      activeView === item.id
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon name={item.icon} size={16} className="group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-3 py-3 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-indigo-300 uppercase tracking-wider font-bold">Niveau {stats.level}</span>
              <span className="text-[11px] font-bold text-indigo-400">{stats.xp}/100</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-400 to-purple-400 h-full transition-all duration-500"
                style={{ width: `${stats.xp}%` }}
              />
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-neutral-200 hover:bg-white/5 transition-all border border-transparent group"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} className="group-hover:text-indigo-400 transition-colors" />
            <span className="font-medium">{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
