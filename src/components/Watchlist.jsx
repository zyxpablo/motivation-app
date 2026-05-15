import { useState } from 'react'
import Icon from './Icon'

const types = [
  { id: 'movie', label: 'Film' },
  { id: 'series', label: 'Série' },
  { id: 'anime', label: 'Anime' },
  { id: 'documentary', label: 'Documentaire' },
]

const statuses = [
  { id: 'wishlist', label: 'À voir' },
  { id: 'watching', label: 'En cours' },
  { id: 'finished', label: 'Vu' },
  { id: 'abandoned', label: 'Abandonné' },
]

const genres = [
  'Action', 'Aventure', 'Comédie', 'Drame', 'Fantastique', 'Horreur',
  'Romance', 'Science-fiction', 'Thriller', 'Documentaire', 'Animation', 'Autre'
]

const platforms = ['Netflix', 'Prime Video', 'Disney+', 'Apple TV+', 'HBO', 'Crunchyroll', 'YouTube', 'Cinéma', 'Autre']

export default function Watchlist({ items = [], onUpdate }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('movie')
  const [year, setYear] = useState('')
  const [genre, setGenre] = useState('Drame')
  const [platform, setPlatform] = useState('Netflix')
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onUpdate([{
      id: Date.now(),
      title,
      type,
      year: parseInt(year) || null,
      genre,
      platform,
      status: 'wishlist',
      rating: 0,
      review: '',
      episodesSeen: 0,
      totalEpisodes: 0,
      addedAt: new Date().toISOString(),
      finishedAt: null,
    }, ...items])
    setTitle('')
    setYear('')
  }

  const updateItem = (id, updates) => {
    onUpdate(items.map(i => {
      if (i.id !== id) return i
      const updated = { ...i, ...updates }
      if (updates.status === 'finished' && !i.finishedAt) updated.finishedAt = new Date().toISOString()
      return updated
    }))
  }

  const removeItem = (id) => onUpdate(items.filter(i => i.id !== id))

  const filtered = items
    .filter(i => filter === 'all' ? true : i.status === filter)
    .filter(i => typeFilter === 'all' ? true : i.type === typeFilter)
    .filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()))

  const avgRating = items.filter(i => i.rating > 0).length > 0
    ? (items.filter(i => i.rating > 0).reduce((s, i) => s + i.rating, 0) / items.filter(i => i.rating > 0).length).toFixed(1)
    : '—'

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Watchlist</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">Films, séries et documentaires à voir ou vus.</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-2xl font-semibold">{items.filter(i => i.status === 'wishlist').length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">À voir</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{items.filter(i => i.status === 'watching').length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">En cours</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{items.filter(i => i.status === 'finished').length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Vus</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{avgRating}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Note moy.</p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleAdd} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" className="md:col-span-2 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Année" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800">
            {types.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800">
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button type="submit" className="flex items-center gap-1.5 text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium hover:opacity-90 transition">
            <Icon name="plus" size={12} /> Ajouter
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[{id: 'all', label: 'Tous'}, ...statuses].map(s => (
            <button key={s.id} onClick={() => setFilter(s.id)} className={`px-2.5 py-1 rounded-md text-xs transition ${filter === s.id ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium' : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'}`}>{s.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
            <option value="all">Tous types</option>
            {types.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <div className="relative">
            <Icon name="search" size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="pl-7 pr-3 py-1 text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md focus:outline-none border border-neutral-200 dark:border-neutral-800 w-48" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map(item => (
          <WatchCard
            key={item.id}
            item={item}
            isExpanded={expanded === item.id}
            onToggleExpand={() => setExpanded(expanded === item.id ? null : item.id)}
            onUpdate={updateItem}
            onDelete={removeItem}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <p className="text-sm text-neutral-500">Aucun titre dans cette catégorie.</p>
        </div>
      )}
    </div>
  )
}

function WatchCard({ item, isExpanded, onToggleExpand, onUpdate, onDelete }) {
  const typeLabel = types.find(t => t.id === item.type)?.label
  const showProgress = ['series', 'anime'].includes(item.type) && item.totalEpisodes > 0
  const episodeProgress = showProgress ? Math.round((item.episodesSeen / item.totalEpisodes) * 100) : 0

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
      <div className="p-4 group">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="font-semibold truncate">{item.title}</h3>
              {item.year && <span className="text-xs text-neutral-500">({item.year})</span>}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="uppercase tracking-wider">{typeLabel}</span>
              <span>·</span>
              <span>{item.genre}</span>
              <span>·</span>
              <span>{item.platform}</span>
            </div>
            {showProgress && item.status === 'watching' && (
              <div className="mt-2">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-neutral-500">Épisode {item.episodesSeen} / {item.totalEpisodes}</span>
                  <span className="font-medium">{episodeProgress}%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-full h-1 overflow-hidden">
                  <div className="bg-neutral-900 dark:bg-neutral-100 h-full" style={{ width: `${episodeProgress}%` }} />
                </div>
              </div>
            )}
            {item.rating > 0 && (
              <div className="flex gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <Icon key={n} name="star" size={11} filled={n <= item.rating} className={n <= item.rating ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-700'} />
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <select value={item.status} onChange={(e) => onUpdate(item.id, { status: e.target.value })} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
              {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <div className="flex gap-1">
              <button onClick={onToggleExpand} className="text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
                {isExpanded ? 'Réduire' : 'Détails'}
              </button>
              <button onClick={() => onDelete(item.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition px-1">
                <Icon name="x" size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-neutral-100 dark:border-neutral-900 p-4 space-y-3">
          {showProgress && (
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={item.episodesSeen || ''} onChange={(e) => onUpdate(item.id, { episodesSeen: parseInt(e.target.value) || 0 })} placeholder="Épisodes vus" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <input type="number" value={item.totalEpisodes || ''} onChange={(e) => onUpdate(item.id, { totalEpisodes: parseInt(e.target.value) || 0 })} placeholder="Total épisodes" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
            </div>
          )}
          {item.status === 'finished' && (
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-neutral-500 mr-2">Note :</span>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => onUpdate(item.id, { rating: n })}>
                  <Icon name="star" size={16} filled={n <= item.rating} className={n <= item.rating ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-700'} />
                </button>
              ))}
            </div>
          )}
          <div>
            <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Critique / Notes</label>
            <textarea value={item.review || ''} onChange={(e) => onUpdate(item.id, { review: e.target.value })} rows="2" placeholder="Vos impressions..." className="w-full mt-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none placeholder-neutral-400 border border-neutral-200 dark:border-neutral-800 resize-none" />
          </div>
        </div>
      )}
    </div>
  )
}
