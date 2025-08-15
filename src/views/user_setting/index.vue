<template>
  <div class="page-wrapper">
    <el-scrollbar class="scrollbar-wrapper">
      <div class="card-wrapper">
        <el-card class="card" shadow="never">
          <div class="setting-wrapper">
            <div class="setting">
              <div class="avatar-img">
                <el-avatar shape="circle" :size="150" :src="appStore.profile.avatar ? appStore.profile.avatar : failPicture" />
              </div>
              <div class="avatar-btn">
                <el-button size="large" @click="changeAvatar()">更换头像</el-button>
              </div>
              <el-form :model="profileForm" size="large" label-position="right" label-width="auto" style="max-width: 600px">
                <el-form-item label="昵称">
                  <el-input v-model="profileForm.nickname" clearable />
                </el-form-item>
                <el-form-item label="个性签名">
                  <el-input v-model="profileForm.motto" type="textarea" :rows="3" />
                </el-form-item>
              </el-form>
              <div class="btn-wrapper">
                <el-button type="primary" size="large" @click="saveProfile()">保存</el-button>
                <el-button size="large" @click="initProfileForm()">重置</el-button>
              </div>
              <el-divider />
              <el-form size="large" label-position="right" label-width="auto" style="max-width: 600px">
                <el-form-item label="密码">
                  <el-button @click="showChangePwd = true">修改密码</el-button>
                </el-form-item>
                <el-form-item label="电话号码">
                  <el-input clearable>
                    <template #append>
                      <el-button @click="ElMessage.error('功能未开发')">更换号码</el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="电子邮箱">
                  <el-input clearable>
                    <template #append>
                      <el-button @click="ElMessage.error('功能未开发')">更换邮箱</el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-card>
      </div>
    </el-scrollbar>
    <ChangeAvatar :show="showChangeAvatar" @close="showChangeAvatar = false" />
    <ChangePwd :show="showChangePwd" @close="showChangePwd = false" />
  </div>
</template>

<script setup>
import failPicture from '@/assets/img/fail_picture.png'
import ChangeAvatar from './ChangeAvatar.vue'
import ChangePwd from './ChangePwd.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import AppConst from '@/constants/app_const'
import Storage from '@/utils/storage'
import API from '@/api'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// ---------- 头像 ----------
// 更换头像对话框
const showChangeAvatar = ref(false)
const changeAvatar = () => {
  showChangeAvatar.value = true
}

// ---------- 修改密码弹窗 ----------
const showChangePwd = ref(false)

// ---------- 个人信息数据 ----------
const profileForm = ref({
  userId: null,
  nickname: null,
  motto: null
})
const initProfileForm = () => {
  if (appStore.hasProfile) {
    profileForm.value.nickname = appStore.profile.nickname
    profileForm.value.motto = appStore.profile.motto
  }
}
initProfileForm()
const saveProfile = () => {
  if (appStore.hasProfile) {
    if (profileForm.value.nickname === appStore.profile.nickname && profileForm.value.motto === appStore.profile.motto) {
      ElMessage.error('用户个人信息未变更')
      return
    }
  }

  profileForm.value.userId = appStore.user.id
  API.content.profile
    .editProfile(profileForm.value)
    .then(async res => {
      if (res && res.success) {
        // 更新store和缓存
        const newProfile = appStore.profile
        const { profile } = res.data
        if (profile) {
          newProfile.nickname = profile.nickname
          newProfile.motto = profile.motto
        }
        await store.commit('app/setProfile', newProfile)
        await Storage.set(AppConst.PROFILE, profile)
        initProfileForm()

        console.log('保存成功')
        ElMessage.success('保存成功')
      } else {
        if (res && res.message != null) {
          console.log('修改用户个人信息失败：', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('修改用户个人信息失败')
          ElMessage.error('保存失败')
        }
      }
    })
    .catch(error => {
      console.log(error)
      ElMessage.error(error.message)
    })
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  width: 100%;
  height: 100%;

  .scrollbar-wrapper {
    ::v-deep .el-scrollbar__view {
      height: 100% !important;
    }

    .card-wrapper {
      width: 100%;
      min-height: 100%;
      display: flex;
      justify-content: center;

      .card {
        width: calc(100% - 2px);
        min-height: calc(100% - 2px);
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;

        .setting-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;

          .setting {
            .avatar-img {
              width: calc(600px - 68px);
              margin-left: 68px;
              margin-top: 20px;
              margin-bottom: 10px;
              display: flex;
              justify-content: center;
            }

            .avatar-btn {
              width: calc(600px - 68px);
              margin-left: 68px;
              margin-top: 15px;
              margin-bottom: 20px;
              display: flex;
              justify-content: center;
            }

            .btn-wrapper {
              width: calc(600px - 68px);
              margin-left: 68px;
              margin-top: 20px;
              display: flex;
              justify-content: center;
            }
          }
        }
      }
    }
  }
}
</style>
