import CommonCaptcha from './services/common/captcha'
import IamUser from './services/iam/user'

export default {
  common: {
    captcha: CommonCaptcha
  },
  iam: {
    user: IamUser
  }
}
