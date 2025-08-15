import IamUser from './modules/iam/user'
import IamRole from './modules/iam/role'
import IamPermission from './modules/iam/permission'
import ContentCaptcha from './modules/content/captcha'
import ContentProfile from './modules/content/profile'
import LedgerBasic from './modules/ledger/basic'
import LedgerCategory from './modules/ledger/category'
import LedgerChannel from './modules/ledger/channel'
import LedgerJournal from './modules/ledger/journal'

export default {
  iam: {
    user: IamUser,
    role: IamRole,
    permission: IamPermission
  },
  content: {
    captcha: ContentCaptcha,
    profile: ContentProfile
  },
  ledger: {
    basic: LedgerBasic,
    category: LedgerCategory,
    channel: LedgerChannel,
    journal: LedgerJournal
  }
}
