const openLog = true

export default {
  log: (...args) => {
    if (openLog) {
      console.log(...args)
    }
  }
}
