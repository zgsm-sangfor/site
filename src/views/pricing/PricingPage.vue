<template>
  <div class="pricing-page-shell">
    <div class="pricing-page pt-24 pb-23 relative">
      <img
        src="../../assets/price/bg_1.png"
        alt="background"
        class="absolute left-[-10px] top-85 w-55 h-58 priceing-page__bg"
      />
      <img
        src="../../assets/price/bg_2.png"
        alt="background"
        class="absolute left-124 top-104 w-55 pricing-page__bg"
      />
      <img
        src="../../assets/price/bg_3.png"
        alt="background"
        class="absolute left-155 top-81 w-28.5 pricing-page__bg"
      />
      <img
        src="../../assets/price/bg_4.png"
        alt="background"
        class="absolute left-233.5 top-104 w-55 pricing-page__bg"
      />
      <img
        src="../../assets/price/bg_5.png"
        alt="background"
        class="absolute left-265 top-81 w-28.5 pricing-page__bg"
      />
      <!-- 问卷 banner 已屏蔽
    <div
      class="fixed left-0 right-0 top-20 flex min-h-16 items-center justify-center rounded-[2px] bg-[linear-gradient(90.2deg,#0c0f15_46.43%,#0a101a_51%,#090c12_69.27%)] px-4 text-[15px] leading-normal text-white/70 max-[960px]:static max-[960px]:mb-[22px] max-[960px]:min-h-14 max-[960px]:flex-wrap max-[960px]:justify-start max-[960px]:gap-x-3 max-[960px]:gap-y-2 max-[960px]:px-3.5 max-[960px]:py-3">
      <img class="shrink-0 max-[960px]:size-5" src="../../assets/price/gift.svg" alt="gift">
      <span class="shrink-0 whitespace-nowrap text-[19px] font-semibold max-[960px]:whitespace-normal max-[960px]:text-base">
        {{ t('pricing.survey.prefix') }}
        <span class="text-[#00ffb7]">{{ t('pricing.survey.credits') }}</span>
      </span>
      <span
        class="ml-[26px] min-w-0 whitespace-nowrap text-[15px] text-white/65 max-[960px]:ml-0 max-[960px]:text-[13px]">{{
          t('pricing.survey.extra') }}</span>
      <span class="ml-3 h-[19px] w-px bg-white/45 max-[960px]:hidden" aria-hidden="true"></span>
      <span
        class="ml-[26px] min-w-0 whitespace-nowrap text-[15px] text-white/65 max-[960px]:ml-0 max-[960px]:text-[13px]">{{
          t('pricing.survey.deadline') }}</span>
      <button
        class="ml-14 h-[37px] min-w-[139px] cursor-pointer rounded-[2px] border-0 bg-[linear-gradient(90deg,#2a7fff_0%,#00d8b7_100%)] text-sm font-semibold text-white max-[960px]:ml-0 max-[960px]:min-w-[120px]"
        type="button" @click="toSurvey">
        {{ t('pricing.survey.feedbackButton') }}
      </button>
      <button
        class="ml-7 inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap border-0 bg-transparent text-sm font-semibold text-[#2a7fff] max-[960px]:ml-0"
        type="button" @click="toSurveyDetail">
        {{ t('pricing.survey.detailLink') }}
        <span aria-hidden="true">›</span>
      </button>
    </div>
    -->
      <div class="pricing-page__title text-3xl text-center">{{ t('pricing.title') }}</div>

      <section class="pricing-notice" aria-labelledby="pricing-notice-title">
        <div class="pricing-notice__header">
          <h1 id="pricing-notice-title">{{ t('pricing.notice.title') }}</h1>
        </div>
        <div class="pricing-notice__body">
          <div class="pricing-notice__intro">
            <span>{{ t('pricing.notice.salutation') }}</span>
          </div>
          <p class="pricing-notice__message">
            <span class="pricing-notice__thanks">{{ t('pricing.notice.thanks') }}</span>
            {{ t('pricing.notice.strategy') }}<strong>{{ t('pricing.notice.deadline') }}</strong
            >{{ t('pricing.notice.deadlineRest') }}{{ t('pricing.notice.impact')
            }}{{ t('pricing.notice.apiPrefix') }}
            <a
              class="pricing-notice__inline-link"
              href="https://docs.costrict.ai/plugin/guide/api-integration"
              target="_blank"
              rel="noopener"
              >{{ t('pricing.notice.apiLink') }}</a
            >
            {{ t('pricing.notice.apiSuffix') }}{{ t('pricing.notice.enterprisePrefix') }}
            <a class="pricing-notice__inline-link" href="/enterprise#enterprise-lead">{{
              t('pricing.notice.enterpriseLink')
            }}</a>
            {{ t('pricing.notice.enterpriseSuffix') }}{{ t('pricing.notice.closing') }}
          </p>
          <div class="pricing-notice__signature">
            <span>{{ t('pricing.notice.team') }}</span>
            <span>{{ t('pricing.notice.date') }}</span>
          </div>
        </div>
      </section>

      <div class="pricing-page__content mt-7">
        <div class="content-version grid grid-cols-4 gap-5">
          <div
            v-for="(plan, index) in pricingPlans"
            :key="index"
            class="content-version__item min-88 px-5 py-6 relative"
          >
            <div v-if="plan.showTrafficLabel" class="absolute right-0 top-[-4px]">
              <img src="../../assets/label-bg.webp" alt="label" />
              <span class="absolute top-1 left-7 label-text">{{
                t('pricing.tag.trafficPackage')
              }}</span>
            </div>
            <div class="content-version__item-title text-base font-semibold">{{ plan.title }}</div>
            <div class="content-version__item-price flex items-center text-3xl mt-3">
              <span class="price-unit ml-[-8px]">￥</span>
              <span class="price">{{ plan.price }}</span>
              <span v-if="index === 1" class="text-xs ml-2 mt-2 original-price__tips">{{
                t('pricing.firstRechargeDiscount')
              }}</span>
              <span
                v-if="plan.originalPrice"
                class="original-price text-line-through text-base mt-2"
                :class="index === 1 ? 'ml-1' : 'ml-2.5'"
              >
                ￥{{ plan.originalPrice }}
              </span>
              <span
                v-if="plan.totalQuota"
                class="quota-value ml-auto text-base font-medium self-end mb-1"
                >{{ plan.totalQuota }}</span
              >
            </div>
            <div class="content-version__item-desc mt-2.5 text-sm text-[#EFEFEF]">
              {{ plan.description }}
            </div>
            <div
              class="content-version__item-btn h-10 text-center leading-10 mt-5 rounded-sm"
              :class="{
                'btn-purchase': plan.buttonType === 'purchase',
                'btn-download': plan.buttonType !== 'purchase',
                'is-disabled': plan.buttonType === 'purchase' && isPurchaseDisabled,
              }"
              :aria-disabled="plan.buttonType === 'purchase' && isPurchaseDisabled"
              @click="handlePlanClick(plan)"
            >
              {{
                plan.buttonType === 'purchase' && isPurchaseDisabled
                  ? t('pricing.purchaseUnavailable')
                  : plan.buttonText
              }}
            </div>
            <ul class="content-version__item-features text-xs mt-5">
              <li
                v-for="(feature, featureIndex) in plan.features"
                :key="featureIndex"
                class="flex items-start mb-4 last-of-type:mb-0"
              >
                <img
                  class="mt-0.5"
                  v-if="feature.available"
                  src="../../assets/y.svg"
                  alt="available"
                />
                <img v-else src="../../assets/x.svg" alt="unavailable" />
                <p class="ml-2">{{ feature.text }}</p>
              </li>
            </ul>
            <div
              v-if="index === 0 && !isPurchaseDisabled"
              class="content-version__item-activity mt-4"
            >
              <span
                class="text-xs text-[#2A7FFF] cursor-pointer hover:underline"
                @click="toOperation"
              >
                {{ t('pricing.activityLink') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5 flex item-center">
        {{ t('pricing.learnMore') }}
        <span class="ml-2 text-[#2A7FFF] cursor-pointer" @click="toDetail"
          >{{ t('pricing.billingDescription') }} >></span
        >
      </div>
    </div>
    <HomeFooter :always-visible="true" />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { useCreditsServiceCutoff } from '@/hooks/useCreditsServiceCutoff'
import HomeFooter from '@/views/home/components/HomeFooter.vue'
import { createPricingPlans } from './const'
import { computed } from 'vue'
import type { PricingPlan } from './interface'

const { t } = useI18n()
const router = useRouter()
const { isCreditsServiceEnded: isPurchaseDisabled } = useCreditsServiceCutoff()

// 使用国际化函数创建价格套餐和指南步骤
const pricingPlans = computed(() => createPricingPlans(t))

const handlePlanClick = (plan: PricingPlan) => {
  if (plan.buttonType === 'purchase' && isPurchaseDisabled.value) return
  plan.clickEvent()
}

// 问卷入口已屏蔽
// const SURVEY_URL = 'https://v.wjx.cn/vm/t7BdP0M.aspx'
// const SURVEY_DETAIL_URL = 'https://mp.weixin.qq.com/s/kX8zt50Yu01a4NB6zwbn-g'

defineOptions({
  name: 'PricingPage',
})

useHead({
  title: 'CoStrict 价格方案 - 个人免费 | 企业套餐 | 私有化部署',
  meta: [
    {
      name: 'description',
      content:
        'CoStrict 提供灵活的价格方案：个人开发者永久免费，企业套餐支持私有化部署，满足不同规模团队的 AI 编程需求。',
    },
    { property: 'og:title', content: 'CoStrict 价格方案 - 个人免费 | 企业套餐 | 私有化部署' },
    {
      property: 'og:description',
      content:
        'CoStrict 提供灵活的价格方案：个人开发者永久免费，企业套餐支持私有化部署，满足不同规模团队的 AI 编程需求。',
    },
    { property: 'og:url', content: 'https://costrict.ai/pricing' },
    { name: 'twitter:title', content: 'CoStrict 价格方案 - 个人免费 | 企业套餐 | 私有化部署' },
    {
      name: 'twitter:description',
      content: 'CoStrict 提供灵活的价格方案：个人开发者永久免费，企业套餐支持私有化部署。',
    },
  ],
  link: [{ rel: 'canonical', href: 'https://costrict.ai/pricing' }],
})

const toDetail = () => {
  window.open('https://docs.costrict.ai/billing/purchase/')
}

const toOperation = () => {
  router.push('/operation')
}

// 问卷入口已屏蔽
// const toSurvey = () => {
//   window.open(SURVEY_URL)
// }
//
// const toSurveyDetail = () => {
//   window.open(SURVEY_DETAIL_URL)
// }
</script>

<style lang="less" scoped>
.pricing-page-shell {
  position: relative;
  width: 100%;
}

.pricing-page {
  width: 1300px;
  margin: auto;
  color: white;

  @media (max-width: 1320px) {
    width: 90%;
  }

  @media (max-width: 960px) {
    padding-top: 90px;
    padding-bottom: 40px;
  }

  &__bg {
    @media (max-width: 1320px) {
      display: none;
    }
  }

  .pricing-notice {
    position: relative;
    margin-top: 48px;
    padding: 34px 28px 24px;
    border-top: 1px solid rgba(118, 151, 190, 0.22);
    border-bottom: 1px solid rgba(118, 151, 190, 0.22);
    background: rgba(9, 15, 23, 0.72);

    &__header {
      position: absolute;
      top: 0;
      left: 50%;
      max-width: calc(100% - 48px);
      transform: translate(-50%, -50%);
    }

    h1 {
      margin: 0;
      padding: 9px 24px;
      border: 1px solid rgba(118, 151, 190, 0.3);
      border-radius: 6px;
      background: #090f17;
      color: #f3f7fb;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      text-align: center;
      white-space: nowrap;
    }

    &__intro {
      display: grid;
      gap: 4px;
      color: #9eafc1;
      font-size: 13px;
      line-height: 20px;
    }

    &__body {
      display: grid;
      gap: 10px;
      margin-top: 14px;
    }

    p {
      margin: 0;
      color: #9eafc1;
      font-size: 14px;
      line-height: 22px;
    }

    &__message strong {
      color: #dce7f2;
      font-weight: 600;
    }

    &__thanks {
      display: block;
    }

    &__inline-link {
      color: #75bfff;
      text-decoration: none;

      &:hover,
      &:focus-visible {
        color: #a9dcff;
        text-decoration: underline;
        outline: none;
      }
    }

    &__signature {
      display: grid;
      justify-items: end;
      color: #9eafc1;
      font-size: 13px;
      line-height: 20px;
    }
  }

  &__content {
    .content-version {
      @media (max-width: 1320px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      @media (max-width: 768px) {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }

      &__item {
        position: relative;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 10px;
        z-index: 0;

        &-btn {
          background: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;

          &.btn-download {
            background: rgba(0, 102, 255, 0.3);
            border: 1px solid rgba(0, 102, 255, 0.5);

            &:hover {
              box-shadow: 0 0 10px rgba(0, 102, 255, 0.3);
            }
          }

          &.btn-purchase {
            background: linear-gradient(91deg, #005eff -9%, #00ffb7 104%);
          }

          &.is-disabled {
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.42);
            background: rgba(255, 255, 255, 0.07);
            cursor: not-allowed;
          }

          &.btn-download {
            border: 1px solid;
            border-image: linear-gradient(
                107deg,
                #0066ff 38%,
                #00ffb7 52%,
                rgba(247, 255, 253, 0.51) 88%,
                rgba(0, 94, 255, 0.09) 100%
              )
              1;
            background: rgba(255, 255, 255, 0.2);
          }
        }

        .original-price {
          text-decoration: line-through;
          color: rgba(255, 255, 255, 0.7);

          &__tips {
            background: linear-gradient(102deg, #00ffb7 3%, #ffffff 68%, #ffffff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }

        .label-text {
          background: linear-gradient(185deg, #005eff 35%, #00ffb7 93%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .quota-value {
          background: linear-gradient(91deg, #00ffb7 0%, #ffffff 101%, #c5dbff 150%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }

      &__item::before {
        content: '';
        position: absolute;
        inset: 0;
        padding: 1px;
        border-radius: 10px;
        background: linear-gradient(
          176deg,
          #0066ff -7%,
          #00ffb7 16%,
          rgba(247, 255, 253, 0.51) 51%,
          rgba(0, 94, 255, 0.3) 85%,
          rgba(0, 94, 255, 0.6) 100%
        );
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        z-index: -1;
      }
    }
  }

  @media (max-width: 960px) {
    .pricing-notice {
      padding: 24px;
    }
  }

  @media (max-width: 480px) {
    .pricing-notice {
      margin-top: 58px;
      padding: 48px 16px 20px;

      &__header {
        width: calc(100% - 32px);
      }

      h1 {
        padding: 8px 14px;
        font-size: 19px;
        line-height: 27px;
        white-space: normal;
      }
    }
  }
}
</style>
