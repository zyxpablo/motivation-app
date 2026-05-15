export const ALL_ACHIEVEMENTS = [
  // Tasks
  { id: 'first_task', icon: '✨', name: 'Premier pas', desc: 'Complète ta première tâche', check: (d) => d.tasks.filter(t => t.completed).length >= 1 },
  { id: 'task_10', icon: '🎯', name: 'Sur la lancée', desc: '10 tâches complétées', check: (d) => d.tasks.filter(t => t.completed).length >= 10 },
  { id: 'task_50', icon: '🏆', name: 'Productif', desc: '50 tâches complétées', check: (d) => d.tasks.filter(t => t.completed).length >= 50 },
  { id: 'task_100', icon: '👑', name: 'Machine', desc: '100 tâches complétées', check: (d) => d.tasks.filter(t => t.completed).length >= 100 },

  // Streak
  { id: 'streak_3', icon: '🔥', name: 'En chauffe', desc: '3 jours de streak', check: (d) => d.streak >= 3 },
  { id: 'streak_7', icon: '🔥', name: 'Une semaine', desc: '7 jours de streak', check: (d) => d.streak >= 7 },
  { id: 'streak_30', icon: '⚡', name: 'Un mois', desc: '30 jours de streak', check: (d) => d.streak >= 30 },
  { id: 'streak_100', icon: '💎', name: 'Légende', desc: '100 jours de streak', check: (d) => d.streak >= 100 },

  // Level
  { id: 'level_5', icon: '⭐', name: 'Niveau 5', desc: 'Atteins le niveau 5', check: (d) => d.stats.level >= 5 },
  { id: 'level_10', icon: '🌟', name: 'Niveau 10', desc: 'Atteins le niveau 10', check: (d) => d.stats.level >= 10 },
  { id: 'level_25', icon: '✨', name: 'Niveau 25', desc: 'Atteins le niveau 25', check: (d) => d.stats.level >= 25 },

  // Objectives
  { id: 'first_obj', icon: '🎯', name: 'Visionnaire', desc: 'Crée ton premier objectif', check: (d) => d.objectives.length >= 1 },
  { id: 'obj_complete_1', icon: '🏅', name: 'Premier accomplissement', desc: 'Termine 1 objectif à 100%', check: (d) => d.objectives.filter(o => o.progress === 100).length >= 1 },
  { id: 'obj_complete_5', icon: '🥇', name: 'Accompli', desc: 'Termine 5 objectifs', check: (d) => d.objectives.filter(o => o.progress === 100).length >= 5 },

  // Habits
  { id: 'first_habit', icon: '🌱', name: 'Nouvelle routine', desc: 'Crée ta première habitude', check: (d) => d.habits.length >= 1 },
  { id: 'habits_5', icon: '🌳', name: 'Bien ancré', desc: '5 habitudes actives', check: (d) => d.habits.length >= 5 },

  // Journal
  { id: 'first_journal', icon: '📝', name: 'Réflexion', desc: 'Première entrée du journal', check: (d) => (d.journal || []).length >= 1 },
  { id: 'journal_10', icon: '📖', name: 'Auteur', desc: '10 entrées du journal', check: (d) => (d.journal || []).length >= 10 },

  // Finance
  { id: 'first_transaction', icon: '💰', name: 'Budget tracker', desc: 'Première transaction enregistrée', check: (d) => (d.finances?.transactions || []).length >= 1 },

  // Health
  { id: 'water_goal', icon: '💧', name: 'Bien hydraté', desc: '8 verres d\'eau dans la journée', check: (d) => (d.health?.water || 0) >= 8 },
  { id: 'first_workout', icon: '💪', name: 'Premier exercice', desc: 'Enregistre ton premier workout', check: (d) => (d.health?.workouts || []).length >= 1 },

  // Books
  { id: 'first_book', icon: '📚', name: 'Lecteur', desc: 'Premier livre ajouté', check: (d) => (d.books || []).length >= 1 },
  { id: 'book_finished', icon: '🎓', name: 'Lecture terminée', desc: 'Termine ton premier livre', check: (d) => (d.books || []).filter(b => b.status === 'finished').length >= 1 },

  // Watchlist
  { id: 'first_movie', icon: '🎬', name: 'Cinéphile', desc: 'Premier film/série ajouté', check: (d) => (d.watchlist || []).length >= 1 },

  // Travel
  { id: 'first_trip', icon: '✈️', name: 'Explorateur', desc: 'Premier voyage ajouté', check: (d) => (d.travels || []).length >= 1 },
]

export function getUnlockedAchievements(data) {
  return ALL_ACHIEVEMENTS.filter(a => a.check(data))
}

export function getNewAchievements(prevData, newData) {
  const prevUnlocked = new Set(getUnlockedAchievements(prevData).map(a => a.id))
  const nowUnlocked = getUnlockedAchievements(newData)
  return nowUnlocked.filter(a => !prevUnlocked.has(a.id))
}
