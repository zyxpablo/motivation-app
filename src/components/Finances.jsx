import { useState, useMemo } from 'react'
import Icon from './Icon'

const categories = [
  { id: 'food', label: 'Alimentation' },
  { id: 'transport', label: 'Transport' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'entertainment', label: 'Loisirs' },
  { id: 'health', label: 'Santé' },
  { id: 'rent', label: 'Logement' },
  { id: 'bills', label: 'Factures' },
  { id: 'subscription', label: 'Abonnements' },
  { id: 'salary', label: 'Salaire' },
  { id: 'freelance', label: 'Freelance' },
  { id: 'investment', label: 'Investissement' },
  { id: 'other', label: 'Autre' },
]

export default function Finances({ finances, onUpdate }) {
  const transactions = finances?.transactions || []
  const budget = finances?.budget || 0
  const savingsGoal = finances?.savingsGoal || 0

  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [recurring, setRecurring] = useState(false)
  const [period, setPeriod] = useState('month')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!label.trim() || !amount) return
    onUpdate({ ...finances, transactions: [{
      id: Date.now(),
      label,
      amount: parseFloat(amount),
      type,
      category,
      date,
      recurring,
      createdAt: new Date().toISOString()
    }, ...transactions] })
    setLabel('')
    setAmount('')
  }

  const remove = (id) => onUpdate({ ...finances, transactions: transactions.filter(t => t.id !== id) })

  const updateBudget = (val) => onUpdate({ ...finances, budget: parseFloat(val) || 0 })
  const updateSavingsGoal = (val) => onUpdate({ ...finances, savingsGoal: parseFloat(val) || 0 })

  const filteredTransactions = useMemo(() => {
    const now = new Date()
    return transactions.filter(t => {
      if (!t.date) return period === 'all'
      const tDate = new Date(t.date)
      if (period === 'month') {
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear()
      }
      if (period === 'year') {
        return tDate.getFullYear() === now.getFullYear()
      }
      return true
    })
  }, [transactions, period])

  const income = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expenses
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0
  const budgetUsage = budget > 0 ? Math.round((expenses / budget) * 100) : 0

  // Category breakdown
  const byCategory = useMemo(() => {
    const result = {}
    filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
      result[t.category] = (result[t.category] || 0) + t.amount
    })
    return Object.entries(result).sort((a, b) => b[1] - a[1])
  }, [filteredTransactions])

  const recurringTransactions = transactions.filter(t => t.recurring)
  const recurringTotal = recurringTransactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Finances</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">Suivi des revenus, dépenses et objectifs d'épargne.</p>
          </div>
          <div className="flex gap-1">
            {[
              { id: 'month', label: 'Ce mois' },
              { id: 'year', label: 'Cette année' },
              { id: 'all', label: 'Total' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-md text-xs transition ${
                  period === p.id
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Solde"
          value={`${balance.toFixed(2)} €`}
          tone={balance >= 0 ? 'positive' : 'negative'}
          sub={`${savingsRate}% d'épargne`}
        />
        <MetricCard
          label="Revenus"
          value={`${income.toFixed(2)} €`}
          tone="positive"
          sub={`${filteredTransactions.filter(t => t.type === 'income').length} entrées`}
        />
        <MetricCard
          label="Dépenses"
          value={`${expenses.toFixed(2)} €`}
          tone="negative"
          sub={`${filteredTransactions.filter(t => t.type === 'expense').length} sorties`}
        />
        <MetricCard
          label="Budget"
          value={budget > 0 ? `${budgetUsage}%` : '—'}
          sub={budget > 0 ? `${expenses.toFixed(0)} / ${budget.toFixed(0)} €` : 'Non défini'}
          tone={budgetUsage > 100 ? 'negative' : budgetUsage > 80 ? 'warning' : 'neutral'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Budget mensuel</h3>
            <span className="text-[11px] text-neutral-500">{budget > 0 ? `${(budget - expenses).toFixed(0)} € restants` : ''}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              value={budget || ''}
              onChange={(e) => updateBudget(e.target.value)}
              placeholder="0"
              className="flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800"
            />
            <span className="text-sm text-neutral-500">€ / mois</span>
          </div>
          {budget > 0 && (
            <div className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${budgetUsage > 100 ? 'bg-red-500' : budgetUsage > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, budgetUsage)}%` }}
              />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Objectif d'épargne</h3>
            <span className="text-[11px] text-neutral-500">{savingsGoal > 0 && balance > 0 ? `${Math.round((balance / savingsGoal) * 100)}%` : ''}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              value={savingsGoal || ''}
              onChange={(e) => updateSavingsGoal(e.target.value)}
              placeholder="0"
              className="flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800"
            />
            <span className="text-sm text-neutral-500">€</span>
          </div>
          {savingsGoal > 0 && (
            <div className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-neutral-900 dark:bg-neutral-100 h-full transition-all"
                style={{ width: `${Math.min(100, (balance / savingsGoal) * 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleAdd} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3">
          <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Description" className="md:col-span-2 bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Montant" className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800">
            <option value="expense">Dépense</option>
            <option value="income">Revenu</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800">
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-neutral-50 dark:bg-neutral-900 rounded-md px-3 py-2 text-sm focus:outline-none border border-neutral-200 dark:border-neutral-800" />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="rounded" />
            Récurrent (abonnement, salaire, etc.)
          </label>
          <button type="submit" className="flex items-center gap-1.5 text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md px-3 py-1.5 font-medium hover:opacity-90 transition">
            <Icon name="plus" size={12} /> Ajouter
          </button>
        </div>
      </form>

      {byCategory.length > 0 && (
        <section>
          <h2 className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">Répartition des dépenses</h2>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 space-y-2">
            {byCategory.map(([catId, total]) => {
              const cat = categories.find(c => c.id === catId)
              const percent = expenses > 0 ? Math.round((total / expenses) * 100) : 0
              return (
                <div key={catId}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{cat?.label || catId}</span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-neutral-500">{percent}%</span>
                      <span className="font-medium tabular-nums">{total.toFixed(2)} €</span>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-full h-1 overflow-hidden">
                    <div className="bg-neutral-900 dark:bg-neutral-100 h-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {recurringTransactions.length > 0 && (
        <section>
          <h2 className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
            Récurrent · {recurringTotal.toFixed(0)} €/mois
          </h2>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 divide-y divide-neutral-100 dark:divide-neutral-900">
            {recurringTransactions.map(t => (
              <TransactionRow key={t.id} t={t} categories={categories} onDelete={remove} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
          Transactions récentes
        </h2>
        {filteredTransactions.length > 0 ? (
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 divide-y divide-neutral-100 dark:divide-neutral-900">
            {filteredTransactions.slice(0, 30).map(t => (
              <TransactionRow key={t.id} t={t} categories={categories} onDelete={remove} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
            <p className="text-sm text-neutral-500">Aucune transaction pour cette période.</p>
          </div>
        )}
      </section>
    </div>
  )
}

function MetricCard({ label, value, sub, tone = 'neutral' }) {
  const toneClass = tone === 'positive' ? 'text-emerald-600 dark:text-emerald-500'
    : tone === 'negative' ? 'text-red-600 dark:text-red-500'
    : tone === 'warning' ? 'text-amber-600 dark:text-amber-500'
    : ''
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
      <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-3">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${toneClass}`}>{value}</p>
      <p className="text-[11px] text-neutral-500 mt-1">{sub}</p>
    </div>
  )
}

function TransactionRow({ t, categories, onDelete }) {
  const cat = categories.find(c => c.id === t.category)
  return (
    <div className="group flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition">
      <span className={`w-1 h-8 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-red-400'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{t.label}</p>
        <p className="text-[11px] text-neutral-500 flex items-center gap-2">
          <span className="uppercase tracking-wider">{cat?.label || t.category}</span>
          {t.date && <span>·</span>}
          {t.date && <span>{new Date(t.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>}
          {t.recurring && <><span>·</span><span className="text-blue-600 dark:text-blue-400">Récurrent</span></>}
        </p>
      </div>
      <span className={`text-sm font-semibold tabular-nums ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-neutral-900 dark:text-neutral-100'}`}>
        {t.type === 'income' ? '+' : '−'}{t.amount.toFixed(2)} €
      </span>
      <button onClick={() => onDelete(t.id)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
        <Icon name="x" size={12} />
      </button>
    </div>
  )
}
