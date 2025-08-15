<template>
  <el-card class="hello-card">
    <template #header>
      <span>
        {{ greeting }}
      </span>
    </template>
    <div class="profile-wrapper">
      <el-avatar
        shape="circle"
        :size="150"
        :src="appStore.profile.avatar ? appStore.profile.avatar : require('@/assets/img/fail_picture.png')"
      />
      <div class="nickname">
        <span>{{ appStore.hasProfile ? appStore.profile.nickname : '昵称' }}</span>
      </div>
      <div class="username">
        <span>@{{ appStore.user.username }}</span>
      </div>
      <div class="motto">
        <span>{{ appStore.hasProfile ? appStore.profile.motto : '请在此处输入您的座右铭' }}</span>
      </div>
      <el-divider class="divider" />
      <div class="btn-wrapper">
        <div class="btn">
          <el-badge :value="mesgCount" :hidden="hideMesgBadge">
            <svg-icon class="btn-icon" icon="ri-mail-line" />
          </el-badge>
          <span class="btn-label">系统消息</span>
        </div>
        <div class="btn" v-if="false">
          <!-- TODO 待办任务 -->
          <el-badge :value="todoCount" :hidden="hideTodoBadge">
            <svg-icon class="btn-icon" icon="ri-checkbox-circle-line" />
          </el-badge>
          <span class="btn-label">待办任务</span>
        </div>
        <div class="btn" @click="router.push(RouteConst.USER_SETTING)">
          <svg-icon class="btn-icon" icon="ri-settings-3-line" />
          <span class="btn-label">用户设置</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import RouteConst from '@/constants/route_const'

const appStore = useAppStore()
const router = useRouter()

const mesgCount = ref(0)
const hideMesgBadge = computed(() => {
  return mesgCount.value === 0
})
const todoCount = ref(0)
const hideTodoBadge = computed(() => {
  return todoCount.value === 0
})

// ---------- 问候语，每10s检查一次 ----------
const greeting = ref('你好！')
const getGreeting = hour => {
  if (hour >= 6 && hour < 8) {
    greeting.value = '早上好！'
  } else if (hour >= 8 && hour < 11) {
    greeting.value = '上午好！'
  } else if (hour >= 11 && hour < 13) {
    greeting.value = '中午好！'
  } else if (hour >= 13 && hour < 17) {
    greeting.value = '下午好！'
  } else if (hour >= 17 && hour < 18) {
    greeting.value = '傍晚好！'
  } else {
    greeting.value = '晚上好！'
  }
}
getGreeting(new Date().getHours())
setInterval(() => {
  getGreeting(new Date().getHours())
}, 10000)
</script>

<style lang="scss" scoped>
.hello-card {
  .profile-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

    .nickname {
      margin-top: 18px;
      font-size: 28px;
      font-weight: bolder;
    }

    .username {
      margin-top: 5px;
      font-size: 14px;
      color: #606266;
    }

    .motto {
      margin-top: 5px;
      font-size: 15px;
    }

    .divider {
      margin-top: 15px;
      margin-bottom: 15px;
    }

    .btn-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;

      .btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 30%;
        height: 50px;
        color: #606266;

        .btn-icon {
          $--btn-icon-size: 28px;
          width: $--btn-icon-size;
          height: $--btn-icon-size;
          cursor: pointer;
        }

        .btn-label {
          font-size: 13px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
