import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useEnterpriseLead } from '@/views/enterprise/hooks/useEnterpriseLead'

const INPUT = {
  company: '测试公司',
  name: '测试',
  contact: '13800000000',
  scale: '20 人以下',
  message: '',
  consent: true,
}

function harness() {
  let state!: ReturnType<typeof useEnterpriseLead>
  const wrapper = mount(
    defineComponent({
      setup() {
        state = useEnterpriseLead()
        return () => h('div')
      },
    }),
  )
  return { state, wrapper }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('enterprise lead receipt handling', () => {
  it('blocks duplicate clicks and requires a matching success receipt', async () => {
    let resolve!: (value: Response) => void
    const request = vi.fn<typeof fetch>(
      () =>
        new Promise<Response>((done) => {
          resolve = done
        }),
    )
    vi.stubGlobal('fetch', request)
    const { state, wrapper } = harness()
    const pending = state.submitLead(INPUT, 'test-token')
    await state.submitLead(INPUT, 'test-token')
    expect(request).toHaveBeenCalledTimes(1)
    expect(state.isSubmitting.value).toBe(true)
    const requestId = JSON.parse(String(request.mock.calls[0][1]?.body)).requestId
    resolve(Response.json({ success: true, requestId }))
    await pending
    expect(state.isSubmitted.value).toBe(true)
    expect(state.isSubmitting.value).toBe(false)
    wrapper.unmount()
  })

  it.each([400, 502, 503, 429])(
    'does not show success for HTTP %s and allows retry',
    async (status) => {
      const request = vi.fn().mockResolvedValue(new Response('{}', { status }))
      vi.stubGlobal('fetch', request)
      const { state, wrapper } = harness()
      await state.submitLead(INPUT, 'test-token')
      expect(state.isSubmitted.value).toBe(false)
      expect(state.submitError.value).not.toBeNull()
      await state.submitLead(INPUT, 'test-token')
      expect(request).toHaveBeenCalledTimes(2)
      expect(request.mock.calls[0][1].body).toBe(request.mock.calls[1][1].body)
      wrapper.unmount()
    },
  )

  it('keeps the request ID when refreshing the token and changes it for new content', async () => {
    const request = vi.fn().mockResolvedValue(new Response('{}', { status: 503 }))
    vi.stubGlobal('fetch', request)
    const { state, wrapper } = harness()
    await state.submitLead(INPUT, 'old-token')
    await state.submitLead(INPUT, 'fresh-token')
    await state.submitLead({ ...INPUT, company: '另一家公司' }, 'another-token')
    const payloads = request.mock.calls.map((call) => JSON.parse(call[1].body))
    expect(payloads[0].requestId).toBe(payloads[1].requestId)
    expect(payloads[1].turnstileToken).toBe('fresh-token')
    expect(payloads[1].requestId).not.toBe(payloads[2].requestId)
    wrapper.unmount()
  })

  it('rejects an HTML fallback or mismatched success response', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(new Response('<html>SPA</html>'))
      .mockResolvedValueOnce(Response.json({ success: true, requestId: 'wrong-id' }))
    vi.stubGlobal('fetch', request)
    const { state, wrapper } = harness()
    await state.submitLead(INPUT, 'test-token')
    expect(state.isSubmitted.value).toBe(false)
    await state.submitLead(INPUT, 'test-token')
    expect(state.isSubmitted.value).toBe(false)
    wrapper.unmount()
  })
})
