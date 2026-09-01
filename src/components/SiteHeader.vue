<template>
  <header
    class="home-header"
    :class="{
      'is-morphing': scrollProgress > 0,
      'is-overlay': isOverlayRoute,
    }"
    :style="navStyle"
  >
    <div class="main-nav-row">
      <div class="main-nav-inner">
        <button
          class="brand-anchor"
          type="button"
          @click="toHome"
        >
          <img src="@/assets/home/redesign/navbar-logo.svg" alt="CoStrict" />
        </button>

        <nav
          class="nav-pill"
          :class="{ 'is-morphing': scrollProgress > 0 }"
          aria-label="Primary navigation"
        >
          <ProductMenu v-if="!isEnglish" class="home-product-menu" />
          <template v-else>
            <button
              v-for="item in productNavigationItems"
              :key="item.key"
              class="nav-pill-item"
              :class="{ active: isProductItemActive(item.key) }"
              type="button"
              @click="navigateProduct(item.route)"
            >
              {{ item.title }}
            </button>
          </template>
          <button
            v-if="!isEnglish"
            class="nav-pill-item"
            :class="{ active: activeNav === 'pricing' }"
            type="button"
            @click="toRoute('pricing')"
          >
            {{ t('home.redesign.header.pricing') }}
          </button>
          <a class="nav-pill-item" :href="docsUrl" target="_blank" rel="noopener">
            {{ t('home.redesign.header.docs') }}
          </a>
          <button
            v-if="!isEnglish"
            class="nav-pill-item"
            :class="{ active: activeNav === 'blog' }"
            type="button"
            @click="toRoute('blog')"
          >
            {{ t('home.redesign.header.blog') }}
          </button>
          <button
            class="nav-pill-item"
            :class="{ active: activeNav === 'operation' }"
            type="button"
            @click="toRoute('operation')"
          >
            {{ t('home.redesign.header.activity') }}
          </button>
        </nav>

        <div class="actions-anchor" :class="{ 'is-morphing': scrollProgress > 0 }">
          <GithubStars />
          <LanguageSwitcher
            :is-open="isLanguageSwitcherOpen"
            :is-pricing-page="false"
            :is-ccf-competition-page="false"
            @update:is-open="handleLanguageSwitcherUpdate"
          />
          <button
            class="mobile-menu-toggle"
            type="button"
            :aria-label="
              isMobileNavOpen
                ? t('home.redesign.header.closeMenu')
                : t('home.redesign.header.openMenu')
            "
            :aria-expanded="isMobileNavOpen"
            aria-controls="home-mobile-navigation"
            @click="toggleMobileNav"
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <Transition name="mobile-nav">
        <nav
          v-if="isMobileNavOpen"
          id="home-mobile-navigation"
          class="mobile-nav-sheet"
          aria-label="Mobile navigation"
        >
          <div v-if="!isEnglish" class="mobile-nav-product">
            <button
              class="mobile-nav-product-trigger"
              :class="{ active: isProductNavigationActive }"
              type="button"
              :aria-expanded="isMobileProductMenuOpen"
              aria-controls="home-mobile-product-navigation"
              @click="toggleMobileProductMenu"
            >
              <span>{{ t('home.redesign.header.product') }}</span>
              <svg viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2 3.5L5 6.5L8 3.5" />
              </svg>
            </button>
            <div
              v-if="isMobileProductMenuOpen"
              id="home-mobile-product-navigation"
              class="mobile-product-items"
            >
              <button
                v-for="item in productNavigationItems"
                :key="item.key"
                class="mobile-product-item"
                :class="{ active: isProductItemActive(item.key) }"
                type="button"
                @click="navigateMobileProduct(item.route)"
              >
                <span>{{ item.title }}</span>
                <small>{{ item.description }}</small>
              </button>
            </div>
          </div>
          <template v-else>
            <button
              v-for="item in productNavigationItems"
              :key="item.key"
              type="button"
              :class="{ active: isProductItemActive(item.key) }"
              @click="navigateMobileProduct(item.route)"
            >
              {{ item.title }}
            </button>
          </template>
          <button v-if="!isEnglish" type="button" @click="navigateMobile('pricing')">
            {{ t('home.redesign.header.pricing') }}
          </button>
          <a :href="docsUrl" target="_blank" rel="noopener" @click="closeMobileNav">
            {{ t('home.redesign.header.docs') }}
          </a>
          <button v-if="!isEnglish" type="button" @click="navigateMobile('blog')">
            {{ t('home.redesign.header.blog') }}
          </button>
          <button type="button" @click="navigateMobile('operation')">
            {{ t('home.redesign.header.activity') }}
          </button>
        </nav>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import GithubStars from '@/components/navbar/GithubStars.vue'
import LanguageSwitcher from '@/components/navbar/LanguageSwitcher.vue'
import ProductMenu from '@/components/navbar/ProductMenu.vue'

defineOptions({
  name: 'SiteHeader',
})

interface ProductNavigationItem {
  key: 'cloud' | 'cli' | 'ide'
  title: string
  description: string
  route: RouteLocationRaw
}

const { t, locale } = useI18n()
const router = useRouter()
const isEnglish = computed(() => locale.value === 'en')
const scrollProgress = ref(0)
const isLanguageSwitcherOpen = ref(false)
const isMobileNavOpen = ref(false)
const isMobileProductMenuOpen = ref(false)
let scrollFrame = 0
const docsUrl = computed(() => `https://docs.costrict.ai${locale.value === 'en' ? '/en' : ''}`)
const NAV_MORPH_DISTANCE = 72
const GLASS_REVEAL_START = 48
const isHomeRoute = computed(() => router.currentRoute.value.name === 'home')
const isOverlayRoute = computed(
  () => !['home', 'augustDeveloperMonth'].includes(router.currentRoute.value.name as string),
)

const navStyle = computed<Record<string, string>>(() => {
  const progress = scrollProgress.value
  const morphProgress = progress * progress
  const scrollDistance = progress * NAV_MORPH_DISTANCE
  const glassProgress = Math.min(
    1,
    Math.max(0, (scrollDistance - GLASS_REVEAL_START) / (NAV_MORPH_DISTANCE - GLASS_REVEAL_START)),
  )
  const glassReveal = glassProgress * glassProgress
  const lerp = (from: number, to: number) => from + (to - from) * morphProgress

  return {
    '--nav-top': `${14 * progress}px`,
    '--nav-height': `${lerp(60, 48)}px`,
    '--nav-padding': `${lerp(0, 18)}px`,
    '--nav-gap': `${lerp(28, 24)}px`,
    '--nav-background-alpha': `${0.52 * glassReveal}`,
    '--nav-border-alpha': `${0.1 * glassReveal}`,
    '--nav-blur': `${18 * glassReveal}px`,
    '--nav-saturation': `${100 + 25 * glassReveal}%`,
    '--nav-shadow-alpha': `${0.26 * glassReveal}`,
    '--nav-highlight-alpha': `${0.055 * glassReveal}`,
    '--brand-opacity': `${isHomeRoute.value ? 1 - progress : 1}`,
  }
})

const activeNav = computed(() => {
  const name = router.currentRoute.value.name as string
  if (name === 'blogDetail') return 'blog'
  if (['augustDeveloperMonth', 'ccfCompetition'].includes(name)) return 'operation'
  if (['home', 'download', 'pricing', 'blog', 'operation'].includes(name)) return name
  return ''
})
const isProductNavigationActive = computed(() => {
  const route = router.currentRoute.value
  const productKey = route.query.product
  return (
    route.name === 'cloud' ||
    route.name === 'CliIndex' ||
    route.name === 'IdeIndex' ||
    (route.name === 'download' && ['cli', 'ide'].includes(productKey as string))
  )
})
const productNavigationItems = computed<ProductNavigationItem[]>(() => [
  {
    key: 'cloud',
    title: t('productMenu.cloudTitle'),
    description: t('productMenu.cloudDesc'),
    route: { name: 'cloud' },
  },
  {
    key: 'cli',
    title: t('productMenu.cliTitle'),
    description: t('productMenu.cliDesc'),
    route: { name: 'CliIndex' },
  },
  {
    key: 'ide',
    title: t('productMenu.ideTitle'),
    description: t('productMenu.ideDesc'),
    route: { name: 'IdeIndex' },
  },
])

const toHome = () => {
  if (router.currentRoute.value.name === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  router.push({ name: 'home' })
}
const toRoute = (name: string) => router.push({ name })
const navigateProduct = (route: RouteLocationRaw) => router.push(route)

const closeMobileNav = () => {
  isMobileNavOpen.value = false
  isMobileProductMenuOpen.value = false
}

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

const navigateMobile = (name: string) => {
  closeMobileNav()
  toRoute(name)
}

const toggleMobileProductMenu = () => {
  isMobileProductMenuOpen.value = !isMobileProductMenuOpen.value
}

const navigateMobileProduct = (route: RouteLocationRaw) => {
  closeMobileNav()
  router.push(route)
}

const isProductItemActive = (key: ProductNavigationItem['key']) => {
  const route = router.currentRoute.value
  if (key === 'cloud') return route.name === 'cloud'
  if (key === 'cli') return route.name === 'CliIndex'
  return route.name === 'IdeIndex'
}

const updateScrollState = () => {
  scrollProgress.value = Math.min(1, Math.max(0, window.scrollY / NAV_MORPH_DISTANCE))
}

const handleScroll = () => {
  if (scrollFrame) return
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0
    updateScrollState()
  })
}

const handleLanguageSwitcherUpdate = (value: boolean) => {
  isLanguageSwitcherOpen.value = value
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMobileNav()
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
})
</script>

<style scoped lang="less">
.home-header {
  position: relative;
  z-index: var(--z-navbar);
  height: 60px;
  background: var(--color-home-bg);

  &.is-overlay {
    height: 0;

    .main-nav-row {
      position: fixed;
      z-index: var(--z-navbar);
      top: var(--nav-top);
      right: 0;
      left: 0;
    }

  }

  &.is-morphing {
    background: transparent;

    .main-nav-row {
      background: transparent;
    }
  }
}

.main-nav-row {
  position: relative;
  width: 100%;
  height: 60px;
  background: var(--color-home-bg);
}

.main-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(var(--home-content-max-width), calc(100% - 160px));
  height: 60px;
  margin: 0 auto;
}

.brand-anchor {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0;
  border: 0;
  color: #f4f6f8;
  background: transparent;
  font: inherit;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  white-space: nowrap;
  cursor: pointer;
  opacity: var(--brand-opacity);
  transition:
    opacity 200ms ease;

  img {
    display: block;
    width: 112px;
    height: 25px;
  }
}

.nav-pill {
  position: fixed;
  z-index: var(--z-navbar);
  top: var(--nav-top);
  left: 50%;
  display: flex;
  align-items: center;
  gap: 28px;
  box-sizing: border-box;
  height: 60px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  transform: translateX(-50%);
  will-change: transform;

  &.is-morphing {
    gap: var(--nav-gap);
    height: var(--nav-height);
    padding: 0 var(--nav-padding);
    border: 1px solid rgba(255, 255, 255, var(--nav-border-alpha));
    border-radius: 999px;
    background: rgba(14, 16, 19, var(--nav-background-alpha));
    box-shadow:
      0 10px 36px rgba(0, 0, 0, var(--nav-shadow-alpha)),
      inset 0 1px 0 rgba(255, 255, 255, var(--nav-highlight-alpha));
    backdrop-filter: blur(var(--nav-blur)) saturate(var(--nav-saturation));
    -webkit-backdrop-filter: blur(var(--nav-blur)) saturate(var(--nav-saturation));
  }
}

.nav-pill-item {
  padding: 0;
  border: 0;
  color: #a4afbb;
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition: color 200ms ease;

  &:hover,
  &.active {
    color: #ffffff;
  }

  &:focus-visible {
    color: #ffffff;
    border-radius: 4px;
    outline: 1px solid rgba(255, 255, 255, 0.28);
    outline-offset: 4px;
  }
}

.home-product-menu {
  :deep(.product-trigger) {
    gap: 4px;
    padding: 0;
    color: #a4afbb;
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    transition: color 200ms ease;

    &:hover,
    &.is-open,
    &.is-active {
      color: #ffffff;
    }

    &:focus-visible {
      border-radius: 4px;
      outline: 1px solid rgba(255, 255, 255, 0.28);
      outline-offset: 4px;
    }
  }

  :deep(.trigger-arrow) {
    width: 9px;
    height: 9px;
    opacity: 0.72;
  }

  :deep(.product-panel) {
    top: calc(100% + 14px);
    border-color: rgba(255, 255, 255, 0.1);
    background: rgba(14, 17, 21, 0.94);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(18px) saturate(115%);
    -webkit-backdrop-filter: blur(18px) saturate(115%);
  }

  :deep(.product-item:hover .icon-box),
  :deep(.product-item.is-active .icon-box) {
    border-color: rgba(61, 114, 255, 0.48);
    box-shadow: none;
  }

  :deep(.icon-glow) {
    display: none;
  }
}

.actions-anchor {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 60px;
  transition:
    top 420ms cubic-bezier(0.22, 1, 0.36, 1),
    height 420ms cubic-bezier(0.22, 1, 0.36, 1);

  &.is-morphing {
    position: fixed;
    z-index: var(--z-navbar);
    top: var(--nav-top);
    right: max(80px, calc((100vw - var(--home-content-max-width)) / 2));
    height: var(--nav-height);
  }

  :deep(.github-icon) {
    margin: 0;
    color: #a4afbb;
    opacity: 1;

    &:hover {
      color: #ffffff;
    }
  }

  :deep(.github-svg) {
    width: 18px;
    height: 18px;
  }

  :deep(.star-count) {
    margin-left: 6px;
    color: #a4afbb;
    font-size: 13px;
  }

  :deep(.language-trigger) {
    gap: 6px;
    padding: 0;
    color: #a4afbb;
    font-size: 14px;
    line-height: 22px;
    transition: color 200ms ease;

    &:hover {
      color: #ffffff;
      background: transparent;
    }
  }

  :deep(.language-trigger .arrow) {
    margin-left: 0;
    color: currentColor;
    font-size: 8px;
    opacity: 0.72;
  }
}

.mobile-menu-toggle {
  display: none;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #dce6f0;
  background: rgba(255, 255, 255, 0.035);
  cursor: pointer;

  span {
    display: block;
    width: 14px;
    height: 1px;
    margin: 4px auto;
    background: currentColor;
    transition: transform 180ms ease;
  }

  &[aria-expanded='true'] {
    span:first-child {
      transform: translateY(2.5px) rotate(45deg);
    }

    span:last-child {
      transform: translateY(-2.5px) rotate(-45deg);
    }
  }

  &:hover,
  &:focus-visible {
    border-color: rgba(101, 207, 230, 0.56);
    color: #ffffff;
    outline: none;
  }
}

.mobile-nav-sheet {
  position: fixed;
  z-index: calc(var(--z-navbar) + 1);
  top: calc(var(--nav-top) + var(--nav-height) + 8px);
  right: 32px;
  display: grid;
  min-width: 176px;
  padding: 6px;
  border: 1px solid rgba(125, 151, 181, 0.18);
  border-radius: 8px;
  background: rgba(9, 13, 19, 0.96);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(18px) saturate(120%);
  -webkit-backdrop-filter: blur(18px) saturate(120%);

  button,
  a {
    padding: 10px 12px;
    border: 0;
    border-radius: 6px;
    color: #b7c4d1;
    background: transparent;
    font: inherit;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
    text-decoration: none;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.06);
      outline: none;
    }
  }

  > button.active {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
  }
}

.mobile-nav-product-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  svg {
    width: 10px;
    height: 10px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.4;
    transition: transform 180ms ease;
  }

  &[aria-expanded='true'] svg {
    transform: rotate(180deg);
  }

  &.active {
    color: #ffffff;
  }
}

.mobile-product-items {
  display: grid;
  gap: 2px;
  padding: 0 4px 4px;
}

.mobile-product-item {
  display: grid;
  gap: 2px;
  padding: 8px 12px 9px 24px !important;

  span {
    color: #dce6f0;
    font-size: 13px;
    font-weight: 500;
    line-height: 18px;
  }

  small {
    overflow: hidden;
    color: #8190a0;
    font-size: 12px;
    line-height: 17px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.active {
    background: rgba(255, 255, 255, 0.06);

    span {
      color: #ffffff;
    }
  }
}

.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition:
    opacity 180ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

@media (max-width: 1023px) {
  .main-nav-inner {
    width: calc(100% - 64px);
  }

  .nav-pill {
    display: none;
  }

  .mobile-menu-toggle {
    display: grid;
    place-content: center;
  }

  .actions-anchor.is-morphing {
    position: static;
    height: 60px;
  }

  .brand-anchor.is-morphing {
    position: static;
    height: 60px;
  }
}

@media (max-width: 767px) {
  .main-nav-inner {
    width: calc(100% - 48px);
  }

  .actions-anchor {
    gap: 12px;
  }

  .mobile-nav-sheet {
    right: 24px;
    min-width: 164px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-pill,
  .nav-pill-item {
    transition: none;
  }
}
</style>
