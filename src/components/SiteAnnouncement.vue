<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'SiteAnnouncement',
})

const { t, locale } = useI18n()
const route = useRoute()
const isVisible = computed(() => locale.value === 'zh' && route.name !== 'pricing')
</script>

<template>
  <div v-if="isVisible" class="announcement-space">
    <RouterLink class="site-announcement" :to="{ name: 'pricing' }">
      <span class="site-announcement__text">{{ t('siteAnnouncement.message') }}</span>
      <span class="site-announcement__action">
        {{ t('siteAnnouncement.action') }}
        <span aria-hidden="true">→</span>
      </span>
    </RouterLink>
  </div>
</template>

<style scoped lang="less">
.announcement-space {
  height: 40px;
}

.site-announcement {
  position: fixed;
  z-index: calc(var(--z-navbar) + 2);
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 0 24px;
  border-bottom: 1px solid rgba(99, 137, 183, 0.18);
  color: #dce7f2;
  background: #0b1119;
  font-size: 13px;
  line-height: 20px;
  text-decoration: none;

  &__text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__action {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 5px;
    color: #7fc4ff;
    font-weight: 500;
    white-space: nowrap;
  }

  &:hover &__action,
  &:focus-visible &__action {
    color: #a9dcff;
  }

  &:focus-visible {
    outline: 1px solid rgba(127, 196, 255, 0.7);
    outline-offset: -2px;
  }
}

@media (max-width: 767px) {
  .announcement-space,
  .site-announcement {
    height: 48px;
  }

  .site-announcement {
    justify-content: space-between;
    gap: 10px;
    padding: 0 16px;
    font-size: 12px;
    line-height: 17px;

    &__text {
      display: -webkit-box;
      overflow: hidden;
      white-space: normal;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}
</style>
