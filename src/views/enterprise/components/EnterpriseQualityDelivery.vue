<template>
  <div class="quality-workflow" :aria-label="t('enterprisePage.capabilities.quality.visualLabel')">
    <div class="workflow-spine" aria-hidden="true">
      <span class="workflow-tracer"></span>
    </div>

    <ol class="workflow-stages">
      <li class="workflow-stage workflow-stage--left">
        <article class="review-card review-card--standard">
          <header class="card-heading">
            <span class="card-badge">{{ flow.standard.badge }}</span>
            <span class="card-status card-status--ready">
              <i aria-hidden="true"></i>
              {{ flow.standard.status }}
            </span>
          </header>
          <strong>{{ flow.standard.title }}</strong>
          <p>{{ flow.standard.desc }}</p>
        </article>

        <span class="stage-marker" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <path d="M5 3.5h7l3 3V16.5H5z" />
            <path d="M12 3.5v3h3M7.5 10h5M7.5 13h3.5" />
          </svg>
        </span>
      </li>

      <li class="workflow-stage workflow-stage--right">
        <span class="stage-marker" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <path d="m7.5 6-4 4 4 4M12.5 6l4 4-4 4M11.5 3.5l-3 13" />
          </svg>
        </span>

        <article class="review-card review-card--diff">
          <header class="card-heading">
            <span class="card-badge">{{ flow.change.badge }}</span>
            <span class="diff-summary">
              <b>{{ flow.change.added }}</b>
              <i>{{ flow.change.removed }}</i>
            </span>
          </header>
          <strong>{{ flow.change.title }}</strong>
          <div class="diff-file">
            <span>{{ flow.change.file }}</span>
            <small>{{ flow.change.fileStatus }}</small>
          </div>
          <div class="diff-code" aria-hidden="true">
            <span class="diff-code--removed">- {{ flow.change.removedLine }}</span>
            <span class="diff-code--added">+ {{ flow.change.addedLine }}</span>
          </div>
        </article>
      </li>

      <li class="workflow-stage workflow-stage--left">
        <article class="review-card review-card--repair">
          <header class="card-heading">
            <span class="card-badge card-badge--warning">{{ flow.review.badge }}</span>
            <span class="card-status card-status--warning">
              <i aria-hidden="true"></i>
              {{ flow.review.status }}
            </span>
          </header>
          <strong>{{ flow.review.title }}</strong>
          <p class="issue-line">{{ flow.review.issue }}</p>
          <div class="repair-result">
            <span aria-hidden="true">↻</span>
            {{ flow.review.resolution }}
          </div>
          <small>{{ flow.review.reviewers.join(' · ') }}</small>
        </article>

        <span class="stage-marker stage-marker--warning" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <path d="M15.5 8A6 6 0 1 0 16 11" />
            <path d="M12.5 5.5H16V2M7.5 10h5" />
          </svg>
        </span>
      </li>

      <li class="workflow-stage workflow-stage--right">
        <span class="stage-marker stage-marker--complete" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="6.5" />
            <path d="m6.8 10.2 2 2 4.5-4.5" />
          </svg>
        </span>

        <article class="review-card review-card--gate">
          <header class="card-heading">
            <span class="card-badge">{{ flow.gate.badge }}</span>
            <span class="card-status card-status--complete">
              <i aria-hidden="true"></i>
              {{ flow.gate.status }}
            </span>
          </header>
          <strong>{{ flow.gate.title }}</strong>
          <p>{{ flow.gate.desc }}</p>
        </article>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'EnterpriseQualityDelivery',
})

interface QualityWorkflowStep {
  badge: string
  title: string
  status: string
  desc: string
}

interface QualityChangeStep {
  badge: string
  title: string
  file: string
  fileStatus: string
  added: string
  removed: string
  addedLine: string
  removedLine: string
}

interface QualityReviewStep {
  badge: string
  title: string
  status: string
  issue: string
  resolution: string
  reviewers: string[]
}

interface QualityWorkflow {
  standard: QualityWorkflowStep
  change: QualityChangeStep
  review: QualityReviewStep
  gate: QualityWorkflowStep
}

const { t, tm } = useI18n()
const flow = computed(
  () => tm('enterprisePage.capabilities.quality.visual.workflow') as QualityWorkflow,
)
</script>

<style scoped lang="less">
.quality-workflow {
  position: relative;
  min-height: 430px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.065);
  border-radius: 8px;
  background:
    linear-gradient(rgba(56, 113, 139, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 113, 139, 0.035) 1px, transparent 1px),
    radial-gradient(circle at 50% 48%, rgba(55, 199, 232, 0.075), transparent 42%), #080a0e;
  background-size:
    32px 32px,
    32px 32px,
    100% 100%;
}

.workflow-spine {
  position: absolute;
  top: 28px;
  bottom: 28px;
  left: 50%;
  width: 1px;
  overflow: hidden;
  background: repeating-linear-gradient(
    180deg,
    rgba(103, 160, 180, 0.3) 0 4px,
    transparent 4px 10px
  );
  transform: translateX(-50%);
}

.workflow-tracer {
  position: absolute;
  top: -68px;
  left: 0;
  width: 1px;
  height: 68px;
  background: linear-gradient(180deg, transparent, #49cde8 74%, #68e0a3);
  box-shadow: 0 0 14px rgba(73, 205, 232, 0.65);
  animation: workflow-trace 5.6s ease-in-out infinite;
}

.workflow-stages {
  position: relative;
  display: grid;
  min-height: 430px;
  margin: 0;
  padding: 20px 24px;
  grid-template-rows: 0.88fr 1.18fr 1.2fr 0.9fr;
  list-style: none;
}

.workflow-stage {
  position: relative;
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr) 44px minmax(0, 1fr);
  align-items: center;
}

.workflow-stage::before,
.workflow-stage::after {
  height: 1px;
  background: linear-gradient(90deg, rgba(74, 164, 192, 0.28), rgba(74, 164, 192, 0.08));
  content: '';
}

.workflow-stage--left::before {
  grid-column: 1;
  grid-row: 1;
}

.workflow-stage--left::after,
.workflow-stage--right::before {
  display: none;
}

.workflow-stage--right::after {
  grid-column: 3;
  grid-row: 1;
  background: linear-gradient(90deg, rgba(74, 164, 192, 0.08), rgba(74, 164, 192, 0.28));
}

.stage-marker {
  z-index: 2;
  display: grid;
  width: 32px;
  height: 32px;
  grid-column: 2;
  grid-row: 1;
  place-self: center;
  place-items: center;
  border: 1px solid rgba(73, 205, 232, 0.32);
  border-radius: 50%;
  color: #64d7ec;
  background: #0a131a;
  box-shadow: 0 0 0 6px rgba(55, 199, 232, 0.035);
}

.stage-marker svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.3;
}

.stage-marker--warning {
  border-color: rgba(241, 174, 75, 0.38);
  color: #e9ad59;
  background: #17130d;
  box-shadow: 0 0 0 6px rgba(241, 174, 75, 0.035);
}

.stage-marker--complete {
  border-color: rgba(74, 214, 151, 0.38);
  color: #55d99b;
  background: #0b1713;
  box-shadow: 0 0 0 6px rgba(74, 214, 151, 0.045);
}

.review-card {
  position: relative;
  z-index: 1;
  width: calc(100% - 10px);
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 6px;
  background: linear-gradient(145deg, rgba(15, 19, 24, 0.98), rgba(8, 11, 15, 0.98));
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.24);
}

.workflow-stage--left .review-card {
  grid-column: 1;
  grid-row: 1;
  justify-self: end;
}

.workflow-stage--right .review-card {
  grid-column: 3;
  grid-row: 1;
  justify-self: start;
}

.review-card--repair {
  border-color: rgba(224, 164, 80, 0.14);
}

.review-card--gate {
  border-color: rgba(74, 214, 151, 0.16);
  background: linear-gradient(145deg, rgba(10, 25, 21, 0.96), rgba(7, 14, 13, 0.98));
}

.card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.card-badge {
  display: inline-flex;
  align-items: center;
  min-height: 18px;
  padding: 1px 6px;
  border: 1px solid rgba(73, 205, 232, 0.18);
  border-radius: 4px;
  color: #74cee0;
  font-size: 9px;
  font-weight: 600;
  line-height: 14px;
  background: rgba(55, 199, 232, 0.055);
}

.card-badge--warning {
  border-color: rgba(224, 164, 80, 0.2);
  color: #dba457;
  background: rgba(224, 164, 80, 0.055);
}

.card-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #7291a1;
  font-size: 9px;
  line-height: 16px;
  white-space: nowrap;
}

.card-status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}

.card-status--ready {
  color: #55cfe8;
}

.card-status--warning {
  color: #dca453;
}

.card-status--complete {
  color: #4ed598;
}

.review-card > strong {
  display: block;
  color: #e2ebf1;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
}

.review-card > p {
  margin: 4px 0 0;
  color: #7f91a2;
  font-size: 10px;
  line-height: 16px;
}

.diff-summary {
  display: inline-flex;
  gap: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 9px;
  line-height: 16px;
}

.diff-summary b {
  color: #5bd39c;
  font-weight: 500;
}

.diff-summary i {
  color: #d9878c;
  font-style: normal;
}

.diff-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
  color: #8fa4b5;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 9px;
  line-height: 15px;
}

.diff-file small {
  color: #647989;
  font-size: 8px;
  white-space: nowrap;
}

.diff-code {
  display: grid;
  gap: 2px;
  margin-top: 5px;
  padding: 5px 6px;
  overflow: hidden;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 8px;
  line-height: 13px;
  background: rgba(2, 5, 8, 0.62);
}

.diff-code span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.diff-code--removed {
  color: #b77980;
}

.diff-code--added {
  color: #69ba92;
}

.issue-line {
  color: #bd9258 !important;
}

.repair-result {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 5px;
  color: #8fbda8;
  font-size: 9px;
  line-height: 15px;
}

.repair-result > span {
  color: #55d99b;
  font-size: 12px;
  line-height: 14px;
}

.review-card--repair > small {
  display: block;
  margin-top: 4px;
  color: #617787;
  font-size: 8px;
  line-height: 13px;
}

@keyframes workflow-trace {
  0%,
  12% {
    opacity: 0;
    transform: translateY(0);
  }

  22% {
    opacity: 1;
  }

  82% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(440px);
  }
}

@media (max-width: 767px) {
  .quality-workflow,
  .workflow-stages {
    min-height: 0;
  }

  .workflow-spine {
    top: 34px;
    bottom: 34px;
    left: 38px;
  }

  .workflow-stages {
    gap: 14px;
    padding: 20px 16px;
    grid-template-rows: none;
  }

  .workflow-stage {
    grid-template-columns: 44px minmax(0, 1fr);
  }

  .workflow-stage::before,
  .workflow-stage::after {
    display: none;
  }

  .stage-marker,
  .workflow-stage--left .stage-marker,
  .workflow-stage--right .stage-marker {
    grid-column: 1;
    grid-row: 1;
  }

  .review-card,
  .workflow-stage--left .review-card,
  .workflow-stage--right .review-card {
    width: 100%;
    grid-column: 2;
    grid-row: 1;
    justify-self: stretch;
  }

  .review-card {
    padding: 13px 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .workflow-tracer {
    display: none;
    animation: none;
  }
}
</style>
