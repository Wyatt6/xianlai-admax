<template>
  <el-sub-menu v-if="menu.children.length > 0" :index="menu.path">
    <template #title>
      <div v-if="menu.meta.icon">
        <el-icon v-if="menu.meta.icon.includes('el-icon')" :size="15">
          <component :is="menu.meta.icon.substring(8, menu.meta.icon.length)" />
        </el-icon>
        <svg-icon class="custom-icon" v-else :icon="menu.meta.icon" />
      </div>
      <span>{{ menu.meta.title }}</span>
    </template>
    <menu-item v-for="item in menu.children" :key="item.path" :menu="item" />
  </el-sub-menu>
  <el-menu-item v-else :index="menu.path">
    <div v-if="menu.meta.icon">
      <el-icon v-if="menu.meta.icon.includes('el-icon')" :size="15">
        <component :is="menu.meta.icon.substring(8, menu.meta.icon.length)" />
      </el-icon>
      <svg-icon class="custom-icon" v-else :icon="menu.meta.icon" />
    </div>
    <template #title>
      <span>{{ menu.meta.title }}</span>
    </template>
  </el-menu-item>
</template>

<script setup>
/**
 * 说明：
 * 侧边栏菜单组件，接受菜单数组menus的元素menu对象作为输入
 * 如果当前菜单有子菜单就用<el-sub-menu>
 * 如果没有子菜单，就用<el-menu-item>
 * 注意<el-submenu>是旧版本^1.0.2-beta.28的标签了
 */
import { defineProps } from 'vue'
import MenuItem from './index.vue'

defineProps({
  menu: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.custom-icon {
  display: flex;
  align-items: center;
  width: 24px;
  height: 20px;
  margin-right: 5px;
}
</style>
