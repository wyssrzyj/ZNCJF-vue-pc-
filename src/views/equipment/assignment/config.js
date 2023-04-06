let colors = ['red', '#C6E8EF', 'red', '#ABC8E6', '#EDE0F7'] //红绿蓝

import * as echarts from 'echarts'

export const echartsOpt = {
  gantt: {
    color: colors,
    tooltip: {
      //提示框
      formatter: function (params) {
        const { name, produceOrderCode, time, styleCode, styleName } = params.data
        var htmlStr = '';
        htmlStr += `<div></div>设备名称 : ${name}<br/>`;
        htmlStr += `<div></div>生产单号 : ${produceOrderCode}<br/>`;
        htmlStr += `<div></div>计划时间 : ${time}<br/>`;
        htmlStr += `<div></div>款式编码 : ${styleCode}<br/>`;
        htmlStr += `<div></div>款式名称 :${styleName}<br/>`;
        return htmlStr

        // return params.name + ':' + params.value[1] + '~' + params.value[2]
      } //数据的值
    },
    legend: {
      //图例
      show: false,
      selectedMode: false // 图例设为不可点击
    },
    grid: {
      //绘图网格
      left: '0%',
      right: '2%',
      top: '5%',
      bottom: '1%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      interval: 3600 * 1000, //以一个小时递增
      min: '', //将data里最小时间的整点时间设为min,否则min会以data里面的min为开始进行整点递增
      max: '',
      axisTick: {
        // X轴线 刻度线
        show: false,
        length: 10,
        lineStyle: {
          color: 'red',
          type: 'solid'
        }
      },
      axisLabel: {
        // formatter: function (value) {
        //   let date = new Date(value)
        //   return getzf(date.getHours()) + ':00'

        //   function getzf(num) {
        //     if (parseInt(num) < 10) {
        //       num = '0' + num
        //     }
        //     return num
        //   }
        // },
        // X轴线 标签修改
        textStyle: {
          color: '#8c8c92' //坐标值得具体的颜色
        }
      },
      splitLine: {
        show: true, // X轴线 颜色类型的修改
        lineStyle: {
          type: 'dashed',
          color: '#DDDDDD'
        }
      },
      axisLine: {
        show: true, // X轴 网格线 颜色类型的修改
        lineStyle: {
          type: 'solid',
          color: '#DDDDDD'
        }
      }
    },
    yAxis: {
      axisLine: {
        //x轴坐标轴，false为隐藏，true为显示
        show: false
      },
      axisTick: {
        //y轴刻度线
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#333333',
          fontSize: '14'
        },
        margin: 90,
        formatter: `{value|{value}}`,
        rich: {
          value: {
            color: '#000000',
            backgroundColor: '#F5F6F8',
            borderColor: '#BAD1FF',
            borderRadius: 8,
            padding: [15, 40],
            align: 'center',
            height: 20,
            width: 100,
            borderWidth: 1
          }
        }
      },
      data: ['深睡', '浅睡', '清醒', '浅睡1', '清醒2']
    },
    series: [
      {
        type: 'custom',
        renderItem: (params, api) => {
          //开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
          let categoryIndex = api.value(0) //这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
          let start = api.coord([api.value(1), categoryIndex]) // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
          let end = api.coord([api.value(2), categoryIndex])
          // let height = api.size([0, 1])[1]
          return {
            type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
            shape: echarts.graphic.clipRectByRect(
              {
                // 矩形的位置和大小。
                x: start[0],
                y: start[1] - 30,
                // y: 100,
                width: end[0] - start[0],
                // height: height
                height: 50
              },
              {
                // 当前坐标系的包围盒。
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
              }
            ),
            style: api.style()
          }
        },
        label: {
          formatter: '{c}',
          show: true,
          position: 'top',
          textStyle: {
            fontWeight: 'bolder',
            fontSize: '12',
            color: '#fff'
          }
        },
        encode: {
          x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
          y: [0, 3] // data 中『维度0』对应到 Y 轴
        },
        data: [
          // 维度0 维度1 维度2
          {
            itemStyle: { normal: { color: colors[1] } }, //条形颜色
            name: '浅睡1',
            value: [4, '2009-6-1 01:28', '2009-6-1 05:00', 111] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          }
        ]
      }
    ],
    //滚动条
    dataZoom: [
      {
        type: 'slider',
        zoomLoxk: true,
        backgroundColor: 'rgba(245, 246, 248, 1)', // 组件的背景颜色。
        fillerColor: 'rgba(186, 209, 255, 1)', // 选中范围的填充颜色。
        borderColor: 'rgba(245, 246, 248, 0)', // 边框颜色
        showDetail: false, //是否显示detail，即拖拽时候显示详细数值信息

         // 可选，dataZoom 组件的 index，多个 dataZoom 组件时有用，默认为 0
    // 开始位置的百分比，0 - 100
    start: 100,
    // 结束位置的百分比，0 - 100
    end: 90,
    // 开始位置的数值
    startValue: 0,
    // 结束位置的数值
    endValue: 0,

        yAxisIndex: [0], //控制哪个轴，如果是 number 表示控制一个轴，如果是 Array 表示控制多个轴。此处控制第二根轴
        width: 1, //滚动条高度
        height: '80%', //滚动条显示位置
        left: 220, // 距离右边

      }
    ]
  }
}
