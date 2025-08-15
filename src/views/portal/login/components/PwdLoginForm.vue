<template>
  <el-form class="from-wrapper" ref="formRef" :model="form" :rules="formRules" :disabled="loading">
    <el-form-item prop="username">
      <el-input size="large" placeholder="用户名" v-model="form.username" maxlength="16" clearable />
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="large" placeholder="密码" v-model="form.password" type="password" maxlength="16" show-password />
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
  </el-form>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineExpose } from 'vue'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Captcha from '@/components/Captcha/index.vue'
import RouteConst from '@/constants/route_const'
import TokenConst from '@/constants/token_const'
import AppConst from '@/constants/app_const'
import Validator from '@/utils/validator'
import Storage from '@/utils/storage'
import API from '@/api'

const appStore = useAppStore()
const emits = defineEmits(['keyEnter'])

// ==================== 定义变量 ====================
const router = useRouter()
const captchaRef = ref()
const loading = ref(false)
// ----- 登录表单 -----
const formRef = ref()
const form = ref({
  username: Storage.get(AppConst.USERNAME) || '', // 自动填充记住的用户名
  password: '',
  captcha: ''
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
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { validator: Validator.captcha(), trigger: 'blur' }
  ]
})

// ==================== 登录 ====================
const login = async rememberMe => {
  console.groupCollapsed('用户名、密码登录')
  await formRef.value.validate(async valid => {
    if (valid) {
      console.log('用户登录信息格式验证通过')
      loading.value = true

      const userForm = {
        username: form.value.username,
        password: form.value.password,
        captchaKey: captchaRef.value.captchaKey,
        captcha: form.value.captcha
      }
      await API.iam.user
        .login(userForm)
        .then(res => {
          if (res && res.success) {
            console.log('登录认证成功')
            const { user, token, tokenExpiredTime } = res.data

            console.log('缓存user对象')
            appStore.setUser(user)
            Storage.set(AppConst.USER, user)

            console.log('缓存token令牌')
            Storage.set(TokenConst.TOKEN, token) // 用来下次自动登录
            Storage.set(TokenConst.TOKEN_EXPIRED_TIME, tokenExpiredTime)

            console.log('记住用户名')
            Storage.delete(AppConst.USERNAME)
            Storage.delete(AppConst.PHONE)
            Storage.delete(AppConst.EMAIL)
            if (rememberMe.value) {
              Storage.set(AppConst.USERNAME, user.username)
            }

            console.log('跳转到主页面')
            console.groupEnd()
            router.push(RouteConst.INDEX)
          } else {
            if (res && res.message != null) {
              console.log('登录失败：', res.message)
              ElMessage.error(res.message)
            } else {
              console.log('登录失败')
              ElMessage.error('登录失败')
            }
            // 自动刷新验证码
            captchaRef.value.initCaptcha(true)
          }
        })
        .catch(error => {
          console.log(error)
          ElMessage.error(error.message)
        })

      loading.value = false
      console.groupEnd()
    }
  })
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
.from-wrapper {
  .captcha-box {
    width: 150px;
    height: 40px;
  }
}
</style>
