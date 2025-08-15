<template>
  <!-- TODO 邮件验证码登录 -->
  <el-form class="form-wrapper" :model="form">
    <el-form-item>
      <el-input size="large" placeholder="电子邮箱" v-model="form.email" clearable />
    </el-form-item>
    <el-form-item>
      <el-input size="large" placeholder="验证码" v-model="form.captcha" clearable>
        <template #append>
          <div class="captcha-box">
            <Captcha ref="captchaRef" />
          </div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-input class="verify-code-input" size="large" placeholder="邮件验证码" v-model="form.verifyCode" clearable>
        <template #append>
          <div class="send-verify-code" @click="ElMessage.error('功能未开发')">
            <span>发送验证码</span>
          </div>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineExpose } from 'vue'
import { ElMessage } from 'element-plus'
import Captcha from '@/components/Captcha/index.vue'

const emits = defineEmits(['keyEnter'])

const captchaRef = ref()
const form = ref({
  email: '',
  captcha: '',
  verifyCode: ''
})

// ==================== 登录 ====================
const login = rememberMe => {
  ElMessage.error('功能未开发')
}
// 回车登录
document.onkeydown = event => {
  if (event.keyCode === 13) {
    emits('keyEnter')
  }
}

// ==================== 向父组件暴露的函数 ====================
defineExpose({
  login
})

// ==================== 初始化验证码 ====================
onMounted(() => {
  captchaRef.value.initCaptcha(true)
})
</script>

<style lang="scss" scoped>
.form-wrapper {
  .captcha-box {
    width: 150px;
    height: 40px;
  }

  .verify-code-input {
    ::v-deep .el-input-group__append {
      border: 1px solid #409eff;
      background-color: #ecf5ff;
      box-shadow: none;
    }

    .send-verify-code {
      width: 150px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #409eff;
    }
  }
}
</style>
