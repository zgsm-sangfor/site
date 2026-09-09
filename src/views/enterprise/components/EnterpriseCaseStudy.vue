<template>
  <section
    id="enterprise-cases"
    class="enterprise-case"
    :class="{ 'enterprise-case--single': !hasMultipleCases }"
    aria-labelledby="enterprise-case-title"
  >
    <div class="section-inner">
      <header class="case-heading" data-home-reveal="heading">
        <h2 id="enterprise-case-title" :aria-label="t('enterprisePage.caseStudy.eyebrow')">
          <span
            v-for="(character, index) in headingCharacters"
            :key="`${character}-${index}`"
            class="heading-character"
            :style="{ transitionDelay: `${index * 12}ms` }"
            aria-hidden="true"
          >
            {{ character }}
          </span>
        </h2>
        <span v-if="hasMultipleCases" class="case-count">
          {{ formattedIndex }} / {{ formattedTotal }}
        </span>
      </header>

      <div class="section-divider" data-home-reveal="content"></div>

      <div
        class="carousel"
        :class="{ 'carousel--single': !hasMultipleCases }"
        data-home-reveal="content"
      >
        <Transition :name="transitionName" mode="out-in">
          <article
            :key="currentCase.id"
            class="case-slide"
            :class="{ 'case-slide--single': !hasMultipleCases }"
          >
            <div class="case-story">
              <span class="quote-mark" aria-hidden="true">«</span>
              <h3>{{ currentCase.title }}</h3>
              <p v-for="paragraph in currentCase.paragraphs" :key="paragraph">
                {{ paragraph }}
              </p>
              <span class="quote-mark quote-mark--end" aria-hidden="true">»</span>
            </div>

            <footer v-if="hasMultipleCases" class="case-footer">
              <div class="case-controls">
                <button
                  type="button"
                  :aria-label="t('enterprisePage.caseStudy.previous')"
                  :title="t('enterprisePage.caseStudy.previous')"
                  @click="previousCase"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  :aria-label="t('enterprisePage.caseStudy.next')"
                  :title="t('enterprisePage.caseStudy.next')"
                  @click="nextCase"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </footer>
          </article>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'EnterpriseCaseStudy',
})

interface EnterpriseCase {
  id: string
  title: string
  paragraphs: string[]
}

const { t, tm } = useI18n()
const caseItems = computed(() => tm('enterprisePage.caseStudy.cards') as EnterpriseCase[])
const currentIndex = ref(0)
const direction = ref(1)

const currentCase = computed(() => caseItems.value[currentIndex.value])
const transitionName = computed(() => (direction.value > 0 ? 'slide-next' : 'slide-previous'))
const headingCharacters = computed(() => Array.from(t('enterprisePage.caseStudy.eyebrow')))
const hasMultipleCases = computed(() => caseItems.value.length > 1)
const formattedIndex = computed(() => String(currentIndex.value + 1).padStart(2, '0'))
const formattedTotal = computed(() => String(caseItems.value.length).padStart(2, '0'))

const nextCase = () => {
  direction.value = 1
  currentIndex.value = (currentIndex.value + 1) % caseItems.value.length
}

const previousCase = () => {
  direction.value = -1
  currentIndex.value = (currentIndex.value - 1 + caseItems.value.length) % caseItems.value.length
}
</script>

<style scoped lang="less">
.enterprise-case {
  width: 100%;
  min-height: 620px;
  padding: 80px 0 88px;
  overflow: hidden;
  color: #eef4f8;
  background:
    radial-gradient(circle at 84% 42%, rgba(34, 138, 178, 0.08), transparent 34%), #07080b;
}

.enterprise-case--single {
  min-height: auto;
  padding-bottom: 48px;
}

.section-inner {
  width: min(1040px, calc(100% - 64px));
  margin: 0 auto;
}

.case-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.case-heading h2,
.case-count {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.case-heading h2 {
  color: #dce6ef;
  letter-spacing: 0;
}

.heading-character {
  display: inline-block;
  opacity: 0;
  transition: opacity 180ms ease;
}

.case-heading.is-revealed .heading-character {
  opacity: 1;
}

.case-count {
  color: #64778a;
  font-variant-numeric: tabular-nums;
}

.section-divider {
  position: relative;
  height: 1px;
  margin-top: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.section-divider::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #37c7e8, rgba(55, 199, 232, 0.08));
  content: '';
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 800ms ease;
}

.section-divider.is-revealed::after {
  transform: scaleX(1);
}

.carousel {
  position: relative;
  min-height: 404px;
  margin-top: 56px;
}

.case-slide {
  display: grid;
  min-height: 404px;
  grid-template-rows: 1fr auto;
}

.carousel--single,
.case-slide--single {
  min-height: auto;
}

.carousel--single {
  margin-top: 44px;
}

.case-slide--single {
  display: block;
}

.case-story {
  position: relative;
  max-width: 920px;
  padding: 0 44px;
}

.quote-mark {
  position: absolute;
  top: -12px;
  left: 0;
  color: #18a8c8;
  font-family: Georgia, serif;
  font-size: 46px;
  line-height: 1;
}

.quote-mark--end {
  top: auto;
  right: 0;
  bottom: -16px;
  left: auto;
}

.case-story h3 {
  max-width: 780px;
  margin: 0;
  color: #f3f7fb;
  font-size: 36px;
  font-weight: 500;
  line-height: 48px;
}

.case-story p {
  max-width: 840px;
  margin: 20px 0 0;
  color: #91a1b2;
  font-size: 16px;
  line-height: 28px;
}

.case-story p + p {
  margin-top: 12px;
}

.case-footer {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.case-controls {
  display: flex;
  gap: 10px;
}

.case-controls button {
  display: flex;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  color: #8fa1b3;
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  transition:
    color 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
}

.case-controls button:hover,
.case-controls button:focus-visible {
  border-color: rgba(55, 199, 232, 0.42);
  color: #e4faff;
  background: rgba(55, 199, 232, 0.1);
  outline: none;
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-previous-enter-active,
.slide-previous-leave-active {
  transition:
    transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 220ms ease;
}

.slide-next-enter-from,
.slide-previous-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.slide-next-leave-to,
.slide-previous-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

@media (max-width: 767px) {
  .enterprise-case {
    min-height: auto;
    padding: 72px 0 80px;
  }

  .section-inner {
    width: calc(100% - 48px);
  }

  .carousel,
  .case-slide {
    min-height: 590px;
  }

  .carousel--single,
  .case-slide--single {
    min-height: auto;
  }

  .carousel {
    margin-top: 48px;
  }

  .case-story {
    padding: 0 24px;
  }

  .quote-mark {
    top: -6px;
    font-size: 38px;
  }

  .quote-mark--end {
    bottom: -8px;
  }

  .case-story h3 {
    font-size: 30px;
    line-height: 40px;
  }

  .case-story p {
    margin-top: 20px;
    font-size: 15px;
    line-height: 27px;
  }

  .case-footer {
    margin-top: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .heading-character,
  .section-divider::after,
  .case-controls button,
  .slide-next-enter-active,
  .slide-next-leave-active,
  .slide-previous-enter-active,
  .slide-previous-leave-active {
    transition: none;
  }
}
</style>
