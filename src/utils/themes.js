export const THEMES = {
  indigo: {
    name: 'Indigo',
    gradient: 'from-indigo-500 to-purple-600',
    accent: 'indigo',
    primary: '#6366f1',
    secondary: '#a855f7',
  },
  emerald: {
    name: 'Emerald',
    gradient: 'from-emerald-500 to-teal-600',
    accent: 'emerald',
    primary: '#10b981',
    secondary: '#14b8a6',
  },
  rose: {
    name: 'Rose',
    gradient: 'from-rose-500 to-pink-600',
    accent: 'rose',
    primary: '#f43f5e',
    secondary: '#ec4899',
  },
  amber: {
    name: 'Amber',
    gradient: 'from-amber-500 to-orange-600',
    accent: 'amber',
    primary: '#f59e0b',
    secondary: '#f97316',
  },
  cyan: {
    name: 'Cyan',
    gradient: 'from-cyan-500 to-blue-600',
    accent: 'cyan',
    primary: '#06b6d4',
    secondary: '#3b82f6',
  },
  monochrome: {
    name: 'Mono',
    gradient: 'from-neutral-700 to-neutral-900',
    accent: 'neutral',
    primary: '#404040',
    secondary: '#171717',
  },
}

export function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.indigo
  document.documentElement.style.setProperty('--theme-primary', theme.primary)
  document.documentElement.style.setProperty('--theme-secondary', theme.secondary)
  localStorage.setItem('theme-accent', themeId)
}
