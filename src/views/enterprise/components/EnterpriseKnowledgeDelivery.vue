<template>
  <div class="delivery-flow" role="group" :aria-label="`${factoryTitle}，${distributionTitle}`">
    <div class="tool-fan" aria-hidden="true">
      <span
        v-for="(tool, index) in tools"
        :key="tool.label"
        class="tool-chip"
        :class="`tool-chip--${index + 1}`"
      >
        <i>{{ tool.icon }}</i>
        <small>{{ tool.label }}</small>
      </span>
    </div>

    <div class="converging-lines" aria-hidden="true">
      <i></i>
      <i></i>
      <i></i>
    </div>

    <div class="factory-node">
      <span aria-hidden="true">S</span>
      <div>
        <strong>{{ factoryTitle }}</strong>
        <small>{{ factoryDesc }}</small>
      </div>
    </div>

    <span class="delivery-line" aria-hidden="true"><i></i></span>

    <div class="people-delivery">
      <div class="people-row" aria-hidden="true">
        <span v-for="person in 3" :key="person" class="person-node">
          <i></i>
          <b></b>
        </span>
      </div>
      <strong>{{ distributionTitle }}</strong>
      <small>{{ distributionDesc }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'EnterpriseKnowledgeDelivery',
})

interface Props {
  factoryTitle?: string
  factoryDesc?: string
  distributionTitle?: string
  distributionDesc?: string
}

withDefaults(defineProps<Props>(), {
  factoryTitle: '',
  factoryDesc: '',
  distributionTitle: '',
  distributionDesc: '',
})

const tools = [
  { icon: 'M', label: 'MCP' },
  { icon: 'S', label: 'Skill' },
  { icon: '>_', label: 'Command' },
  { icon: 'P', label: 'Plugin' },
]
</script>

<style scoped lang="less">
.delivery-flow {
  position: relative;
  display: flex;
  width: 156px;
  min-height: 286px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.tool-fan {
  position: relative;
  width: 150px;
  height: 76px;
}

.tool-chip {
  position: absolute;
  display: flex;
  width: 54px;
  height: 31px;
  align-items: center;
  padding: 0 6px;
  border: 1px solid rgba(102, 185, 218, 0.18);
  border-radius: 5px;
  color: #8ba2b7;
  background: rgba(12, 22, 32, 0.94);
  box-shadow: 0 9px 22px rgba(0, 0, 0, 0.28);
  transform-origin: center bottom;
  transition: transform 520ms cubic-bezier(0.16, 1, 0.3, 1);

  i {
    display: inline-flex;
    width: 17px;
    height: 17px;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
    border: 1px solid rgba(74, 201, 234, 0.24);
    border-radius: 4px;
    color: #79d9ed;
    background: rgba(35, 128, 157, 0.12);
    font-size: 7px;
    font-style: normal;
    font-weight: 600;
    line-height: 1;
  }

  small {
    font-size: 7px;
    line-height: 12px;
  }
}

.tool-chip--1 {
  top: 27px;
  left: 3px;
  transform: rotate(-12deg);
}

.tool-chip--2 {
  top: 3px;
  left: 49px;
  transform: rotate(-2deg);
}

.tool-chip--3 {
  top: 27px;
  right: 1px;
  transform: rotate(12deg);
}

.tool-chip--4 {
  top: 39px;
  left: 51px;
  transform: rotate(2deg);
}

.delivery-flow:hover .tool-chip--1 {
  transform: translate(-5px, -3px) rotate(-16deg);
}

.delivery-flow:hover .tool-chip--2 {
  transform: translateY(-7px) rotate(-2deg);
}

.delivery-flow:hover .tool-chip--3 {
  transform: translate(5px, -3px) rotate(16deg);
}

.delivery-flow:hover .tool-chip--4 {
  transform: translateY(3px) rotate(2deg);
}

.converging-lines {
  position: relative;
  width: 96px;
  height: 25px;
  margin-top: -3px;
}

.converging-lines::before,
.converging-lines::after,
.converging-lines i {
  position: absolute;
  background: rgba(55, 199, 232, 0.2);
  content: '';
}

.converging-lines::before {
  top: 0;
  right: 9px;
  left: 9px;
  height: 1px;
}

.converging-lines::after {
  top: 0;
  left: 50%;
  width: 1px;
  height: 25px;
}

.converging-lines i {
  top: 0;
  width: 1px;
  height: 12px;
}

.converging-lines i:first-child {
  left: 9px;
}

.converging-lines i:nth-child(2) {
  left: 31px;
}

.converging-lines i:last-child {
  right: 9px;
}

.factory-node {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  width: 140px;
  min-height: 56px;
  padding: 9px;
  border: 1px solid rgba(55, 199, 232, 0.2);
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(13, 33, 45, 0.98), rgba(8, 18, 27, 0.98));
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.32),
    inset 0 0 24px rgba(55, 199, 232, 0.04);

  > span {
    display: inline-flex;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(55, 199, 232, 0.25);
    border-radius: 5px;
    color: #79d9ed;
    background: rgba(32, 113, 146, 0.14);
    font-size: 11px;
    font-weight: 600;
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: #c7d5e2;
    font-size: 10px;
    font-weight: 500;
    line-height: 16px;
  }

  small {
    margin-top: 1px;
    color: #62788d;
    font-size: 8px;
    line-height: 12px;
  }
}

.delivery-line {
  position: relative;
  display: block;
  width: 1px;
  height: 29px;
  overflow: hidden;
  background: rgba(55, 199, 232, 0.2);
}

.delivery-line::after {
  position: absolute;
  right: -3px;
  bottom: 0;
  width: 7px;
  height: 7px;
  border-right: 1px solid rgba(55, 199, 232, 0.42);
  border-bottom: 1px solid rgba(55, 199, 232, 0.42);
  content: '';
  transform: rotate(45deg);
}

.delivery-line i {
  position: absolute;
  top: -8px;
  left: 0;
  width: 1px;
  height: 8px;
  background: #59d6ee;
  box-shadow: 0 0 8px rgba(55, 199, 232, 0.72);
  animation: delivery-pulse 2.4s ease-in-out infinite;
}

.people-delivery {
  display: flex;
  width: 140px;
  align-items: center;
  flex-direction: column;
  text-align: center;

  > strong {
    margin-top: 7px;
    color: #aebfce;
    font-size: 10px;
    font-weight: 500;
    line-height: 16px;
  }

  > small {
    margin-top: 1px;
    color: #5f7488;
    font-size: 8px;
    line-height: 12px;
  }
}

.people-row {
  display: flex;
  gap: 11px;
  align-items: flex-end;
  justify-content: center;
}

.person-node {
  position: relative;
  display: block;
  width: 25px;
  height: 29px;

  i {
    position: absolute;
    top: 0;
    left: 50%;
    width: 10px;
    height: 10px;
    border: 1px solid rgba(98, 188, 220, 0.34);
    border-radius: 50%;
    background: #102535;
    transform: translateX(-50%);
  }

  b {
    position: absolute;
    right: 2px;
    bottom: 0;
    left: 2px;
    height: 16px;
    border: 1px solid rgba(98, 188, 220, 0.28);
    border-radius: 10px 10px 4px 4px;
    background: linear-gradient(180deg, rgba(21, 63, 82, 0.82), rgba(8, 24, 35, 0.9));
  }
}

.person-node:nth-child(2) {
  transform: translateY(-4px);
}

@keyframes delivery-pulse {
  0% {
    opacity: 0;
    transform: translateY(0);
  }

  35% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(37px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tool-chip {
    transition: none;
  }

  .delivery-line i {
    animation: none;
  }
}
</style>
