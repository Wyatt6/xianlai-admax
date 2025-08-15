<template>
  <el-dialog :model-value="show" title="更换头像">
    <div class="avatar-area">
      <el-avatar shape="circle" :size="150" :src="failPicture" />
      <el-avatar style="margin-left: 60px" shape="square" :size="36" :src="failPicture" />
    </div>
    <template #footer>
      <el-upload ref="upload" :limit="1" :auto-upload="false" :on-exceed="onExceed()">
        <template #trigger>
          <el-button type="info" plain>选择</el-button>
        </template>
        <el-button style="margin-left: 10px" type="primary">确定</el-button>
        <template #tip>
          <div class="el-upload__tip">格式为jpeg/jpg/png/bmp，大小不超过500KB</div>
        </template>
      </el-upload>
    </template>
  </el-dialog>
</template>

<script setup>
import failPicture from '@/assets/images/fail_picture.png'
import { defineProps, ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.avatar-area {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
