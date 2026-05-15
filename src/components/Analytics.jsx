import { useMemo } from 'react'
import { Chart as ChartJS, ArcElement, LineElement, PointElement, BarElement, CategoryScale, LinearScale, RadialLinearScale, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2'

ChartJS.register(ArcElement, LineElement, PointElement, BarElement, CategoryScale, LinearScale, RadialLinearScale, Tooltip, Legend, Filler)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#a3a3a3', font: { size: 11 } } }
  },
  scales: {
    y: { ticks: { color: '#a3a3a3', font: { size: 10 } }, grid: { color: 'rgba(128,128,128,0.1)' } },
    x: { ticks: { color: '#a3a3a3', font: { size: 10 } }, grid: { color: 'rgba(128,128,128,0.1)' } }
  }
}

export default function Analytics({ data }) {
  const last30Days = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (29 - i))
      return d.toISOString().split('T')[0]
    })
  }, [])

  // Tasks per day
  const tasksData = useMemo(() => {
    const completed = data.tasks.filter(t => t.completed)
    return last30Days.map(date => {
      return completed.filter(t => {
        const tDate = new Date(t.createdAt).toISOString().split('T')[0]
        return tDate === date
      }).length
    })
  }, [data.tasks, last30Days])

  // Habits per day
  const habitsData = useMemo(() => {
    return last30Days.map(date => {
      return data.habits.filter(h => (h.history || []).includes(date)).length
    })
  }, [data.habits, last30Days])

  // Finances by category
  const financeByCategory = useMemo(() => {
    const cats = {}
    ;(data.finances?.transactions || []).filter(t => t.type === 'expense').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount
    })
    return cats
  }, [data.finances])

  // Wheel of life
  const wheelData = useMemo(() => ({
    labels: ['Tâches', 'Habitudes', 'Santé', 'Finances', 'Lecture', 'Carrière', 'Voyages', 'Journal'],
    datasets: [{
      label: 'Score',
      data: [
        Math.min(100, (data.tasks.filter(t => t.completed).length / Math.max(1, data.tasks.length)) * 100),
        Math.min(100, data.habits.length * 20),
        Math.min(100, (data.health?.water || 0) * 12.5),
        Math.min(100, (data.finances?.transactions || []).length * 10),
        Math.min(100, (data.books || []).filter(b => b.status === 'finished').length * 25),
        Math.min(100, (data.career?.skills || []).length * 20),
        Math.min(100, (data.travels || []).length * 15),
        Math.min(100, (data.journal || []).length * 10),
      ],
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: '#6366f1',
      borderWidth: 2,
      pointBackgroundColor: '#6366f1',
    }]
  }), [data])

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">Vue d'ensemble de ta progression</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard label="Tâches totales" value={data.tasks.length} sub={`${data.tasks.filter(t => t.completed).length} complétées`} />
        <SummaryCard label="Streak record" value={data.streak} sub="jours consécutifs" />
        <SummaryCard label="Niveau" value={data.stats.level} sub={`${data.stats.xp}/100 XP`} />
        <SummaryCard label="Objectifs" value={data.objectives.length} sub={`${data.objectives.filter(o => o.progress === 100).length} accomplis`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Tâches complétées (30 derniers jours)">
          <Line
            data={{
              labels: last30Days.map(d => new Date(d).getDate()),
              datasets: [{
                label: 'Tâches',
                data: tasksData,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
              }]
            }}
            options={chartOptions}
          />
        </ChartCard>

        <ChartCard title="Habitudes maintenues (30 derniers jours)">
          <Bar
            data={{
              labels: last30Days.map(d => new Date(d).getDate()),
              datasets: [{
                label: 'Habitudes',
                data: habitsData,
                backgroundColor: '#10b981',
                borderRadius: 4,
              }]
            }}
            options={chartOptions}
          />
        </ChartCard>

        <ChartCard title="Dépenses par catégorie">
          {Object.keys(financeByCategory).length > 0 ? (
            <Doughnut
              data={{
                labels: Object.keys(financeByCategory),
                datasets: [{
                  data: Object.values(financeByCategory),
                  backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444'],
                  borderWidth: 0,
                }]
              }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#a3a3a3', font: { size: 11 } } } } }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-neutral-500">Aucune dépense enregistrée</div>
          )}
        </ChartCard>

        <ChartCard title="🎯 Wheel of Life">
          <Radar
            data={wheelData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100,
                  ticks: { color: '#a3a3a3', backdropColor: 'transparent', font: { size: 9 } },
                  grid: { color: 'rgba(128,128,128,0.2)' },
                  angleLines: { color: 'rgba(128,128,128,0.2)' },
                  pointLabels: { color: '#a3a3a3', font: { size: 11 } }
                }
              },
              plugins: { legend: { display: false } }
            }}
          />
        </ChartCard>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
      <p className="text-xs text-neutral-500 mt-1">{sub}</p>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
      <h3 className="font-semibold mb-4 text-sm">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  )
}
