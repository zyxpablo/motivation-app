let audioContext = null
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false'

function getContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

function tone(frequency, duration = 100, type = 'sine', volume = 0.1) {
  if (!soundEnabled) return
  try {
    const ctx = getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = frequency
    osc.type = type
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration / 1000)
  } catch (e) {}
}

export const sounds = {
  click: () => tone(800, 50, 'sine', 0.05),
  complete: () => {
    tone(523, 100, 'sine', 0.1)
    setTimeout(() => tone(659, 100, 'sine', 0.1), 100)
    setTimeout(() => tone(784, 150, 'sine', 0.1), 200)
  },
  levelUp: () => {
    tone(523, 100)
    setTimeout(() => tone(659, 100), 80)
    setTimeout(() => tone(784, 100), 160)
    setTimeout(() => tone(1047, 200), 240)
  },
  error: () => tone(200, 200, 'sawtooth', 0.08),
  delete: () => tone(300, 80, 'triangle', 0.06),
  add: () => tone(600, 60, 'sine', 0.06),
}

export function setSoundEnabled(enabled) {
  soundEnabled = enabled
  localStorage.setItem('soundEnabled', enabled)
}

export function isSoundEnabled() {
  return soundEnabled
}
