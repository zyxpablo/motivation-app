import { useState } from 'react'
import Icon from './Icon'

const statuses = [
  { id: 'dream', label: 'Souhait' },
  { id: 'planned', label: 'Planifié' },
  { id: 'visited', label: 'Visité' },
]

const transports = ['Avion', 'Train', 'Voiture', 'Bus', 'Bateau', 'Multi-mode']

export default function Travel({ items = [], onUpdate }) {
  const [destination, setDestination] = useState('')
  const [country, setCountry] = useState('')
  const [status, setStatus] = useState('dream')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!destination.trim()) return
    onUpdate([{
      id: Date.now(),
      destination,
      country,
      status,
      notes: '',
      places: [],
      budget: 0,
      actualCost: 0,
      startDate: null,
      endDate: null,
      transport: 'Avion',
      companions: '',
      rating: 0,
      addedAt: new Date().toISOString()
    }, ...items])
    setDestination('')
    setCountry('')
  }

  const updateItem = (id, updates) => onUpdate(items.map(i => i.id === id ? { ...i, ...updates } : i))
  const removeItem = (id) => onUpdate(items.filter(i => i.id !== id))

  const addPlace = (tripId, place) => {
    if (!place.trim()) return
    onUpdate(items.map(i => i.id === tripId
      ? { ...i, places: [...(i.places || []), { id: Date.now(), text: place }] }
      : i
    ))
  }

  const removePlace = (tripId, placeId) => {
    onUpdate(items.map(i => i.id === tripId
      ? { ...i, places: (i.places || []).filter(p => p.id !== placeId) }
      : i
    ))
  }

  const filtered = items
    .filter(i => filter === 'all' ? true : i.status === filter)
    .filter(i => !search || i.destination.toLowerCase().includes(search.toLowerCase()) || (i.country || '').toLowerCase().includes(search.toLowerCase()))

  const visited = items.filter(i => i.status === 'visited')
  const countriesVisited = new Set(visited.map(i => i.country).filter(Boolean)).size
  const totalSpent = visited.reduce((s, t) => s + (t.actualCost || 0), 0)
  const plannedBudget = items.filter(i => i.status === 'planned').reduce((s, t) => s + (t.budget || 0), 0)

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Voyages</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">Destinations visitées, planifiées et rêves d'évasion.</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-2xl font-semibold">{visited.length}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Visités</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{countriesVisited}</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Pays</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{totalSpent.toFixed(0)} €</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Dépensé</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{plannedBudget.toFixed(0)} €</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">À venir</p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleAdd} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination (ville)" className="md:col-span-2 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Pays" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800">
            {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <div className="flex justify-end">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map(trip => (
          <TripCard
            key={trip.id}
            trip={trip}
            isExpanded={expanded === trip.id}
            onToggleExpand={() => setExpanded(expanded === trip.id ? null : trip.id)}
            onUpdate={updateItem}
            onDelete={removeItem}
            onAddPlace={addPlace}
            onRemovePlace={removePlace}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <p className="text-sm text-neutral-500">Aucune destination dans cette catégorie.</p>
        </div>
      )}
    </div>
  )
}

function TripCard({ trip, isExpanded, onToggleExpand, onUpdate, onDelete, onAddPlace, onRemovePlace }) {
  const [placeInput, setPlaceInput] = useState('')

  const handleAddPlace = (e) => {
    e.preventDefault()
    onAddPlace(trip.id, placeInput)
    setPlaceInput('')
  }

  const duration = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1
    : null

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
      <div className="p-4 group">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="font-semibold">{trip.destination}</h3>
              {trip.country && <span className="text-xs text-neutral-500">{trip.country}</span>}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 flex-wrap">
              <span className="uppercase tracking-wider">{trip.transport}</span>
              {duration && <><span>·</span><span>{duration} jours</span></>}
              {trip.budget > 0 && <><span>·</span><span>Budget {trip.budget} €</span></>}
              {trip.status === 'visited' && trip.actualCost > 0 && <><span>·</span><span>Coût {trip.actualCost} €</span></>}
              {trip.companions && <><span>·</span><span>Avec : {trip.companions}</span></>}
            </div>
            {(trip.places || []).length > 0 && (
              <p className="text-[11px] text-neutral-500 mt-1.5">{(trip.places || []).length} lieu{(trip.places || []).length > 1 ? 'x' : ''} d'intérêt</p>
            )}
            {trip.status === 'visited' && trip.rating > 0 && (
              <div className="flex gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <Icon key={n} name="star" size={11} filled={n <= trip.rating} className={n <= trip.rating ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-700'} />
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <select value={trip.status} onChange={(e) => onUpdate(trip.id, { status: e.target.value })} className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded-md px-2.5 py-1 focus:outline-none border border-neutral-200 dark:border-neutral-800">
              {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <div className="flex gap-1">
              <button onClick={onToggleExpand} className="text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
                {isExpanded ? 'Réduire' : 'Détails'}
              </button>
              <button onClick={() => onDelete(trip.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition px-1">
                <Icon name="x" size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-neutral-100 dark:border-neutral-900 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={trip.startDate || ''} onChange={(e) => onUpdate(trip.id, { startDate: e.target.value })} placeholder="Date début" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
            <input type="date" value={trip.endDate || ''} onChange={(e) => onUpdate(trip.id, { endDate: e.target.value })} placeholder="Date fin" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
            <input type="number" value={trip.budget || ''} onChange={(e) => onUpdate(trip.id, { budget: parseFloat(e.target.value) || 0 })} placeholder="Budget prévu" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
            <input type="number" value={trip.actualCost || ''} onChange={(e) => onUpdate(trip.id, { actualCost: parseFloat(e.target.value) || 0 })} placeholder="Coût réel" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
            <select value={trip.transport || 'Avion'} onChange={(e) => onUpdate(trip.id, { transport: e.target.value })} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800">
              {transports.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="text" value={trip.companions || ''} onChange={(e) => onUpdate(trip.id, { companions: e.target.value })} placeholder="Avec qui ?" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-2.5 py-1.5 text-xs focus:outline-none border border-neutral-200 dark:border-neutral-800" />
          </div>

          {trip.status === 'visited' && (
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-neutral-500 mr-2">Note :</span>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => onUpdate(trip.id, { rating: n })}>
                  <Icon name="star" size={16} filled={n <= trip.rating} className={n <= trip.rating ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-700'} />
                </button>
              ))}
            </div>
          )}

          <div>
            <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Lieux d'intérêt</label>
            <form onSubmit={handleAddPlace} className="flex gap-2 mt-1">
              <input type="text" value={placeInput} onChange={(e) => setPlaceInput(e.target.value)} placeholder="Restaurant, monument, plage..." className="flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
              <button type="submit" className="text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium">Ajouter</button>
            </form>
            {(trip.places || []).length > 0 && (
              <div className="mt-2 space-y-1">
                {(trip.places || []).map(p => (
                  <div key={p.id} className="group flex items-center gap-2 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 rounded-md">
                    <span className="w-1 h-1 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                    <span className="flex-1 text-sm">{p.text}</span>
                    <button onClick={() => onRemovePlace(trip.id, p.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                      <Icon name="x" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Notes</label>
            <textarea value={trip.notes || ''} onChange={(e) => onUpdate(trip.id, { notes: e.target.value })} rows="3" placeholder="Souvenirs, anecdotes, conseils..." className="w-full mt-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none placeholder-neutral-400 border border-neutral-200 dark:border-neutral-800 resize-none" />
          </div>
        </div>
      )}
    </div>
  )
}
