import { useState } from 'react'
import Icon from './Icon'

export default function Career({ career = {}, onUpdate }) {
  const skills = career.skills || []
  const experiences = career.experiences || []
  const goals = career.goals || []
  const certifications = career.certifications || []
  const salaryHistory = career.salaryHistory || []
  const [tab, setTab] = useState('skills')

  const [skillName, setSkillName] = useState('')
  const [skillCategory, setSkillCategory] = useState('technical')
  const [skillLevel, setSkillLevel] = useState(50)

  const [expTitle, setExpTitle] = useState('')
  const [expCompany, setExpCompany] = useState('')
  const [expStart, setExpStart] = useState('')
  const [expEnd, setExpEnd] = useState('')
  const [expCurrent, setExpCurrent] = useState(false)

  const [goalText, setGoalText] = useState('')
  const [goalDeadline, setGoalDeadline] = useState('')

  const [certName, setCertName] = useState('')
  const [certIssuer, setCertIssuer] = useState('')
  const [certDate, setCertDate] = useState('')

  const [salary, setSalary] = useState('')
  const [salaryDate, setSalaryDate] = useState(new Date().toISOString().split('T')[0])

  const skillCategories = [
    { id: 'technical', label: 'Technique' },
    { id: 'soft', label: 'Soft skill' },
    { id: 'language', label: 'Langue' },
    { id: 'tool', label: 'Outil' },
  ]

  const addSkill = (e) => {
    e.preventDefault()
    if (!skillName.trim()) return
    onUpdate({ ...career, skills: [...skills, { id: Date.now(), name: skillName, level: skillLevel, category: skillCategory }] })
    setSkillName('')
    setSkillLevel(50)
  }

  const updateSkill = (id, updates) => onUpdate({ ...career, skills: skills.map(s => s.id === id ? { ...s, ...updates } : s) })
  const removeSkill = (id) => onUpdate({ ...career, skills: skills.filter(s => s.id !== id) })

  const addExperience = (e) => {
    e.preventDefault()
    if (!expTitle.trim()) return
    onUpdate({ ...career, experiences: [{
      id: Date.now(),
      title: expTitle,
      company: expCompany,
      startDate: expStart,
      endDate: expCurrent ? null : expEnd,
      current: expCurrent,
      description: ''
    }, ...experiences] })
    setExpTitle('')
    setExpCompany('')
    setExpStart('')
    setExpEnd('')
    setExpCurrent(false)
  }

  const updateExperience = (id, updates) => onUpdate({ ...career, experiences: experiences.map(e => e.id === id ? { ...e, ...updates } : e) })
  const removeExperience = (id) => onUpdate({ ...career, experiences: experiences.filter(e => e.id !== id) })

  const addGoal = (e) => {
    e.preventDefault()
    if (!goalText.trim()) return
    onUpdate({ ...career, goals: [...goals, { id: Date.now(), text: goalText, done: false, deadline: goalDeadline }] })
    setGoalText('')
    setGoalDeadline('')
  }

  const toggleGoal = (id) => onUpdate({ ...career, goals: goals.map(g => g.id === id ? { ...g, done: !g.done } : g) })
  const removeGoal = (id) => onUpdate({ ...career, goals: goals.filter(g => g.id !== id) })

  const addCert = (e) => {
    e.preventDefault()
    if (!certName.trim()) return
    onUpdate({ ...career, certifications: [{ id: Date.now(), name: certName, issuer: certIssuer, date: certDate }, ...certifications] })
    setCertName('')
    setCertIssuer('')
    setCertDate('')
  }

  const removeCert = (id) => onUpdate({ ...career, certifications: certifications.filter(c => c.id !== id) })

  const addSalary = (e) => {
    e.preventDefault()
    if (!salary) return
    onUpdate({ ...career, salaryHistory: [{ id: Date.now(), amount: parseFloat(salary), date: salaryDate }, ...salaryHistory].sort((a, b) => new Date(b.date) - new Date(a.date)) })
    setSalary('')
  }

  const removeSalary = (id) => onUpdate({ ...career, salaryHistory: salaryHistory.filter(s => s.id !== id) })

  // Stats
  const currentSalary = salaryHistory[0]?.amount
  const previousSalary = salaryHistory[1]?.amount
  const salaryEvolution = currentSalary && previousSalary
    ? Math.round(((currentSalary - previousSalary) / previousSalary) * 100)
    : null
  const yearsExperience = experiences.length > 0
    ? Math.round(experiences.reduce((sum, e) => {
        if (!e.startDate) return sum
        const end = e.current ? new Date() : (e.endDate ? new Date(e.endDate) : new Date())
        return sum + (end - new Date(e.startDate)) / (1000 * 60 * 60 * 24 * 365)
      }, 0) * 10) / 10
    : 0

  const avgSkillLevel = skills.length > 0
    ? Math.round(skills.reduce((s, sk) => s + sk.level, 0) / skills.length)
    : 0

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Carrière</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">Compétences, expériences et trajectoire professionnelle.</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-2xl font-semibold">{yearsExperience}<span className="text-base text-neutral-500">ans</span></p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Expérience</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{skills.length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Compétences</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{avgSkillLevel}%</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Niveau moyen</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{certifications.length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Certifications</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex gap-1 border-b border-neutral-200 dark:border-neutral-900">
        {[
          { id: 'skills', label: 'Compétences' },
          { id: 'experiences', label: 'Expériences' },
          { id: 'certifications', label: 'Certifications' },
          { id: 'salary', label: 'Salaire' },
          { id: 'goals', label: 'Objectifs' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm transition border-b-2 -mb-px ${
              tab === t.id
                ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100 font-medium'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'skills' && (
        <div className="space-y-4">
          <form onSubmit={addSkill} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
            <div className="flex flex-wrap gap-2 items-center">
              <input type="text" value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="Compétence" className="flex-1 min-w-[200px] bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <select value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-2 focus:outline-none border border-neutral-200 dark:border-neutral-800">
                {skillCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <input type="range" min="0" max="100" value={skillLevel} onChange={(e) => setSkillLevel(parseInt(e.target.value))} className="w-32 accent-neutral-900 dark:accent-neutral-100" />
              <span className="text-xs w-10 tabular-nums text-neutral-500">{skillLevel}%</span>
              <button type="submit" className="text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium">Ajouter</button>
            </div>
          </form>

          {skillCategories.map(cat => {
            const catSkills = skills.filter(s => s.category === cat.id)
            if (catSkills.length === 0) return null
            return (
              <div key={cat.id}>
                <h3 className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">{cat.label} · {catSkills.length}</h3>
                <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 divide-y divide-neutral-100 dark:divide-neutral-900">
                  {catSkills.map(skill => (
                    <div key={skill.id} className="group p-3 flex items-center gap-3">
                      <span className="text-sm font-medium flex-1 min-w-0 truncate">{skill.name}</span>
                      <input type="range" min="0" max="100" value={skill.level} onChange={(e) => updateSkill(skill.id, { level: parseInt(e.target.value) })} className="w-32 accent-neutral-900 dark:accent-neutral-100" />
                      <span className="text-xs w-10 tabular-nums text-neutral-500">{skill.level}%</span>
                      <button onClick={() => removeSkill(skill.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                        <Icon name="x" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {skills.length === 0 && (
            <div className="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
              <p className="text-sm text-neutral-500">Ajoutez vos compétences pour suivre leur évolution.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'experiences' && (
        <div className="space-y-4">
          <form onSubmit={addExperience} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <input type="text" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} placeholder="Poste / Rôle" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <input type="text" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} placeholder="Entreprise" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <input type="date" value={expStart} onChange={(e) => setExpStart(e.target.value)} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <input type="date" value={expEnd} onChange={(e) => setExpEnd(e.target.value)} disabled={expCurrent} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800 disabled:opacity-50" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <input type="checkbox" checked={expCurrent} onChange={(e) => setExpCurrent(e.target.checked)} />
                Poste actuel
              </label>
              <button type="submit" className="text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium">Ajouter</button>
            </div>
          </form>

          <div className="space-y-2">
            {experiences.map(exp => (
              <div key={exp.id} className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{exp.title}</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{exp.company}</p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : '—'}
                      {' → '}
                      {exp.current ? 'aujourd\'hui' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : '—')}
                    </p>
                  </div>
                  <button onClick={() => removeExperience(exp.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                    <Icon name="x" size={14} />
                  </button>
                </div>
                <textarea
                  value={exp.description || ''}
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                  rows="2"
                  placeholder="Réalisations, responsabilités..."
                  className="w-full mt-3 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none placeholder-neutral-400 border border-neutral-200 dark:border-neutral-800 resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'certifications' && (
        <div className="space-y-4">
          <form onSubmit={addCert} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input type="text" value={certName} onChange={(e) => setCertName(e.target.value)} placeholder="Nom de la certification" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <input type="text" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} placeholder="Organisme" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <div className="flex gap-2">
                <input type="date" value={certDate} onChange={(e) => setCertDate(e.target.value)} className="flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
                <button type="submit" className="text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium">Ajouter</button>
              </div>
            </div>
          </form>

          <div className="space-y-2">
            {certifications.map(cert => (
              <div key={cert.id} className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 flex items-center gap-3">
                <Icon name="award" size={18} className="text-neutral-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{cert.name}</p>
                  <p className="text-xs text-neutral-500">
                    {cert.issuer}
                    {cert.date && ` · ${new Date(cert.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`}
                  </p>
                </div>
                <button onClick={() => removeCert(cert.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                  <Icon name="x" size={14} />
                </button>
              </div>
            ))}
            {certifications.length === 0 && (
              <div className="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
                <p className="text-sm text-neutral-500">Aucune certification enregistrée.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'salary' && (
        <div className="space-y-4">
          {salaryHistory.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
                <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2">Salaire actuel</p>
                <p className="text-2xl font-semibold tabular-nums">{currentSalary?.toLocaleString('fr-FR') || '—'} €</p>
              </div>
              {salaryEvolution !== null && (
                <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2">Évolution</p>
                  <p className={`text-2xl font-semibold tabular-nums ${salaryEvolution > 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
                    {salaryEvolution > 0 ? '+' : ''}{salaryEvolution}%
                  </p>
                </div>
              )}
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
                <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2">Évolutions enregistrées</p>
                <p className="text-2xl font-semibold tabular-nums">{salaryHistory.length}</p>
              </div>
            </div>
          )}

          <form onSubmit={addSalary} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Salaire annuel brut (€)" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <input type="date" value={salaryDate} onChange={(e) => setSalaryDate(e.target.value)} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <button type="submit" className="text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium">Enregistrer</button>
            </div>
          </form>

          {salaryHistory.length > 0 && (
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 divide-y divide-neutral-100 dark:divide-neutral-900">
              {salaryHistory.map(s => (
                <div key={s.id} className="group flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-neutral-500">{new Date(s.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tabular-nums">{s.amount.toLocaleString('fr-FR')} €</span>
                    <button onClick={() => removeSalary(s.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                      <Icon name="x" size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'goals' && (
        <div className="space-y-4">
          <form onSubmit={addGoal} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
            <div className="flex gap-2">
              <input type="text" value={goalText} onChange={(e) => setGoalText(e.target.value)} placeholder="Objectif professionnel..." className="flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <input type="date" value={goalDeadline} onChange={(e) => setGoalDeadline(e.target.value)} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <button type="submit" className="text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium">Ajouter</button>
            </div>
          </form>

          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 divide-y divide-neutral-100 dark:divide-neutral-900">
            {goals.map(goal => (
              <div key={goal.id} className="group flex items-center gap-3 px-4 py-3">
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition flex-shrink-0 ${
                    goal.done
                      ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100'
                      : 'border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  {goal.done && <Icon name="check" size={10} className="text-white dark:text-neutral-900" strokeWidth={3} />}
                </button>
                <span className={`flex-1 text-sm ${goal.done ? 'line-through text-neutral-400' : ''}`}>{goal.text}</span>
                {goal.deadline && (
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <Icon name="calendar" size={11} />
                    {new Date(goal.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
                <button onClick={() => removeGoal(goal.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                  <Icon name="x" size={12} />
                </button>
              </div>
            ))}
          </div>
          {goals.length === 0 && (
            <div className="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
              <p className="text-sm text-neutral-500">Aucun objectif. Définissez vos ambitions professionnelles.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
