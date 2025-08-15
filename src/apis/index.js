import iam from './modules/iam'
import content from './modules/content'
import ledger from './modules/ledger'

// index.js作为api的出口，输出所有模块，包含了所有接口
export default {
  iam,
  content,
  ledger
}
