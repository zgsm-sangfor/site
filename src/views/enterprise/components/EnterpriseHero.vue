<template>
  <section class="enterprise-hero" aria-labelledby="enterprise-hero-title">
    <div class="hero-beams" aria-hidden="true">
      <span class="beam beam--wide"></span>
      <span class="beam beam--mid"></span>
      <span class="beam beam--thin"></span>
      <span class="beam beam--halo"></span>
    </div>

    <div class="hero-inner" data-home-reveal="content">
      <span class="hero-eyebrow">{{ t('enterprisePage.hero.eyebrow') }}</span>
      <h1 id="enterprise-hero-title">{{ t('enterprisePage.hero.title') }}</h1>
      <p class="hero-subtitle">{{ t('enterprisePage.hero.subtitle') }}</p>
      <button class="hero-button" type="button" @click="scrollToForm">
        {{ t('enterprisePage.hero.primary') }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'EnterpriseHero',
})

const { t } = useI18n()

const scrollToForm = () => {
  document.getElementById('enterprise-lead')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped lang="less">
.enterprise-hero {
  position: relative;
  display: flex;
  min-height: 720px;
  margin-top: -94px;
  padding: 184px 0 100px;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  background: #050505;
}

.hero-beams {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: none;
  pointer-events: none;
  opacity: 0.85;
  isolation: isolate;
  contain: strict;
  mix-blend-mode: screen;
}

@media (min-width: 1024px) {
  .hero-beams {
    display: block;
  }
}

.beam {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 9999px;
  transform: rotate(-45deg);
}

.beam--wide {
  width: 35rem;
  height: 80rem;
  transform: translateY(-21.875rem) rotate(-45deg);
  background: radial-gradient(
    68.54% 68.72% at 55.02% 31.46%,
    hsla(213, 62%, 88%, 0.22) 0,
    hsla(215, 46%, 62%, 0.07) 50%,
    hsla(215, 42%, 50%, 0) 80%
  );
}

.beam--mid,
.beam--thin {
  width: 14rem;
  height: 80rem;
  background: radial-gradient(
    50% 50% at 50% 50%,
    hsla(210, 66%, 88%, 0.18) 0,
    hsla(213, 50%, 60%, 0.05) 80%,
    transparent 100%
  );
}

.beam--mid {
  transform: translate(5%, -50%) rotate(-45deg);
}

.beam--thin {
  transform: translateY(-21.875rem) rotate(-45deg);
}

.beam--halo {
  left: 50%;
  width: 64rem;
  height: 42rem;
  transform: translate(-50%, -58%);
  background: radial-gradient(
    50% 50% at 50% 50%,
    hsla(215, 72%, 80%, 0.14) 0%,
    hsla(215, 60%, 62%, 0.05) 45%,
    transparent 75%
  );
}

.hero-inner {
  position: relative;
  top: 30px;
  z-index: 1;
  display: flex;
  align-items: center;
  width: min(760px, calc(100% - 48px));
  margin: 0 auto;
  flex-direction: column;
  text-align: center;
}

.hero-eyebrow {
  color: #8495aa;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.12em;
}

h1 {
  margin: 16px 0 0;
  color: #f3f7fb;
  font-size: 56px;
  font-weight: 600;
  line-height: 66px;
}

.hero-subtitle {
  max-width: 700px;
  margin: 18px auto 0;
  color: #9fb0c3;
  font-size: 16px;
  line-height: 28px;
}

.hero-button {
  height: 46px;
  margin-top: 34px;
  padding: 0 22px;
  border: 0;
  border-radius: 8px;
  color: #ffffff;
  background: linear-gradient(120deg, #347fff, #279fe9 58%, #22c7d9);
  box-shadow: 0 8px 24px rgba(43, 143, 242, 0.14);
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  transition: background-color var(--motion-fast) ease;

  &:hover {
    background: linear-gradient(120deg, #438bff, #33aaef 58%, #2dd3e2);
  }
}

@media (max-width: 767px) {
  .enterprise-hero {
    min-height: auto;
    padding: 176px 0 76px;
  }

  .hero-inner {
    top: 16px;
  }

  h1 {
    font-size: 36px;
    line-height: 46px;
  }

  .hero-subtitle {
    font-size: 15px;
    line-height: 26px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-button {
    transition: none;
  }
}
</style>
