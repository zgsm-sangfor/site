<script setup lang="ts">
import { computed, watch } from 'vue'
import { NMessageProvider } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteAnnouncement from '@/components/SiteAnnouncement.vue'
import { useCreditsServiceCutoff } from '@/hooks/useCreditsServiceCutoff'
import { useRouterPrefetch } from '@/hooks/useRouterPrefetch'

// 启用路由悬停预加载
useRouterPrefetch()

const route = useRoute()
const router = useRouter()
const { isCreditsServiceEnded } = useCreditsServiceCutoff()
const showNavbar = computed(() => route.meta.hideNavbar !== true)
const ACTIVITY_ROUTE_NAMES = new Set(['operation', 'augustDeveloperMonth', 'ccfCompetition'])

watch(
  [isCreditsServiceEnded, () => route.name],
  ([isEnded, routeName]) => {
    if (!isEnded || !ACTIVITY_ROUTE_NAMES.has(String(routeName))) return
    router.replace({
      name: 'home',
      query: route.query.preview === 'disabled' ? { preview: 'disabled' } : undefined,
    })
  },
  { immediate: true },
)
</script>

<template>
  <SiteAnnouncement />
  <SiteHeader v-if="showNavbar" />
  <n-message-provider>
    <main>
      <router-view />
    </main>
  </n-message-provider>
</template>
