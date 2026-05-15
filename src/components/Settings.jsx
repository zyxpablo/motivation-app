import { useState, useRef } from 'react'
import { THEMES, applyTheme } from '../utils/themes'
import { setSoundEnabled, isSoundEnabled } from '../utils/sounds'
import Icon from './Icon'

export default function Settings({ data, onImport, theme, setTheme, accentTheme, setAccentTheme }) {
  const [sound, setSound] = useState(isSoundEnabled())
  const [exportStatus, setExportStatus] = useState('')
  const fileInputRef = useRef(null)

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lifeOS-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportStatus('Sauvegarde téléchargée')
    setTimeout(() => setExportStatus(''), 3000)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result)
        onImport(imported)
        setExportStatus('Données importées avec succès')
        setTimeout(() => setExportStatus(''), 3000)
      } catch {
        setExportStatus('Fichier invalide')
        setTimeout(() => setExportStatus(''), 3000)
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    if (confirm('Cette action supprimera définitivement toutes vos données. Êtes-vous sûr de vouloir continuer ?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleSound = (val) => {
    setSound(val)
    setSoundEnabled(val)
  }

  const handleAccent = (id) => {
    setAccentTheme(id)
    applyTheme(id)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <header className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5">Personnalisez l'expérience selon vos préférences.</p>
      </header>

      <Section title="Apparence" desc="Personnalisez le thème et les couleurs de l'interface.">
        <Row label="Thème" desc="Mode clair ou sombre">
          <div className="flex gap-1">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition ${theme === 'light' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium' : 'bg-neutral-100 dark:bg-neutral-900'}`}
            >
              <Icon name="sun" size={12} /> Clair
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition ${theme === 'dark' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium' : 'bg-neutral-100 dark:bg-neutral-900'}`}
            >
              <Icon name="moon" size={12} /> Sombre
            </button>
          </div>
        </Row>

        <Row label="Couleur d'accent" desc="Personnalise la teinte principale">
          <div className="flex gap-1.5">
            {Object.entries(THEMES).map(([id, t]) => (
              <button
                key={id}
                onClick={() => handleAccent(id)}
                className={`w-7 h-7 rounded-md ring-offset-2 ring-offset-neutral-50 dark:ring-offset-neutral-950 transition ${accentTheme === id ? 'ring-2 ring-neutral-900 dark:ring-white' : ''}`}
                style={{ backgroundColor: t.primary }}
                title={t.name}
              />
            ))}
          </div>
        </Row>
      </Section>

      <Section title="Sons" desc="Effets sonores discrets pour les interactions.">
        <Row label="Effets sonores" desc="Bips et confirmations audio">
          <Toggle on={sound} onChange={handleSound} />
        </Row>
      </Section>

      <Section title="Sauvegarde & Synchronisation" desc="Exportez ou importez vos données pour les transférer.">
        <div className="space-y-3">
          <Row label="Exporter mes données" desc="Télécharger un fichier JSON de sauvegarde">
            <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition">
              <Icon name="download" size={12} /> Télécharger
            </button>
          </Row>
          <Row label="Importer des données" desc="Restaurer depuis un fichier JSON">
            <>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition">
                <Icon name="upload" size={12} /> Importer
              </button>
            </>
          </Row>
          {exportStatus && (
            <div className="px-3 py-2 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-400">
              {exportStatus}
            </div>
          )}
        </div>
      </Section>

      <Section title="Données" desc="Statistiques sur votre utilisation.">
        <div className="grid grid-cols-3 gap-3">
          <DataStat label="Tâches" value={data.tasks?.length || 0} />
          <DataStat label="Entrées journal" value={data.journal?.length || 0} />
          <DataStat label="Transactions" value={data.finances?.transactions?.length || 0} />
          <DataStat label="Livres" value={data.books?.length || 0} />
          <DataStat label="Films/Séries" value={data.watchlist?.length || 0} />
          <DataStat label="Voyages" value={data.travels?.length || 0} />
        </div>
      </Section>

      <Section title="Zone sensible" desc="Actions irréversibles.">
        <Row label="Réinitialiser tout" desc="Supprime définitivement toutes vos données">
          <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-950 transition">
            <Icon name="alert" size={12} /> Tout effacer
          </button>
        </Row>
      </Section>

      <Section title="Raccourcis clavier">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <Shortcut keys="⌘ K" desc="Ouvrir la palette de commandes" />
          <Shortcut keys="↑ ↓" desc="Naviguer dans les listes" />
          <Shortcut keys="↵" desc="Sélectionner / Valider" />
          <Shortcut keys="ESC" desc="Fermer une fenêtre modale" />
        </div>
      </Section>

      <Section title="À propos">
        <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
          <p><strong className="text-neutral-900 dark:text-neutral-100">Life OS</strong> — Tableau de bord personnel pour gérer votre quotidien.</p>
          <p>Toutes les données sont stockées localement dans votre navigateur. Aucune information n'est transmise à un serveur externe.</p>
          <p className="text-neutral-500">Version 1.0</p>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, desc, children }) {
  return (
    <section className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
      <header className="mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-900">
        <h2 className="text-sm font-semibold">{title}</h2>
        {desc && <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>}
      </header>
      {children}
    </section>
  )
}

function Row({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-10 h-5 rounded-full transition-colors relative ${on ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-300 dark:bg-neutral-700'}`}
    >
      <span className={`absolute top-0.5 ${on ? 'left-5' : 'left-0.5'} w-4 h-4 bg-white dark:bg-neutral-900 rounded-full transition-all`} />
    </button>
  )
}

function DataStat({ label, value }) {
  return (
    <div className="px-3 py-2 rounded-md bg-neutral-50 dark:bg-neutral-900">
      <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  )
}

function Shortcut({ keys, desc }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md bg-neutral-50 dark:bg-neutral-900">
      <kbd className="text-xs font-mono px-2 py-0.5 bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800">{keys}</kbd>
      <span className="text-xs text-neutral-600 dark:text-neutral-400">{desc}</span>
    </div>
  )
}
