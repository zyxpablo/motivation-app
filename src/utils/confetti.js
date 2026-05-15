import confetti from 'canvas-confetti'

export function fireConfetti() {
  const duration = 2000
  const end = Date.now() + duration

  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

  ;(function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

export function fireSmallConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 }
  })
}

export function fireFireworks() {
  const duration = 3000
  const end = Date.now() + duration
  const colors = ['#6366f1', '#ec4899', '#f59e0b']

  ;(function frame() {
    confetti({
      particleCount: 2,
      angle: Math.random() * 360,
      spread: 360,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
      colors
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}
