import type { TurnstileAPI } from '@/components/turnstile/types'

let loading: Promise<TurnstileAPI> | undefined

export function loadTurnstile(): Promise<TurnstileAPI> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (loading) return loading
  loading = new Promise<TurnstileAPI>((resolve, reject) => {
    const script = document.createElement('script')
    const timer = window.setTimeout(() => fail(), 15000)
    const fail = () => {
      window.clearTimeout(timer)
      script.remove()
      reject(new Error('Verification could not load'))
    }
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = () => {
      window.clearTimeout(timer)
      if (window.turnstile) resolve(window.turnstile)
      else fail()
    }
    script.onerror = fail
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    loading = undefined
    throw error
  })
  return loading
}
