import { useState, useEffect } from 'react'
import Icon from './Icon'

const weatherIcons = {
  clear: 'sun',
  cloud: 'cloud',
  rain: 'droplet',
}

const codeMap = (code) => {
  if (code === 0 || code === 1) return 'clear'
  if (code >= 2 && code <= 48) return 'cloud'
  if (code >= 51 && code <= 99) return 'rain'
  return 'cloud'
}

export default function Weather() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const cached = localStorage.getItem('weather-cache')
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          setWeather(data)
          return
        }
      } catch {}
    }

    if (!navigator.geolocation) {
      setError(true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          )
          const json = await res.json()
          const data = {
            temp: Math.round(json.current_weather.temperature),
            code: json.current_weather.weathercode,
          }
          setWeather(data)
          localStorage.setItem('weather-cache', JSON.stringify({ data, timestamp: Date.now() }))
        } catch {
          setError(true)
        }
      },
      () => setError(true),
      { timeout: 5000 }
    )
  }, [])

  if (error || !weather) return null

  return (
    <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
      <Icon name={weatherIcons[codeMap(weather.code)]} size={12} />
      <span className="font-medium tabular-nums">{weather.temp}°</span>
    </div>
  )
}
