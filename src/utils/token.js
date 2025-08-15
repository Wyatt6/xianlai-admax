import Storage from './storage'
import TokenConst from '@/constants/token_const'

// ----- 缓存token -----
const setToken = (token) => {
  Storage.set(TokenConst.TOKEN, token)
}
// ----- 获取token -----
const getToken = () => {
  return Storage.get(TokenConst.TOKEN)
}
// ----- 缓存token过期时间 -----
const setExpiredTime = (expiredTime) => {
  Storage.set(TokenConst.TOKEN_EXPIRED_TIME, expiredTime)
}
// ----- 获取token过期时间缓存 -----
const getExpiredTime = () => {
  return Storage.get(TokenConst.TOKEN_EXPIRED_TIME)
}

export default {
  setToken: setToken,
  getToken: getToken,
  setExpiredTime: setExpiredTime,
  getExpiredTime: getExpiredTime,
  // ----- 判断token是否存在 -----
  hasToken: () => {
    return getToken() != null
  },
  // ----- 判断token是否过期 -----
  isExpired: () => {
    const current = Date.now()
    const expiredTime = getExpiredTime()
    return current > expiredTime
  }
}
