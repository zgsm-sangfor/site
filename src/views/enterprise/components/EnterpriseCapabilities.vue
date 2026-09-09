<template>
  <div class="enterprise-capabilities">
    <section class="capability-screen collaboration-screen" aria-labelledby="collaboration-title">
      <div class="section-inner collaboration-layout">
        <div class="section-copy" data-home-reveal="heading">
          <h2 id="collaboration-title">
            {{ t('enterprisePage.capabilities.collaboration.title') }}
          </h2>
          <div class="point-list">
            <article v-for="point in collaborationPoints" :key="point.title" class="point-item">
              <h3>{{ point.title }}</h3>
              <p>{{ point.desc }}</p>
            </article>
          </div>
        </div>

        <div class="collaboration-visual" data-home-reveal="content">
          <EnterpriseCollaborationFlow />
          <div class="visual-caption">
            <span>{{ t('enterprisePage.capabilities.collaboration.visualLabel') }}</span>
            <span class="visual-status">
              <i aria-hidden="true"></i>
              {{ t('enterprisePage.capabilities.collaboration.visualStatus') }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="capability-screen knowledge-screen" aria-labelledby="knowledge-title">
      <div class="section-inner knowledge-layout">
        <div class="knowledge-visual" data-home-reveal="content">
          <div class="knowledge-canvas">
            <div class="knowledge-sources">
              <EnterpriseKnowledgeFolder
                :sources="knowledgeSources"
                :label="t('enterprisePage.capabilities.knowledge.visual.sourcesLabel')"
              />
            </div>

            <span class="knowledge-arrow" aria-hidden="true">→</span>

            <div class="knowledge-hub">
              <span class="hub-ring" aria-hidden="true"></span>
              <strong>{{ t('enterprisePage.capabilities.knowledge.visual.hub') }}</strong>
              <small>{{ t('enterprisePage.capabilities.knowledge.visual.hubDesc') }}</small>
            </div>

            <span class="knowledge-arrow" aria-hidden="true">→</span>

            <div class="knowledge-delivery">
              <EnterpriseKnowledgeDelivery
                :factory-title="t('enterprisePage.capabilities.knowledge.visual.factory')"
                :factory-desc="t('enterprisePage.capabilities.knowledge.visual.factoryDesc')"
                :distribution-title="t('enterprisePage.capabilities.knowledge.visual.distribution')"
                :distribution-desc="
                  t('enterprisePage.capabilities.knowledge.visual.distributionDesc')
                "
              />
            </div>
          </div>

          <div class="visual-caption">
            <span>{{ t('enterprisePage.capabilities.knowledge.visualLabel') }}</span>
            <span class="visual-status">
              <i aria-hidden="true"></i>
              {{ t('enterprisePage.capabilities.knowledge.visualStatus') }}
            </span>
          </div>
        </div>

        <div class="section-copy" data-home-reveal="heading">
          <h2 id="knowledge-title">{{ t('enterprisePage.capabilities.knowledge.title') }}</h2>
          <div class="point-list">
            <article v-for="point in knowledgePoints" :key="point.title" class="point-item">
              <h3>{{ point.title }}</h3>
              <p>{{ point.desc }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="capability-screen quality-screen" aria-labelledby="quality-title">
      <div class="section-inner quality-layout">
        <div class="section-copy" data-home-reveal="heading">
          <h2 id="quality-title">{{ t('enterprisePage.capabilities.quality.title') }}</h2>
          <div class="point-list">
            <article v-for="point in qualityPoints" :key="point.title" class="point-item">
              <h3>{{ point.title }}</h3>
              <p>{{ point.desc }}</p>
            </article>
          </div>
        </div>

        <div class="quality-visual" data-home-reveal="content">
          <EnterpriseQualityDelivery />
          <div class="visual-caption">
            <span>{{ t('enterprisePage.capabilities.quality.visualLabel') }}</span>
            <span class="visual-status">
              <i aria-hidden="true"></i>
              {{ t('enterprisePage.capabilities.quality.visualStatus') }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="capability-screen metrics-screen" aria-labelledby="metrics-title">
      <div class="section-inner">
        <header class="metrics-heading" data-home-reveal="heading">
          <h2 id="metrics-title">{{ t('enterprisePage.capabilities.metrics.title') }}</h2>
        </header>

        <div class="metrics-points" data-home-reveal="content">
          <article v-for="point in metricsPoints" :key="point.title" class="metric-point">
            <h3>{{ point.title }}</h3>
            <p>{{ point.desc }}</p>
          </article>
        </div>

        <div class="metrics-visual" data-home-reveal="content">
          <div
            class="dashboard-shot"
            :class="{ 'is-highlighted': isHighlightActive }"
            @mouseleave="deactivateHighlights"
          >
            <div class="dashboard-stage">
              <div class="dashboard-card">
                <img
                  src="@/assets/enterprise/enterprise-metrics-dashboard.webp"
                  :alt="t('enterprisePage.capabilities.metrics.visualAlt')"
                  width="2880"
                  height="1880"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div class="dashboard-pin-layer" aria-hidden="true">
                <div
                  v-for="(pin, index) in metricPins"
                  :key="pin.title"
                  class="dashboard-pin"
                  :class="`dashboard-pin--${index + 1}`"
                >
                  <span class="pin-anchor"></span>
                  <span class="pin-line"></span>
                  <span class="pin-label">
                    <strong>{{ pin.title }}</strong>
                    <span>{{ pin.desc }}</span>
                  </span>
                </div>
              </div>

              <button
                class="dashboard-hotspot"
                type="button"
                :aria-label="t('enterprisePage.capabilities.metrics.highlightTrigger')"
                @mouseenter="scheduleHighlights"
                @mouseleave="cancelHighlightSchedule"
                @focus="activateHighlights"
                @blur="deactivateHighlights"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import EnterpriseCollaborationFlow from './EnterpriseCollaborationFlow.vue'
import EnterpriseKnowledgeDelivery from './EnterpriseKnowledgeDelivery.vue'
import EnterpriseKnowledgeFolder from './EnterpriseKnowledgeFolder.vue'
import EnterpriseQualityDelivery from './EnterpriseQualityDelivery.vue'

defineOptions({
  name: 'EnterpriseCapabilities',
})

interface CapabilityPoint {
  title: string
  desc: string
}

interface MetricPin {
  title: string
  desc: string
}

const { t, tm } = useI18n()
const collaborationPoints = computed(
  () => tm('enterprisePage.capabilities.collaboration.points') as CapabilityPoint[],
)
const knowledgePoints = computed(
  () => tm('enterprisePage.capabilities.knowledge.points') as CapabilityPoint[],
)
const knowledgeSources = computed(
  () => tm('enterprisePage.capabilities.knowledge.visual.sources') as string[],
)
const qualityPoints = computed(
  () => tm('enterprisePage.capabilities.quality.points') as CapabilityPoint[],
)
const metricsPoints = computed(
  () => tm('enterprisePage.capabilities.metrics.points') as CapabilityPoint[],
)
const metricPins = computed(() => tm('enterprisePage.capabilities.metrics.pins') as MetricPin[])
const isHighlightActive = ref(false)

let highlightTimer: ReturnType<typeof setTimeout> | undefined

const cancelHighlightSchedule = () => {
  if (!highlightTimer) return

  clearTimeout(highlightTimer)
  highlightTimer = undefined
}

const activateHighlights = () => {
  cancelHighlightSchedule()
  isHighlightActive.value = true
}

const scheduleHighlights = () => {
  cancelHighlightSchedule()
  highlightTimer = setTimeout(activateHighlights, 250)
}

const deactivateHighlights = () => {
  cancelHighlightSchedule()
  isHighlightActive.value = false
}

onBeforeUnmount(cancelHighlightSchedule)
</script>

<style scoped lang="less">
.enterprise-capabilities {
  background: #050505;
}

.capability-screen {
  position: relative;
  min-height: 700px;
  padding: 88px 0;
  overflow: hidden;
}

.collaboration-screen {
  min-height: 600px;
  padding-top: 48px;
}

.section-inner {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.collaboration-layout,
.knowledge-layout,
.quality-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
  gap: 84px;
  align-items: center;
}

.knowledge-layout {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 64px;
}

.quality-layout {
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: 72px;
}

.section-copy h2,
.metrics-heading h2 {
  margin: 0;
  color: #f3f7fb;
  font-size: 38px;
  font-weight: 600;
  line-height: 50px;
}

.point-list {
  margin-top: 48px;
}

.point-item {
  position: relative;
  padding-left: 22px;

  & + .point-item {
    margin-top: 34px;
  }
}

.point-item::before {
  position: absolute;
  top: 7px;
  bottom: 2px;
  left: 0;
  width: 2px;
  background: linear-gradient(180deg, #37c7e8, rgba(55, 199, 232, 0.06));
  content: '';
}

.point-item h3,
.metric-point h3 {
  margin: 0;
  color: #dce5ef;
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
}

.point-item p,
.metric-point p {
  margin: 10px 0 0;
  color: #8495aa;
  font-size: 14px;
  line-height: 25px;
}

.collaboration-visual {
  overflow: visible;
  background: transparent;
}

.visual-caption {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 14px;
  color: #8292a6;
  font-size: 12px;
  line-height: 20px;
}

.visual-status {
  display: inline-flex;
  align-items: center;
  color: #5f7287;
}

.visual-status i {
  width: 6px;
  height: 6px;
  margin-right: 8px;
  border-radius: 50%;
  background: #42d392;
  box-shadow: 0 0 12px rgba(66, 211, 146, 0.65);
}

.knowledge-screen {
  min-height: auto;
  padding-bottom: 112px;
  background: #07080b;
}

.quality-screen {
  min-height: 700px;
  padding-top: 72px;
  padding-bottom: 72px;
  background: #050505;
}

.quality-visual {
  overflow: visible;
}

.knowledge-visual {
  position: relative;
  overflow: visible;
  background: transparent;
}

.knowledge-canvas {
  display: grid;
  grid-template-columns: 160px 16px minmax(122px, 1fr) 16px 160px;
  gap: 5px;
  align-items: center;
  min-height: 374px;
  padding: 36px 16px;
  background:
    radial-gradient(circle at 50% 50%, rgba(12, 123, 189, 0.14), transparent 38%),
    linear-gradient(rgba(48, 119, 182, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(48, 119, 182, 0.045) 1px, transparent 1px);
  background-size:
    100% 100%,
    36px 36px,
    36px 36px;
}

.knowledge-sources {
  display: flex;
  align-items: center;
  justify-content: center;
}

.knowledge-arrow {
  color: rgba(55, 199, 232, 0.46);
  font-size: 22px;
  line-height: 1;
  text-align: center;
}

.knowledge-hub {
  position: relative;
  display: flex;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(55, 199, 232, 0.22);
  border-radius: 50%;
  flex-direction: column;
  padding: 22px;
  background: radial-gradient(circle, rgba(14, 73, 105, 0.88), rgba(7, 22, 34, 0.96) 70%);
  box-shadow:
    0 0 0 12px rgba(55, 199, 232, 0.025),
    0 0 50px rgba(20, 130, 190, 0.12);
  text-align: center;
}

.hub-ring {
  position: absolute;
  inset: 12px;
  border: 1px dashed rgba(76, 188, 222, 0.18);
  border-radius: 50%;
}

.knowledge-hub strong {
  position: relative;
  width: 100%;
  color: #d8edf2;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  text-align: center;
}

.knowledge-hub small {
  position: relative;
  width: 100%;
  max-width: 98px;
  margin-top: 5px;
  color: #6e899d;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
}

.knowledge-delivery {
  display: flex;
  align-items: center;
  justify-content: center;
}

.metrics-screen {
  min-height: auto;
  padding-top: 48px;
  padding-bottom: 80px;
  background: #07080b;
}

.metrics-heading {
  width: min(1080px, 100%);
  max-width: none;
  margin: 0 auto;
  text-align: center;
}

.metrics-points {
  display: grid;
  width: min(1080px, 100%);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
  margin: 50px auto 0;
}

.metric-point {
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.metrics-visual {
  width: min(1080px, 100%);
  margin: 78px auto 0;
}

.dashboard-shot,
.dashboard-stage {
  position: relative;
  width: 100%;
}

.dashboard-stage {
  aspect-ratio: 2880 / 1880;
  perspective: 1600px;
}

.dashboard-card {
  position: absolute;
  inset: 0;
  transform: translateY(0) rotateX(0deg) scale(1);
  transform-origin: center 62%;
  transform-style: preserve-3d;
  transition: transform var(--motion-xslow) cubic-bezier(0.2, 0.72, 0.2, 1);
  will-change: transform;
}

.dashboard-card img {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 8px;
  object-fit: contain;
  box-shadow:
    0 48px 140px rgba(24, 92, 190, 0.16),
    0 4px 24px rgba(0, 0, 0, 0.45);
}

.dashboard-pin-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.dashboard-hotspot {
  position: absolute;
  top: 66.2%;
  right: 14.5%;
  bottom: 5.2%;
  left: 14.5%;
  z-index: 3;
  padding: 0;
  border: 0;
  border-radius: 8px;
  outline: 0;
  cursor: pointer;
  background: transparent;
}

.dashboard-hotspot::before {
  position: absolute;
  inset: -8%;
  border-radius: 8px;
  content: '';
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    ellipse at 48% 52%,
    rgba(50, 157, 255, 0.12) 0%,
    rgba(55, 199, 232, 0.04) 52%,
    transparent 78%
  );
  box-shadow: inset 0 0 36px rgba(55, 199, 232, 0.035);
  transition: opacity var(--motion-fast) ease;
}

.dashboard-pin {
  --pin-height: 138px;
  --pin-delay: 120ms;

  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  transform: translate3d(-50%, 34px, 90px);
  transition:
    opacity 420ms ease var(--pin-delay),
    transform 620ms cubic-bezier(0.16, 1, 0.3, 1) var(--pin-delay);
}

.dashboard-pin--1 {
  top: 65%;
  left: 32%;
}

.dashboard-pin--2 {
  --pin-height: 174px;
  --pin-delay: 230ms;

  top: 51%;
  left: 50%;
}

.dashboard-pin--3 {
  --pin-height: 148px;
  --pin-delay: 340ms;

  top: 83%;
  left: 70%;
}

.pin-anchor {
  position: absolute;
  bottom: -5px;
  left: -5px;
  width: 10px;
  height: 10px;
  border: 2px solid rgba(115, 224, 255, 0.88);
  border-radius: 50%;
  background: #07111c;
  box-shadow:
    0 0 0 5px rgba(43, 183, 255, 0.1),
    0 0 22px rgba(55, 199, 232, 0.72);
}

.pin-anchor::before,
.pin-anchor::after {
  position: absolute;
  inset: 50% auto auto 50%;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(55, 199, 232, 0.28);
  border-radius: 50%;
  content: '';
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.2);
}

.pin-line {
  position: absolute;
  bottom: 3px;
  left: -1px;
  width: 2px;
  height: var(--pin-height);
  background: linear-gradient(to top, #37c7e8 0%, rgba(55, 199, 232, 0.5) 55%, transparent 100%);
  box-shadow: 0 0 10px rgba(55, 199, 232, 0.68);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 560ms cubic-bezier(0.16, 1, 0.3, 1) calc(var(--pin-delay) + 80ms);
}

.pin-label {
  position: absolute;
  bottom: calc(var(--pin-height) + 14px);
  left: 0;
  display: flex;
  width: 180px;
  padding: 10px 12px;
  border: 1px solid rgba(104, 217, 255, 0.24);
  border-radius: 6px;
  flex-direction: column;
  color: #dff8ff;
  background: rgba(5, 14, 24, 0.88);
  box-shadow:
    0 10px 36px rgba(0, 0, 0, 0.34),
    inset 0 0 22px rgba(55, 199, 232, 0.04);
  opacity: 0;
  transform: translate(-12px, 10px);
  backdrop-filter: blur(10px);
  transition:
    opacity 360ms ease calc(var(--pin-delay) + 260ms),
    transform 480ms cubic-bezier(0.16, 1, 0.3, 1) calc(var(--pin-delay) + 260ms);

  strong {
    font-size: 13px;
    font-weight: 600;
    line-height: 20px;
  }

  span {
    margin-top: 2px;
    color: #809aad;
    font-size: 12px;
    line-height: 18px;
  }
}

.dashboard-pin--2 .pin-label {
  transform: translate(-50%, 10px);
}

.dashboard-pin--3 .pin-label {
  transform: translate(calc(-100% + 12px), 10px);
}

@media (hover: hover) and (pointer: fine) {
  .dashboard-hotspot:hover::before,
  .dashboard-hotspot:focus-visible::before {
    opacity: 1;
  }

  .dashboard-hotspot:focus-visible {
    box-shadow: inset 0 0 0 1px rgba(104, 217, 255, 0.32);
  }

  .dashboard-shot.is-highlighted .dashboard-hotspot::before {
    opacity: 0;
  }

  .dashboard-shot.is-highlighted .dashboard-card {
    transform: translateY(88px) rotateX(58deg) scale(0.88);
  }

  .dashboard-shot.is-highlighted .dashboard-pin {
    opacity: 1;
    transform: translate3d(-50%, 0, 90px);
  }

  .dashboard-shot.is-highlighted .pin-line {
    transform: scaleY(1);
  }

  .dashboard-shot.is-highlighted .pin-label {
    opacity: 1;
    transform: translate(-12px, 0);
  }

  .dashboard-shot.is-highlighted .dashboard-pin--2 .pin-label {
    transform: translate(-50%, 0);
  }

  .dashboard-shot.is-highlighted .dashboard-pin--3 .pin-label {
    transform: translate(calc(-100% + 12px), 0);
  }

  .dashboard-shot.is-highlighted .pin-anchor::before,
  .dashboard-shot.is-highlighted .pin-anchor::after {
    animation: pin-ripple 2.6s ease-out infinite calc(var(--pin-delay) + 520ms);
  }

  .dashboard-shot.is-highlighted .pin-anchor::after {
    animation-delay: calc(var(--pin-delay) + 1.42s);
  }
}

@keyframes pin-ripple {
  0% {
    opacity: 0.58;
    transform: translate(-50%, -50%) scale(0.25);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.45);
  }
}

@media (max-width: 1023px) {
  .collaboration-layout,
  .knowledge-layout,
  .quality-layout {
    grid-template-columns: 1fr;
    gap: 64px;
  }

  .knowledge-visual {
    order: 2;
  }

  .knowledge-layout .section-copy {
    order: 1;
  }
}

@media (max-width: 767px) {
  .capability-screen {
    min-height: auto;
    padding: 72px 0;
  }

  .collaboration-screen {
    padding-top: 48px;
  }

  .knowledge-screen {
    padding-bottom: 48px;
  }

  .quality-screen {
    padding-top: 72px;
    padding-bottom: 72px;
  }

  .metrics-screen {
    padding-top: 48px;
  }

  .section-inner {
    width: calc(100% - 48px);
  }

  .section-copy h2,
  .metrics-heading h2 {
    font-size: 30px;
    line-height: 40px;
  }

  .point-list {
    margin-top: 38px;
  }

  .point-item + .point-item {
    margin-top: 30px;
  }

  .collaboration-layout,
  .knowledge-layout,
  .quality-layout {
    gap: 48px;
  }

  .knowledge-canvas {
    grid-template-columns: 1fr;
    gap: 16px;
    min-height: auto;
    padding: 28px;
  }

  .knowledge-arrow {
    transform: rotate(90deg);
  }

  .knowledge-hub {
    width: 150px;
    justify-self: center;
  }

  .knowledge-delivery {
    width: 100%;
  }

  .metrics-points {
    grid-template-columns: 1fr;
    gap: 30px;
    margin-top: 42px;
  }

  .metrics-visual {
    width: calc(100% + 24px);
    margin: 56px -12px 0;
  }

  .dashboard-pin-layer,
  .dashboard-hotspot {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-card,
  .dashboard-pin,
  .pin-line,
  .pin-label {
    transition: none;
  }

  .pin-anchor::before,
  .pin-anchor::after {
    animation: none !important;
  }
}
</style>
