export interface TurnstileConfig {
  siteKey: string
  action: string
}

export interface TurnstileAPI {
  render(
    container: HTMLElement,
    options: {
      sitekey: string
      action: string
      theme: 'dark'
      size: 'flexible'
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
      'timeout-callback': () => void
    },
  ): string
  reset(id: string): void
  remove(id: string): void
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI
  }
}
