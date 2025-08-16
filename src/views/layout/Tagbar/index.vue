<template>
  <div class="tagbar-wrapper">
    <el-scrollbar class="tagbar">
      <router-link
        v-for="(tag, index) in layoutStore.tagList"
        :key="tag.fullPath"
        :to="{ path: tag.fullPath }"
        class="tagbar-item"
        :class="isActive(tag) ? 'active' : ''"
        :style="{
          backgroundColor: isActive(tag) ? Variables.tagbarActiveTagColor : '',
          borderColor: isActive(tag) ? Variables.tagbarActiveTagColor : ''
        }"
        @contextmenu.prevent="openContextMenu($event, index, tag.fullPath)"
      >
        {{ tag.title }}
        <svg-icon
          style="width: 13px; height: 13px"
          icon="ri-close-circle-line"
          @click.prevent.stop="onCloseClick(tag, index)"
        ></svg-icon>
      </router-link>
    </el-scrollbar>
    <ContextMenu v-show="visible" :style="menuStyle" :index="selectIndex" :tagPath="selectTagPath" />
  </div>
</template>

<script setup>
import ContextMenu from './ContextMenu.vue'
import { ref, reactive, watch } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import { useRouter, useRoute } from 'vue-router'
import RouteConst from '@/constants/route_const'
import Variables from '../index.module.scss'

const layoutStore = useLayoutStore()
const router = useRouter()
const route = useRoute()

// 是否被选中
const isActive = tag => {
  return tag.path === route.path
}

// 关闭页面标签
const onCloseClick = async (tag, index) => {
  // 如果关闭的是激活页面
  if (isActive(tag)) {
    // 则将其右边第一个页面作为新的激活页面
    if (index + 1 < layoutStore.tagList.length) {
      await layoutStore.removeTags({ mode: 'index', index })
      router.push(layoutStore.tagList[index].fullPath) // 注意这里的tagList已经是新的
    } else if (index > 0) {
      // 如果右边已经没有了标签，则将其左边第一个页面作为新的激活页面
      await layoutStore.removeTags({ mode: 'index', index })
      router.push(layoutStore.tagList[index - 1].fullPath) // 注意这里的tagList已经是新的
    } else {
      // 如果左边也已经没有了标签：如果最后要关闭的是主页，不执行关闭；否则关闭标签后，回到主页
      if (tag.fullPath !== RouteConst.INDEX && tag.fullPath !== RouteConst.INDEX_REDIRECT) {
        await layoutStore.removeTags({ mode: 'index', index })
        router.push(RouteConst.INDEX)
      }
    }
  } else {
    store.dispatch('layout/removeTags', { mode: 'index', index })
  }
}

// ----- 右键菜单相关 -----
const selectIndex = ref(0)
const selectTagPath = ref('')
const visible = ref(false)
const menuStyle = reactive({
  left: 0,
  top: 0
})
// 打开右键菜单
const openContextMenu = (e, index, tagPath) => {
  const { x, y } = e
  menuStyle.left = x + 'px'
  menuStyle.top = y + 'px'
  selectIndex.value = index
  selectTagPath.value = tagPath
  visible.value = true
}
// 关闭右键菜单
const closeContextMenu = () => {
  visible.value = false
}

// 监听页面标签关闭事件
watch(
  visible,
  val => {
    if (val) {
      document.body.addEventListener('click', closeContextMenu)
    } else {
      document.body.removeEventListener('click', closeContextMenu)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@use '../index.module.scss' as variables;

a {
  text-decoration: none !important;
}

::v-deep .el-scrollbar__bar {
  display: none !important;
}

.tagbar-wrapper {
  width: 100%;
  height: variables.$tagbar-height;
  background: variables.$tagbar-color;
  border-bottom: 1px solid #d8dce5;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tagbar {
    .tagbar-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 25px;
      line-height: 25px;
      border: 1px solid #ccd1dd;
      border-top-right-radius: 6px;
      border-top-left-radius: 6px;
      color: black;
      background: white;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        color: #fff;

        &::before {
          content: '';
          background: #ffffff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 4px;
        }
      }

      .el-icon-close {
        width: 16px;
        height: 16px;
        line-height: 10px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;

        &:before {
          transform: scale(0.6);
          display: inline-block;
          vertical-align: -3px;
        }

        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
}
</style>
