<template>
  <div class="box">
    <figure>
      <v-chart :option="option" :theme="theme" :autoresize="autoResize" />
    </figure>
  </div>
</template>

<script lang="ts">
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { CustomChart } from 'echarts/charts'
  import { GridComponent, TitleComponent } from 'echarts/components'

  import VChart, { THEME_KEY } from 'vue-echarts'
  import { ref, defineComponent } from 'vue'

  use([CustomChart, GridComponent, TitleComponent, CanvasRenderer])
  export default defineComponent({
    name: 'Charts',
    components: {
      VChart
    },
    provide: {
      [THEME_KEY]: 'westeros'
    },
    setup() {
      const colorList = ['#98e9ac', '#00b32c', '#00b32c', '#00b32c', 'red']
      const data = [
        [0, 100, 10, 'A'],
        [20, 30, 10, 'B'],
        [20, 30, 10, 'C'],
        [60, 70, 10, 'C']
      ].map(function (item, index) {
        return {
          value: item,
          itemStyle: {
            color: colorList[index]
          }
        }
      })
      const option = ref({
        title: {
          text: '糯甜软软酱',
          left: 'center'
        },
        tooltip: {},
        xAxis: {
          scale: true
        },
        yAxis: {},
        series: [
          {
            type: 'custom',
            renderItem: function (params, api) {
              let yValue = api.value(2)
              let start = api.coord([api.value(0), yValue])
              let size = api.size([api.value(1) - api.value(0), yValue])
              let style = api.style()
              return {
                type: 'rect',
                shape: {
                  x: start[0],
                  y: start[1],
                  width: size[0],
                  height: size[1]
                },
                style: style
              }
            },
            label: {
              show: true,
              position: 'top'
            },
            dimensions: ['from', 'to', 'profit'],
            encode: {
              x: [0, 1],
              y: 2,
              tooltip: [0, 1, 2],
              itemName: 3
            },
            data: data
          }
        ]
      })
      return {
        option,
        theme: '9999',
        autoResize: false
      }
    }
  })
</script>

<style lang="less" scoped>
  .box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    figure {
      display: inline-block;
      position: relative;
      margin: 2em auto;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      box-shadow: 0 0 45px rgba(0, 0, 0, 0.2);
      padding: 30px;

      .echarts {
        width: 40vw;
        min-width: 400px;
        height: 300px;
      }
    }
  }
</style>
