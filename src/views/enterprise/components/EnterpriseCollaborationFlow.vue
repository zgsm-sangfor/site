<template>
  <div
    class="collaboration-flow"
    :class="{ 'has-active-node': activeNode }"
    @mouseleave="clearActiveNode"
  >
    <div class="flow-desktop" aria-label="人机协同研发流程">
      <svg class="flow-connections" viewBox="0 0 1000 500" aria-hidden="true">
        <path
          v-for="connection in connections"
          :key="connection.id"
          class="flow-connection"
          :class="[
            `flow-connection--${connection.branch}`,
            { 'is-active': isConnectionActive(connection.branch) },
          ]"
          :d="connection.path"
          pathLength="1"
        />
      </svg>

      <article
        v-for="node in nodes"
        :key="node.id"
        class="flow-node"
        :class="[
          `flow-node--${node.id}`,
          `node--${node.kind}`,
          {
            'is-active': activeNode === node.id,
            'is-related': isNodeRelated(node),
          },
        ]"
        :style="{ '--node-delay': `${node.delay}ms` }"
        tabindex="0"
        @mouseenter="setActiveNode(node.id)"
        @focus="setActiveNode(node.id)"
        @blur="clearActiveNode"
      >
        <span class="node-icon" aria-hidden="true"><i></i></span>
        <span class="node-copy">
          <small>{{ node.label }}</small>
          <strong>{{ node.title }}</strong>
          <span v-if="node.desc">{{ node.desc }}</span>
        </span>
      </article>

      <span class="flow-lane-label flow-lane-label--agent">
        <i aria-hidden="true">AI</i>
        {{ t('enterprisePage.capabilities.collaboration.visual.agentLane') }}
      </span>
      <span class="flow-lane-label flow-lane-label--human">
        <i aria-hidden="true">H</i>
        {{ t('enterprisePage.capabilities.collaboration.visual.humanLane') }}
      </span>
      <span class="flow-pulse flow-pulse--agent" aria-hidden="true"></span>
      <span class="flow-pulse flow-pulse--human" aria-hidden="true"></span>
    </div>

    <div class="flow-mobile" aria-label="人机协同研发流程">
      <article class="mobile-node" :class="`node--${nodeMap.entry.kind}`">
        <span class="node-icon" aria-hidden="true"><i></i></span>
        <span class="node-copy">
          <small>{{ nodeMap.entry.label }}</small>
          <strong>{{ nodeMap.entry.title }}</strong>
        </span>
      </article>
      <span class="mobile-connector" aria-hidden="true"></span>
      <article class="mobile-node" :class="`node--${nodeMap.scheduler.kind}`">
        <span class="node-icon" aria-hidden="true"><i></i></span>
        <span class="node-copy">
          <small>{{ nodeMap.scheduler.label }}</small>
          <strong>{{ nodeMap.scheduler.title }}</strong>
          <span>{{ nodeMap.scheduler.desc }}</span>
        </span>
      </article>

      <div class="mobile-branches">
        <section class="mobile-branch mobile-branch--agent">
          <span class="mobile-branch-label">
            <i aria-hidden="true">AI</i>
            {{ t('enterprisePage.capabilities.collaboration.visual.agentLane') }}
          </span>
          <template v-for="(node, index) in agentNodes" :key="node.id">
            <span v-if="index" class="mobile-branch-connector" aria-hidden="true"></span>
            <article class="mobile-node" :class="`node--${node.kind}`">
              <span class="node-icon" aria-hidden="true"><i></i></span>
              <span class="node-copy">
                <small>{{ node.label }}</small>
                <strong>{{ node.title }}</strong>
              </span>
            </article>
          </template>
        </section>

        <section class="mobile-branch mobile-branch--human">
          <span class="mobile-branch-label">
            <i aria-hidden="true">H</i>
            {{ t('enterprisePage.capabilities.collaboration.visual.humanLane') }}
          </span>
          <template v-for="(node, index) in humanNodes" :key="node.id">
            <span v-if="index" class="mobile-branch-connector" aria-hidden="true"></span>
            <article class="mobile-node" :class="`node--${node.kind}`">
              <span class="node-icon" aria-hidden="true"><i></i></span>
              <span class="node-copy">
                <small>{{ node.label }}</small>
                <strong>{{ node.title }}</strong>
              </span>
            </article>
          </template>
        </section>
      </div>

      <div class="mobile-delivery">
        <article class="mobile-node" :class="`node--${nodeMap.gate.kind}`">
          <span class="node-icon" aria-hidden="true"><i></i></span>
          <span class="node-copy">
            <small>{{ nodeMap.gate.label }}</small>
            <strong>{{ nodeMap.gate.title }}</strong>
          </span>
        </article>
        <span class="mobile-connector" aria-hidden="true"></span>
        <article class="mobile-node" :class="`node--${nodeMap.delivery.kind}`">
          <span class="node-icon" aria-hidden="true"><i></i></span>
          <span class="node-copy">
            <small>{{ nodeMap.delivery.label }}</small>
            <strong>{{ nodeMap.delivery.title }}</strong>
          </span>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'EnterpriseCollaborationFlow',
})

type FlowBranch = 'core' | 'agent' | 'human' | 'delivery'
type FlowNodeKind = 'input' | 'scheduler' | 'agent' | 'human' | 'gate' | 'delivery'

interface FlowNode {
  id: string
  kind: FlowNodeKind
  branch: FlowBranch
  label: string
  title: string
  desc?: string
  delay: number
}

interface FlowConnection {
  id: string
  branch: FlowBranch
  path: string
}

const { t } = useI18n()
const activeNode = ref('')

const nodes = computed<FlowNode[]>(() => [
  {
    id: 'entry',
    kind: 'input',
    branch: 'core',
    label: t('enterprisePage.capabilities.collaboration.visual.inputLabel'),
    title: t('enterprisePage.capabilities.collaboration.visual.entry'),
    delay: 80,
  },
  {
    id: 'scheduler',
    kind: 'scheduler',
    branch: 'core',
    label: t('enterprisePage.capabilities.collaboration.visual.schedulerLabel'),
    title: t('enterprisePage.capabilities.collaboration.visual.scheduler'),
    desc: t('enterprisePage.capabilities.collaboration.visual.schedulerDesc'),
    delay: 170,
  },
  {
    id: 'task',
    kind: 'agent',
    branch: 'agent',
    label: t('enterprisePage.capabilities.collaboration.visual.executionLabel'),
    title: t('enterprisePage.capabilities.collaboration.visual.taskBreakdown'),
    desc: t('enterprisePage.capabilities.collaboration.visual.taskBreakdownDesc'),
    delay: 280,
  },
  {
    id: 'coding',
    kind: 'agent',
    branch: 'agent',
    label: t('enterprisePage.capabilities.collaboration.visual.executionLabel'),
    title: t('enterprisePage.capabilities.collaboration.visual.codingTest'),
    desc: t('enterprisePage.capabilities.collaboration.visual.codingTestDesc'),
    delay: 370,
  },
  {
    id: 'direction',
    kind: 'human',
    branch: 'human',
    label: t('enterprisePage.capabilities.collaboration.visual.decisionLabel'),
    title: t('enterprisePage.capabilities.collaboration.visual.direction'),
    desc: t('enterprisePage.capabilities.collaboration.visual.directionDesc'),
    delay: 280,
  },
  {
    id: 'approval',
    kind: 'human',
    branch: 'human',
    label: t('enterprisePage.capabilities.collaboration.visual.decisionLabel'),
    title: t('enterprisePage.capabilities.collaboration.visual.approval'),
    desc: t('enterprisePage.capabilities.collaboration.visual.approvalDesc'),
    delay: 370,
  },
  {
    id: 'gate',
    kind: 'gate',
    branch: 'delivery',
    label: t('enterprisePage.capabilities.collaboration.visual.gateLabel'),
    title: t('enterprisePage.capabilities.collaboration.visual.gate'),
    delay: 490,
  },
  {
    id: 'delivery',
    kind: 'delivery',
    branch: 'delivery',
    label: t('enterprisePage.capabilities.collaboration.visual.deliveryLabel'),
    title: t('enterprisePage.capabilities.collaboration.visual.delivery'),
    delay: 580,
  },
])

const nodeMap = computed(() => Object.fromEntries(nodes.value.map((node) => [node.id, node])))
const agentNodes = computed(() => nodes.value.filter((node) => node.branch === 'agent'))
const humanNodes = computed(() => nodes.value.filter((node) => node.branch === 'human'))

const connections: FlowConnection[] = [
  { id: 'entry-scheduler', branch: 'core', path: 'M 160 250 C 177 250, 188 250, 210 250' },
  { id: 'scheduler-task', branch: 'agent', path: 'M 390 250 C 423 250, 415 136, 450 136' },
  { id: 'scheduler-human', branch: 'human', path: 'M 390 250 C 423 250, 415 364, 450 364' },
  { id: 'task-coding', branch: 'agent', path: 'M 620 136 C 638 136, 642 136, 660 136' },
  { id: 'direction-approval', branch: 'human', path: 'M 620 364 C 638 364, 642 364, 660 364' },
  { id: 'coding-gate', branch: 'agent', path: 'M 830 136 C 860 136, 858 220, 880 220' },
  { id: 'approval-gate', branch: 'human', path: 'M 830 364 C 860 364, 858 280, 880 280' },
  { id: 'gate-delivery', branch: 'delivery', path: 'M 930 280 C 930 294, 930 306, 930 320' },
]

const getNodeBranch = (nodeId: string) => nodes.value.find((node) => node.id === nodeId)?.branch

const isConnectionActive = (branch: FlowBranch) => {
  if (!activeNode.value) return false
  const activeBranch = getNodeBranch(activeNode.value)
  if (activeBranch === 'core' || activeBranch === 'delivery') return true
  return branch === 'core' || branch === activeBranch || branch === 'delivery'
}

const isNodeRelated = (node: FlowNode) => {
  if (!activeNode.value) return false
  const activeBranch = getNodeBranch(activeNode.value)
  if (activeBranch === 'core' || activeBranch === 'delivery') return true
  return node.branch === 'core' || node.branch === activeBranch || node.branch === 'delivery'
}

const setActiveNode = (nodeId: string) => {
  activeNode.value = nodeId
}

const clearActiveNode = () => {
  activeNode.value = ''
}
</script>

<style scoped lang="less">
.collaboration-flow {
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(rgba(48, 119, 182, 0.052) 1px, transparent 1px),
    linear-gradient(90deg, rgba(48, 119, 182, 0.052) 1px, transparent 1px),
    radial-gradient(circle at 44% 48%, rgba(24, 119, 191, 0.12), transparent 52%);
  background-size:
    36px 36px,
    36px 36px,
    100% 100%;
}

.flow-desktop {
  position: relative;
  min-height: 430px;
}

.flow-connections {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.flow-connection {
  fill: none;
  stroke: rgba(79, 146, 196, 0.28);
  stroke-width: 2;
  stroke-dasharray: 0.018 0.013;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  transition:
    stroke 240ms ease,
    opacity 240ms ease,
    filter 240ms ease;
}

.flow-connection--human {
  stroke: rgba(144, 161, 180, 0.24);
}

.flow-connection--delivery {
  stroke: rgba(66, 211, 146, 0.35);
}

.flow-connection.is-active {
  stroke: rgba(70, 207, 239, 0.9);
  filter: drop-shadow(0 0 5px rgba(55, 199, 232, 0.55));
  animation: connection-flow 1.4s linear infinite;
}

.flow-connection--human.is-active {
  stroke: rgba(190, 205, 222, 0.74);
  filter: drop-shadow(0 0 4px rgba(157, 182, 206, 0.34));
}

.flow-connection--delivery.is-active {
  stroke: rgba(66, 211, 146, 0.86);
  filter: drop-shadow(0 0 5px rgba(66, 211, 146, 0.44));
}

.flow-node {
  position: absolute;
  z-index: 2;
  display: flex;
  width: 17%;
  min-height: 78px;
  padding: 11px 10px;
  border: 1px solid rgba(123, 153, 182, 0.14);
  border-radius: 6px;
  outline: none;
  align-items: flex-start;
  color: #c7d5e2;
  background: rgba(12, 18, 26, 0.94);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
  opacity: 0;
  transform: translateY(8px);
  animation: node-enter 520ms cubic-bezier(0.2, 0.72, 0.2, 1) forwards;
  animation-delay: var(--node-delay);
  transition:
    border-color 220ms ease,
    background 220ms ease,
    box-shadow 220ms ease,
    filter 220ms ease,
    opacity 220ms ease,
    transform 220ms ease;
}

.flow-node:hover,
.flow-node:focus-visible,
.flow-node.is-active {
  border-color: rgba(71, 207, 238, 0.48);
  background: rgba(12, 33, 47, 0.98);
  box-shadow:
    0 16px 34px rgba(0, 0, 0, 0.32),
    0 0 28px rgba(55, 199, 232, 0.09);
  transform: translateY(-2px);
}

.has-active-node .flow-node:not(.is-related) {
  filter: brightness(0.52) saturate(0.55);
}

.flow-node--entry {
  top: 42.2%;
  left: 2.5%;
  width: 13.5%;
}

.flow-node--scheduler {
  top: 40.2%;
  left: 21%;
  width: 18%;
  min-height: 94px;
}

.flow-node--task,
.flow-node--coding {
  top: 17.2%;
}

.flow-node--direction,
.flow-node--approval {
  top: 63.8%;
}

.flow-node--task,
.flow-node--direction {
  left: 45%;
}

.flow-node--coding,
.flow-node--approval {
  left: 66%;
}

.flow-node--gate,
.flow-node--delivery {
  left: 88%;
  width: 10%;
  min-height: 60px;
  padding: 9px 7px;
}

.flow-node--gate {
  top: 38%;
}

.flow-node--delivery {
  top: 64%;
}

.node--agent {
  border-color: rgba(55, 199, 232, 0.2);
  background: rgba(12, 33, 47, 0.94);
}

.node--human {
  border-color: rgba(160, 177, 195, 0.16);
  background: rgba(19, 24, 31, 0.96);
}

.node--gate,
.node--delivery {
  border-color: rgba(66, 211, 146, 0.2);
  background: rgba(9, 30, 25, 0.94);
}

.node-icon {
  display: inline-flex;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border: 1px solid rgba(55, 199, 232, 0.22);
  border-radius: 5px;
  flex: 0 0 24px;
  align-items: center;
  justify-content: center;
  background: rgba(55, 199, 232, 0.08);
}

.node-icon i {
  width: 6px;
  height: 6px;
  border: 1px solid #67d8ed;
  border-radius: 50%;
  box-shadow: 0 0 9px rgba(55, 199, 232, 0.55);
}

.node--human .node-icon {
  border-color: rgba(173, 188, 204, 0.18);
  background: rgba(173, 188, 204, 0.06);
}

.node--human .node-icon i {
  border-color: #a9b7c6;
  box-shadow: 0 0 8px rgba(159, 179, 201, 0.3);
}

.node--gate .node-icon,
.node--delivery .node-icon {
  border-color: rgba(66, 211, 146, 0.22);
  background: rgba(66, 211, 146, 0.07);
}

.node--gate .node-icon i,
.node--delivery .node-icon i {
  border-color: #65d9a0;
  box-shadow: 0 0 8px rgba(66, 211, 146, 0.42);
}

.node-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.node-copy small {
  color: #597086;
  font-size: 8px;
  font-weight: 500;
  line-height: 12px;
}

.node-copy strong {
  margin-top: 2px;
  color: #d4e1ec;
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
}

.node-copy > span {
  margin-top: 3px;
  color: #65798d;
  font-size: 8px;
  line-height: 12px;
}

.flow-node--gate .node-icon,
.flow-node--delivery .node-icon {
  display: none;
}

.flow-node--gate .node-copy strong,
.flow-node--delivery .node-copy strong {
  color: #cfe8dc;
}

.flow-lane-label {
  position: absolute;
  z-index: 3;
  top: 7%;
  left: 45%;
  display: inline-flex;
  align-items: center;
  color: #5d7185;
  font-size: 9px;
  line-height: 16px;
}

.flow-lane-label i {
  display: inline-flex;
  width: 22px;
  height: 22px;
  margin-right: 7px;
  border: 1px solid rgba(55, 199, 232, 0.22);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  color: #64d4ea;
  background: rgba(55, 199, 232, 0.08);
  font-size: 7px;
  font-style: normal;
  font-weight: 600;
}

.flow-lane-label--human {
  top: 85.5%;
}

.flow-lane-label--human i {
  border-color: rgba(174, 190, 207, 0.17);
  color: #9cabb9;
  background: rgba(174, 190, 207, 0.05);
}

.flow-pulse {
  position: absolute;
  z-index: 1;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #56d5ef;
  box-shadow: 0 0 10px rgba(55, 199, 232, 0.86);
  pointer-events: none;
}

.flow-pulse--agent {
  top: 28.8%;
  left: 42%;
  animation: pulse-agent 4.2s ease-in-out infinite;
}

.flow-pulse--human {
  top: 71%;
  left: 42%;
  background: #a4b3c2;
  box-shadow: 0 0 9px rgba(159, 179, 201, 0.58);
  animation: pulse-human 4.2s ease-in-out 1.1s infinite;
}

.flow-mobile {
  display: none;
}

@keyframes node-enter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes connection-flow {
  to {
    stroke-dashoffset: -0.062;
  }
}

@keyframes pulse-agent {
  0%,
  18% {
    opacity: 0;
    transform: translate(0, 0);
  }
  26%,
  72% {
    opacity: 1;
  }
  84%,
  100% {
    opacity: 0;
    transform: translate(360px, -58px);
  }
}

@keyframes pulse-human {
  0%,
  18% {
    opacity: 0;
    transform: translate(0, 0);
  }
  26%,
  72% {
    opacity: 1;
  }
  84%,
  100% {
    opacity: 0;
    transform: translate(360px, 58px);
  }
}

@media (max-width: 767px) {
  .flow-desktop {
    display: none;
  }

  .flow-mobile {
    display: flex;
    padding: 24px 16px 20px;
    align-items: center;
    flex-direction: column;
  }

  .mobile-node {
    display: flex;
    width: min(236px, 100%);
    min-height: 64px;
    padding: 10px;
    border: 1px solid rgba(123, 153, 182, 0.14);
    border-radius: 6px;
    align-items: flex-start;
    background: rgba(12, 18, 26, 0.96);
  }

  .mobile-connector,
  .mobile-branch-connector {
    display: block;
    width: 1px;
    height: 18px;
    background: linear-gradient(rgba(55, 199, 232, 0.2), rgba(55, 199, 232, 0.64));
  }

  .mobile-branches {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    width: 100%;
    margin-top: 34px;
    padding-bottom: 30px;
  }

  .mobile-branches::before,
  .mobile-branches::after {
    position: absolute;
    content: '';
  }

  .mobile-branches::before {
    top: -18px;
    right: 25%;
    left: 25%;
    height: 1px;
    background: rgba(75, 149, 216, 0.34);
  }

  .mobile-branches::after {
    top: -18px;
    left: 50%;
    width: 1px;
    height: 18px;
    background: rgba(75, 149, 216, 0.34);
  }

  .mobile-branch {
    position: relative;
    display: flex;
    min-width: 0;
    align-items: center;
    flex-direction: column;
  }

  .mobile-branch::before {
    position: absolute;
    top: -18px;
    left: 50%;
    width: 1px;
    height: 18px;
    background: rgba(75, 149, 216, 0.34);
    content: '';
  }

  .mobile-branch-label {
    display: flex;
    min-height: 34px;
    margin-bottom: 10px;
    align-items: center;
    color: #61768a;
    font-size: 9px;
    line-height: 15px;
  }

  .mobile-branch-label i {
    display: inline-flex;
    width: 20px;
    height: 20px;
    margin-right: 6px;
    border: 1px solid rgba(55, 199, 232, 0.2);
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    color: #64d4ea;
    font-size: 7px;
    font-style: normal;
  }

  .mobile-branch--human .mobile-branch-label i {
    border-color: rgba(174, 190, 207, 0.17);
    color: #9cabb9;
  }

  .mobile-branch .mobile-node {
    width: 100%;
    min-height: 72px;
  }

  .mobile-delivery {
    display: flex;
    width: 100%;
    align-items: center;
    flex-direction: column;
  }

  .mobile-delivery::before {
    width: 50%;
    height: 18px;
    border-top: 1px solid rgba(75, 149, 216, 0.34);
    border-right: 1px solid rgba(75, 149, 216, 0.34);
    border-left: 1px solid rgba(75, 149, 216, 0.34);
    content: '';
  }
}

@media (prefers-reduced-motion: reduce) {
  .flow-node {
    opacity: 1;
    transform: none;
    animation: none;
  }

  .flow-connection.is-active,
  .flow-pulse {
    animation: none;
  }

  .flow-pulse {
    display: none;
  }
}
</style>
