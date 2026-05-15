import { useState, useEffect, useRef } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import TaskManager from './components/TaskManager'
import ObjectiveManager from './components/ObjectiveManager'
import HabitTracker from './components/HabitTracker'
import Journal from './components/Journal'
import Finances from './components/Finances'
import Health from './components/Health'
import Watchlist from './components/Watchlist'
import Travel from './components/Travel'
import Library from './components/Library'
import Career from './components/Career'
import Analytics from './components/Analytics'
import Settings from './components/Settings'
import Achievements from './components/Achievements'
import CommandPalette from './components/CommandPalette'
import AchievementToast from './components/AchievementToast'
import { fireConfetti, fireSmallConfetti, fireFireworks } from './utils/confetti'
import { sounds } from './utils/sounds'
import { getNewAchievements } from './utils/achievements'
import { applyTheme } from './utils/themes'

const DEFAULT_DATA = {
  tasks: [],
  objectives: [],
  habits: [],
  journal: [],
  finances: { transactions: [], budget: 0 },
  health: { workouts: [], water: 0, sleep: [] },
  watchlist: [],
  travels: [],
  books: [],
  career: { skills: [], experiences: [], goals: [] },
  streak: 0,
  stats: { completed: 0, total: 0, level: 1, xp: 0 }
}

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [theme, setTheme] = useState('dark')
  const [accentTheme, setAccentTheme] = useState('indigo')
  const [data, setData] = useState(DEFAULT_DATA)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [achievementToast, setAchievementToast] = useState(null)
  const prevDataRef = useRef(DEFAULT_DATA)

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('lifeOS')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const merged = { ...DEFAULT_DATA, ...parsed }
        setData(merged)
        prevDataRef.current = merged
      } catch {}
    }
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')

    const savedAccent = localStorage.getItem('theme-accent') || 'indigo'
    setAccentTheme(savedAccent)
    applyTheme(savedAccent)
  }, [])

  // Persist data
  useEffect(() => {
    localStorage.setItem('lifeOS', JSON.stringify(data))

    // Check for new achievements
    const newAchievements = getNewAchievements(prevDataRef.current, data)
    if (newAchievements.length > 0) {
      setAchievementToast(newAchievements[0])
      fireConfetti()
      sounds.levelUp()
    }
    prevDataRef.current = data
  }, [data])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const toggleTheme = (newTheme) => {
    const t = newTheme || (theme === 'dark' ? 'light' : 'dark')
    setTheme(t)
    localStorage.setItem('theme', t)
    document.documentElement.classList.toggle('dark', t === 'dark')
  }

  const handleAddTask = (task) => {
    sounds.add()
    updateData('tasks', [...data.tasks, { ...task, id: Date.now(), completed: false, createdAt: new Date() }])
  }

  const handleCompleteTask = (id) => {
    const task = data.tasks.find(t => t.id === id)
    if (!task.completed) {
      sounds.complete()
      fireSmallConfetti()
      updateData('tasks', data.tasks.map(t => t.id === id ? { ...t, completed: true } : t))

      const xpGain = 10
      const newXp = data.stats.xp + xpGain
      const newLevel = Math.floor((data.stats.level - 1) * 100 + newXp) >= 100 * data.stats.level
        ? data.stats.level + 1
        : data.stats.level
      const finalXp = newXp >= 100 ? newXp - 100 : newXp

      if (newLevel > data.stats.level) {
        sounds.levelUp()
        fireConfetti()
      }

      updateData('stats', {
        ...data.stats,
        completed: data.stats.completed + 1,
        level: newLevel,
        xp: finalXp
      })

      const today = new Date().toDateString()
      const lastCompleted = localStorage.getItem('lastCompleted')
      if (lastCompleted !== today) {
        updateData('streak', data.streak + 1)
        localStorage.setItem('lastCompleted', today)
      }
    } else {
      updateData('tasks', data.tasks.map(t => t.id === id ? { ...t, completed: false } : t))
    }
  }

  const handleDeleteTask = (id) => {
    sounds.delete()
    updateData('tasks', data.tasks.filter(t => t.id !== id))
  }

  const handleObjectivesUpdate = (objectives) => {
    // Detect objective completion
    const prev = data.objectives
    const completed = objectives.filter(o => o.progress === 100 && !prev.find(p => p.id === o.id && p.progress === 100))
    if (completed.length > 0) {
      fireFireworks()
      sounds.levelUp()
    }
    updateData('objectives', objectives)
  }

  const handleImport = (imported) => {
    const merged = { ...DEFAULT_DATA, ...imported }
    setData(merged)
  }

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        toggleTheme={() => toggleTheme()}
        stats={data.stats}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-10">
          {activeView === 'dashboard' && (
            <Dashboard data={data} setActiveView={setActiveView} />
          )}
          {activeView === 'analytics' && <Analytics data={data} />}
          {activeView === 'tasks' && (
            <TaskManager
              tasks={data.tasks}
              onAdd={handleAddTask}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
            />
          )}
          {activeView === 'objectives' && (
            <ObjectiveManager
              objectives={data.objectives}
              onUpdate={handleObjectivesUpdate}
            />
          )}
          {activeView === 'habits' && (
            <HabitTracker
              habits={data.habits}
              onUpdate={(habits) => updateData('habits', habits)}
            />
          )}
          {activeView === 'journal' && (
            <Journal
              entries={data.journal}
              onUpdate={(journal) => updateData('journal', journal)}
            />
          )}
          {activeView === 'finances' && (
            <Finances
              finances={data.finances}
              onUpdate={(finances) => updateData('finances', finances)}
            />
          )}
          {activeView === 'health' && (
            <Health
              health={data.health}
              onUpdate={(health) => updateData('health', health)}
            />
          )}
          {activeView === 'watchlist' && (
            <Watchlist items={data.watchlist} onUpdate={(watchlist) => updateData('watchlist', watchlist)} />
          )}
          {activeView === 'travel' && (
            <Travel items={data.travels} onUpdate={(travels) => updateData('travels', travels)} />
          )}
          {activeView === 'library' && (
            <Library items={data.books} onUpdate={(books) => updateData('books', books)} />
          )}
          {activeView === 'career' && (
            <Career career={data.career} onUpdate={(career) => updateData('career', career)} />
          )}
          {activeView === 'achievements' && <Achievements data={data} />}
          {activeView === 'settings' && (
            <Settings
              data={data}
              onImport={handleImport}
              theme={theme}
              setTheme={toggleTheme}
              accentTheme={accentTheme}
              setAccentTheme={setAccentTheme}
            />
          )}
        </div>
      </main>

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        setActiveView={setActiveView}
      />

      <AchievementToast
        achievement={achievementToast}
        onClose={() => setAchievementToast(null)}
      />
    </div>
  )
}

export default App
