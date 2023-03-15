<!--
 * @Author: lyj
 * @Date: 2023-01-09 15:17:25
 * @LastEditTime: 2023-03-14 14:04:58
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="new-page">
    <div id="ganttDemo" ref="ruleFormRef" class="gantt-container"></div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue'
  import { cloneDeep, isEmpty } from 'lodash'
  import { gantt } from 'dhtmlx-gantt' // 引入模块
  import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

  const props = defineProps<{
    data: any
    onChang: any
  }>()

  const state: any = reactive({
    name: 'DhtmlxGantt-Demo1',
    ganttList: {
      data: [],
      links: []
    }
  })
  //配置数据【】
  const initZoom = () => {
    gantt.i18n.setLocale('cn') //设置中文
    gantt.config.readonly = true //只读
    gantt.config.autoscroll = true //如果线超出屏幕可以x滚动
    gantt.config.order_branch = false // 左侧可以拖动
    // gantt.config.sort = true //左侧点击表头排序
    gantt.config.drag_move = false //是否可以移动
    gantt.config.drag_progress = false //拖放进度
    gantt.config.drag_resize = false //控制大小
    // gantt.config.show_links = false //控制两端的线是否可以拖动
    gantt.config.details_on_dblclick = false //双击出弹窗
    gantt.config.show_errors = false //发生异常时，允许弹出警告到UI界面
    // open = true  图数据中设置 open = true 默认展开树
    // gantt.selectTask('1')//默认选中

    gantt.plugins({
      //多选
      multiselect: true
    })

    //单击事件
    gantt.attachEvent('onTaskSelected', function (id: any) {
      props.onChang(id, state.ganttList)
    })
    //单击右键
    gantt.attachEvent('onContextMenu', function (id: any) {
      // rightData && rightData(id)
    })

    gantt.attachEvent('onTaskOpened', function (e: any) {
      // console.log('分支被打开时(任务打开)', e)
      // expandOperation && expandOperation('开', e)
    })
    gantt.attachEvent('onTaskClosed', function (e: any) {
      // console.log('分支关闭时(任务关闭)', e)
      // expandOperation && expandOperation('关', e)
    })
    // 可以通过此控制 是否可以拖动 当前的状态=1不可拖动
    gantt.attachEvent('onBeforeTaskDrag', function (id: any, mode: any, e: any) {
      const task = gantt.getTask(id)
      // console.log('可以通过此控制 是否可以拖动', task)
      if (task.type === '1') {
        return false
      } else {
        return true
      }
    })

    //  日期控制
    const zoomConfig = {
      //只会使用第一个对象的数据
      levels: [
        {
          name: 'Hours', //时
          scale_height: 60,
          min_column_width: 30,
          scales: [
            { unit: 'day', step: 1, format: '%M %d %l ' }, //时间的第一层
            { unit: 'hour', step: 1, format: '%H' } //时间的第二层
          ]
        },
        {
          name: 'Days', //日
          scale_height: 50,
          min_column_width: 100,
          scales: [
            { unit: 'day', step: 1, format: ' %M %d ' }, //月日
            { unit: 'day', step: 1, format: '  %l' } //星期
          ]
        },
        {
          name: 'Quarter', //月
          height: 100,
          min_column_width: 90,
          scales: [{ unit: 'month', step: 1, format: '%M' }]
        },
        {
          name: 'Year', //年
          scale_height: 50,
          min_column_width: 30,
          scales: [{ unit: 'year', step: 1, format: '%Y' }]
        }
      ]
    }
    gantt.ext.zoom.init(zoomConfig)
  }
  initZoom()

  //渲染
  const ganttShow = async () => {
    const chartDom: any = document.getElementById('ganttDemo')
    gantt.clearAll() //缓存问题 先清楚后添加

    gantt.config.date_format = '%Y-%m-%d %H:%i' //处理时间格【勿动】2023-2-23
    gantt.init(chartDom) //根据 id
    gantt.parse(state.ganttList) //渲染数据
  }

  // 赋值数据
  const init = (e: any) => {
    if (!isEmpty(e.data)) {
      state.ganttList.data = e.data
      //渲染
    } else {
      state.ganttList.data = []
    }
    ganttShow()
  }

  watch(
    () => props.data,
    item => {
      let list = cloneDeep(item)
      //动态设置表头表头
      if (item.title === '床次') {
        gantt.config.columns = [
          { name: 'text', label: item.title, tree: true, align: 'center', width: '150' },
          { name: 'start_time', label: '时间', align: 'center', width: '150' },
          { name: 'type', label: '状态', align: 'center' }
        ]
      } else {
        gantt.config.columns = [
          { name: 'text', label: item.title, tree: true, align: 'center', width: '150' },
          { name: 'start_time', label: '时间', align: 'center', width: '150' }
        ]
      }

      init(list)

      gantt.selectTask(list.id) //选中
      // gantt.scrollTo(35, 35)//位移
    },
    { deep: true, immediate: true }
  )
</script>

<style scoped>
  .gantt-container {
    width: 68vw;
    height: 400px;
  }
  .new-page {
    height: 100%;
    background-color: #fff;
    border-radius: 4px;
  }
</style>
