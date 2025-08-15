<template>
  <el-dialog :model-value="show" title="修改密码" @close="onClose()">
    <div class="input-wrapper">
      <div class="input-box">
        <div style="width: 100%">
          <el-form
            size="large"
            ref="formRef"
            :rules="formRules"
            :model="form"
            label-position="right"
            label-width="auto"
            :disabled="loading"
          >
            <el-form-item label="请输入当前密码" prop="oldPassword">
              <el-input size="large" v-model="form.oldPassword" type="password" maxlength="16" show-password />
            </el-form-item>
            <el-form-item label="请输入新密码" prop="password1">
              <el-input size="large" v-model="form.password1" type="password" maxlength="16" show-password />
            </el-form-item>
            <el-form-item label="请再次输入新密码" prop="password2">
              <el-input size="large" v-model="form.password2" type="password" maxlength="16" show-password />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button size="large" type="primary" @click="onConfirm()">确定</el-button>
      <el-button size="large" @click="onClose()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { ElMessage } from 'element-plus'
import Validator from '@/utils/validator'
import API from '@/api'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
    required: true
  }
})
const emits = defineEmits(['close'])

const loading = ref(false)
const formRef = ref()
const form = ref({
  oldPassword: null,
  password1: null,
  password2: null
})
const formRules = ref({
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, max: 16, message: '长度6至16位', trigger: 'change' },
    { min: 6, max: 16, message: '长度6至16位', trigger: 'blur' },
    { validator: Validator.password(), trigger: 'change' },
    { validator: Validator.password(), trigger: 'blur' }
  ],
  password1: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 16, message: '长度6至16位', trigger: 'change' },
    { min: 6, max: 16, message: '长度6至16位', trigger: 'blur' },
    { validator: Validator.password(), trigger: 'change' },
    { validator: Validator.password(), trigger: 'blur' }
  ],
  password2: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (form.value.password1 !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// ----- 监听打开对话框动作进行初始化 -----
watch(
  () => props.show,
  (value, oldValue) => {
    if (value === true) {
      form.value.oldPassword = null
      form.value.password1 = null
      form.value.password2 = null
      loading.value = false
    }
  }
)

// ----- 点击“取消”或关闭对话框 -----
const onClose = () => {
  // 调用父组件close事件
  emits('close')
}

// ----- 点击“确定” -----
const onConfirm = () => {
  console.groupCollapsed('修改密码')
  formRef.value.validate(async valid => {
    if (valid) {
      loading.value = true

      const input = {
        username: appStore.user.username,
        oldPassword: form.value.oldPassword,
        newPassword: form.value.password1
      }
      await API.iam.user
        .changePassword(input)
        .then(res => {
          if (res && res.success) {
            console.log('修改成功')
            ElMessage.success('修改成功')
            onClose()
          } else {
            if (res && res.message) {
              console.log('修改密码失败：', res.message)
              ElMessage.error(res.message)
            } else {
              console.log('修改密码失败')
              ElMessage.error('修改密码失败')
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
</script>

<style scoped>
.input-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;

  .input-box {
    width: 60%;
    display: flex;
    justify-content: center;
  }
}
</style>
