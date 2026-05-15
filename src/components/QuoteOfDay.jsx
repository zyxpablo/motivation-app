import { useState, useEffect } from 'react'

const FALLBACK_QUOTES = [
  { q: "La discipline est le pont entre les objectifs et les accomplissements.", a: "Jim Rohn" },
  { q: "La seule façon de faire du bon travail, c'est d'aimer ce que tu fais.", a: "Steve Jobs" },
  { q: "Le succès, c'est tomber sept fois et se relever huit.", a: "Proverbe japonais" },
  { q: "Tu ne te noies pas en tombant à l'eau, tu te noies en y restant.", a: "Inconnu" },
  { q: "Commence là où tu es. Utilise ce que tu as. Fais ce que tu peux.", a: "Arthur Ashe" },
  { q: "Le meilleur moment pour planter un arbre c'était il y a 20 ans. Le deuxième meilleur, c'est maintenant.", a: "Proverbe chinois" },
  { q: "La motivation te lance, l'habitude te maintient.", a: "Jim Ryun" },
  { q: "N'attends pas. Le moment ne sera jamais parfait.", a: "Napoleon Hill" },
  { q: "Une journée à la fois, un pas à la fois.", a: "Anonyme" },
  { q: "Tes seules limites sont celles que tu te fixes.", a: "Albert Einstein" },
]

export default function QuoteOfDay() {
  const [quote, setQuote] = useState(null)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const cached = localStorage.getItem('quote-of-day')
    if (cached) {
      try {
        const { data, date } = JSON.parse(cached)
        if (date === today) {
          setQuote(data)
          return
        }
      } catch {}
    }

    const fetchQuote = async () => {
      try {
        const res = await fetch('https://api.quotable.io/random?tags=motivational|inspirational|success&maxLength=120', {
          signal: AbortSignal.timeout(3000)
        })
        if (!res.ok) throw new Error()
        const json = await res.json()
        const data = { q: json.content, a: json.author }
        setQuote(data)
        localStorage.setItem('quote-of-day', JSON.stringify({ data, date: today }))
      } catch {
        const idx = new Date().getDate() % FALLBACK_QUOTES.length
        const data = FALLBACK_QUOTES[idx]
        setQuote(data)
        localStorage.setItem('quote-of-day', JSON.stringify({ data, date: today }))
      }
    }

    fetchQuote()
  }, [])

  if (!quote) {
    return (
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6">
        <div className="h-3 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse w-3/4 mb-2" />
        <div className="h-2 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse w-1/4" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6">
      <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-3">Citation du jour</p>
      <p className="text-base italic text-neutral-700 dark:text-neutral-300 leading-relaxed">
        « {quote.q} »
      </p>
      <p className="text-xs text-neutral-500 mt-3">— {quote.a}</p>
    </div>
  )
}
