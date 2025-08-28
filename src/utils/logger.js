import { useOptionStore } from '@/options'

export default {
  log: (...args) => {
    if (useOptionStore().data.console.openLog) {
      console.log(...args)
    }
  }
}
