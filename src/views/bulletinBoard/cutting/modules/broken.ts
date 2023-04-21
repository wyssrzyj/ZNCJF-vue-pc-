/*
 * @Author: lyj
 * @Date: 2023-04-19 15:02:09
 * @LastEditTime: 2023-04-19 16:47:44
 * @Description:
 * @LastEditors: lyj
 */
export const echartsOpt = {
  xAxis: {
    type: 'category',
    symbol: 'circle', //折线点设置为实心点
    symbolSize: 4, //折线点的大小
    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    data: [],
    axisLine: {
      //底部线颜色更改
      onZero: false,
      lineStyle: {
        color: '#5470C6'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} %'
    },
    axisLine: {
      onZero: false,
      lineStyle: {
        color: '#5470C6'
      }
    },
    //背景虚线更改
    splitLine: {
      show: true,
      lineStyle: {
        color: '#263A60',
        type: 'dashed'
      }
    }
  },
  color: ['#6A37FF'], //线颜色
  series: [
    {
      // data: [820, 932, 901, 934, 1290, 1330, 1320],
      data: [],
      type: 'line',
      symbol: 'none' //不显示圆点
    }
  ],
  tooltip: {
    formatter: function (params: any) {
      let htmlStr = ''
      htmlStr += `<div></div>达成率 :${params.data}% <br/>`
      return htmlStr
    }
  }
}
