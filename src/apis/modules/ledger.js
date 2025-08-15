import request from '@/apis/axios'

const BASIC = '/ledger/basic'
const CHANNEL = '/ledger/channel'
const CATEGORY = '/ledger/category'
const JOURNAL = '/ledger/journal'

export default {
  basic: {
    subscribe: id => {
      return request({
        desc: '订阅记账本服务',
        url: `${BASIC}/subscribe`
      })
    },
    unsubscribe: id => {
      return request({
        desc: '取消订阅记账本服务',
        url: `${BASIC}/unsubscribe`
      })
    }
  },
  channel: {
    addChannel: input => {
      return request({
        desc: '当前用户添加动账渠道',
        method: 'post',
        url: `${CHANNEL}/addChannel`,
        data: input
      })
    },
    deleteChannel: id => {
      return request({
        desc: '删除用户的某条动账渠道',
        url: `${CHANNEL}/deleteChannel?channelId=${id}`
      })
    },
    editChannel: input => {
      return request({
        desc: '编辑动账渠道',
        method: 'post',
        url: `${CHANNEL}/editChannel`,
        data: input
      })
    },
    swapPosition: (id1, id2) => {
      return request({
        desc: '交换位置',
        url: `${CHANNEL}/swapPosition?id1=${id1}&id2=${id2}`
      })
    },
    getChannels: () => {
      return request({
        desc: '获取本用户的动账渠道列表',
        url: `${CHANNEL}/getChannels`
      })
    }
  },
  category: {
    addCategory: input => {
      return request({
        desc: '新增记账类别',
        method: 'post',
        url: `${CATEGORY}/addCategory`,
        data: input
      })
    },
    deleteCategoryTree: id => {
      return request({
        desc: '删除记账类别及其子类别',
        url: `${CATEGORY}/deleteCategoryTree?id=${id}`
      })
    },
    editCategory: input => {
      return request({
        desc: '编辑记账类别',
        method: 'post',
        url: `${CATEGORY}/editCategory`,
        data: input
      })
    },
    changeActivated: (rootId, newActivated) => {
      return request({
        desc: '启用/禁用记账类别子树',
        url: `${CATEGORY}/changeActivated?rootId=${rootId}&newActivated=${newActivated}`
      })
    },
    moveOneRow: (id, mode) => {
      return request({
        desc: '上/下移动目标记账类别一行',
        url: `${CATEGORY}/moveOneRow?id=${id}&mode=${mode}`
      })
    },
    getCategoryTree: () => {
      return request({
        desc: '获取记账类别树（森林）',
        url: `${CATEGORY}/getCategoryTree`
      })
    },
    getCategories: () => {
      return request({
        desc: '获取所有记账类别列表',
        url: `${CATEGORY}/getCategories`
      })
    }
  },
  journal: {
    addJournal: input => {
      return request({
        desc: '新增记账流水',
        method: 'post',
        url: `${JOURNAL}/addJournal`,
        data: input
      })
    },
    deleteJournal: id => {
      return request({
        desc: '删除记账流水',
        url: `${JOURNAL}/deleteJournal?journalId=${id}`
      })
    },
    editJournal: input => {
      return request({
        desc: '编辑记账流水',
        method: 'post',
        url: `${JOURNAL}/editJournal`,
        data: input
      })
    },
    getJournalsByPageConditionally: condition => {
      return request({
        desc: '条件查询记账流水分页数据',
        method: 'post',
        url: `${JOURNAL}/getJournalsByPageConditionally`,
        data: condition
      })
    },
    getSumConditionally: condition => {
      return request({
        desc: '条件查询总收入和总支出',
        method: 'post',
        url: `${JOURNAL}/getSumConditionally`,
        data: condition
      })
    }
  }
}
