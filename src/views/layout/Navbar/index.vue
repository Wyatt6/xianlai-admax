<template>
  <div class="navbar-wrapper" :class="[layoutStore.sidebarExpand ? '' : 'sidebar-hidden']">
    <!-- 菜单栏伸缩按钮 -->
    <hamburger class="hamburger-container" />
    <!-- 面包屑导航组件 -->
    <breadcrumb class="breadcrumb-container" />
    <div class="navbar-right">
      <el-space wrap size="large">
        <el-badge :is-dot="false">
          <svg-icon class="btn-icon" icon="ri-mail-line" />
        </el-badge>
        <el-badge :is-dot="false" v-if="false">
          <!-- TOOD 待办任务 -->
          <svg-icon class="btn-icon" icon="ri-checkbox-circle-line" />
        </el-badge>
        <div class="name">
          <span style="color: #606266; font-size: 12px">@{{ appStore.user.username }}</span>
          <span style="color: #303133; font-size: 17px; font-weight: bold">{{ appStore.profile.nickname }}</span>
        </div>
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <el-avatar shape="square" :size="36" :src="appStore.profile.avatar ? appStore.profile.avatar : failPicture" />
            <el-icon :size="15">
              <CaretBottom />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown">
              <el-dropdown-item @click="router.push(RouteConst.USER_SETTING)">
                <span>用户设置</span>
              </el-dropdown-item>
              <el-dropdown-item @click="getAuthorizations">
                <span>刷新授权</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-popover trigger="hover" placement="left-start">
                  <template #reference> 联系管理员 </template>
                </el-popover>
              </el-dropdown-item>
              <el-dropdown-item divided @click="logout">
                <span style="color: #f56c6c">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </div>
  </div>
</template>

<script setup>
import failPicture from '@/assets/images/fail_picture.png'
import Hamburger from '../components/Hamburger/index.vue'
import Breadcrumb from '../components/Breadcrumb/index.vue'
import { useAppStore } from '@/stores/app'
import { useLayoutStore } from '@/stores/layout'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import RouteConst from '@/constants/route_const'
import AuthorizationService from '@/services/authorization_service'
import Apis from '@/apis'

const appStore = useAppStore()
const layoutStore = useLayoutStore()
const router = useRouter()

// ---------- 刷新授权数据 ----------
const getAuthorizations = async () => {
  if (await AuthorizationService.updateAuthorizations()) {
    ElMessage.success('成功刷新授权')
  } else {
    ElMessage.error('刷新授权失败')
  }
}

// ---------- 退出登录 ----------
const logout = async () => {
  console.groupCollapsed('退出登录')

  appStore.setLoggingOut(true)
  await Apis.iam.user
    .logout()
    .then(async res => {
      if (res && res.success) {
        console.log('退出登录成功')
        console.log('返回到登录页面')
        appStore.initApp()
        console.groupEnd()
        await router.push(RouteConst.LOGIN)
      } else {
        console.log('退出登录失败')
      }
    })
    .catch(error => {
      console.log(error)
      ElMessage.error(error.message)
    })

  appStore.setLoggingOut(false)
  console.groupEnd()
}
</script>

<style lang="scss" scoped>
@use '../index.module.scss' as variables;

.navbar-wrapper {
  width: 100%;
  height: variables.$navbar-height;
  background: variables.$navbar-color;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 37px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.5s;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .breadcrumb-container {
    float: left;
    height: 100%;
    max-width: 1000px;
    overflow: hidden;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    float: right;
    height: 100%;
    align-items: center;

    .name {
      display: flex;
      flex-direction: column;
      align-items: self-end;
      cursor: default;
    }

    // ::v-deep .right-menu-item {
    //   display: inline-block;
    //   padding: 0 18px 0 0;
    //   font-size: 24px;
    //   color: #5a5e66;
    //   vertical-align: text-bottom;

    //   &.hover-effect {
    //     cursor: pointer;
    //     transition: background 0.3s;

    //     &:hover {
    //       background: rgba(0, 0, 0, 0.025);
    //     }
    //   }
    // }

    ::v-deep .avatar-container {
      cursor: pointer; // 手指形状鼠标指针

      .avatar-wrapper {
        display: flex;
        align-items: center;
        position: relative;

        .el-avatar {
          --el-avatar-background-color: none;
          margin-right: 3px;
        }
      }
    }

    .btn-icon {
      $--btn-icon-size: 20px;
      width: $--btn-icon-size;
      height: $--btn-icon-size;
      color: #606266;
      cursor: pointer;
    }
  }
}
</style>
