<template>
  <div class="page-wrapper">
    <el-scrollbar class="scrollbar-wrapper">
      <div class="card-wrapper">
        <el-card class="card" shadow="never">
          <el-button
            size="small"
            type="primary"
            :icon="Plus"
            v-perm="[PermissionConst.IAM_PERMISSION_ADD]"
            @click="showAddPermission = true"
            >新增</el-button
          >
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
            <el-form-item label="所属模块" prop="module">
              <el-input v-model="searchForm.module" clearable />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="searchForm.type" clearable>
                <el-option label="页面" value="view" />
                <el-option label="资源" value="resource" />
                <el-option label="API" value="api" />
              </el-select>
            </el-form-item>
            <el-form-item label="权限标识" prop="identifier">
              <el-input v-model="searchForm.identifier" clearable />
            </el-form-item>
            <el-form-item label="权限名称" prop="name">
              <el-input v-model="searchForm.name" clearable />
            </el-form-item>
            <el-form-item label="状态" prop="activated">
              <el-select v-model="searchForm.activated" clearable>
                <el-option label="生效" value="true" />
                <el-option label="未生效" value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" prop="timeRange">
              <el-date-picker
                v-model="searchForm.timeRange"
                type="datetimerange"
                start-placeholder="开始时间（含）"
                end-placeholder="结束时间（含）"
              />
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
              <el-table-column label="序号" align="center" width="70" type="index" :index="getIndex" />
              <el-table-column label="所属模块" align="center" prop="module" width="150" />
              <el-table-column label="类型" align="center" width="80">
                <template #default="scope">
                  <el-tag type="success" v-if="scope.row.type != null && scope.row.type === 'view'" round effect="plain"
                    >页面</el-tag
                  >
                  <el-tag v-if="scope.row.type != null && scope.row.type === 'resource'" round effect="plain">资源</el-tag>
                  <el-tag type="danger" v-if="scope.row.type != null && scope.row.type === 'api'" round effect="plain"
                    >API</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label="权限标识" prop="identifier" />
              <el-table-column label="权限名称">
                <template #default="scope">
                  <el-popover placement="left" effect="light" v-if="scope.row.remark && scope.row.remark.length > 0">
                    <template #reference
                      ><span style="cursor: default">{{ scope.row.name }}</span></template
                    >
                    {{ scope.row.remark }}
                  </el-popover>
                  <span v-else style="cursor: default">{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center" width="80">
                <template #default="scope">
                  <el-tag :type="scope.row.activated ? 'success' : 'danger'">
                    {{ scope.row.activated ? '生效' : '未生效' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" width="155">
                <template #default="scope">
                  {{ new Date(scope.row.createTime).toLocaleString() }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="170"
                fixed="right"
                v-perm="[PermissionConst.IAM_PERMISSION_EDIT, PermissionConst.IAM_PERMISSION_DELETE]"
              >
                <template #default="scope">
                  <el-button-group size="small">
                    <el-tooltip effect="dark" content="禁用" placement="top" v-if="scope.row.activated">
                      <el-button
                        v-perm="[PermissionConst.IAM_PERMISSION_EDIT]"
                        :icon="Open"
                        plain
                        type="success"
                        @click="onChangeStatus(scope.row)"
                      />
                    </el-tooltip>
                    <el-tooltip effect="dark" content="激活" placement="top" v-else>
                      <el-button
                        v-perm="[PermissionConst.IAM_PERMISSION_EDIT]"
                        :icon="TurnOff"
                        plain
                        type="danger"
                        @click="onChangeStatus(scope.row)"
                      />
                    </el-tooltip>
                    <el-button v-perm="[PermissionConst.IAM_PERMISSION_EDIT]" :icon="Edit" plain @click="onEdit(scope.row)" />
                    <el-button
                      v-perm="[PermissionConst.IAM_PERMISSION_DELETE]"
                      :icon="Delete"
                      type="danger"
                      @click="onDelete(scope.row)"
                    />
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
      </div>
    </el-scrollbar>
    <AddPermission :show="showAddPermission" @close="showAddPermission = false" @afterAdd="afterAdd" />
    <EditPermission :show="showEditPermission" :nowRow="nowRow" @close="showEditPermission = false" @afterEdit="afterEdit" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Search, Brush, Open, TurnOff, Edit, Delete } from '@element-plus/icons-vue'
import AddPermission from './AddPermission.vue'
import EditPermission from './EditPermission.vue'
import PermissionConst from '@/constants/permission_const'
import Storage from '@/utils/storage'
import Apis from '@/apis'

// ---------- 搜索表单数据定义 ----------
const searched = ref(false)
const searchFormRef = ref()
const deafultSearchForm = {
  module: null,
  type: null,
  identifier: null,
  name: null,
  activated: null,
  timeRange: null
}
const searchForm = ref(deafultSearchForm)

// ---------- 表格数据定义 ----------
const PAGE_NUM_KEY = 'iam.permission_manage.pageNum'
const PAGE_SIZE_KEY = 'iam.permission_manage.pageSize'
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

// ---------- 获取权限列表分页数据渲染表格 ----------
const getListByPage = (num, size) => {
  // 注意：num是服务器页码，下标从0开始
  return Apis.iam.permission
    .getPermissionsByPage(num, size)
    .then(res => {
      if (res && res.success) {
        console.log('成功获取权限列表分页数据')
        return res.data
      } else {
        if (res && res.message != null) {
          console.log('获取权限列表分页失败：', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('获取权限列表分页失败')
          ElMessage.error('获取权限列表分页失败')
        }
      }
    })
    .catch(error => {
      console.log(error)
      ElMessage.error(error.message)
    })
}
const getList = async (num, size) => {
  console.groupCollapsed('获取权限列表分页数据')
  loading.value = true

  const { pageNum, pageSize, totalPages, totalElements, permissions } = await getListByPage(num - 1, size) // 注意：服务器页码，下标从0开始
  console.log('渲染权限分页表格')
  formerPageSize.value = formPageSize.value
  formPageNum.value = pageNum + 1 // 注意：自然页码，下标从1开始
  formPageSize.value = pageSize
  formTotalPages.value = totalPages
  formTotalElements.value = totalElements
  formList.value = permissions

  loading.value = false
  console.groupEnd()
}
getList(formPageNum.value, formPageSize.value)

// ---------- 条件查询权限列表分页数据渲染表格 ----------
const getListByPageConditionally = (num, size, condition) => {
  // 注意：num是服务器页码，下标从0开始
  condition.pageNum = num
  condition.pageSize = size
  if (condition.type === '') condition.type = null
  return Apis.iam.permission
    .getPermissionsByPageConditionally(condition)
    .then(res => {
      if (res && res.success) {
        console.log('成功获取权限列表分页数据')
        return res.data
      } else {
        if (res && res.message != null) {
          console.log('获取权限列表分页失败：', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('获取权限列表分页失败')
          ElMessage.error('获取权限列表分页失败')
        }
      }
    })
    .catch(error => {
      console.log(error)
      ElMessage.error(error.message)
    })
}
const getListConditionally = async (num, size) => {
  console.groupCollapsed('条件查询权限列表分页数据')
  loading.value = true

  const condition = {
    module: searchForm.value.module,
    type: searchForm.value.type,
    identifier: searchForm.value.identifier,
    name: searchForm.value.name,
    activated: searchForm.value.activated,
    stTime: searchForm.value.timeRange != null ? searchForm.value.timeRange[0] : null,
    edTime: searchForm.value.timeRange != null ? searchForm.value.timeRange[1] : null
  }
  const { pageNum, pageSize, totalPages, totalElements, permissions } = await getListByPageConditionally(num - 1, size, condition) // 注意：服务器页码，下标从0开始
  console.log('渲染权限分页表格')
  formerPageSize.value = formPageSize.value
  formPageNum.value = pageNum + 1 // 注意：自然页码，下标从1开始
  formPageSize.value = pageSize
  formTotalPages.value = totalPages
  formTotalElements.value = totalElements
  formList.value = permissions

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

// ---------- 新增权限 ----------
const showAddPermission = ref(false)
const afterAdd = async id => {
  formPageNum.value = 1
  // 获取新权限的排名
  await Apis.iam.permission
    .getRowNumStartFrom1(id)
    .then(res => {
      if (res && res.success) {
        console.log('成功获取新权限的排名')
        const { rowNum } = res.data
        formPageNum.value = Math.floor((rowNum - 1) / formPageSize.value) + 1
      } else {
        if (res && res.message != null) {
          console.log('获取新权限的排名失败：', res.message)
        } else {
          console.log('获取新权限的排名失败')
        }
      }
    })
    .catch(error => {
      console.log(error)
    })
  // 查询新权限所在分页
  await getList(formPageNum.value, formPageSize.value)
  // 选中最新增加的权限记录
  currRowKey.value = id
}

// ---------- 刷新表格 ----------
const refresh = async () => {
  getListGeneral()
  ElMessage.success('表格刷新完成')
}

// ---------- 启用/禁用 ----------
const onChangeStatus = row => {
  const { id, identifier, name, activated } = row
  const message = '是否' + (activated ? '禁用' : '激活') + '权限【' + identifier + (name ? ' / ' + name : '') + '】？'
  ElMessageBox.confirm(message, '请确认', { type: 'warning' })
    .then(() => {
      const input = { id: id, activated: !activated }
      Apis.iam.permission
        .editPermission(input)
        .then(res => {
          if (res && res.success) {
            if (activated) {
              const succMesg = '成功禁用权限【' + identifier + (name ? ' / ' + name : '') + '】'
              ElMessage.warning(succMesg)
            } else {
              const succMesg = '成功激活权限【' + identifier + (name ? ' / ' + name : '') + '】'
              ElMessage.success(succMesg)
            }
            row.activated = !row.activated
          } else {
            if (res && res.message != null) {
              ElMessage.error(res.message)
            } else {
              ElMessage.error('激活 / 禁用权限失败')
            }
          }
        })
        .catch(error => {
          ElMessage.error(error.message)
        })
    })
    .catch(() => {
      // 点击“取消”不做动作
    })
}

// ---------- 修改权限 ----------
const showEditPermission = ref(false)
const nowRow = ref({})
const onEdit = row => {
  showEditPermission.value = true
  nowRow.value = row
}
// 编辑权限后处理，回显数据
const afterEdit = permission => {
  console.log('回显编辑后的权限信息')
  for (let i = 0; i < formList.value.length; i++) {
    if (permission.id === formList.value[i].id) {
      formList.value[i].module = permission.module
      formList.value[i].type = permission.type
      formList.value[i].identifier = permission.identifier
      formList.value[i].name = permission.name
      formList.value[i].remark = permission.remark
      break
    }
  }
  currRowKey.value = permission.id
}

// ---------- 删除权限 ----------
const onDelete = row => {
  const { id, identifier, name } = row
  const message = '是否删除权限【' + identifier + (name ? ' / ' + name : '') + '】？'
  ElMessageBox.confirm(message, '请确认', { type: 'warning' })
    .then(() => {
      Apis.iam.permission
        .deletePermission(id)
        .then(res => {
          if (res && res.success) {
            const succMesg = '成功删除权限【' + identifier + (name ? ' / ' + name : '') + '】'
            ElMessage.success(succMesg)
          } else {
            if (res && res.message != null) {
              ElMessage.error(res.message)
            } else {
              ElMessage.error('删除权限失败')
            }
          }
          getListGeneral(formPageNum.value, formPageSize.value)
        })
        .catch(error => {
          ElMessage.error(error.message)
        })
    })
    .catch(() => {
      // 点击“取消”不做动作
    })
}

// ---------- 计算序号 ----------
const getIndex = index => {
  return (formPageNum.value - 1) * formPageSize.value + index + 1
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

// ---------- 自定义表格行高 ----------
const tableRow = () => {
  return {
    height: '40px'
  }
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
