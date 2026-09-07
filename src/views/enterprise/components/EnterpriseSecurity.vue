<template>
  <section class="enterprise-security" aria-labelledby="enterprise-security-title">
    <div class="section-inner">
      <header class="section-heading" data-home-reveal="heading">
        <h2 id="enterprise-security-title">{{ t('enterprisePage.security.title') }}</h2>
        <p>{{ t('enterprisePage.security.subtitle') }}</p>
      </header>

      <div class="security-grid" data-home-reveal="content">
        <article v-for="(item, index) in items" :key="item.title" class="security-item">
          <div class="security-visual" aria-hidden="true">
            <img
              :src="SECURITY_VISUALS[index]"
              alt=""
              width="1100"
              height="825"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div class="security-item-body">
            <span class="security-icon" aria-hidden="true">
              <!-- 物理隔离：盾 + 隔离线 -->
              <svg v-if="index === 0" viewBox="0 0 24 24">
                <path d="M12 3l7 2.8V11c0 4.6-3 8.7-7 10.2C8 19.7 5 15.6 5 11V5.8L12 3z" />
                <path d="M8.5 8.5l7 7" />
              </svg>
              <!-- 端到端加密：锁 -->
              <svg v-else-if="index === 1" viewBox="0 0 24 24">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8.5 11V8a3.5 3.5 0 017 0v3" />
                <path d="M12 15v2" />
              </svg>
              <!-- 审计日志：留痕文档 -->
              <svg v-else-if="index === 2" viewBox="0 0 24 24">
                <rect x="6.5" y="4.5" width="11" height="15" rx="1.6" />
                <path d="M9.5 9h5M9.5 12.5h5M9.5 16h3" />
              </svg>
              <!-- 身份认证：身份卡 -->
              <svg v-else viewBox="0 0 24 24">
                <rect x="4.5" y="6" width="15" height="12" rx="1.8" />
                <circle cx="9.5" cy="11" r="1.8" />
                <path d="M7.2 15.4c.5-1.4 1.3-2 2.3-2s1.8.6 2.3 2" />
                <path d="M13.5 10h3.5M13.5 13h3.5" />
              </svg>
            </span>

            <div class="security-copy">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import securityAuditVisual from '@/assets/enterprise/enterprise-security-audit.webp'
import securityEncryptionVisual from '@/assets/enterprise/enterprise-security-encryption.webp'
import securityIdentityVisual from '@/assets/enterprise/enterprise-security-identity.webp'
import securityIsolationVisual from '@/assets/enterprise/enterprise-security-isolation.webp'

defineOptions({
  name: 'EnterpriseSecurity',
})

interface SecurityItem {
  title: string
  desc: string
}

const SECURITY_VISUALS = [
  securityIsolationVisual,
  securityEncryptionVisual,
  securityAuditVisual,
  securityIdentityVisual,
] as const

const { t, tm } = useI18n()
const items = computed(() => tm('enterprisePage.security.items') as SecurityItem[])
</script>

<style scoped lang="less">
.enterprise-security {
  padding: 72px 0 56px;
  background: #050505;
}

.section-inner {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.section-heading {
  text-align: center;

  h2 {
    margin: 0;
    color: #f3f7fb;
    font-size: 36px;
    font-weight: 600;
    line-height: 44px;
  }

  p {
    max-width: 620px;
    margin: 14px auto 0;
    color: #8495aa;
    font-size: 15px;
    line-height: 26px;
  }
}

.security-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 40px;
}

.security-item {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  background: #090b0e;
  transition:
    border-color 300ms ease,
    background-color 300ms ease;

  &:hover {
    border-color: rgba(55, 199, 232, 0.16);
    background: #0a0d11;

    .security-visual img {
      filter: saturate(0.76) brightness(0.78) contrast(0.98);
      transform: scale(1.025);
    }
  }
}

.security-visual {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9.5;
  border-bottom: 1px solid rgba(255, 255, 255, 0.045);
  background: #07090c;

  &::after {
    position: absolute;
    inset: 0;
    content: '';
    background:
      linear-gradient(180deg, rgba(10, 12, 15, 0.2) 0%, rgba(10, 12, 15, 0.34) 68%, #090b0e 100%),
      rgba(136, 146, 158, 0.08);
    box-shadow: inset 0 0 80px rgba(7, 9, 12, 0.36);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 52%;
    filter: saturate(0.66) brightness(0.7) contrast(0.96);
    transform: scale(1.01);
    transition:
      filter 420ms ease,
      transform 560ms cubic-bezier(0.2, 0.72, 0.2, 1);
  }
}

.security-item-body {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 12px;
  min-height: 116px;
  padding: 18px;
}

.security-copy {
  min-width: 0;

  h3 {
    margin: 0;
    color: #f3f7fb;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }

  p {
    margin: 6px 0 0;
    color: #8495aa;
    font-size: 13px;
    line-height: 21px;
  }
}

.security-icon {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid rgba(55, 199, 232, 0.16);
  border-radius: 10px;
  background: rgba(55, 199, 232, 0.07);

  svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: #37c7e8;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

@media (max-width: 1023px) {
  .security-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .security-item-body {
    min-height: 112px;
    padding-right: 22px;
    padding-left: 22px;
  }
}

@media (max-width: 767px) {
  .enterprise-security {
    padding: 96px 24px 64px;
  }

  .section-inner {
    width: 100%;
  }

  .section-heading h2 {
    font-size: 32px;
    line-height: 40px;
  }

  .security-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 48px;
  }

  .security-visual {
    aspect-ratio: 16 / 9;
  }

  .security-item-body {
    min-height: 0;
    padding: 20px 20px 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .security-item,
  .security-visual img {
    transition: none;
  }
}
</style>
