<template>
  <section id="enterprise-lead" class="enterprise-lead" aria-labelledby="enterprise-lead-title">
    <div class="section-inner">
      <div class="closing-container" data-home-reveal="content">
        <img
          class="closing-flow"
          src="@/assets/enterprise/enterprise-converging-data-flow.png"
          alt=""
          loading="lazy"
          aria-hidden="true"
        />
        <img
          class="closing-brand"
          src="@/assets/enterprise/enterprise-brand-core.png"
          alt=""
          loading="lazy"
          aria-hidden="true"
        />

        <div class="closing-copy">
          <h2 id="enterprise-lead-title">{{ t('enterprisePage.closing.title') }}</h2>
          <p>{{ t('enterprisePage.closing.desc') }}</p>
          <ul class="closing-points">
            <li v-for="point in closingPoints" :key="point">{{ point }}</li>
          </ul>
        </div>

        <form
          v-if="!isSubmitted"
          class="lead-form"
          novalidate
          :aria-busy="isSubmitting"
          @submit.prevent="handleSubmit"
        >
          <fieldset class="lead-fields" :disabled="isSubmitting">
            <div class="form-grid">
              <div class="field field-topic">
                <span>{{ t('enterprisePage.form.topic') }}</span>
                <div class="fixed-value">{{ form.topic }}</div>
              </div>
              <label class="field" :class="{ 'has-error': errors.company }">
                <span
                  >{{ t('enterprisePage.form.company') }}
                  <i class="req" aria-hidden="true">*</i></span
                >
                <input
                  v-model.trim="form.company"
                  type="text"
                  maxlength="100"
                  autocomplete="organization"
                  :placeholder="t('enterprisePage.form.companyPlaceholder')"
                  @input="errors.company = false"
                />
              </label>
              <label class="field" :class="{ 'has-error': errors.name }">
                <span
                  >{{ t('enterprisePage.form.name') }} <i class="req" aria-hidden="true">*</i></span
                >
                <input
                  v-model.trim="form.name"
                  type="text"
                  maxlength="50"
                  autocomplete="name"
                  :placeholder="t('enterprisePage.form.namePlaceholder')"
                  @input="errors.name = false"
                />
              </label>
              <label class="field" :class="{ 'has-error': errors.contact }">
                <span
                  >{{ t('enterprisePage.form.contact') }}
                  <i class="req" aria-hidden="true">*</i></span
                >
                <input
                  v-model.trim="form.contact"
                  type="tel"
                  inputmode="numeric"
                  autocomplete="tel-national"
                  maxlength="11"
                  :placeholder="t('enterprisePage.form.contactPlaceholder')"
                  @input="errors.contact = false"
                />
              </label>
              <div class="field">
                <span>{{ t('enterprisePage.form.scale') }}</span>
                <div
                  class="field-select"
                  :class="{ 'is-open': openSelect === 'scale' }"
                  @keydown.esc="openSelect = ''"
                >
                  <button
                    type="button"
                    class="select-trigger"
                    aria-haspopup="listbox"
                    :aria-expanded="openSelect === 'scale'"
                    @click="toggleSelect('scale')"
                  >
                    <span class="select-value">{{ form.scale }}</span>
                    <svg class="select-chevron" viewBox="0 0 10 6" aria-hidden="true">
                      <path
                        d="M1 1l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.4"
                        stroke-linecap="round"
                      />
                    </svg>
                  </button>
                  <transition name="select-pop">
                    <ul
                      v-if="openSelect === 'scale'"
                      class="select-panel"
                      role="listbox"
                      :aria-label="t('enterprisePage.form.scale')"
                    >
                      <li
                        v-for="option in scaleOptions"
                        :key="option"
                        class="select-option"
                        :class="{ 'is-selected': option === form.scale }"
                        role="option"
                        :aria-selected="option === form.scale"
                        @click="chooseSelect('scale', option)"
                      >
                        <span>{{ option }}</span>
                        <svg
                          v-if="option === form.scale"
                          class="select-check"
                          viewBox="0 0 12 10"
                          aria-hidden="true"
                        >
                          <path
                            d="M1 5.2l3.2 3.2L11 1.6"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.6"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </li>
                    </ul>
                  </transition>
                </div>
              </div>
              <label class="field field-message">
                <span>{{ t('enterprisePage.form.message') }}</span>
                <div class="message-box">
                  <textarea
                    v-model="form.message"
                    rows="4"
                    maxlength="255"
                    :placeholder="t('enterprisePage.form.messagePlaceholder')"
                  ></textarea>
                  <em class="message-count" aria-hidden="true">{{ form.message.length }}/255</em>
                </div>
              </label>
            </div>

            <label class="consent">
              <input v-model="form.consent" type="checkbox" />
              <span
                >{{ t('enterprisePage.form.consentBefore')
                }}<a :href="termsUrl" target="_blank" rel="noopener" @click.stop>{{
                  t('enterprisePage.form.consentTerms')
                }}</a
                >{{ t('enterprisePage.form.consentAnd')
                }}<a :href="privacyUrl" target="_blank" rel="noopener" @click.stop>{{
                  t('enterprisePage.form.consentPrivacy')
                }}</a
                >{{ t('enterprisePage.form.consentAfter') }}</span
              >
            </label>
          </fieldset>

          <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

          <button class="lead-submit" type="submit" :disabled="isSubmitting">
            {{ t(isSubmitting ? 'enterprisePage.form.submitting' : 'enterprisePage.form.submit') }}
          </button>
        </form>
        <div v-else class="lead-success" role="status">
          <h3>{{ t('enterprisePage.form.successTitle') }}</h3>
          <p>{{ t('enterprisePage.form.successDesc') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ENTERPRISE_PHONE_PATTERN } from '../constants'
import { useEnterpriseLead } from '../hooks/useEnterpriseLead'

defineOptions({
  name: 'EnterpriseLeadForm',
})

const { t, tm, locale } = useI18n()
const scaleOptions = computed(() => tm('enterprisePage.form.scaleOptions') as string[])
const closingPoints = computed(() => tm('enterprisePage.closing.bullets') as string[])
const form = reactive({
  topic: t('enterprisePage.form.topicValue'),
  company: '',
  name: '',
  contact: '',
  scale: '',
  message: '',
  consent: false,
})
const errors = reactive({ company: false, name: false, contact: false })
form.scale = scaleOptions.value[0] ?? ''
const { isSubmitting, isSubmitted, submitError, submitLead } = useEnterpriseLead()
const errorMessage = ref('')

const docsBase = computed(() => `https://docs.costrict.ai${locale.value === 'en' ? '/en' : ''}`)
const termsUrl = computed(() => `${docsBase.value}/plugin/policy/terms-of-service`)
const privacyUrl = computed(() => `${docsBase.value}/plugin/policy/privacy-policy`)

// 自定义下拉：原生 select 弹层样式不可控，用面板替代
type SelectKey = 'scale'
const openSelect = ref<'' | SelectKey>('')

const toggleSelect = (key: SelectKey) => {
  openSelect.value = openSelect.value === key ? '' : key
}

const chooseSelect = (key: SelectKey, value: string) => {
  form[key] = value
  openSelect.value = ''
}

const handleClickOutside = (event: MouseEvent) => {
  if (!(event.target as HTMLElement).closest('.field-select')) {
    openSelect.value = ''
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))

const handleSubmit = async () => {
  if (isSubmitting.value || isSubmitted.value) return
  errorMessage.value = ''
  errors.company = !form.company
  errors.name = !form.name
  errors.contact = !ENTERPRISE_PHONE_PATTERN.test(form.contact)

  if (errors.company || errors.name || !form.contact || !form.consent) {
    errorMessage.value = t('enterprisePage.form.errorRequired')
    return
  }
  if (errors.contact) {
    errorMessage.value = t('enterprisePage.form.errorContactInvalid')
    return
  }
  if (!form.scale) form.scale = scaleOptions.value[0] ?? ''

  await submitLead({
    company: form.company,
    name: form.name,
    contact: form.contact,
    scale: form.scale,
    message: form.message.trim(),
    consent: form.consent,
  })
  if (submitError.value) errorMessage.value = t(`enterprisePage.form.${submitError.value}`)
}
</script>

<style scoped lang="less">
.enterprise-lead {
  position: relative;
  padding: 120px 0 88px;
  overflow: hidden;
  background: #050505;
}

.section-inner {
  position: relative;
  z-index: 1;
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
}

.closing-container {
  position: relative;
  display: grid;
  grid-template-columns: 44fr 56fr;
  gap: 52px;
  padding: 52px 56px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.065);
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.025), rgba(55, 199, 232, 0.015)), #080a0d;
}

.closing-flow {
  position: absolute;
  bottom: -100px;
  left: -100px;
  z-index: 0;
  width: 660px;
  max-width: none;
  opacity: 0.44;
  filter: brightness(0.78) saturate(0.85);
  pointer-events: none;
  user-select: none;
}

.closing-brand {
  position: absolute;
  bottom: 28px;
  left: 28px;
  z-index: 1;
  width: 130px;
  max-width: none;
  opacity: 0.3;
  pointer-events: none;
  user-select: none;
}

.closing-copy {
  position: relative;
  z-index: 2;
  h2 {
    margin: 0;
    color: #f3f7fb;
    font-size: 32px;
    font-weight: 600;
    line-height: 42px;
    white-space: pre-line;
  }

  p {
    margin: 16px 0 0;
    color: #8495aa;
    font-size: 15px;
    line-height: 26px;
  }
}

.closing-points {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 26px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #9fb0c3;
    font-size: 14px;
    line-height: 22px;

    &::before {
      flex: none;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #37c7e8;
      content: '';
      opacity: 0.7;
    }
  }
}

.lead-form {
  position: relative;
  z-index: 2;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  span {
    color: #a9b5c2;
    font-size: 13px;
    line-height: 20px;
  }

  input,
  textarea {
    width: 100%;
    height: 46px;
    padding: 0 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    color: #edf2f7;
    background: #0c0f13;
    font: inherit;
    font-size: 14px;
    line-height: 22px;
    outline: none;
    box-sizing: border-box;
    transition:
      border-color 200ms ease,
      box-shadow 200ms ease;

    &::placeholder {
      color: #536276;
    }

    &:focus {
      border-color: rgba(55, 199, 232, 0.42);
      box-shadow: 0 0 0 3px rgba(55, 199, 232, 0.055);
    }
  }

  textarea {
    height: auto;
    min-height: 104px;
    padding: 12px 14px 30px;
    resize: vertical;
  }

  &.has-error input {
    border-color: rgba(243, 139, 139, 0.55);

    &:focus {
      border-color: rgba(243, 139, 139, 0.75);
      box-shadow: 0 0 0 3px rgba(243, 139, 139, 0.08);
    }
  }
}

.req {
  margin-left: 2px;
  color: #f38b8b;
  font-style: normal;
}

.field-message {
  grid-column: 1 / -1;
}

.fixed-value {
  display: flex;
  align-items: center;
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #c7d2de;
  background: rgba(12, 15, 19, 0.72);
  font-size: 14px;
  line-height: 22px;
  box-sizing: border-box;
}

/* 自定义下拉 */
.field-select {
  position: relative;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #edf2f7;
  background: #0c0f13;
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }

  .field-select.is-open & {
    border-color: rgba(55, 199, 232, 0.42);
    box-shadow: 0 0 0 3px rgba(55, 199, 232, 0.055);
  }
}

.select-chevron {
  flex: none;
  width: 10px;
  height: 6px;
  color: #8495aa;
  transition: transform 200ms ease;

  .field-select.is-open & {
    transform: rotate(180deg);
  }
}

.select-panel {
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  margin: 0;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  background: #10151c;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.5);
  list-style: none;
}

.select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  border-radius: 8px;
  color: #c7d2de;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease;

  &:hover {
    color: #edf2f7;
    background: rgba(255, 255, 255, 0.05);
  }

  &.is-selected {
    color: #37c7e8;
    background: rgba(55, 199, 232, 0.07);
  }
}

.select-check {
  flex: none;
  width: 12px;
  height: 10px;
}

.select-pop-enter-active,
.select-pop-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.select-pop-enter-from,
.select-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.message-box {
  position: relative;
}

.message-count {
  position: absolute;
  right: 12px;
  bottom: 10px;
  color: #536276;
  font-size: 12px;
  font-style: normal;
  line-height: 16px;
  pointer-events: none;
}

.field-topic {
  grid-column: 1 / -1;
}

.consent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 20px;
  color: #8495aa;
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;

  input {
    flex: none;
    width: 15px;
    height: 15px;
    margin: 2px 0 0;
    accent-color: #347fff;
    cursor: pointer;
  }

  a {
    color: rgba(55, 199, 232, 0.85);
    text-decoration: none;
    transition: color 180ms ease;

    &:hover {
      color: #37c7e8;
      text-decoration: underline;
    }
  }
}

.form-error {
  margin: 14px 0 0;
  color: #f38b8b;
  font-size: 13px;
  line-height: 20px;
}

.lead-fields {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.lead-submit {
  width: 100%;
  height: 46px;
  margin-top: 24px;
  border: 0;
  border-radius: 10px;
  color: #ffffff;
  background: linear-gradient(120deg, #347fff, #279fe9 58%, #22c7d9);
  box-shadow: 0 8px 24px rgba(43, 143, 242, 0.14);
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 0.92;
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
}

.lead-success {
  margin-top: 24px;
  align-self: center;
  text-align: center;

  h3 {
    margin: 0;
    color: #f3f7fb;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
  }

  p {
    margin: 12px 0 0;
    color: #8495aa;
    font-size: 14px;
    line-height: 24px;
  }

  a {
    color: var(--color-home-brand-cyan);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media (max-width: 1023px) {
  .closing-container {
    grid-template-columns: 1fr;
    gap: 36px;
    padding: 40px 32px;
  }
}

@media (max-width: 767px) {
  .enterprise-lead {
    padding: 96px 24px 104px;
  }

  .closing-brand {
    display: none;
  }

  .closing-flow {
    width: 460px;
    opacity: 0.2;
  }

  .section-inner {
    width: 100%;
  }

  .closing-container {
    padding: 32px 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .field input,
  .field textarea,
  .select-trigger,
  .select-chevron,
  .select-option,
  .select-pop-enter-active,
  .select-pop-leave-active,
  .lead-submit {
    transition: none;
  }
}
</style>
