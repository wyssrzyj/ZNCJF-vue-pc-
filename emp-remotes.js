/*
 * @Author: lyj
 * @Date: 2022-08-15 09:55:44
 * @LastEditTime: 2022-09-07 13:12:58
 * @Description:
 * @LastEditors: lyj
 */
const port_common = 8990
const port_intellicut = 9001

const host_develop = 'http://localhost'
const host_dev = 'http://192.168.0.242'
const host_test = 'http://192.168.0.243'
const host_pre = 'http://192.168.0.234'
const host_prod = 'http://10.4.101.50'

const getConfigMap = host => {
  return {
    host: host,
    port: port_intellicut,
    remotes: {
      '@njpCommon': `njpCommon@[(window.host_micro_app?window.host_micro_app:'${host}')]:[(window.port_common?window.port_common:'${port_common}')]/emp.js`
    }
  }
}

/*本地开发环境*/
const develop = getConfigMap(host_develop)
/*开发环境*/
const dev = getConfigMap(host_dev)
/*测试环境*/
const test = getConfigMap(host_test)
/*预发布环境*/
const pre = getConfigMap(host_pre)
/*生产环境*/
const prod = getConfigMap(host_prod)

const configs = { develop, dev, test, pre, prod }

exports.getConfig = (env = 'develop') => {
  return configs[env] || {}
}
