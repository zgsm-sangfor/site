import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import TurnstileWidget from '@/components/turnstile/TurnstileWidget.vue'
import { loadTurnstile } from '@/utils/turnstile'
import type { TurnstileAPI } from '@/components/turnstile/types'

vi.mock('@/utils/turnstile', () => ({ loadTurnstile: vi.fn() }))
const i18n = createI18n({ legacy: false, locale: 'en', missingWarn: false, fallbackWarn: false })

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('Turnstile widget lifecycle without a browser', () => {
  it('clears expired tokens, resets after submit failure, and removes on unmount', async () => {
    let callbacks!: Parameters<TurnstileAPI['render']>[1]
    const api = {
      render: vi.fn((_element, options) => {
        callbacks = options
        return 'widget'
      }),
      reset: vi.fn(),
      remove: vi.fn(),
    }
    vi.mocked(loadTurnstile).mockResolvedValue(api)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ siteKey: 'key', action: 'enterprise_submit' })),
    )
    const wrapper = mount(TurnstileWidget, { global: { plugins: [i18n] } })
    await flushPromises()
    expect(callbacks.action).toBe('enterprise_submit')
    callbacks.callback('token')
    expect(wrapper.emitted('token')?.at(-1)).toEqual(['token'])
    callbacks['expired-callback']()
    expect(wrapper.emitted('token')?.at(-1)).toEqual([''])
    wrapper.vm.reset()
    expect(api.reset).toHaveBeenCalledWith('widget')
    wrapper.unmount()
    expect(api.remove).toHaveBeenCalledWith('widget')
  })

  it('offers retry when configuration cannot load and prevents rendering after unmount', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 503 })))
    const wrapper = mount(TurnstileWidget, { global: { plugins: [i18n] } })
    await flushPromises()
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(loadTurnstile).not.toHaveBeenCalled()
    wrapper.unmount()

    let resolve!: (value: Response) => void
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise<Response>((done) => {
            resolve = done
          }),
      ),
    )
    const api = { render: vi.fn(), reset: vi.fn(), remove: vi.fn() }
    vi.mocked(loadTurnstile).mockResolvedValue(api)
    const disposed = mount(TurnstileWidget, { global: { plugins: [i18n] } })
    disposed.unmount()
    resolve(Response.json({ siteKey: 'key', action: 'enterprise_submit' }))
    await flushPromises()
    expect(api.render).not.toHaveBeenCalled()
  })
})
