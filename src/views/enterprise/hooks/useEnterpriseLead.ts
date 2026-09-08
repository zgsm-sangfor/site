import { onBeforeUnmount, ref } from 'vue'
import { ENTERPRISE_LEAD_ENDPOINT } from '../constants'
import type { EnterpriseLeadError, EnterpriseLeadInput } from '../types'

export function useEnterpriseLead() {
  const isSubmitting = ref(false)
  const isSubmitted = ref(false)
  const submitError = ref<EnterpriseLeadError | null>(null)
  let controller: AbortController | undefined
  let lastPayload = ''
  let requestId = ''

  const submitLead = async (input: EnterpriseLeadInput, turnstileToken: string) => {
    if (isSubmitting.value || isSubmitted.value) return
    isSubmitting.value = true
    submitError.value = null
    controller = new AbortController()
    const timer = setTimeout(() => controller?.abort(), 12000)
    try {
      const payload = JSON.stringify(input)
      if (payload !== lastPayload) {
        requestId = crypto.randomUUID()
        lastPayload = payload
      }
      const response = await fetch(ENTERPRISE_LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...input, requestId, turnstileToken }),
        credentials: 'omit',
        signal: controller.signal,
      })
      if (!response.ok) {
        const result = await response.json().catch(() => null)
        submitError.value =
          result?.error === 'verification_failed'
            ? 'verificationRequired'
            : response.status === 429
              ? 'tooManyRequests'
              : response.status === 503
                ? 'serviceUnavailable'
                : 'submitFailed'
        return
      }
      const result: unknown = await response.json()
      if (
        !result ||
        typeof result !== 'object' ||
        !('success' in result) ||
        result.success !== true ||
        !('requestId' in result) ||
        result.requestId !== requestId
      ) {
        submitError.value = 'submitFailed'
        return
      }
      isSubmitted.value = true
    } catch {
      submitError.value = 'submitFailed'
    } finally {
      clearTimeout(timer)
      controller = undefined
      isSubmitting.value = false
    }
  }

  onBeforeUnmount(() => controller?.abort())
  return { isSubmitting, isSubmitted, submitError, submitLead }
}
