import axios from '@/apis/axios'

const CATEGORY = '/ledger/category'

export default {
  addCategory: input => {
    return axios({
      desc: '新增记账类别',
      method: 'post',
      url: `${CATEGORY}/addCategory`,
      data: input
    })
  },
  deleteCategoryTree: id => {
    return axios({
      desc: '删除记账类别及其子类别',
      url: `${CATEGORY}/deleteCategoryTree?id=${id}`
    })
  },
  editCategory: input => {
    return axios({
      desc: '编辑记账类别',
      method: 'post',
      url: `${CATEGORY}/editCategory`,
      data: input
    })
  },
  changeActivated: (rootId, newActivated) => {
    return axios({
      desc: '启用/禁用记账类别子树',
      url: `${CATEGORY}/changeActivated?rootId=${rootId}&newActivated=${newActivated}`
    })
  },
  moveOneRow: (id, mode) => {
    return axios({
      desc: '上/下移动目标记账类别一行',
      url: `${CATEGORY}/moveOneRow?id=${id}&mode=${mode}`
    })
  },
  getCategoryTree: () => {
    return axios({
      desc: '获取记账类别树（森林）',
      url: `${CATEGORY}/getCategoryTree`
    })
  },
  getCategories: () => {
    return axios({
      desc: '获取所有记账类别列表',
      url: `${CATEGORY}/getCategories`
    })
  }
}
