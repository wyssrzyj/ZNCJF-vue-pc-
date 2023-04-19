/*
 * @Author: lyj
 * @Date: 2023-04-16 17:24:31
 * @LastEditTime: 2023-04-16 17:25:39
 * @Description: 
 * @LastEditors: lyj
 */
import { IObject, IViewHooks, IViewHooksOptions } from '@/types/interface'
// import baseService from '@/service/baseService'
import { checkPermission, getDictLabel } from '@/utils/utils'
import {  onActivated, onMounted } from 'vue'
// import { initI18n } from '@/i18n'
import { useStore } from 'vuex'

/**
 * 通用视图业务逻辑（列表/增删改查基本业务）
 * @param props 自定义通用业务state
 * @returns 返回响应式自定义state和通用方法
 */
const useView = (props: IViewHooksOptions | IObject): IViewHooks => {
  // const { t } = initI18n.global
  const store = useStore()
  const defaultOptions: IViewHooksOptions = {
    createdIsNeed: true,
    activatedIsNeed: false,
    getDataListURL: '',
    getDataListIsPage: false,
    deleteURL: '',
    deleteIsBatch: false,
    deleteIsBatchKey: 'id',
    exportURL: '',
    dataForm: {},
    dataList: [],
    order: '',
    orderField: '',
    page: 1,
    limit: 10,
    total: 0,
    dataListLoading: false,
    dataListSelections: [],
    addOrUpdateVisible: false,
    addOrUpdate: {},
    elTable: {},
    tableHeight: 0,
    tabTableHeight: 0
  }
  const mergeDefaultStateToPageState = (options: IObject, props: IObject): IViewHooksOptions => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key]
      }
    }
    return props
  }
  const state = mergeDefaultStateToPageState(defaultOptions, props)
  onMounted(() => {
    if (state.createdIsNeed && !state.activatedIsNeed) {
      viewFns.query()
      viewFns.getTableHeight()
    }
  })
  onActivated(() => {
    if (state.activatedIsNeed) {
      viewFns.query()
      viewFns.getTableHeight()
    }
  })

  /**
   * element-plus button组件聚焦事件bug，导致点击后一直处于聚焦状态，按下回车键依然会触发事件
   * @param elm
   */
  // const fixEleButtonFocus = () => {
  //   const elm = state.addOrUpdate
  //   if (elm && elm.$parent && elm.$parent.$el) {
  //     const node = elm.$parent.$el
  //     node.setAttribute('tabindex', 0)
  //     node.focus()
  //     node.blur()
  //     node.removeAttribute('tabindex')
  //   }
  // }
  //
  const rejectFns = {
    hasPermission(key: string) {
      return checkPermission(store.state.permissions as string[], key)
    },
    getDictLabel(dictType: string, dictValue: number) {
      return getDictLabel(store.state.dicts, dictType, dictValue)
    }
  }

  //
  return {
    ...rejectFns
  }
}

export default useView
