<template>
  <div class="content-wrapper">
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
/**
 * 说明：
 * 主内容区，具备动画切换的效果，同时带动页面标签栏的动作
 */
import { watch } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import { useRoute } from 'vue-router'
import RouteConst from '@/constants/route_const'

const route = useRoute()
const layoutStore = useLayoutStore()

const tagPathException = [
  RouteConst.LOGIN,
  RouteConst.REGISTER,
  RouteConst.NOT_AUTHORIZED,
  RouteConst.NOT_FOUND,
  RouteConst.NOT_CONNECT
]
/**
 * 根据路由路径判断是否应该显示为页面标签
 * @param {*} path 路由路径
 * @returns true-应该显示为页面标签；false-不应该显示为页面标签
 */
const isTag = path => {
  return !tagPathException.includes(path)
}

// 监听主内容区路由变化，如果要添加页面标签则添加
watch(
  route,
  (to, from) => {
    if (!isTag(to.path)) return
    const { fullPath, meta, name, params, path, query } = to
    const title = to.meta.title
    layoutStore.addTag({ fullPath, meta, name, params, path, query, title })
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@use '../index.module.scss' as variables;

$--padding-top: 5px;
$--padding-left-right: 8px;

.content-wrapper {
  width: 100%;
  height: 100%;
  padding: calc(variables.$navbar-height + variables.$tagbar-height + $--padding-top) $--padding-left-right 0px
    $--padding-left-right;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
