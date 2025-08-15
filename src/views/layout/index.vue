<template>
  <div class="page-wrapper" :class="[layoutStore.sidebarExpand ? 'sidebar-expand' : 'sidebar-hidden']">
    <Sidebar />
    <div class="right-wrapper">
      <div class="fixed-header">
        <Navbar />
        <Tagbar />
      </div>
      <Content />
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { useLayoutStore } from '@/stores/layout'
import Sidebar from './Sidebar/index.vue'
import Navbar from './Navbar/index.vue'
import Tagbar from './Tagbar/index.vue'
import Content from './Content/index.vue'
import AuthorizationService from '@/services/authorization_service'
import ProfileService from '@/services/profile_service'

const appStore = useAppStore()
const layoutStore = useLayoutStore()

// ----- 授权数据 -----
watch(
  () => appStore.hasAuthorizations,
  async (value, oldValue) => {
    if (!value && !appStore.gettingAuthorizations && !appStore.loggingOut) {
      await AuthorizationService.getAuthorizations()
    }
  },
  { immediate: true }
)

// ----- 用户个人信息 -----
watch(
  () => appStore.hasProfile,
  async (value, oldValue) => {
    if (!value && !appStore.gettingProfile) {
      await ProfileService.getProfile(appStore.user.id)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import './index.module.scss';

.page-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: #f2f3f5;

  .right-wrapper {
    height: 100%;
    margin-left: $--sidebar-width;
    transition: margin-left #{$--sidebar-transition-duration};

    .fixed-header {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 1001;
      width: calc(100% - #{$--sidebar-width});
      transition: width #{$--sidebar-transition-duration};
    }
  }
}

.sidebar-hidden {
  .right-wrapper {
    margin-left: $--sidebar-width-hidden !important;

    .fixed-header {
      width: calc(100% - #{$--sidebar-width-hidden});
    }
  }
}
</style>
