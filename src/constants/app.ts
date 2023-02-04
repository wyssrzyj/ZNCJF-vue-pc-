/*
 * @Author: lyj
 * @Date: 2022-09-05 10:01:25
 * @LastEditTime: 2023-02-02 16:41:42
 * @Description: 
 * @LastEditors: lyj
 */
import appPack from '../../package.json'
/**
 * app系统配置
 */
export default {
  /**
   * 系统版本号，自动读取package.json中的version字段
   */
  version: appPack.version,
  /**
   * 系统默认语言
   */
  defaultLang: 'zh-CN',
  /**
   * 启用logo图标，logo尺寸32*32，存放路径@/assets/images/logo.png
   */
  enabledLogo: false,

  /**
   * 开启页面缓存
   */
  enabledKeepAlive: true,

  /**
   * 网络请求超时时间，单位毫秒
   */
  requestTimeout: 30000,

  /**
   * 全屏渲染的页面
   */
  fullscreenPages: ['/login']
}
