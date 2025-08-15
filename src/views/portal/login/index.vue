<template>
  <div class="input-box-wrapper">
    <div class="input-box-header">
      <div>
        <span class="title">Wyatt的日常生活</span>
      </div>
      <div>
        <span class="sub-title">没有账号？</span>
        <span class="sub-title-link" @click="toRegisterPage">点此注册</span>
      </div>
    </div>
    <el-tabs type="card" :stretch="true" :model="selectedTabPane" @tab-change="onTabChange">
      <el-tab-pane label="密码登录" name="0">
        <div class="login-tab-box">
          <PwdLoginForm ref="pwdLoginRef" @keyEnter="onLogin(selectedTabPane)" />
        </div>
      </el-tab-pane>
      <el-tab-pane label=" 邮件验证码" name="1" :lazy="true">
        <div class="login-tab-box">
          <EmailLoginForm ref="emailLoginRef" @keyEnter="onLogin(selectedTabPane)" />
        </div>
      </el-tab-pane>
      <el-tab-pane label=" 短信验证码" name="2" :lazy="true">
        <div class="login-tab-box">
          <SmsLoginForm ref="smsLoginRef" @keyEnter="onLogin(selectedTabPane)" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="sub-input-box">
      <div>
        <el-checkbox v-model="rememberMe" label="记住我" />
      </div>
      <div @click="ElMessage.error('功能未开发')">
        <span class="sub-title-link">已有帐号，忘记密码？</span>
      </div>
    </div>
    <el-button class="login-btn" type="primary" size="large" :loading="loading" @click="onLogin(selectedTabPane)">
      <span class="login-btn-label">登 录</span>
    </el-button>
    <el-divider />
    <div class="footer">
      <div>
        <span>&copy; 2024 wyatt.run</span>
      </div>
      <div>
        <span>欢迎使用 ONCE 系统！如有问题，</span>
        <el-popover trigger="hover" placement="top">
          <template #reference>
            <span class="footer-link" style="color: #409eff; cursor: pointer">请联系管理员</span>
          </template>
        </el-popover>
      </div>
      <div>
        <span>备案号：</span>
        <el-link type="primary" href="https://beian.miit.gov.cn" target="_blank">粤ICP备2022019185号-1</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PwdLoginForm from './components/PwdLoginForm.vue'
import EmailLoginForm from './components/EmailLoginForm.vue'
import SmsLoginForm from './components/SmsLoginForm.vue'
import RouteConst from '@/constants/route_const'
import AppConst from '@/constants/app_const'
import Storage from '@/utils/storage'

// ==================== 定义变量 ====================
const router = useRouter()
const loading = ref(false)
// ----- 3种登录方式标签页 -----
const selectedTabPane = ref('0')
const pwdLoginRef = ref()
const emailLoginRef = ref()
const smsLoginRef = ref()
// ----- “记住我”勾选框 -----
const hasUsername = Storage.get(AppConst.USERNAME) != null
const rememberMe = ref(hasUsername)

// ==================== 切换标签 ====================
const onTabChange = activeName => {
  selectedTabPane.value = activeName
}

// ==================== 登录 ====================
const onLogin = async selectedTabPane => {
  loading.value = true
  // 密码登录
  if (selectedTabPane === '0') {
    await pwdLoginRef.value.login(rememberMe)
  }
  // 邮件登录
  if (selectedTabPane === '1') {
    await emailLoginRef.value.login(rememberMe)
  }
  // 短信登录
  if (selectedTabPane === '2') {
    await smsLoginRef.value.login(rememberMe)
  }
  loading.value = false
}

// ==================== 跳转到注册页面 ====================
const toRegisterPage = () => {
  if (!loading.value) {
    router.push(RouteConst.REGISTER)
  }
}

// ==================== 监听登录方式切换，渲染“记住我”勾选框 ====================
watch(
  () => selectedTabPane.value,
  (value, oldValue) => {
    if (value === '0') {
      if (Storage.get(AppConst.USERNAME)) {
        rememberMe.value = true
      } else {
        rememberMe.value = false
      }
    }
    if (value === '1') {
      if (Storage.get(AppConst.EMAIL)) {
        rememberMe.value = true
      } else {
        rememberMe.value = false
      }
    }
    if (value === '2') {
      if (Storage.get(AppConst.PHONE)) {
        rememberMe.value = true
      } else {
        rememberMe.value = false
      }
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.input-box-wrapper {
  width: 100%;
  height: 100%;

  .sub-title {
    color: #40485b;
    font-size: 14px;
  }

  .sub-title-link {
    color: #409eff;
    font-size: 14px;
    cursor: pointer;
  }

  .input-box-header {
    width: 100%;
    height: 35px;
    margin-bottom: 25px;
    display: flex;
    align-items: flex-end; // 下边对齐
    justify-content: space-between;

    .title {
      color: #40485b;
      font-size: 25px;
      font-weight: bold;
    }
  }

  ::v-deep .el-input-group__append {
    padding: 0px;
  }

  .login-tab-box {
    width: 100%;
    height: 180px;
  }

  .sub-input-box {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .login-btn {
    width: 100%;
    margin-top: 30px;

    .login-btn-label {
      font-size: 18px;
    }
  }

  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #40485b;
    font-size: 15px;
  }
}
</style>
