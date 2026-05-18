import { useState, useEffect } from 'react'
import Icon from './Icon'

export default function Health({ health, onUpdate }) {
  const water = health?.water || 0

  // Reset water and mood at midnight
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const lastHealthResetDate = localStorage.getItem('health-reset-date')

    if (lastHealthResetDate !== today) {
      // Reset water to 0
      const updatedHealth = { ...health, water: 0 }
      onUpdate(updatedHealth)
      localStorage.setItem('health-reset-date', today)
    }
  }, [health])
  const workouts = health?.workouts || []
  const sleep = health?.sleep || []
  const weight = health?.weight || []
  const mood = health?.mood || []
  const height = health?.height || 0

  const [workoutName, setWorkoutName] = useState('')
  const [workoutType, setWorkoutType] = useState('cardio')
  const [duration, setDuration] = useState('')
  const [calories, setCalories] = useState('')
  const [sleepHours, setSleepHours] = useState('')
  const [sleepQuality, setSleepQuality] = useState('good')
  const [weightValue, setWeightValue] = useState('')
  const [moodValue, setMoodValue] = useState(7)
  const [heightInput, setHeightInput] = useState(height)

  const workoutTypes = [
    { id: 'cardio', label: 'Cardio' },
    { id: 'strength', label: 'Musculation' },
    { id: 'flexibility', label: 'Souplesse' },
    { id: 'sport', label: 'Sport' },
    { id: 'walk', label: 'Marche' },
  ]

  const addWater = () => onUpdate({ ...health, water: water + 1 })
  const removeWater = () => onUpdate({ ...health, water: Math.max(0, water - 1) })

  const addWorkout = (e) => {
    e.preventDefault()
    if (!workoutName.trim() || !duration) return
    onUpdate({
      ...health,
      workouts: [{
        id: Date.now(),
        name: workoutName,
        type: workoutType,
        duration: parseInt(duration),
        calories: parseInt(calories) || 0,
        date: new Date().toISOString()
      }, ...workouts]
    })
    setWorkoutName('')
    setDuration('')
    setCalories('')
  }

  const addSleep = (e) => {
    e.preventDefault()
    if (!sleepHours) return
    onUpdate({
      ...health,
      sleep: [{
        id: Date.now(),
        hours: parseFloat(sleepHours),
        quality: sleepQuality,
        date: new Date().toISOString()
      }, ...sleep].slice(0, 90)
    })
    setSleepHours('')
  }

  const addWeight = (e) => {
    e.preventDefault()
    if (!weightValue) return
    onUpdate({
      ...health,
      weight: [{ id: Date.now(), value: parseFloat(weightValue), date: new Date().toISOString() }, ...weight].slice(0, 100)
    })
    setWeightValue('')
  }

  const addMood = () => {
    onUpdate({
      ...health,
      mood: [{ id: Date.now(), value: moodValue, date: new Date().toISOString() }, ...mood].slice(0, 90)
    })
  }

  const saveHeight = () => onUpdate({ ...health, height: parseFloat(heightInput) || 0 })

  // Calculations
  const avgSleep = sleep.length > 0 ? (sleep.reduce((s, e) => s + e.hours, 0) / sleep.length).toFixed(1) : '0.0'
  const totalWorkoutTime = workouts.reduce((s, w) => s + w.duration, 0)
  const totalCalories = workouts.reduce((s, w) => s + (w.calories || 0), 0)
  const currentWeight = weight[0]?.value
  const previousWeight = weight[1]?.value
  const weightTrend = currentWeight && previousWeight ? (currentWeight - previousWeight).toFixed(1) : null
  const bmi = currentWeight && height ? (currentWeight / Math.pow(height / 100, 2)).toFixed(1) : null
  const bmiCategory = bmi ? (bmi < 18.5 ? 'Insuffisant' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Surpoids' : 'Obésité') : null
  const avgMood = mood.length > 0 ? (mood.reduce((s, m) => s + m.value, 0) / mood.length).toFixed(1) : '0.0'

  // Weekly workouts
  const now = new Date()
  const weekWorkouts = workouts.filter(w => (now - new Date(w.date)) < 7 * 24 * 60 * 60 * 1000)
  const weekDuration = weekWorkouts.reduce((s, w) => s + w.duration, 0)

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Santé & Bien-être</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">Suivi global de votre forme physique et mentale.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Hydratation" value={`${water}`} sub={`/ 8 verres · ${Math.round((water / 8) * 100)}%`} />
        <MetricCard label="Sommeil moyen" value={`${avgSleep}h`} sub={sleep.length > 0 ? `sur ${sleep.length} nuits` : 'Aucune donnée'} />
        <MetricCard label="Sport (semaine)" value={`${weekDuration}m`} sub={`${weekWorkouts.length} séances`} />
        <MetricCard label="Humeur moyenne" value={`${avgMood}/10`} sub={mood.length > 0 ? `${mood.length} entrées` : 'Aucune donnée'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Hydratation du jour</h2>
            <span className="text-[11px] text-neutral-500">{water} / 8</span>
          </div>
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <button
                key={i}
                onClick={() => onUpdate({ ...health, water: i + 1 })}
                className={`flex-1 h-12 rounded-sm transition ${
                  i < water
                    ? 'bg-neutral-900 dark:bg-neutral-100'
                    : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={removeWater} className="flex-1 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-sm transition">−</button>
            <button onClick={addWater} className="flex-1 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium transition">+ Ajouter un verre</button>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Poids & IMC</h2>
            <span className="text-[11px] text-neutral-500">{currentWeight ? `${currentWeight} kg` : 'Aucune donnée'}</span>
          </div>
          {bmi ? (
            <div className="mb-4">
              <p className="text-3xl font-semibold">{bmi}</p>
              <p className="text-xs text-neutral-500">IMC · {bmiCategory}</p>
              {weightTrend !== null && (
                <p className={`text-[11px] mt-2 flex items-center gap-1 ${parseFloat(weightTrend) > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                  <Icon name={parseFloat(weightTrend) > 0 ? 'arrow_up' : 'arrow_down'} size={11} />
                  {Math.abs(parseFloat(weightTrend))} kg depuis la dernière pesée
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 mb-4">Renseignez taille et poids pour calculer votre IMC.</p>
          )}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input type="number" value={heightInput || ''} onChange={(e) => setHeightInput(e.target.value)} placeholder="Taille (cm)" className="flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <button onClick={saveHeight} className="text-xs px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">OK</button>
            </div>
            <form onSubmit={addWeight} className="flex gap-2">
              <input type="number" step="0.1" value={weightValue} onChange={(e) => setWeightValue(e.target.value)} placeholder="Poids (kg)" className="flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <button type="submit" className="text-xs px-2 py-1 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">+</button>
            </form>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Humeur du jour</h2>
            <span className="text-[11px] text-neutral-500">{moodValue}/10</span>
          </div>
          <input
            type="range"
            min="1" max="10"
            value={moodValue}
            onChange={(e) => setMoodValue(parseInt(e.target.value))}
            className="w-full accent-neutral-900 dark:accent-neutral-100 mb-3"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 mb-4">
            <span>Difficile</span>
            <span>Neutre</span>
            <span>Excellent</span>
          </div>
          <button onClick={addMood} className="w-full text-xs bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md py-2 font-medium transition">
            Enregistrer
          </button>
          {mood.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
              <p className="text-[11px] text-neutral-500 mb-2">14 derniers jours</p>
              <div className="flex gap-0.5 items-end h-10">
                {mood.slice(0, 14).reverse().map(m => (
                  <div
                    key={m.id}
                    className="flex-1 bg-neutral-900 dark:bg-neutral-100 rounded-sm"
                    style={{ height: `${(m.value / 10) * 100}%` }}
                    title={`${m.value}/10 - ${new Date(m.date).toLocaleDateString('fr-FR')}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Activité physique</h2>
            <span className="text-[11px] text-neutral-500">{totalWorkoutTime} min · {totalCalories} kcal</span>
          </div>
          <form onSubmit={addWorkout} className="space-y-2 mb-4">
            <input type="text" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} placeholder="Type d'exercice (ex: Course, Yoga...)" className="w-full bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
            <div className="grid grid-cols-3 gap-2">
              <select value={workoutType} onChange={(e) => setWorkoutType(e.target.value)} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800">
                {workoutTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Minutes" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="Kcal" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
            </div>
            <button type="submit" className="w-full text-xs bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md py-2 font-medium">Enregistrer la séance</button>
          </form>
          <div className="space-y-1 max-h-48 overflow-auto">
            {workouts.slice(0, 5).map(w => (
              <div key={w.id} className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-900 last:border-0">
                <div>
                  <p className="text-sm">{w.name}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{workoutTypes.find(t => t.id === w.type)?.label || w.type}</p>
                </div>
                <div className="text-right text-xs text-neutral-500">
                  <p>{w.duration} min</p>
                  {w.calories > 0 && <p>{w.calories} kcal</p>}
                </div>
              </div>
            ))}
            {workouts.length === 0 && <p className="text-xs text-neutral-500 text-center py-4">Aucune séance enregistrée</p>}
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Sommeil</h2>
            <span className="text-[11px] text-neutral-500">Moy. : {avgSleep}h</span>
          </div>
          <form onSubmit={addSleep} className="space-y-2 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <input type="number" step="0.5" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} placeholder="Heures dormies" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <select value={sleepQuality} onChange={(e) => setSleepQuality(e.target.value)} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800">
                <option value="poor">Mauvais</option>
                <option value="fair">Moyen</option>
                <option value="good">Bon</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>
            <button type="submit" className="w-full text-xs bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md py-2 font-medium">Enregistrer la nuit</button>
          </form>
          <div className="mb-3">
            <p className="text-[11px] text-neutral-500 mb-2">14 dernières nuits</p>
            <div className="flex gap-0.5 items-end h-10">
              {sleep.slice(0, 14).reverse().map(s => (
                <div
                  key={s.id}
                  className="flex-1 bg-neutral-900 dark:bg-neutral-100 rounded-sm"
                  style={{ height: `${Math.min(100, (s.hours / 10) * 100)}%` }}
                  title={`${s.hours}h - ${new Date(s.date).toLocaleDateString('fr-FR')}`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1 max-h-32 overflow-auto">
            {sleep.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-900 last:border-0">
                <span className="text-xs text-neutral-500">{new Date(s.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-500 capitalize">{s.quality}</span>
                  <span className="font-medium">{s.hours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub }) {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
      <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-3">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] text-neutral-500 mt-1">{sub}</p>
    </div>
  )
}
