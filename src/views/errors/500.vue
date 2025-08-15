<template>
  <div class="err-container">
    <div class="err">
      <div class="err-content">
        <div class="err-content__title">500 Connection Fail</div>
        <div class="err-content__headline">抱歉，连接服务器失败，请稍后重试......</div>
        <div class="err-content__info">请单击下面的按钮尝试重建连接。</div>
        <el-button type="primary" size="large" round @click="router.go(-1)">重新连接</el-button>
        <el-button size="large" round @click="toLogin">重新登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import RouteConst from '@/constants/route_const'

const appStore = useAppStore()
const router = useRouter()

const toLogin = async () => {
  appStore.init()
  router.push(RouteConst.LOGIN)
}
</script>

<style lang="scss" scoped>
.err-container {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .err {
    width: 400px;
    overflow: hidden;

    .err-content {
      position: relative;
      float: left;
      width: 400px;
      padding: 30px 0;
      overflow: hidden;

      &__title {
        font-size: 32px;
        font-weight: bold;
        line-height: 40px;
        color: #1482f0;
        opacity: 0;
        margin-bottom: 20px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }

      &__headline {
        font-size: 20px;
        line-height: 24px;
        color: #222;
        font-weight: bold;
        opacity: 0;
        margin-bottom: 10px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.1s;
        animation-fill-mode: forwards;
      }

      &__info {
        font-size: 13px;
        line-height: 21px;
        color: grey;
        opacity: 0;
        margin-bottom: 30px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.2s;
        animation-fill-mode: forwards;
      }

      @keyframes slideUp {
        0% {
          transform: translateY(60px);
          opacity: 0;
        }

        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }
}
</style>
