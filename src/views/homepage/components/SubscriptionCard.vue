<template>
  <el-card class="sub-card">
    <div class="card-body">
      <span class="sub-label">{{ props.label }}</span>
      <div v-if="props.subscribed" class="sub-btn-subscribed" @click="onUnsubscribe()">
        <svg-icon class="btn-icon" icon="ri-check-line" />
        <span class="btn-label">已订阅</span>
      </div>
      <div v-else class="sub-btn-default" @click="onSubscribe()">
        <svg-icon class="btn-icon" icon="ri-add-line" />
        <span class="btn-label">订阅服务</span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  subscribed: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['subscribe', 'subscribe'])

const onSubscribe = () => {
  ElMessageBox.confirm('是否订阅' + props.label + '服务？', '请确认')
    .then(() => {
      emits('subscribe')
    })
    .catch()
}
const onUnsubscribe = () => {
  ElMessageBox.confirm('是否退订' + props.label + '服务？退订后数据不会删除，需要重新订阅服务才能继续使用。', '请确认')
    .then(() => {
      emits('unsubscribe')
    })
    .catch()
}
</script>

<style lang="scss" scoped>
.sub-card {
  width: calc(33.2% - 5px);
  height: 100%;

  ::v-deep .el-card__body {
    $--padding: 30px;
    width: calc(100% - 2 * $--padding);
    height: 100%;
    padding-left: $--padding;
    padding-right: $--padding;
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .card-body {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .sub-label {
      color: #303133;
      font-size: 25px;
      font-weight: bold;
      cursor: default;
    }

    .sub-btn-default {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #606266;
    }

    .sub-btn-subscribed {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #67C23A;
    }

    .btn-icon {
      $--btn-icon-size: 30px;
      width: $--btn-icon-size;
      height: $--btn-icon-size;
      cursor: pointer;
    }

    .btn-label {
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>
