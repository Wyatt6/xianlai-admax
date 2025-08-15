import axios from '@/apis/axios'

const BASIC = '/ledger/basic'

export default {
  subscribe: id => {
    return axios({
      desc: '订阅记账本服务',
      url: `${BASIC}/subscribe`
    })
  },
  unsubscribe: id => {
    return axios({
      desc: '取消订阅记账本服务',
      url: `${BASIC}/unsubscribe`
    })
  }
}
