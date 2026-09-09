<template>
  <div class="mt-4 min-w-0" aria-live="polite">
    <div ref="container" />
    <p v-if="loading">{{ t('enterprisePage.form.verificationLoading') }}</p>
    <div v-if="failed">
      <p role="alert">{{ t('enterprisePage.form.verificationUnavailable') }}</p>
      <button type="button" class="underline" @click="initialize">
        {{ t('enterprisePage.form.verificationRetry') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiUrl } from '@/utils/api'
import { loadTurnstile } from '@/utils/turnstile'
import type { TurnstileAPI, TurnstileConfig } from './types'

defineOptions({ name: 'TurnstileWidget' })
const emit = defineEmits<{ token: [value: string] }>()
const { t } = useI18n()
const container = ref<HTMLElement>()
const loading = ref(false)
const failed = ref(false)
let api: TurnstileAPI | undefined
let widgetId: string | undefined
let disposed = false
let controller: AbortController | undefined

function clearWidget() {
  emit('token', '')
  if (api && widgetId !== undefined) api.remove(widgetId)
  widgetId = undefined
}

async function initialize() {
  if (loading.value) return
  clearWidget()
  loading.value = true
  failed.value = false
  controller = new AbortController()
  const timer = window.setTimeout(() => controller?.abort(), 10000)
  try {
    const response = await fetch(apiUrl('/cloudflare/turnstile/config'), {
      signal: controller.signal,
      credentials: 'omit',
    })
    if (!response.ok) throw new Error('Verification configuration unavailable')
    const config: TurnstileConfig = await response.json()
    if (
      typeof config.siteKey !== 'string' ||
      !config.siteKey ||
      typeof config.action !== 'string' ||
      !config.action
    ) {
      throw new Error('Invalid verification configuration')
    }
    api = await loadTurnstile()
    if (disposed || !container.value) return
    widgetId = api.render(container.value, {
      sitekey: config.siteKey,
      action: config.action,
      theme: 'dark',
      size: 'flexible',
      callback: (token) => {
        failed.value = false
        emit('token', token)
      },
      'expired-callback': () => emit('token', ''),
      'error-callback': () => {
        failed.value = true
        emit('token', '')
      },
      'timeout-callback': () => {
        failed.value = true
        emit('token', '')
      },
    })
  } catch {
    if (!disposed) failed.value = true
  } finally {
    window.clearTimeout(timer)
    loading.value = false
  }
}

function reset() {
  emit('token', '')
  if (api && widgetId !== undefined) api.reset(widgetId)
}

defineExpose({ reset })
onMounted(initialize)
onBeforeUnmount(() => {
  disposed = true
  controller?.abort()
  clearWidget()
})
</script>

<style scoped lang="less">
p,
button {
  color: #a9b5c2;
  font-size: 13px;
  line-height: 20px;
}
</style>
