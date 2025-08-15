<template>
  <el-drawer :model-value="show" :title="title" size="40%" @close="onClose()">
    <el-form label-width="70px" label-position="left" :model="form">
      <el-form-item label="日期">
        <el-date-picker v-model="form.acctDate" type="date" :shortcuts="shortcuts" />
      </el-form-item>
      <el-form-item label="收支类型">
        <el-radio-group v-model="form.type">
          <el-radio label="debit" border>
            <el-tag type="danger">收入</el-tag>
          </el-radio>
          <el-radio label="credit" border>
            <el-tag type="success">支出</el-tag>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="金额(元)">
        <el-input-number v-model="form.amount" :controls="false" :precision="2" :min="0" placeholder="请输入交易金额" />
      </el-form-item>
      <el-form-item label="记账类别">
        <el-tree-select v-model="form.categoryId" :data="tree" :props="treeProps" default-expand-all highlight-current
          :expand-on-click-node="false" node-key="id" clearable />
      </el-form-item>
      <el-form-item label="说明">
        <el-input type="textarea" v-model="form.description" placeholder="选填" />
      </el-form-item>
      <el-form-item label="动账渠道">
        <el-select v-model="form.channelId" clearable>
          <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"
            :disabled="!item.activated" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button style="margin-top:30px" type="primary" @click="onSave()">保存</el-button>
    <el-button style="margin-top:30px" @click="initForm()">重置</el-button>
  </el-drawer>
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
  title: {
    type: String,
    default: '',
    required: false
  },
  categoryTree: {
    type: Array,
    default: null,
    required: false
  },
  channelList: {
    type: Array,
    default: null,
    required: false
  },
  data: {
    type: Object,
    default: null,
    required: false
  }
})
const emits = defineEmits(['save', 'close'])

const form = ref({})
const initForm = () => {
  form.value = {}
  if (props.data != null) {
    form.value.id = props.data.id
    form.value.acctDate = props.data.acctDate
    form.value.type = props.data.type
    form.value.amount = props.data.amount
    form.value.categoryId = props.data.categoryId
    form.value.channelId = props.data.channelId
    form.value.description = props.data.description
  } else {
    form.value.acctDate = new Date()
    form.value.type = 'credit'
  }
}
const tree = ref([])
const list = ref([])
const shortcuts = ref([
  {
    text: '今日',
    value: new Date()
  },
  {
    text: '昨日',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    }
  },
  {
    text: '前日',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 48)
      return date
    }
  }])
const treeProps = ref({
  label: (data, node) => {
    return data.data.name
  },
  value: 'id',
  children: 'children',
  disabled: (data, node) => {
    return !data.data.activated
  }
})

const onSave = () => {
  emits('save', form.value)
}

const getCategoryTree = () => {
  return API.ledger.category.getCategoryTree()
    .then((res) => {
      if (res && res.success) {
        console.log('成功获取类别树')
        return res.data.categoryTree
      } else {
        if (res && res.message != null) {
          console.log('获取类别树失败：', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('获取类别树失败')
          ElMessage.error('获取记账类别失败')
        }
      }
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(error.message)
    })
}
const getChannelList = () => {
  return API.ledger.channel.getChannels()
    .then((res) => {
      if (res && res.success) {
        console.log('成功获取动账渠道列表')
        return res.data.channels
      } else {
        if (res && res.message != null) {
          console.log('获取动账渠道列表失败：', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('获取动账渠道列表失败')
          ElMessage.error('获取动账渠道失败')
        }
      }
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(error.message)
    })
}

// ----- 监听打开动作 -----
watch(
  () => props.show,
  async (value, oldValue) => {
    if (value === true) {
      initForm()
      tree.value = props.categoryTree != null ? props.categoryTree : await getCategoryTree()
      list.value = props.channelList != null ? props.channelList : await getChannelList()
    }
  }
)

// ----- 关闭对话框 -----
const onClose = () => {
  // 调用父组件close事件
  emits('close')
}
</script>
