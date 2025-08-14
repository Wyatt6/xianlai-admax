import axios from '../../axios'

const EMAIL = '/admax/common/email'

export default {
  sendEmailCode: (params, data) => {
    return axios({
      desc: '发送邮件校验码',
      method: 'post',
      url: `${EMAIL}/sendEmailCode`,
      data
    })
  }
}
