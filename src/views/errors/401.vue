<template>
  <div class="err-container">
    <div class="err">
      <div class="err-content">
        <div class="err-content__title">401 Unauthorized</div>
        <div class="err-content__headline">抱歉，您没有访问该页面的权限......</div>
        <div class="err-content__info">
          请检查您输入的URL是否正确，或联系管理员获得访问权限。
        </div>
        <el-button size="large" round type="primary" @click="router.go(-1)">返回之前的页面</el-button>
        <el-button size="large" round @click="router.push(RouteConst.INDEX)">回到主页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import RouteConst from '@/constants/route_const'
const router = useRouter()
</script>

<style lang="scss" scoped>
.err-container {
  position: relative;
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
