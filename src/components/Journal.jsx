import { useState } from 'react'
import { marked } from 'marked'
import Icon from './Icon'

const moods = [
  { id: 'great', value: 5, label: 'Excellente', color: 'bg-emerald-500' },
  { id: 'good', value: 4, label: 'Bonne', color: 'bg-emerald-400' },
  { id: 'neutral', value: 3, label: 'Neutre', color: 'bg-neutral-400' },
  { id: 'bad', value: 2, label: 'Difficile', color: 'bg-amber-500' },
  { id: 'terrible', value: 1, label: 'Mauvaise', color: 'bg-red-500' },
]

export default function Journal({ entries, onUpdate }) {
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('neutral')
  const [tags, setTags] = useState('')
  const [search, setSearch] = useState('')
  const [preview, setPreview] = useState(false)

  const handleAdd = () => {
    if (!content.trim()) return
    onUpdate([{
      id: Date.now(),
      content,
      mood,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      date: new Date().toISOString()
    }, ...entries])
    setContent('')
    setMood('neutral')
    setTags('')
    setPreview(false)
  }

  const remove = (id) => onUpdate(entries.filter(e => e.id !== id))

  const filtered = entries.filter(e => {
    if (!search) return true
    return e.content.toLowerCase().includes(search.toLowerCase()) ||
      (e.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))
  })

  const wordCount = content.split(/\s+/).filter(Boolean).length
  const charCount = content.length

  // Get all unique tags
  const allTags = [...new Set(entries.flatMap(e => e.tags || []))]

  // Mood stats (last 30 days)
  const recentEntries = entries.filter(e => (new Date() - new Date(e.date)) < 30 * 24 * 60 * 60 * 1000)
  const avgMood = recentEntries.length > 0
    ? (recentEntries.reduce((s, e) => s + (moods.find(m => m.id === e.mood)?.value || 3), 0) / recentEntries.length).toFixed(1)
    : '—'

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Journal</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">Espace d'écriture quotidien avec support Markdown.</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-2xl font-semibold">{entries.length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Entrées</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{recentEntries.length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">30 derniers jours</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{avgMood}<span className="text-base text-neutral-500">/5</span></p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Humeur moy.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {moods.map(m => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`px-2.5 py-1 rounded-md text-xs transition flex items-center gap-1.5 ${
                  mood === m.id
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${m.color}`} />
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            <button onClick={() => setPreview(false)} className={`px-2.5 py-1 rounded-md text-xs transition ${!preview ? 'bg-neutral-200 dark:bg-neutral-800 font-medium' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}>Édition</button>
            <button onClick={() => setPreview(true)} className={`px-2.5 py-1 rounded-md text-xs transition ${preview ? 'bg-neutral-200 dark:bg-neutral-800 font-medium' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}>Aperçu</button>
          </div>
        </div>

        {preview ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none min-h-[120px] text-sm [&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:font-semibold [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: marked(content || '*Aucun contenu*', { breaks: true }) }}
          />
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Qu'est-ce qui s'est passé aujourd'hui ? (Markdown supporté : **gras**, *italique*, # titre, - liste)"
            rows="6"
            className="w-full bg-transparent text-sm focus:outline-none placeholder-neutral-400 resize-none font-mono leading-relaxed"
          />
        )}

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-900">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags séparés par virgule (ex: travail, famille, sport)"
            className="flex-1 bg-transparent text-xs focus:outline-none placeholder-neutral-400"
          />
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-500 tabular-nums">{wordCount} mots · {charCount} chars</span>
            <button
              onClick={handleAdd}
              className="text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium hover:opacity-90 transition"
            >
              Publier
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Icon name="search" size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher dans le journal..." className="w-full pl-7 pr-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md focus:outline-none border border-neutral-200 dark:border-neutral-800" />
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {allTags.slice(0, 8).map(tag => (
              <button key={tag} onClick={() => setSearch(tag)} className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition">
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filtered.map(entry => {
          const moodInfo = moods.find(m => m.id === entry.mood) || moods[2]
          const entryWords = entry.content.split(/\s+/).filter(Boolean).length
          return (
            <article key={entry.id} className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
              <header className="flex items-start justify-between mb-3 pb-3 border-b border-neutral-100 dark:border-neutral-900">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${moodInfo.color}`} />
                  <div>
                    <p className="text-sm font-medium">{moodInfo.label}</p>
                    <p className="text-[11px] text-neutral-500">
                      {new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}
                      {new Date(entry.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      {' · '}
                      {entryWords} mots
                    </p>
                  </div>
                </div>
                <button onClick={() => remove(entry.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                  <Icon name="x" size={14} />
                </button>
              </header>
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-sm text-neutral-700 dark:text-neutral-300 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:font-semibold [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: marked(entry.content || '', { breaks: true }) }}
              />
              {(entry.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-900">
                  {entry.tags.map(tag => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          )
        })}
      </div>

      {entries.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <p className="text-sm text-neutral-500">Aucune entrée. Commencez votre journal pour réfléchir et garder une trace.</p>
        </div>
      )}
    </div>
  )
}
