<template>
  <div class="enterprise-page">
    <HomeHeader />
    <main>
      <EnterpriseHero />
      <EnterpriseCapabilities />
      <EnterpriseSecurity />
      <EnterpriseCaseStudy />
      <EnterpriseLeadForm />
    </main>
    <HomeFooter />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import HomeHeader from '@/views/home/components/HomeHeader.vue'
import HomeFooter from '@/views/home/components/HomeFooter.vue'
import EnterpriseHero from './components/EnterpriseHero.vue'
import EnterpriseCapabilities from './components/EnterpriseCapabilities.vue'
import EnterpriseSecurity from './components/EnterpriseSecurity.vue'
import EnterpriseCaseStudy from './components/EnterpriseCaseStudy.vue'
import EnterpriseLeadForm from './components/EnterpriseLeadForm.vue'

defineOptions({
  name: 'EnterprisePage',
})

useScrollReveal()

useHead({
  title: 'CoStrict 企业版 - 企业级 AI Coding 研发平台',
  meta: [
    {
      name: 'description',
      content:
        'CoStrict 企业版面向规模化研发组织，支持大规模人机协作、组织资产持续沉淀、研发质量与效能度量，以及企业级私有化部署。',
    },
    { property: 'og:title', content: 'CoStrict 企业版 - 企业级 AI Coding 研发平台' },
    {
      property: 'og:description',
      content: '让人机协作规模化运转，让组织资产持续沉淀，让研发质量可控、效能可衡量。',
    },
    { property: 'og:url', content: 'https://costrict.ai/enterprise' },
  ],
  link: [{ rel: 'canonical', href: 'https://costrict.ai/enterprise' }],
})
</script>

<style scoped lang="less">
.enterprise-page {
  background: #050505;
}

.enterprise-page :deep([data-home-reveal]) {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 640ms ease,
    transform 640ms cubic-bezier(0.22, 1, 0.36, 1);
}

.enterprise-page :deep([data-home-reveal='content']) {
  transition-delay: 110ms;
}

.enterprise-page :deep([data-home-reveal].is-revealed) {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .enterprise-page :deep([data-home-reveal]) {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
