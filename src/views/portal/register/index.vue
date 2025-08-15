<template>
  <div class="input-box-wrapper">
    <div class="input-box-header">
      <div>
        <span class="title">注册 ONCE 用户</span>
      </div>
      <div>
        <span class="sub-title">已有账号？</span>
        <span :class="loading ? 'sub-title-link__disabled' : 'sub-title-link'" @click="toLoginPage">点此登录</span>
      </div>
    </div>
    <el-form ref="formRef" :model="form" :rules="formRules" :disabled="loading">
      <el-form-item prop="username">
        <el-input size="large" placeholder="用户名" v-model="form.username" maxlength="16" clearable />
      </el-form-item>
      <el-form-item prop="password">
        <el-input size="large" placeholder="密码" v-model="form.password" type="password" maxlength="16" show-password />
      </el-form-item>
      <el-form-item prop="password2">
        <el-input size="large" placeholder="再次输入密码" v-model="form.password2" maxlength="16" show-password />
      </el-form-item>
      <el-form-item prop="phone">
        <el-input size="large" placeholder="手机" v-model="form.phone" maxlength="11" clearable />
      </el-form-item>
      <el-form-item prop="email">
        <el-input size="large" placeholder="电子邮箱" v-model="form.email" clearable />
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input size="large" placeholder="验证码" v-model="form.captcha" maxlength="5" clearable>
          <template #append>
            <div class="captcha-box">
              <Captcha ref="captchaRef" :loading="loading" />
            </div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="agreeLaw" class="agree-law-box">
        <el-checkbox v-model="form.agreeLaw">
          <span>我已阅读并同意</span>
        </el-checkbox>
        <div style="cursor: pointer" @click="ElMessage.error('功能未开发')">
          <span style="color: #409eff; font-size: 14px">《使用条款》</span>
        </div>
      </el-form-item>
    </el-form>
    <el-button class="register-btn" type="primary" size="large" :loading="loading" @click="onRegister">
      <span class="register-btn-label">立即注册</span>
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
import Captcha from '@/components/Captcha/index.vue'
import AppConst from '@/constants/app_const'
import RouteConst from '@/constants/route_const'
import TokenConst from '@/constants/token_const'
import Validator from '@/utils/validator'
import Storage from '@/utils/storage'
import API from '@/api'

const appStore = useAppStore()

// ==================== 定义变量 ====================
const router = useRouter()
const loading = ref(false)
// ----- 注册表单 -----
const formRef = ref()
const form = ref({
  username: '',
  password: '',
  password2: '',
  phone: '',
  email: '',
  captcha: '',
  agreeLaw: false
})
const formRules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '长度3至16位', trigger: 'change' },
    { min: 3, max: 16, message: '长度3至16位', trigger: 'blur' },
    { validator: Validator.username(), trigger: 'change' },
    { validator: Validator.username(), trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '长度6至16位', trigger: 'change' },
    { min: 6, max: 16, message: '长度6至16位', trigger: 'blur' },
    { validator: Validator.password(), trigger: 'change' },
    { validator: Validator.password(), trigger: 'blur' }
  ],
  password2: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (form.value.password !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [{ required: false, trigger: 'blur', validator: Validator.phone() }],
  email: [{ required: false, trigger: 'blur', validator: Validator.email() }],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { validator: Validator.captcha(), trigger: 'blur' }
  ],
  agreeLaw: [{ type: 'enum', required: true, enum: [true], message: '请阅读并同意服务条款', trigger: 'blur' }]
})

// ==================== 点击注册 ====================
const onRegister = () => {
  console.groupCollapsed('注册新用户')
  formRef.value.validate(async valid => {
    if (valid) {
      console.log('新用户注册信息格式验证通过')
      loading.value = true

      const userForm = {
        username: form.value.username,
        password: form.value.password,
        phone: form.value.phone,
        email: form.value.email,
        captchaKey: captchaRef.value.captchaKey,
        captcha: form.value.captcha
      }
      await API.iam.user
        .register(userForm)
        .then(res => {
          if (res && res.success) {
            console.log('新用户注册成功')
            const { user, token, tokenExpiredTime } = res.data

            console.log('缓存user对象')
            appStore.setUser(user)

            console.log('缓存token令牌')
            Storage.set(TokenConst.TOKEN, token) // 用来下次自动登录
            Storage.set(TokenConst.TOKEN_EXPIRED_TIME, tokenExpiredTime)

            console.log('清除用户名缓存')
            Storage.delete(AppConst.USERNAME)
            Storage.delete(AppConst.PHONE)
            Storage.delete(AppConst.EMAIL)
            Storage.set(AppConst.USERNAME, user.username)

            console.log('跳转到主页面')
            console.groupEnd()
            router.push(RouteConst.INDEX)
          } else {
            if (res && res.message) {
              console.log('注册失败：', res.message)
              ElMessage.error(res.message)
            } else {
              console.log('注册失败')
              ElMessage.error('注册失败')
            }
          }
        })
        .catch(error => {
          console.log(error)
          ElMessage.error(error.message)
        })

      loading.value = false
    }
  })
  console.groupEnd()
}
// 回车登录
document.onkeydown = event => {
  if (event.keyCode === 13) {
    onRegister()
  }
}

// ==================== 跳转到登录页面 ====================
const toLoginPage = () => {
  if (!loading.value) {
    router.push(RouteConst.LOGIN)
  }
}

// ==================== 绑定验证码组件，挂载组件时初始化验证码 ====================
const captchaRef = ref()
onMounted(() => {
  captchaRef.value.initCaptcha(true)
})
</script>

<style lang="scss" scoped>
.input-box-wrapper {
  width: 100%;
  height: 100%;

  .input-box-header {
    width: 100%;
    height: 35px;
    margin-bottom: 15px;
    display: flex;
    align-items: flex-end; // 下边对齐
    justify-content: space-between;

    .title {
      color: #40485b;
      font-size: 25px;
      font-weight: bold;
    }

    .sub-title {
      color: #40485b;
      font-size: 14px;
    }

    .sub-title-link {
      color: #409eff;
      font-size: 14px;
      cursor: pointer;

      &__disabled {
        color: #409eff;
        font-size: 14px;
        cursor: not-allowed;
      }
    }
  }

  ::v-deep .el-input-group__append {
    padding: 0px;
  }

  .captcha-box {
    width: 150px;
    height: 40px;
  }

  .agree-law-box {
    $--agree-law-box-height: 15px;

    ::v-deep .el-form-item__content {
      line-height: $--agree-law-box-height !important;

      .el-checkbox {
        height: $--agree-law-box-height !important;
      }
    }
  }

  .register-btn {
    width: 100%;
    margin-top: 10px;

    .register-btn-label {
      font-size: 18px;
    }
  }
}
</style>
