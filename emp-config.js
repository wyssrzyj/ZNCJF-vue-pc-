const PluginBabelVue3 = require('@efox/plugin-babel-vue-3')
const { defineConfig } = require('@efox/emp')
const ExternalRemotesPlugin = require('external-remotes-plugin')
// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)
const deps = require('./package.json').dependencies

const { exposes, name } = require('./emp-exposes')
const { getConfig } = require('./emp-remotes')

module.exports = defineConfig(({ mode, env }) => {
  process.env.API_ENV = env
  const target = 'es5'
  return {
    // 用来处理编译vue3
    plugins: [PluginBabelVue3],
    // 入口文件
    appEntry: 'main.ts',
    // 微应用端口
    server: { port: getConfig(env).port },
    html: { title: '智能裁剪房系统' },
    build: { target, sourcemap: true, minify: false },
    webpackChain: (chain, config) => {
      // webpack原始配置
      chain.resolve.alias.set('@', resolve('src'))
      chain.plugin('ExternalRemotesPlugin').use(ExternalRemotesPlugin)
    },
    // 封装module federation的配置项
    empShare: {
      // 微应用的名字，远程调用时需要指定名字
      name: name,
      // 远程应用的地址
      remotes: getConfig(env).remotes,
      exposes: exposes,
      // 依赖共享配置
      shared: {
        ...deps
      }
    }
  }
})
