<!--
 * @Author: lyj
 * @Date: 2023-01-09 15:17:25
 * @LastEditTime: 2023-02-21 11:12:02
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="new-page">
    <div id="ganttDemo" ref="ruleFormRef" class="gantt-container"></div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, onMounted ,watch} from 'vue'

  import {gantt} from 'dhtmlx-gantt' // 引入模块
  import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

    const props = defineProps<{
    data:any
  }>()

  const state: any = reactive({
    name: 'DhtmlxGantt-Demo1',
    ganttList: {
      data: [],
      links: []
    }
  })
  
  const init = () => {
    const data = [                          
      {
        //父亲
        id: 1,
        type: true, //判断是否可以移动
        text: '裁剪车间—裁剪班组', //名称
        lyj: '8848',
        lxr: '糯米',
        progress: 0.6,
        open: true, //默认展开
        // duration: 6, //天数
        // progress: 1, //控制完成百分比 范围0-1
        color: 'red' //控制颜色
      },
      {
        //儿子
        id: 11,
        text: '订单1',
        start_date: '2020-04-07',
        lyj: '8848',
        lxr: '刘心睿',
        progress: 0.6,
        parent: 1,
        color: '', //控制颜色
        render: 'split' //添加同一行
      },
      {
        //孙子
        id: 111,
        text: '卢英杰的子1',
        lyj: '8848',
        lxr: '刘心睿',
        start_date: '2020-04-7-9', //开始时间
        end_date: '2020-04-7-17 ', //结束时间
        // duration: 1,
        progress: 0.6,
        parent: 11,
        color: 'red' //控制颜色
      },
      {
        id: 112,
        text: '卢英杰的子2',
        start_date: '2020-04-9',
        duration: 1,
        progress: 0.6,
        parent: 11,
        color: 'pink' //控制颜色
      },
      {
        id: 113,
        text: '卢英杰号的子3',
        start_date: '2020-04-10',
        duration: 1,
        progress: 0.6,
        parent: 11,
        color: '#039af9' //控制颜色
      },
        {
        //父亲
        id: 1971,
        type: true, //判断是否可以移动
        text: '裁剪车间—裁剪班组', //名称
        lyj: '8848',
        lxr: '糯米1',
        progress: 0.6,
        open: true, //默认展开
        // duration: 6, //天数
        // progress: 1, //控制完成百分比 范围0-1
        color: 'red' //控制颜色
      },
        {
        //父亲
        id: 1972,
        type: true, //判断是否可以移动
        text: '裁剪车间—裁剪班组', //名称
        lyj: '8848',
        lxr: '糯米2',
        progress: 0.6,
        open: true, //默认展开
        // duration: 6, //天数
        // progress: 1, //控制完成百分比 范围0-1
        color: 'red' //控制颜色
      },
        {
        //父亲
        id: 1973,
        type: true, //判断是否可以移动
        text: '裁剪车间—裁剪班组', //名称
        lyj: '8848',
        lxr: '糯米2',
        progress: 0.6,
        open: true, //默认展开
        // duration: 6, //天数
        // progress: 1, //控制完成百分比 范围0-1
        color: 'red' //控制颜色
      },
        {
        //父亲
        id: 1974,
        type: true, //判断是否可以移动
        text: '裁剪车间—裁剪班组', //名称
        lyj: '8848',
        lxr: '糯米2',
        progress: 0.6,
        open: true, //默认展开
        // duration: 6, //天数
        // progress: 1, //控制完成百分比 范围0-1
        color: 'red' //控制颜色
      },
        {
        //父亲
        id: 1975,
        type: true, //判断是否可以移动
        text: '测试选中—裁剪班组', //名称
        lyj: '8848',
        lxr: '糯米2',
        progress: 0.6,
        open: true, //默认展开
        // duration: 6, //天数
        // progress: 1, //控制完成百分比 范围0-1
        color: 'red' //控制颜色
      },
        {
        //父亲
        id: 1976,
        type: true, //判断是否可以移动
        text: '裁剪车间—裁剪班组', //名称
        lyj: '8848',
        lxr: '糯米2',
        progress: 0.6,
        open: true, //默认展开
        // duration: 6, //天数
        // progress: 1, //控制完成百分比 范围0-1
        color: 'red' //控制颜色
      },
       {
        //父亲
        id: 1977,
        type: true, //判断是否可以移动
        text: '裁剪车间—裁剪班组', //名称
        lyj: '8848',
        lxr: '糯米2',
        progress: 0.6,
        open: true, //默认展开
        // duration: 6, //天数
        // progress: 1, //控制完成百分比 范围0-1
        color: 'red' //控制颜色
      },
       {
        //父亲
        id: 1978,
        type: true, //判断是否可以移动
        text: '裁剪车间—裁剪班组', //名称
        lyj: '8848',
        lxr: '糯米2',
        progress: 0.6,
        open: true, //默认展开
        // duration: 6, //天数
        // progress: 1, //控制完成百分比 范围0-1
        color: 'red' //控制颜色
      },
       {
        //父亲
        id: 1979,
        type: true, //判断是否可以移动
        text: '裁剪车间—裁剪班组', //名称
        lyj: '8848',
        lxr: '糯米2',
        progress: 0.6,
        open: true, //默认展开
        // duration: 6, //天数
        // progress: 1, //控制完成百分比 范围0-1
        color: 'red' //控制颜色
      },
    ]

    state.ganttList.data = data
    // state.ganttList.links=links
    // // //本地化
    // gantt.i18n.setLocale("cn");
    // // 新增列
    // // 初始化
    // gantt.init(chartDom);
    // // 数据解析
    // gantt.parse(state.tasks);
  }
  init()

  //配置数据
  const initZoom = () => {
    gantt.i18n.setLocale('cn') //设置中文
    gantt.config.readonly = true//只读
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
    //表头
    gantt.config.columns = [
      { name: 'text', label: '款号', tree: true, width: '250' },
      { name: 'lyj', label: '床次', align: 'center' },
      { name: 'start_date', label: '时间', align: 'center' },
      { name: 'lxr', label: '状态', align: 'center' },
    ]
    //单击事件
    gantt.attachEvent('onTaskSelected', function (id: any) {
      // leftData && leftData(id)
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
  //渲染
  const ganttShow = async () => {
    const chartDom = document.getElementById('ganttDemo')
    gantt.clearAll() //缓存问题 先清楚后添加
    gantt.init(chartDom) //根据 id
    gantt.parse(state.ganttList) //渲染数据
  }

  onMounted(() => {
    initZoom()
    ganttShow()
  })
     watch(
    () => props.data,
    item => {
     
      gantt.scrollTo(35, 35)//位移
       gantt.selectTask(1975)//选中
      //  console.log("监听数据变化-触发位移", item);
    }
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
