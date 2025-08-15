<template>
  <el-dialog draggable :model-value="props.show" title="移动到" @close="onClose()">
    <div style="margin-bottom:20px">
      <span>移动“{{ nowRow.name }}”记账类别，请选择其要移动到的上级类别：</span>
    </div>
    <el-tree-select :data="tree" :props="treeProps" default-expand-all highlight-current check-strictly
      :expand-on-click-node="false" node-key="id" v-model="newParentId" :current-node-key="currParent" clearable />
    <template #footer>
      <el-button type="primary" @click="onConfirm()" :loading="loading">确定</el-button>
      <el-button @click="onClose()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import API from '@/api'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
    required: true
  },
  nowRow: {
    type: Object,
    required: true
  },
  tree: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['close', 'after'])

const loading = ref(false)
const newParentId = ref()
const tree = ref()
const currParent = ref()
const treeProps = ref({
  label: (data, node) => {
    return data.data.name
  },
  value: 'id',
  children: 'children'
})

watch(
  () => props.show,
  (value, oldValue) => {
    if (value === true) {
      tree.value = [{
        id: -1,
        data: {
          name: '根类别'
        },
        children: props.tree
      }]
      newParentId.value = props.nowRow.parentId
      currParent.value = props.nowRow.parentId
    }
  },
  { immediate: true }
)

const onConfirm = () => {
  if (newParentId.value === props.nowRow.parentId) {
    ElMessage.warning('上级类别未变更')
  } else {
    const input = {
      id: props.nowRow.id,
      parentId: newParentId.value
    }
    API.ledger.category.editCategory(input)
      .then((res) => {
        if (res && res.success) {
          console.log('移动成功')
          ElMessage.success('移动成功')
          onClose()
          emits('after')
        } else {
          if (res && res.message != null) {
            console.log('移动失败', res.message)
            ElMessage.error(res.message)
          } else {
            console.log('移动失败')
            ElMessage.error('移动失败')
          }
        }
      })
      .catch((error) => {
        console.log(error)
        ElMessage.error(error.message)
      })
  }
}

// ----- 点击“取消”或关闭对话框 -----
const onClose = () => {
  // 调用父组件close事件
  emits('close')
}
</script>
