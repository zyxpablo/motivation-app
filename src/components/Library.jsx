import { useState } from 'react'
import Icon from './Icon'

const statuses = [
  { id: 'wishlist', label: 'À lire' },
  { id: 'reading', label: 'En cours' },
  { id: 'finished', label: 'Lu' },
  { id: 'abandoned', label: 'Abandonné' },
]

const genres = [
  'Roman', 'Essai', 'Biographie', 'Histoire', 'Philosophie',
  'Science', 'Business', 'Développement perso', 'Fiction', 'Poésie', 'Autre'
]

export default function Library({ items = [], onUpdate }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('Roman')
  const [pages, setPages] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onUpdate([{
      id: Date.now(),
      title,
      author,
      genre,
      status: 'wishlist',
      rating: 0,
      notes: '',
      quotes: [],
      progress: 0,
      pages: parseInt(pages) || 0,
      startedAt: null,
      finishedAt: null,
      addedAt: new Date().toISOString()
    }, ...items])
    setTitle('')
    setAuthor('')
    setPages('')
  }

  const updateItem = (id, updates) => {
    onUpdate(items.map(i => {
      if (i.id !== id) return i
      const updated = { ...i, ...updates }
      if (updates.status === 'reading' && !i.startedAt) updated.startedAt = new Date().toISOString()
      if (updates.status === 'finished' && !i.finishedAt) updated.finishedAt = new Date().toISOString()
      return updated
    }))
  }

  const removeItem = (id) => onUpdate(items.filter(i => i.id !== id))

  const addQuote = (bookId, text) => {
    if (!text.trim()) return
    onUpdate(items.map(i => i.id === bookId
      ? { ...i, quotes: [...(i.quotes || []), { id: Date.now(), text, addedAt: new Date().toISOString() }] }
      : i
    ))
  }

  const removeQuote = (bookId, quoteId) => {
    onUpdate(items.map(i => i.id === bookId
      ? { ...i, quotes: (i.quotes || []).filter(q => q.id !== quoteId) }
      : i
    ))
  }

  const filtered = items
    .filter(i => filter === 'all' ? true : i.status === filter)
    .filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()) || (i.author || '').toLowerCase().includes(search.toLowerCase()))

  const totalPagesRead = items.reduce((s, b) => s + (b.status === 'finished' ? (b.pages || 0) : b.progress || 0), 0)
  const avgRating = items.filter(b => b.rating > 0).length > 0
    ? (items.filter(b => b.rating > 0).reduce((s, b) => s + b.rating, 0) / items.filter(b => b.rating > 0).length).toFixed(1)
    : '—'

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Bibliothèque</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">Votre collection de lectures, en cours et passées.</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-2xl font-semibold">{items.filter(i => i.status === 'finished').length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Lus</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{items.filter(i => i.status === 'reading').length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">En cours</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{totalPagesRead.toLocaleString('fr-FR')}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Pages lues</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{avgRating}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Note moyenne</p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleAdd} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre du livre" className="md:col-span-2 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Auteur" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
          <input type="number" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="Pages" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
        </div>
        <div className="flex items-center justify-between">
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <button type="submit" className="flex items-center gap-1.5 text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium hover:opacity-90 transition">
            <Icon name="plus" size={12} /> Ajouter
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {[{id: 'all', label: 'Tous'}, ...statuses].map(s => (
            <button key={s.id} onClick={() => setFilter(s.id)} className={`px-2.5 py-1 rounded-md text-xs transition ${filter === s.id ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium' : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'}`}>{s.label}</button>
          ))}
        </div>
        <div className="relative">
          <Icon name="search" size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="pl-7 pr-3 py-1 text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md focus:outline-none border border-neutral-200 dark:border-neutral-800 w-48" />
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(book => (
          <BookCard
            key={book.id}
            book={book}
            isExpanded={expanded === book.id}
            onToggleExpand={() => setExpanded(expanded === book.id ? null : book.id)}
            onUpdate={updateItem}
            onDelete={removeItem}
            onAddQuote={addQuote}
            onRemoveQuote={removeQuote}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <p className="text-sm text-neutral-500">Aucun livre dans cette catégorie.</p>
        </div>
      )}
    </div>
  )
}

function BookCard({ book, isExpanded, onToggleExpand, onUpdate, onDelete, onAddQuote, onRemoveQuote }) {
  const [quoteInput, setQuoteInput] = useState('')
  const progress = book.pages > 0 ? Math.min(100, Math.round((book.progress / book.pages) * 100)) : 0

  const handleAddQuote = (e) => {
    e.preventDefault()
    onAddQuote(book.id, quoteInput)
    setQuoteInput('')
  }

  const readingDays = book.startedAt && book.finishedAt
    ? Math.ceil((new Date(book.finishedAt) - new Date(book.startedAt)) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
      <div className="p-4 group">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="font-semibold truncate">{book.title}</h3>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500">{book.genre}</span>
            </div>
            <p className="text-xs text-neutral-500">{book.author || 'Auteur non renseigné'}</p>
            {book.pages > 0 && book.status === 'reading' && (
              <div className="mt-3">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-neutral-500">Page {book.progress} / {book.pages}</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-full h-1 overflow-hidden">
                  <div className="bg-neutral-900 dark:bg-neutral-100 h-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            {book.status === 'finished' && book.rating > 0 && (
              <div className="flex items-center gap-3 mt-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(n => (
                    <Icon key={n} name="star" size={12} filled={n <= book.rating} className={n <= book.rating ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-700'} />
                  ))}
                </div>
                {readingDays && <span className="text-[11px] text-neutral-500">Lu en {readingDays} jours</span>}
                {(book.quotes || []).length > 0 && <span className="text-[11px] text-neutral-500">{(book.quotes || []).length} citation{(book.quotes || []).length > 1 ? 's' : ''}</span>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select value={book.status} onChange={(e) => onUpdate(book.id, { status: e.target.value })} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
              {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <button onClick={onToggleExpand} className="text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
              {isExpanded ? 'Réduire' : 'Détails'}
            </button>
            <button onClick={() => onDelete(book.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
              <Icon name="x" size={14} />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-neutral-100 dark:border-neutral-900 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input type="number" value={book.progress || ''} onChange={(e) => onUpdate(book.id, { progress: parseInt(e.target.value) || 0 })} placeholder="Page actuelle" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
            <input type="number" value={book.pages || ''} onChange={(e) => onUpdate(book.id, { pages: parseInt(e.target.value) || 0 })} placeholder="Pages totales" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
            {book.status === 'finished' && (
              <div className="flex items-center gap-1 px-2.5 py-1.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => onUpdate(book.id, { rating: n })}>
                    <Icon name="star" size={14} filled={n <= book.rating} className={n <= book.rating ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-700'} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Notes & Réflexions</label>
            <textarea
              value={book.notes || ''}
              onChange={(e) => onUpdate(book.id, { notes: e.target.value })}
              rows="3"
              placeholder="Vos réflexions sur le livre..."
              className="w-full mt-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none placeholder-neutral-400 border border-neutral-200 dark:border-neutral-800 resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Citations marquantes</label>
            <form onSubmit={handleAddQuote} className="flex gap-2 mt-1">
              <input type="text" value={quoteInput} onChange={(e) => setQuoteInput(e.target.value)} placeholder="Ajouter une citation..." className="flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <button type="submit" className="text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium">Ajouter</button>
            </form>
            {(book.quotes || []).length > 0 && (
              <div className="mt-2 space-y-1">
                {(book.quotes || []).map(q => (
                  <div key={q.id} className="group flex items-start gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-md">
                    <span className="text-neutral-400 text-sm">"</span>
                    <p className="flex-1 text-sm italic text-neutral-700 dark:text-neutral-300">{q.text}</p>
                    <button onClick={() => onRemoveQuote(book.id, q.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                      <Icon name="x" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
