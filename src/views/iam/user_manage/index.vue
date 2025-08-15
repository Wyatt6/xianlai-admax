<template>
  <div class="page-wrapper">
    <el-scrollbar class="scrollbar-wrapper">
      <div class="card-wrapper">
        <el-card class="card" shadow="never">
          <el-button size="small" type="success" :icon="Refresh" @click="refresh">刷新</el-button>
          <el-form
            class="search-box-inline"
            :inline="true"
            size="small"
            label-position="right"
            label-width="auto"
            ref="searchFormRef"
            :model="searchForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="searchForm.username" clearable />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="searchForm.phone" clearable />
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="searchForm.email" clearable />
            </el-form-item>
            <el-form-item label="用户状态" prop="activated">
              <el-select v-model="searchForm.activated" clearable>
                <el-option label="正常" value="true" />
                <el-option label="冻结" value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="注册时间" prop="timeRange">
              <el-date-picker
                v-model="searchForm.timeRange"
                type="datetimerange"
                start-placeholder="开始时间（含）"
                end-placeholder="结束时间（含）"
              />
            </el-form-item>
            <el-form-item label="包含角色" prop="role">
              <el-input v-model="searchForm.role" clearable />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" @click="onSearch">搜索</el-button>
              <el-button :icon="Brush" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="table-wrapper">
            <el-table
              height="100%"
              stripe
              row-key="id"
              :row-style="tableRow"
              highlight-current-row
              :data="formList"
              :current-row-key="currRowKey"
              v-loading="loading"
            >
              <el-table-column label="序号" align="center" width="90" type="index" :index="getIndex" />
              <el-table-column label="用户名" prop="username" />
              <el-table-column label="手机号码" prop="phone" />
              <el-table-column label="电子邮箱" prop="email" />
              <el-table-column label="用户状态" align="center" width="90">
                <template #default="scope">
                  <el-tag :type="scope.row.activated ? 'success' : 'danger'">
                    {{ scope.row.activated ? '正常' : '冻结' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="注册时间" align="center" width="180">
                <template #default="scope">
                  {{ new Date(scope.row.createTime).toLocaleString() }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="130"
                fixed="right"
                v-perm="[PermissionConst.IAM_USER_QUERY, PermissionConst.IAM_USER_EDIT]"
              >
                <template #default="scope">
                  <el-button-group size="small">
                    <el-tooltip effect="dark" content="查看用户绑定的角色" placement="top">
                      <el-button
                        v-perm="[PermissionConst.IAM_USER_QUERY]"
                        :icon="Search"
                        plain
                        type="primary"
                        @click="onBind(scope.row)"
                      />
                    </el-tooltip>
                    <el-tooltip effect="dark" content="冻结" placement="top" v-if="scope.row.activated">
                      <el-button
                        v-perm="[PermissionConst.IAM_USER_EDIT]"
                        :icon="Open"
                        plain
                        type="success"
                        @click="onChangeStatus(scope.row)"
                      />
                    </el-tooltip>
                    <el-tooltip effect="dark" content="解冻" placement="top" v-else>
                      <el-button
                        v-perm="[PermissionConst.IAM_USER_EDIT]"
                        :icon="TurnOff"
                        plain
                        type="danger"
                        @click="onChangeStatus(scope.row)"
                      />
                    </el-tooltip>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination-wrapper">
            <el-pagination
              small
              layout="total, sizes, prev, pager, next, jumper"
              :total="formTotalElements"
              :page-sizes="pageSizeList"
              v-model:page-size="formPageSize"
              @size-change="onSizeChange"
              background
              v-model:current-page="formPageNum"
              @current-change="getListGeneral"
            />
          </div>
        </el-card>
        <BindRole :show="showBindRole" :nowRow="nowRow" @close="showBindRole = false" />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Search, Brush, Open, TurnOff } from '@element-plus/icons-vue'
import BindRole from './BindRole.vue'
import PermissionConst from '@/constants/permission_const'
import Storage from '@/utils/storage'
import API from '@/api'

// ---------- 搜索表单数据定义 ----------
const searched = ref(false)
const searchFormRef = ref()
const deafultSearchForm = {
  username: null,
  phone: null,
  email: null,
  activated: null,
  timeRange: null,
  role: null
}
const searchForm = ref(deafultSearchForm)

// ---------- 数据定义 ----------
const PAGE_NUM_KEY = 'iam.user_manage.pageNum'
const PAGE_SIZE_KEY = 'iam.user_manage.pageSize'
const pageSizeList = ref([10, 20, 50, 100])
const formerPageSize = ref(0)
const formPageNum = ref(Storage.get(PAGE_NUM_KEY) || 1) // 初始页码（注意：自然页码，下标从1开始）
const formPageSize = ref(Storage.get(PAGE_SIZE_KEY) || pageSizeList.value[0]) // 初始分页大小
const formTotalPages = ref(0) // 初始总页数
const formTotalElements = ref(0) // 初始总记录数
const formList = ref([]) // 初始分页列表
const currRowKey = ref()
const loading = ref(false)
watch(
  () => formPageNum.value,
  (value, oldValue) => {
    Storage.set(PAGE_NUM_KEY, value)
  },
  { immediate: true }
)
watch(
  () => formPageSize.value,
  (value, oldValue) => {
    Storage.set(PAGE_SIZE_KEY, value)
  },
  { immediate: true }
)

// ---------- 获取用户列表分页数据渲染表格 ----------
const getListByPage = (num, size) => {
  // 注意：num是服务器页码，下标从0开始
  return API.iam.user
    .getUsersByPage(num, size)
    .then(res => {
      if (res && res.success) {
        console.log('成功获取用户列表分页数据')
        return res.data
      } else {
        if (res && res.message != null) {
          console.log('获取用户列表分页失败：', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('获取用户列表分页失败')
          ElMessage.error('获取用户列表分页失败')
        }
      }
    })
    .catch(error => {
      console.log(error)
      ElMessage.error(error.message)
    })
}
const getList = async (num, size) => {
  console.groupCollapsed('获取用户列表分页数据')
  loading.value = true

  const { pageNum, pageSize, totalPages, totalElements, users } = await getListByPage(num - 1, size) // 注意：服务器页码，下标从0开始
  console.log('渲染用户分页表格')
  formerPageSize.value = formPageSize.value
  formPageNum.value = pageNum + 1 // 注意：自然页码，下标从1开始
  formPageSize.value = pageSize
  formTotalPages.value = totalPages
  formTotalElements.value = totalElements
  formList.value = users

  loading.value = false
  console.groupEnd()
}
getList(formPageNum.value, formPageSize.value)

// ---------- 条件查询用户列表分页数据渲染表格 ----------
const getListByPageConditionally = (num, size, condition) => {
  // 注意：num是服务器页码，下标从0开始
  condition.pageNum = num
  condition.pageSize = size
  return API.iam.user
    .getUsersByPageConditionally(condition)
    .then(res => {
      if (res && res.success) {
        console.log('成功获取用户列表分页数据')
        return res.data
      } else {
        if (res && res.message != null) {
          console.log('获取用户列表分页失败：', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('获取用户列表分页失败')
          ElMessage.error('获取用户列表分页失败')
        }
      }
    })
    .catch(error => {
      console.log(error)
      ElMessage.error(error.message)
    })
}
const getListConditionally = async (num, size) => {
  console.groupCollapsed('条件查询用户列表分页数据')
  loading.value = true

  const condition = {
    username: searchForm.value.username,
    phone: searchForm.value.phone,
    email: searchForm.value.email,
    activated: searchForm.value.activated,
    stTime: searchForm.value.timeRange != null ? searchForm.value.timeRange[0] : null,
    edTime: searchForm.value.timeRange != null ? searchForm.value.timeRange[1] : null,
    role: searchForm.value.role
  }
  const { pageNum, pageSize, totalPages, totalElements, users } = await getListByPageConditionally(num - 1, size, condition) // 注意：服务器页码，下标从0开始
  console.log('渲染用户分页表格')
  formerPageSize.value = formPageSize.value
  formPageNum.value = pageNum + 1 // 注意：自然页码，下标从1开始
  formPageSize.value = pageSize
  formTotalPages.value = totalPages
  formTotalElements.value = totalElements
  formList.value = users

  loading.value = false
  console.groupEnd()
}

// ---------- 通用分页查询 ----------
const getListGeneral = async () => {
  if (searched.value) {
    await getListConditionally(formPageNum.value, formPageSize.value)
  } else {
    await getList(formPageNum.value, formPageSize.value)
  }
}

// ---------- 刷新表格 ----------
const refresh = async () => {
  getListGeneral()
  ElMessage.success('表格刷新完成')
}

// ---------- 搜索 ----------
const onSearch = () => {
  searched.value = true
  getListConditionally(1, formPageSize.value)
}

// ---------- 重置 ----------
const reset = () => {
  searched.value = false
  searchForm.value = deafultSearchForm
  searchFormRef.value.resetFields()
  getList(1, formPageSize.value)
}

// ---------- 冻结/解冻 ----------
const onChangeStatus = row => {
  const { id, username, activated } = row
  const message = `是否${activated ? '冻结' : '解冻'}用户【${username}】？`
  ElMessageBox.confirm(message, '请确认', { type: 'warning' })
    .then(() => {
      if (activated) {
        API.iam.user
          .freeze(id)
          .then(res => {
            if (res && res.success) {
              const succMesg = `成功冻结用户【${username}】`
              ElMessage.warning(succMesg)
              row.activated = false
            } else {
              if (res && res.message != null) {
                ElMessage.error(res.message)
              } else {
                ElMessage.error('冻结用户失败')
              }
            }
          })
          .catch(error => {
            ElMessage.error(error.message)
          })
      } else {
        API.iam.user
          .unfreeze(id)
          .then(res => {
            if (res && res.success) {
              const succMesg = `成功解冻用户【${username}】`
              ElMessage.success(succMesg)
              row.activated = true
            } else {
              if (res && res.message != null) {
                ElMessage.error(res.message)
              } else {
                ElMessage.error('解冻用户失败')
              }
            }
          })
          .catch(error => {
            ElMessage.error(error.message)
          })
      }
    })
    .catch(() => {
      // 点击“取消”不做动作
    })
}

// ---------- 计算序号 ----------
const getIndex = index => {
  return (formPageNum.value - 1) * formPageSize.value + index + 1
}

// ---------- 自定义表格行高 ----------
const tableRow = () => {
  return {
    height: '40px'
  }
}

// ---------- 分页器改变页码大小 ----------
// 为了在改变分页大小后，依然显示当前浏览的数据，需要对新页码进行计算
const onSizeChange = () => {
  console.log('改变分页大小')
  // 旧页码和旧大小
  const num0 = formPageNum.value - 1 // 转成服务器页码
  const size0 = formerPageSize.value
  // 新页码和新大小
  const size1 = formPageSize.value
  const num1 = Math.floor((num0 * size0 + 0) / size1) // 以旧分页中的第1个记录为锚计算新页码
  formPageNum.value = num1 + 1 // 转成自然页码

  getListGeneral()
}

// ---------- 查看角色绑定 ----------
const showBindRole = ref(false)
const nowRow = ref()
const onBind = row => {
  showBindRole.value = true
  nowRow.value = row
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  width: 100%;
  height: 100%;

  .scrollbar-wrapper {
    .el-scrollbar__view {
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

        .el-card__body {
          min-height: calc(100% - 2 * var(--el-card-padding)) !important;
        }

        .search-box-inline {
          margin-top: 20px;

          .el-input {
            --el-input-width: 189.6px;
          }
        }

        .table-wrapper {
          width: 100%;
          height: calc(100vh - 295px);
        }

        .pagination-wrapper {
          padding-top: 20px;
        }
      }
    }
  }
}
</style>
