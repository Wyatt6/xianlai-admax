import axios from '@/apis/axios'

const CHANNEL = '/ledger/channel'

export default {
  addChannel: input => {
    return axios({
      desc: '当前用户添加动账渠道',
      method: 'post',
      url: `${CHANNEL}/addChannel`,
      data: input
    })
  },
  deleteChannel: id => {
    return axios({
      desc: '删除用户的某条动账渠道',
      url: `${CHANNEL}/deleteChannel?channelId=${id}`
    })
  },
  editChannel: input => {
    return axios({
      desc: '编辑动账渠道',
      method: 'post',
      url: `${CHANNEL}/editChannel`,
      data: input
    })
  },
  swapPosition: (id1, id2) => {
    return axios({
      desc: '交换位置',
      url: `${CHANNEL}/swapPosition?id1=${id1}&id2=${id2}`
    })
  },
  getChannels: () => {
    return axios({
      desc: '获取本用户的动账渠道列表',
      url: `${CHANNEL}/getChannels`
    })
  }
}
