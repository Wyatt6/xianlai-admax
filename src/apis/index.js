import CommonCaptcha from './services/common/captcha'
import CommonEmail from './services/common/email'
import IamUser from './services/iam/user'

export default {
  common: {
    captcha: CommonCaptcha,
    email: CommonEmail
  },
  iam: {
    user: IamUser
  }
}
