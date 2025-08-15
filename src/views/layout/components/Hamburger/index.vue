<template>
  <div class="hamburger-container" @click="toggle">
    <svg-icon class="hamburger" :icon="icon" />
  </div>
</template>

<script setup>
/**
 * 说明：
 * 放在顶部导航栏左侧的菜单栏伸缩按钮
 */
import { computed } from 'vue'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// 切换动作
const toggle = () => {
  layoutStore.changeSidebarExpand()
}

const icon = computed(() => {
  return layoutStore.sidebarExpand ? 'ri-menu-fold-fill' : 'ri-menu-unfold-fill'
})
</script>

<style lang="scss" scoped>
.hamburger-container {
  display: flex;
  align-items: center;
  padding: 0px 10px;

  .hamburger {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }
}
</style>
