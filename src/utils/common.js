/**
 * 判断数据是否为空值（null/undefined/{}/[]）
 * @param {*} data
 * @returns true-空；false-非空
 */
export function isEmpty(data) {
  if (!data) return true
  if (JSON.stringify(data) === '{}') return true
  if (JSON.stringify(data) === '[]') return true
  return false
}

/**
 * 判断数据是否非空（null/undefined/{}/[]）
 * @param {*} data
 * @returns true-非空；false-空
 */
export function notEmpty(data) {
  return !isEmpty(data)
}
