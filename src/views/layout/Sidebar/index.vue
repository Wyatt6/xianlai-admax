<template>
  <div class="sidebar-wrapper" :class="[layoutStore.sidebarExpand ? '' : 'sidebar-hidden']">
    <router-link :to="RouteConst.INDEX">
      <div class="logo-container">
        <el-avatar :size="logoHeight" shape="square" :src="logoUrl" />
        <span class="logo-title" v-if="layoutStore.sidebarExpand"> 一次 · ONCE </span>
      </div>
    </router-link>
    <el-scrollbar>
      <el-menu
        :collapse="!layoutStore.sidebarExpand"
        :unique-opend="true"
        popper-effect="dark"
        :background-color="Variables.menuColor"
        :text-color="Variables.menuTextColor"
        :active-text-color="Variables.menuActiveTextColor"
        :default-active="activeMenuPath"
        router
      >
        <menu-item v-for="item in menus" :key="item.path" :menu="item" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
/**
 * 说明：需要显示的菜单项路由配置meta属性中isMenu应为true，且需要带有title和icon属性。
 */
import { computed } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import { useRouter, useRoute } from 'vue-router'
import RouteConst from '@/constants/route_const.js'
import { filterRoutes, generateMenus } from '@/utils/routes2menus'
import MenuItem from '../components/MenuItem/index.vue'
import Variables from '../index.module.scss'
import logoUrl from '@/assets/img/logo.png'

const layoutStore = useLayoutStore()
const router = useRouter()
const route = useRoute()

// ---------- LOGO ----------
const logoHeight = 30

// ---------- 获取（树形结构）菜单数据 ----------
// 由于路由表中有很多路径并不是用来显示菜单的，只是用来跳转用，所以要把真正用来显示菜单的路由筛选出来
const menus = computed(() => {
  const routes = filterRoutes(router.getRoutes()) // getRoutes()返回扁平化的路由，即子路由也被提到第一级了
  return generateMenus(routes)
})

// ---------- 默认激活（高亮）的菜单项 ----------
// 通过直接输入URL访问页面或刷新页面时，菜单都能激活对应的菜单项
const activeMenuPath = computed(() => {
  const { path } = route
  return path // 对应的是v-for里的key的路径
})
</script>

<style lang="scss">
// 菜单栏收起状态二级菜单样式（通过修改全局el-popper实现自定义样式）
@import '../index.module.scss';

$--poper-menu-item-height: 40px;
$--poper-menu-item-padding-right: 13px;

.el-popper {
  .el-sub-menu__title {
    height: $--poper-menu-item-height !important;
    line-height: $--poper-menu-item-height !important;
  }

  .el-menu-item {
    height: $--poper-menu-item-height !important;
    line-height: $--poper-menu-item-height !important;
  }

  .is-active .el-sub-menu__title {
    color: $--menu-active-sub-menu-text-color !important;
  }
}
</style>

<style lang="scss" scoped>
@import '../index.module.scss';

$--menu-item-height: 40px;
$--menu-item-mergin-left: -7px;
$--menu-item-padding-right: 13px;

// 去除菜单右侧白色边框
.el-menu {
  border: none;
}

// 菜单项（el-menu-item)样式
::v-deep .el-menu-item {
  height: $--menu-item-height !important;
  line-height: $--menu-item-height !important;
  margin-left: $--menu-item-mergin-left !important;
  padding-right: $--menu-item-padding-right !important;

  span {
    width: 100%;
    overflow: hidden;
  }
}

// 子菜单项（el-sub-menu)样式
::v-deep .el-sub-menu {
  .el-sub-menu__title {
    height: $--menu-item-height !important;
    line-height: $--menu-item-height !important;
    margin-left: $--menu-item-mergin-left !important;
    padding-right: $--menu-item-padding-right !important;

    span {
      width: calc(100% - 58px);
      overflow: hidden;
    }
  }
}

::v-deep .is-active .el-sub-menu__title {
  color: $--menu-active-sub-menu-text-color !important;
}

// 滚动条宽度
::v-deep .el-scrollbar__bar.is-vertical {
  right: 0px;
  width: 5px;
}

// 菜单栏展开状态
.sidebar-wrapper {
  width: $--sidebar-width;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  background-color: $--sidebar-color;
  transition: width #{$--sidebar-transition-duration};

  // 取消链接的下划线
  a:-webkit-any-link {
    text-decoration: none !important;
  }

  .logo-container {
    height: v-bind(logoHeight) + 'px';
    padding: 10px 0 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .logo-title {
      margin-left: 10px;
      color: #fff;
      font-weight: 550;
      font-size: 16px;
      height: 21px;
      overflow: hidden;
    }
  }

  .el-scrollbar {
    height: calc(100% - 50px);
  }

  .el-menu {
    width: $--sidebar-width !important;
    transition: width #{$--sidebar-transition-duration};
  }
}

// 菜单栏收起状态
.sidebar-hidden {
  width: $--sidebar-width-hidden !important;

  .el-menu {
    width: $--sidebar-width-hidden !important;
  }
}
</style>
