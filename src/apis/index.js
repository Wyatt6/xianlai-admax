import IamUser from './modules/iam/user'
import IamRole from './modules/iam/role'
import IamPermission from './modules/iam/permission'
import ContentCaptcha from './modules/content/captcha'
import ContentProfile from './modules/content/profile'

export default {
  iam: {
    user: IamUser,
    role: IamRole,
    permission: IamPermission
  },
  content: {
    captcha: ContentCaptcha,
    profile: ContentProfile
  }
}
