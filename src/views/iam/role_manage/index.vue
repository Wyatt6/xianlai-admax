<template>
  <div class="page-wrapper">
    <el-scrollbar class="scrollbar-wrapper">
      <div class="card-wrapper">
        <el-card class="card" shadow="never">
          <el-button size="small" type="primary" :icon="Plus" v-perm="[PermissionConst.IAM_ROLE_ADD]" @click="showAddRole = true"
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
            <el-form-item label="状态" prop="activated">
              <el-select v-model="searchForm.activated" clearable>
                <el-option label="生效" value="true" />
                <el-option label="未生效" value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="角色标识" prop="identifier">
              <el-input v-model="searchForm.identifier" clearable />
            </el-form-item>
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="searchForm.name" clearable />
            </el-form-item>
            <el-form-item label="创建时间" prop="timeRange">
              <el-date-picker
                v-model="searchForm.timeRange"
                type="datetimerange"
                start-placeholder="开始时间（含）"
                end-placeholder="结束时间（含）"
              />
            </el-form-item>
            <el-form-item label="包含权限" prop="permission">
              <el-input v-model="searchForm.permission" clearable />
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
              <el-table-column label="状态" align="center" width="95">
                <template #default="scope">
                  <el-tag :type="scope.row.activated ? 'success' : 'danger'">
                    {{ scope.row.activated ? '生效' : '未生效' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="角色标识" prop="identifier" />
              <el-table-column label="角色名称">
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
              <el-table-column label="创建时间" align="center" width="160">
                <template #default="scope">
                  {{ new Date(scope.row.createTime).toLocaleString() }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="300"
                fixed="right"
                v-perm="[PermissionConst.IAM_ROLE_QUERY, PermissionConst.IAM_ROLE_EDIT, PermissionConst.IAM_ROLE_DELETE]"
              >
                <template #default="scope">
                  <el-button-group size="small">
                    <el-tooltip effect="dark" content="查看授权" placement="top">
                      <el-button
                        v-perm="[PermissionConst.IAM_ROLE_QUERY]"
                        :icon="Search"
                        plain
                        type="primary"
                        @click="onGrant(scope.row)"
                      />
                    </el-tooltip>
                    <el-tooltip effect="dark" content="禁用" placement="top" v-if="scope.row.activated">
                      <el-button
                        v-perm="[PermissionConst.IAM_ROLE_EDIT]"
                        :icon="Open"
                        plain
                        type="success"
                        @click="onChangeStatus(scope.row)"
                      />
                    </el-tooltip>
                    <el-tooltip effect="dark" content="激活" placement="top" v-else>
                      <el-button
                        v-perm="[PermissionConst.IAM_ROLE_EDIT]"
                        :icon="TurnOff"
                        plain
                        type="danger"
                        @click="onChangeStatus(scope.row)"
                      />
                    </el-tooltip>
                    <el-button v-perm="[PermissionConst.IAM_ROLE_EDIT]" :icon="Edit" plain @click="onEdit(scope.row)" />
                    <el-button
                      v-perm="[PermissionConst.IAM_ROLE_EDIT]"
                      v-if="!searched"
                      :icon="Top"
                      plain
                      @click="moveUp(scope)"
                    />
                    <el-button
                      v-perm="[PermissionConst.IAM_ROLE_EDIT]"
                      v-if="!searched"
                      :icon="Bottom"
                      plain
                      @click="moveDown(scope)"
                    />
                    <el-button
                      v-perm="[PermissionConst.IAM_ROLE_DELETE]"
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
        <AddRole :show="showAddRole" @close="showAddRole = false" @afterAdd="afterAdd" />
        <EditRole :show="showEditRole" :nowRow="nowRow" @close="showEditRole = false" @afterEdit="afterEdit" />
        <GrantPermission :show="showGrantPermission" :nowRow="nowRow" @close="showGrantPermission = false" />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Search, Brush, Open, TurnOff, Edit, Top, Bottom, Delete } from '@element-plus/icons-vue'
import AddRole from './AddRole.vue'
import EditRole from './EditRole.vue'
import GrantPermission from './GrantPermission.vue'
import PermissionConst from '@/constants/permission_const'
import Storage from '@/utils/storage'
import API from '@/api'

// ---------- 搜索表单数据定义 ----------
const searched = ref(false)
const searchFormRef = ref()
const deafultSearchForm = {
  identifier: null,
  name: null,
  activated: null,
  timeRange: null,
  permission: null
}
const searchForm = ref(deafultSearchForm)

// ---------- 数据定义 ----------
const PAGE_NUM_KEY = 'iam.role_manage.pageNum'
const PAGE_SIZE_KEY = 'iam.role_manage.pageSize'
const pageSizeList = ref([10, 20, 50, 100])
const formerPageSize = ref(0)
const formPageNum = ref(Storage.get(PAGE_NUM_KEY) || 1) // 初始页码（注意：自然页码，下标从1开始）
const formPageSize = ref(Storage.get(PAGE_SIZE_KEY) || pageSizeList.value[0]) // 初始分页大小
const formTotalPages = ref(0) // 初始总页数
const formTotalElements = ref(0) // 初始总记录数
const formList = ref([]) // 初始分页列表
const currRowKey = ref()
const loading = ref(false)
const nowRow = ref()
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

// ---------- 获取角色列表分页数据渲染表格 ----------
const getListByPage = (num, size) => {
  // 注意：num是服务器页码，下标从0开始
  return API.iam.role
    .getRolesByPage(num, size)
    .then(res => {
      if (res && res.success) {
        console.log('成功获取角色列表分页数据')
        return res.data
      } else {
        if (res && res.message != null) {
          console.log('获取角色列表分页失败：', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('获取角色列表分页失败')
          ElMessage.error('获取角色列表分页失败')
        }
      }
    })
    .catch(error => {
      console.log(error)
      ElMessage.error(error.message)
    })
}
const getList = async (num, size) => {
  console.groupCollapsed('获取角色列表分页数据')
  loading.value = true

  const { pageNum, pageSize, totalPages, totalElements, roles } = await getListByPage(num - 1, size) // 注意：服务器页码，下标从0开始
  console.log('渲染角色分页表格')
  formerPageSize.value = formPageSize.value
  formPageNum.value = pageNum + 1 // 注意：自然页码，下标从1开始
  formPageSize.value = pageSize
  formTotalPages.value = totalPages
  formTotalElements.value = totalElements
  formList.value = roles

  loading.value = false
  console.groupEnd()
}
getList(formPageNum.value, formPageSize.value)

// ---------- 条件查询角色列表分页数据渲染表格 ----------
const getListByPageConditionally = (num, size, condition) => {
  // 注意：num是服务器页码，下标从0开始
  condition.pageNum = num
  condition.pageSize = size
  return API.iam.role
    .getRolesByPageConditionally(condition)
    .then(res => {
      if (res && res.success) {
        console.log('成功获取角色列表分页数据')
        return res.data
      } else {
        if (res && res.message != null) {
          console.log('获取角色列表分页失败：', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('获取角色列表分页失败')
          ElMessage.error('获取角色列表分页失败')
        }
      }
    })
    .catch(error => {
      console.log(error)
      ElMessage.error(error.message)
    })
}
const getListConditionally = async (num, size) => {
  console.groupCollapsed('条件查询角色列表分页数据')
  loading.value = true

  const condition = {
    identifier: searchForm.value.identifier,
    name: searchForm.value.name,
    activated: searchForm.value.activated,
    stTime: searchForm.value.timeRange != null ? searchForm.value.timeRange[0] : null,
    edTime: searchForm.value.timeRange != null ? searchForm.value.timeRange[1] : null,
    permission: searchForm.value.permission
  }
  const { pageNum, pageSize, totalPages, totalElements, roles } = await getListByPageConditionally(num - 1, size, condition) // 注意：服务器页码，下标从0开始
  console.log('渲染角色分页表格')
  formerPageSize.value = formPageSize.value
  formPageNum.value = pageNum + 1 // 注意：自然页码，下标从1开始
  formPageSize.value = pageSize
  formTotalPages.value = totalPages
  formTotalElements.value = totalElements
  formList.value = roles

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

// ---------- 新增角色 ----------`
const showAddRole = ref(false)
const afterAdd = async id => {
  formPageNum.value = 1
  // 获取新角色的排名
  await API.iam.role
    .getRowNumStartFrom1(id)
    .then(res => {
      if (res && res.success) {
        console.log('成功获取新角色的排名')
        const { rowNum } = res.data
        formPageNum.value = Math.floor((rowNum - 1) / formPageSize.value) + 1
      } else {
        if (res && res.message != null) {
          console.log('获取新角色的排名失败：', res.message)
        } else {
          console.log('获取新角色的排名失败')
        }
      }
    })
    .catch(error => {
      console.log(error)
    })
  // 查询新角色所在分页
  await getList(formPageNum.value, formPageSize.value)
  // 选中最新增加的角色记录
  currRowKey.value = id
}

// ---------- 刷新表格 ----------
const refresh = async () => {
  getListGeneral()
  ElMessage.success('表格刷新完成')
}

// ---------- 查看授权 ----------
const showGrantPermission = ref(false)
const onGrant = row => {
  showGrantPermission.value = true
  nowRow.value = row
}

// ---------- 启用/禁用 ----------
const onChangeStatus = row => {
  const { id, identifier, name, activated } = row
  const message = '是否' + (activated ? '禁用' : '激活') + '角色【' + identifier + (name ? ' / ' + name : '') + '】？'
  ElMessageBox.confirm(message, '请确认', { type: 'warning' })
    .then(() => {
      const input = { id: id, activated: !activated }
      API.iam.role
        .editRole(input)
        .then(res => {
          if (res && res.success) {
            if (activated) {
              const succMesg = '成功禁用角色【' + identifier + (name ? ' / ' + name : '') + '】'
              ElMessage.warning(succMesg)
            } else {
              const succMesg = '成功激活角色【' + identifier + (name ? ' / ' + name : '') + '】'
              ElMessage.success(succMesg)
            }
            row.activated = !row.activated
          } else {
            if (res && res.message != null) {
              ElMessage.error(res.message)
            } else {
              ElMessage.error('激活 / 禁用角色失败')
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

// ----- 编辑角色 -----
const showEditRole = ref(false)
const onEdit = row => {
  showEditRole.value = true
  nowRow.value = row
}
// 编辑角色后处理，回显数据
const afterEdit = role => {
  console.log('回显编辑后的角色信息')
  for (let i = 0; i < formList.value.length; i++) {
    if (role.id === formList.value[i].id) {
      formList.value[i].identifier = role.identifier
      formList.value[i].name = role.name
      formList.value[i].remark = role.remark
      break
    }
  }
  currRowKey.value = role.id
}

// ----- 上移、下移操作 -----
const swapPosition = (id1, id2) => {
  return API.iam.role
    .swapPosition(id1, id2)
    .then(res => {
      if (res && res.success) {
        console.log('移动成功')
        return res.data
      } else {
        console.log(res.message)
        ElMessage.error('移动失败')
      }
    })
    .catch(error => {
      console.log(error.message)
      ElMessage.error(error.message)
    })
}
// 上移
const moveUp = async scope => {
  console.groupCollapsed('上移角色记录', 'index=', scope.$index)
  const index = scope.$index
  const row = scope.row
  if (index === 0) {
    if (formPageNum.value === 1) {
      ElMessage.error('已经是第1行，无法再上移')
      console.log('已经是第1页第1条，无法再上移')
    } else {
      console.log('在当页第1条，需要先查询上一页角色数据')
      const { roles } = await getListByPage(formPageNum.value - 1 - 1, formPageSize.value) // 注意：服务器页码，下标从0开始
      const id1 = row.id
      const id2 = roles[roles.length - 1].id
      console.log('id1=', id1, 'sortId_1=', row.sortId)
      console.log('id2=', id2, 'sortId_2=', roles[roles.length - 1].sortId)

      const { role1, role2 } = await swapPosition(id1, id2)
      if (role1 != null && role2 != null) {
        console.log('跳转到上一页，自动跟踪')
        formPageNum.value = formPageNum.value - 1
        roles[roles.length - 1] = role1
        formList.value = roles
        currRowKey.value = id1
        ElMessage.success('移动完成')
      }
    }
  } else {
    const id1 = row.id
    const id2 = formList.value[index - 1].id
    console.log('id1=', id1, 'sortId_1=', row.sortId)
    console.log('id2=', id2, 'sortId_2=', formList.value[index - 1].sortId)

    const { role1, role2 } = await swapPosition(id1, id2)
    if (role1 != null && role2 != null) {
      console.log('渲染表格')
      formList.value[index].sortId = role1.sortId
      formList.value[index - 1].sortId = role2.sortId

      const temp = formList.value[index]
      formList.value[index] = formList.value[index - 1]
      formList.value[index - 1] = temp
      ElMessage.success('移动完成')
    }
  }
  console.groupEnd()
}
// 下移
const moveDown = async scope => {
  console.groupCollapsed('下移角色记录', 'index=', scope.$index)
  const index = scope.$index
  const row = scope.row
  if (index === formList.value.length - 1) {
    if (formPageNum.value === formTotalPages.value) {
      ElMessage.error('已经是最后一行，无法再下移')
      console.log('已经是最后一行，无法再下移')
    } else {
      console.log('在当页最后一条，需要先查询下一页角色数据')
      const { roles } = await getListByPage(formPageNum.value + 1 - 1, formPageSize.value) // 注意：服务器页码，下标从0开始
      const id1 = row.id
      const id2 = roles[0].id
      console.log('id1=', id1, 'sortId_1=', row.sortId)
      console.log('id2=', id2, 'sortId_2=', roles[0].sortId)

      const { role1, role2 } = await swapPosition(id1, id2)
      if (role1 != null && role2 != null) {
        console.log('跳转到下一页，自动跟踪')
        formPageNum.value = formPageNum.value + 1
        roles[0] = role1
        formList.value = roles
        currRowKey.value = id1
        ElMessage.success('移动完成')
      }
    }
  } else {
    const id1 = row.id
    const id2 = formList.value[index + 1].id
    console.log('id1=', id1, 'sortId_1=', row.sortId)
    console.log('id2=', id2, 'sortId_2=', formList.value[index + 1].sortId)

    const { role1, role2 } = await swapPosition(id1, id2)
    if (role1 != null && role2 != null) {
      console.log('渲染表格')
      formList.value[index].sortId = role1.sortId
      formList.value[index + 1].sortId = role2.sortId

      const temp = formList.value[index]
      formList.value[index] = formList.value[index + 1]
      formList.value[index + 1] = temp
      ElMessage.success('移动完成')
    }
  }
  console.groupEnd()
}

// ---------- 删除角色 ----------
const onDelete = row => {
  const { id, identifier, name } = row
  const message = '是否删除角色【' + identifier + (name ? ' / ' + name : '') + '】？'
  ElMessageBox.confirm(message, '请确认', { type: 'warning' })
    .then(() => {
      API.iam.role
        .deleteRole(id)
        .then(res => {
          if (res && res.success) {
            const succMesg = '成功删除角色【' + identifier + (name ? ' / ' + name : '') + '】'
            ElMessage.success(succMesg)
          } else {
            if (res && res.message != null) {
              ElMessage.error(res.message)
            } else {
              ElMessage.error('删除角色失败')
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
