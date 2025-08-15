const requestLog = (config) => {
  const url = config.baseURL + config.url
  console.groupCollapsed('Request:', '[', config.method.toUpperCase(), ']', url, config.desc)
  // 防泄漏敏感信息
  // if (config.headers.token) {
  //   console.log('token: ', config.headers.token)
  // }
  // 防泄漏敏感信息
  // if (config.data) {
  //   console.log('form: ', config.data)
  // }
  console.groupEnd()
}

const requestErr = (err) => {
  const url = err.config.baseURL + err.config.url
  console.groupCollapsed('Request error:', '[', err.config.method.toUpperCase(), ']', url, err.desc)
  console.log('请求发送失败')
  console.groupEnd()
}

const responseLog = (config, res) => {
  const url = config.baseURL + config.url
  console.groupCollapsed('Response: ' + url)
  if (res && res.traceId != null) {
    console.log('traceId: ', res.traceId)
  }
  if (res && res.success != null) {
    console.log('success: ', res.success)
  }
  if (res && res.message != null) {
    console.log('message: ', res.message)
  }
  if (res && res.data != null && JSON.stringify(res.data) !== '{}') {
    console.log('data: ', res.data)
  }
  console.groupEnd()
}

const responseErr = (err, mesg) => {
  const url = err.config.baseURL + err.config.url
  console.groupCollapsed('Response error:', '[', err.response.status, ']', url)
  if (mesg != null) {
    console.log('message:', mesg)
  }
  if (err != null) {
    console.log('error:', err)
  }
  console.groupEnd()
}

export default {
  reqLog: requestLog,
  reqErr: requestErr,
  resLog: responseLog,
  resErr: responseErr
}
