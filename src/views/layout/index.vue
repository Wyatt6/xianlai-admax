<template>
  <div class="page-wrap" :class="[layoutStore.sidebarExpand ? '' : 'sidebar-hidden']">
    <Sidebar />
    <div class="right-wrap">
      <div class="fixed-header">
        <Navbar />
        <Tagbar />
      </div>
      <Content />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar/index.vue'
import Navbar from './Navbar/index.vue'
import Tagbar from './Tagbar/index.vue'
import Content from './Content/index.vue'
import { watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { useLayoutStore } from '@/stores/layout'
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
@use './index.module.scss' as variables;

.page-wrap {
  width: 100%;
  height: 100%;
  background-color: var(--el-bg-color-page);

  .right-wrap {
    height: 100%;
    margin-left: variables.$sidebar-width;
    transition: margin-left #{variables.$sidebar-transition-duration};

    .fixed-header {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 1001;
      width: calc(100% - variables.$sidebar-width);
      transition: width #{variables.$sidebar-transition-duration};
    }
  }
}

.sidebar-hidden {
  .right-wrap {
    margin-left: variables.$sidebar-width-hidden !important;

    .fixed-header {
      width: calc(100% - variables.$sidebar-width-hidden);
    }
  }
}
</style>
