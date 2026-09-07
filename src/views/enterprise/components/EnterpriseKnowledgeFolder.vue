<template>
  <div class="knowledge-folder" role="group" :aria-label="label" tabindex="0">
    <div class="folder-trigger">
      <span class="folder-back" aria-hidden="true"></span>

      <span
        v-for="(source, index) in sources"
        :key="source"
        class="knowledge-document"
        :class="`knowledge-document--${index + 1}`"
      >
        <strong>{{ source }}</strong>
        <span class="document-lines" aria-hidden="true">
          <i v-for="line in 6" :key="line"></i>
        </span>
      </span>

      <span class="folder-front" aria-hidden="true">
        <span></span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'EnterpriseKnowledgeFolder',
})

interface Props {
  sources?: string[]
  label?: string
}

withDefaults(defineProps<Props>(), {
  sources: () => [],
  label: '',
})
</script>

<style scoped lang="less">
.knowledge-folder {
  position: relative;
  display: flex;
  width: 156px;
  height: 160px;
  align-items: center;
  justify-content: center;
  outline: 0;
}

.folder-trigger {
  position: relative;
  display: block;
  width: 142px;
  height: 126px;
  padding: 0;
  border: 0;
  outline: 0;
  cursor: pointer;
  background: transparent;
  perspective: 700px;
}

.folder-back {
  position: absolute;
  right: 6px;
  bottom: 4px;
  left: 6px;
  z-index: 1;
  height: 90px;
  border: 1px solid rgba(74, 176, 217, 0.2);
  border-radius: 7px;
  background: linear-gradient(180deg, rgba(17, 43, 61, 0.96), rgba(7, 19, 29, 0.98)), #0a111a;
  box-shadow:
    inset 0 0 28px rgba(50, 170, 220, 0.08),
    0 18px 42px rgba(0, 0, 0, 0.34);
}

.folder-back::before {
  position: absolute;
  top: -12px;
  left: 0;
  width: 54px;
  height: 18px;
  border: 1px solid rgba(74, 176, 217, 0.2);
  border-bottom: 0;
  border-radius: 7px 9px 0 0;
  background: #102536;
  content: '';
}

.knowledge-document {
  position: absolute;
  top: 18px;
  left: 50%;
  z-index: 2;
  display: flex;
  box-sizing: border-box;
  width: 80px;
  min-height: 98px;
  padding: 10px 8px;
  border: 1px solid rgba(120, 168, 203, 0.22);
  border-radius: 6px;
  flex-direction: column;
  color: #c9dbe8;
  background: linear-gradient(180deg, #15202d, #0c141e);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.34);
  transform: translate(-50%, 5px) rotate(0deg);
  transform-origin: center bottom;
  transition:
    transform 560ms cubic-bezier(0.22, 1.35, 0.32, 1),
    border-color 300ms ease,
    box-shadow 300ms ease;

  strong {
    min-height: 26px;
    font-size: 9px;
    font-weight: 500;
    line-height: 13px;
    text-align: left;
  }
}

.knowledge-document--1 {
  z-index: 2;
  transform: translate(-64%, 7px) rotate(-3deg);
}

.knowledge-document--2 {
  z-index: 3;

  strong {
    text-align: center;
  }
}

.knowledge-document--3 {
  z-index: 2;
  transform: translate(-36%, 7px) rotate(3deg);

  strong {
    text-align: right;
  }
}

.document-lines {
  display: flex;
  gap: 5px;
  margin-top: 6px;
  flex-direction: column;
}

.document-lines i {
  display: block;
  width: 100%;
  height: 1px;
  border-radius: 999px;
  background: rgba(116, 151, 178, 0.2);
}

.document-lines i:nth-child(2),
.document-lines i:nth-child(5) {
  width: 76%;
}

.document-lines i:nth-child(3) {
  width: 88%;
}

.folder-front {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4;
  height: 78px;
  overflow: hidden;
  border: 1px solid rgba(73, 190, 231, 0.22);
  border-radius: 7px 7px 10px 10px;
  background: linear-gradient(160deg, rgba(28, 91, 121, 0.78), rgba(10, 31, 45, 0.96) 62%), #0b1c28;
  box-shadow:
    inset 0 1px rgba(157, 225, 246, 0.08),
    inset 0 -28px 50px rgba(1, 9, 16, 0.24),
    0 14px 34px rgba(0, 0, 0, 0.36);
  transform: rotateX(0deg);
  transform-origin: center bottom;
  transition: transform 520ms cubic-bezier(0.22, 1.2, 0.32, 1);
}

.folder-front::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(91, 211, 242, 0.38), transparent);
  content: '';
}

.folder-front span {
  position: absolute;
  top: 17px;
  left: 50%;
  width: 24px;
  height: 3px;
  border-radius: 999px;
  background: rgba(91, 211, 242, 0.32);
  box-shadow: 0 0 14px rgba(55, 199, 232, 0.26);
  transform: translateX(-50%);
}

.knowledge-folder:hover .knowledge-document--1,
.knowledge-folder:focus-visible .knowledge-document--1 {
  border-color: rgba(89, 205, 238, 0.34);
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.44);
  transform: translate(-105%, -20px) rotate(-9deg);
}

.knowledge-folder:hover .knowledge-document--2,
.knowledge-folder:focus-visible .knowledge-document--2 {
  border-color: rgba(89, 205, 238, 0.38);
  box-shadow: 0 20px 38px rgba(0, 0, 0, 0.46);
  transform: translate(-50%, -34px) rotate(1deg);
}

.knowledge-folder:hover .knowledge-document--3,
.knowledge-folder:focus-visible .knowledge-document--3 {
  border-color: rgba(89, 205, 238, 0.34);
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.44);
  transform: translate(8%, -22px) rotate(9deg);
}

.knowledge-folder:hover .folder-front,
.knowledge-folder:focus-visible .folder-front {
  transform: rotateX(-34deg) translateY(3px);
}

.knowledge-folder:focus-visible::after {
  position: absolute;
  inset: -8px;
  border: 1px solid rgba(91, 211, 242, 0.46);
  border-radius: 10px;
  content: '';
}

@media (max-width: 767px) {
  .knowledge-document--1 {
    transform: translate(-105%, -20px) rotate(-9deg);
  }

  .knowledge-document--2 {
    transform: translate(-50%, -34px) rotate(1deg);
  }

  .knowledge-document--3 {
    transform: translate(8%, -22px) rotate(9deg);
  }

  .folder-front {
    transform: rotateX(-34deg) translateY(3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .knowledge-document,
  .folder-front {
    transition: none;
  }
}
</style>
