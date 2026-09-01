<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ParticleField from '@/components/particle/ParticleField.vue'

defineOptions({
  name: 'CliFinalCta',
})

const { t } = useI18n()
const router = useRouter()

const toDownload = () => {
  document.querySelector('.hero-install-command')?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'center',
  })
}

const toIde = () => router.push({ name: 'IdeIndex' })
</script>

<template>
  <section class="cli-final-cta" aria-labelledby="cli-final-cta-title">
    <div class="cta-particles" aria-hidden="true">
      <ParticleField variant="closing" :interactive="false" />
    </div>

    <div class="cta-inner" data-home-reveal="content">
      <div class="cta-content">
        <h2 id="cli-final-cta-title">{{ t('cli.finalCta.title') }}</h2>
        <p>{{ t('cli.finalCta.description') }}</p>
        <div class="cta-actions">
          <button class="cta-button cta-button-primary" type="button" @click="toDownload">
            {{ t('cli.finalCta.primary') }}
          </button>
          <button class="cta-cross-link" type="button" @click="toIde">
            <span class="cta-cross-context">{{ t('cli.finalCta.crossPrompt') }}</span>
            <span class="cta-cross-action">
              {{ t('cli.finalCta.crossAction') }}
              <span class="cta-cross-arrow" aria-hidden="true">→</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.cli-final-cta {
  position: relative;
  display: flex;
  min-height: 440px;
  align-items: center;
  justify-content: center;
  overflow: visible;
  box-sizing: border-box;
  background: #050505;
}

.cta-particles {
  position: absolute;
  z-index: 1;
  inset: 0;
  overflow: hidden;
  opacity: 0.82;
  pointer-events: none;
  contain: layout paint;
  -webkit-mask-image: radial-gradient(ellipse 54% 70% at 50% 54%, #000 12%, transparent 78%);
  mask-image: radial-gradient(ellipse 54% 70% at 50% 54%, #000 12%, transparent 78%);
}

.cta-inner {
  position: relative;
  z-index: 2;
  width: min(980px, calc(100% - 48px));
  margin: 0 auto;
  transform: translateY(58px);
}

.cta-content {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transform: translateY(8px);

  h2 {
    max-width: 980px;
    margin: 0;
    color: #f3f7fb;
    font-size: 42px;
    font-weight: 600;
    line-height: 52px;
  }

  p {
    margin: 16px 0 0;
    color: #8495aa;
    font-size: 16px;
    line-height: 28px;
  }
}

.cta-actions {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 32px;
}

.cta-button {
  height: 46px;
  padding: 0 22px;
  border: 0;
  border-radius: 10px;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  transition:
    border-color var(--motion-fast) ease,
    background-color var(--motion-fast) ease,
    color var(--motion-fast) ease,
    filter var(--motion-fast) ease;

  &:focus-visible {
    outline: 2px solid rgba(101, 207, 230, 0.62);
    outline-offset: 2px;
  }

  span {
    display: inline-block;
    margin-left: 4px;
  }
}

.cta-button-primary {
  color: #ffffff;
  background: linear-gradient(135deg, #347fff 0%, #279fe9 55%, #22c7d9 100%);
  box-shadow:
    0 9px 26px rgba(43, 143, 242, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    background: linear-gradient(135deg, #438bff 0%, #33aaef 55%, #2dd3e2 100%);
    filter: brightness(1.05);
  }
}

.cta-cross-link {
  display: inline-flex;
  max-width: 100%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 2px 7px;
  padding: 4px;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;

  &:hover .cta-cross-action {
    border-color: rgba(218, 230, 242, 0.55);
    color: #e4edf6;
  }

  &:focus-visible {
    border-radius: 4px;
    outline: 2px solid rgba(101, 207, 230, 0.62);
    outline-offset: 2px;
  }
}

.cta-cross-context {
  color: #66778b;
  font-size: 13px;
}

.cta-cross-action {
  border-bottom: 1px solid rgba(185, 201, 217, 0.28);
  color: #b9c9d9;
  font-weight: 500;
  white-space: nowrap;
  transition:
    border-color var(--motion-fast) ease,
    color var(--motion-fast) ease;
}

.cta-cross-arrow {
  display: inline-block;
  margin-left: 3px;
}

@media (min-width: 1024px) {
  .cta-content h2 {
    white-space: nowrap;
  }
}

@media (max-width: 767px) {
  .cli-final-cta {
    min-height: 480px;
    padding: 0 24px;
  }

  .cta-inner {
    width: 100%;
    transform: translateY(42px);

    h2 {
      font-size: 34px;
      line-height: 44px;
    }
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cta-button,
  .cta-cross-action {
    transition: none;
  }
}
</style>
