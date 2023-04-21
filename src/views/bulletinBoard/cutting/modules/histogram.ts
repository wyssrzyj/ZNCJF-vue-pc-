/*
 * @Author: lyj
 * @Date: 2023-04-19 15:02:09
 * @LastEditTime: 2023-04-20 13:20:42
 * @Description:
 * @LastEditors: lyj
 */
export const echartsOpt = {
  title: {},
  color: [
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: '#923FFF' }, // 设置颜色渐变
        { offset: 1, color: '#2e1042' }
      ]
    },
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: '#3662EC' }, // 设置颜色渐变
        { offset: 1, color: '#2e1042' }
      ]
    }
  ],
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['计划', '实际'],
    textStyle: {
      //图例文字的样式
      color: '#3E8FF7',
      fontSize: 20
    },
    // type: 'scroll',
    top: 0,
    right: 100
  },
  xAxis: [
    {
      type: 'category',
      // prettier-ignore
      data: ['一床', '二床', '三床', '四床', '五床', '六床', '七床', '八床', '九床', '十床',],
      axisLine: {
        //底部线颜色更改
        onZero: false,
        lineStyle: {
          color: '#5470C6'
        }
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '时间(min)',
      axisLine: {
        onZero: true,
        show: true, //加箭头处1
        symbol: ['none', 'arrow'], //加箭头处2
        lineStyle: {
          color: '#5470C6'
        }
      },
      splitLine: {
        show: false, //背景线
        lineStyle: {}
      }
    }
  ],
  series: [
    {
      name: '计划',
      type: 'bar',
      // data: [],
      data: [90, 120, 70, 23, 25, 76, 135, 140, 32, 20],
      itemStyle: {
        normal: {
          barBorderRadius: [15, 15, 0, 0]
        }
      },
      barWidth: 20 //柱图宽度
    },
    {
      name: '实际',
      type: 'bar',
      // data: [],
      data: [60, 100, 90, 65, 28, 70, 120, 130, 48, 99],
      itemStyle: {
        normal: {
          barBorderRadius: [15, 15, 0, 0]
        }
      },
      barWidth: 20 //柱图宽度
    }
  ]
}
