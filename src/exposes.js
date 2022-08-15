const files = require.context('./views', true, /\.\/.*(index.vue|view-.*\.vue$)/)
const modules = {}

files.keys().forEach(key => {
  const objKey = key.replace('/index.vue', '').replace('/modules', '').replace('.vue', '').replace('.', '')
  modules[objKey] = files(key).default
})

export default {
  components: modules
}
