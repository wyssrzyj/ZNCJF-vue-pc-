/**
 * 判断是否纯中文
 * @param value
 * @returns
 */
export const isChinese = (value: string) => {
  const reg = /[^\u4e00-\u9fa5]/
  if (reg.test(value)) return false
  return true
}

/**
 * 判断是否纯英文
 * @param value
 * @returns
 */
export const isEnglish = (value: string) => {
  const reg = /^[A-Za-z]+$/
  if (reg.test(value)) return true
  return false
}
