<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>
        <span style="color: var(--color-primary); font-size: 1.3rem">打印设置</span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-divider border-style="dotted" />
    <div class="allmain">
      <div class="printmain">
        <div class="choose">
          <p class="title">选项</p>
          <div class="main" style="overflow: hidden">
            <el-checkbox-group v-model="checkList" text-color="#E02020" fill="#E02020" @change="choosechange()">
              <!-- 使用了el-checkbox-group就使用list作为item是否被选的判断 -->
              <draggable :list="alllableList" @change="itemchange">
                <div v-for="item in alllableList" :key="item" class="chooseitem" style="cursor: move">
                  <el-checkbox :label="item" size="large" />
                </div>
              </draggable>
              <!-- <div class="mustchoose">
                <div class="chooseitem">
                  <el-checkbox label="二维码" size="large" @change="ifCode"></el-checkbox>
                </div>
                <div class="chooseitem">
                  <el-checkbox label="备注" size="large" disabled></el-checkbox>
                </div>
              </div> -->
            </el-checkbox-group>
          </div>
        </div>

        <div class="preview">
          <p class="title">预览</p>
          <div class="main previewmain" style="overflow: hidden">
            <div class="previewhead"></div>

            <div v-for="item in checkList" :key="item" class="previewitem">
              <span v-if="item != '二维码'"> {{ item }}:{{ getvaluebyitem(item) }}</span>
            </div>

            <div v-if="checkList.indexOf('二维码') != -1" class="erweima">
              <vue-qr
                :logo-src="qrImage"
                :text="testerweimavalue"
                :size="codeSize"
                margin="0"
                logo-scale="0.25"
                binarize="255"
              />

              <!-- <qrcode-vue :value="testerweimavalue" :size="codeSize" level="H" class="img" /> -->
            </div>
            <div class="beizhu">
              <el-input v-model="textarea" placeholder="前片" />
            </div>
          </div>
        </div>
      </div>
      <p style="color: rgb(183, 183, 172)">拖动上下排序</p>
      <div class="flex defaultPaper">
        <div>默认纸张：</div>
        <div>
          <el-select v-model="ticketValue" class="m-2" placeholder="请选择纸张" @change="changePaper">
            <el-option v-for="item in paperOptions" :key="item" :value="item.value" :label="item.comment" />
          </el-select>
        </div>
      </div>
      <div class="save">
        <el-button type="primary" size="large" @click="save()">保存设置</el-button>
        <el-button type="primary" size="large" @click="toDetail()">配置</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { VueDraggableNext } from 'vue-draggable-next'
  import { defineComponent, reactive, toRefs, getCurrentInstance, onMounted, computed } from 'vue'
  // import baseService from '@/service/baseService'
  import useView from '@/hooks/useView'
  // import QrcodeVue from "qrcode.vue";
  import vueQr from 'vue-qr/src/packages/vue-qr.vue'
  // import { getSize } from "xe-utils";
  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
      vueQr
    },
    setup() {
      const { proxy }: any = getCurrentInstance()
      const state = reactive({
        checkList: [],
        alllableList: [],
        list: [],
        textarea: '',
        ticketValue: 1,
        ticketPapers: '',
        papers: [] as any,
        qrImage: 'https://ycpg-setting.oss-cn-hangzhou.aliyuncs.com/image/qrl_logo.png',
        paperOptions: [
          { name: 'ticket_size', comment: '4*6cm单排', value: 1, sort: 0, selected: 0 },
          { name: 'ticket_size', comment: '>4*6cm单排', value: 2, sort: 1, selected: 0 },
          { name: 'ticket_size', comment: '4*6cm双排', value: 3, sort: 2, selected: 0 },
          { name: 'ticket_size', comment: '>4*6cm双排', value: 4, sort: 3, selected: 0 }
        ] as any,
        isupdate: 0,
        id: '',
        codeSize: 80,
        testerweimavalue: '测试value生成二维码',
        getvaluebyitem: computed(() => (item: any) => {
          let count = ''
          proxy.list.forEach(function (x: any) {
            // 找到item对应的value并且拿出来
            if (x.comment == item) count = x.value
          })
          return count
        }),
        getSize() {
          // 150-80
          // console.log();
          // console.log(state.alllableList);

          let num: any = proxy.alllableList.length - proxy.checkList.length
          if (num <= 2) {
            state.codeSize = 80
          }
          if (num < 4 && num > 2) {
            state.codeSize = 100
          }
          if (num >= 4 && num <= 7) {
            state.codeSize = 120
          }
          if (num > 7 && num <= 10) {
            state.codeSize = 150
          }
        },
        choosechange() {
          //进入前先把所有的标签置空
          proxy.alllableList.forEach(function (x: any) {
            proxy[x] = false
          })
          // 遍历得到所有的lable值，并把proxy中的值置为true
          proxy.checkList.forEach(function (x: any) {
            proxy[x] = true
          })
          this.getSize()
        },
        itemchange() {
          proxy.checkList = proxy.arrsort(proxy.alllableList, proxy.checkList)
          // proxy.checkList.push("二维码"); //固定项添加
          // proxy.checkList.push("备注");
          // console.log(proxy.checkList);
        },
        // 不全等数组相对排序（非重复,字符情况浅拷贝）
        arrsort(arrall: any, arrless: any) {
          const arrfinall: any[] = []
          arrall.forEach(function (x: any) {
            if (proxy.arrhaschar(arrless, x)) {
              arrfinall.push(x)
            }
          })

          return (arrless = [...arrfinall])
        },
        // 检测数组中是否存在某一项
        arrhaschar(arr: any, char: any) {
          return arr.some(function (x: any) {
            return x == char
          })
        },
        // 保存设置
        save() {
          // 最开始先做一个循环把所有的selected设置为0
          proxy.list.forEach(function (alllablex: any) {
            alllablex.selected = 0
          })
          proxy.list.forEach(function (alllablex: any, alllableindex: any) {
            let flag = 0
            proxy.checkList.forEach(function (checkx: any, checkindex: any) {
              if (checkx == alllablex.comment) {
                alllablex.ord = checkindex
                alllablex.selected = 1
                flag = 1
              }
            })
            if (flag == 0) {
              alllablex.ord = alllableindex + 9722 //未被选中的排序加一个大数和自身序号
            }
          })
          let list = JSON.stringify(proxy.list)

          if (proxy.isupdate) {
            // 走修改接口
            baseService
              .put('/ycgp/tenantsetting', { print: list, id: proxy.id, ticketSize: state.ticketPapers })
              .then(res => {
                if (res.code !== 0) {
                  return proxy.$message.error(res.msg)
                }
                proxy.$message({
                  message: proxy.$t('prompt.success'),
                  type: 'success',
                  duration: 2000
                })
              })
          } else {
            // 走保存接口
            baseService.post('/ycgp/tenantsetting', { print: list, ticketSize: state.ticketPapers }).then(res => {
              if (res.code !== 0) {
                return proxy.$message.error(res.msg)
              }
              proxy.$message({
                message: proxy.$t('prompt.success'),
                type: 'success',
                duration: 2000
              })
            })
          }
        },
        toDetail() {
          proxy.$router.push('/ycgp/setprint/print?_mt=配置打印')
        }
      })
      onMounted(() => {
        init()
        state.getSize()
      })
      const init = () => {
        baseService.get('/ycgp/tenantsetting/getSetting').then(res => {
          if (res.code !== 0) {
            return proxy.$message.error(res.msg)
          }
          proxy.id = res.data.id
          if (res.data.print) {
            proxy.list = JSON.parse(res.data.print)
            proxy.isupdate = 1
          } else {
            proxy.list = JSON.parse(res.data.print0)
          }

          // 排序
          function compare(property: any) {
            return function (a: any, b: any) {
              let value1 = a[property]
              let value2 = b[property]
              return value1 - value2
            }
          }

          proxy.list.sort(compare('ord'))
          proxy.list.forEach(function (x: any) {
            // 第一步   forEach拿到alllableList集合
            proxy.alllableList.push(x.comment)
            // 第二部  forEach拿到checkList数据集合
            if (x.selected) {
              if (proxy.isupdate) {
                proxy.checkList.push(x.comment)
              }
            }
          })
          if (res.data.ticketSize) {
            state.papers = JSON.parse(res.data.ticketSize)
          }

          state.papers.forEach((item: any) => {
            if (item.selected == 1) {
              state.ticketValue = Number(item.value)
            }
          })
        })
      }
      const changePaper = (val: any) => {
        state.ticketPapers = ''
        state.paperOptions.forEach((item: any) => {
          if (item.value == val) {
            item.selected = 1
          } else {
            item.selected = 0
          }
        })
        state.ticketPapers = JSON.stringify(state.paperOptions)
      }

      return { ...useView(state), ...toRefs(state), init, changePaper }
    }
  })
</script>
<style lang="less" scoped>
  .save :deep(.el-button) {
    margin-left: 150px !important;
    width: 200px !important;
  }

  .printmain {
    display: flex;
    margin-bottom: 20px;

    .main {
      width: 200px;
      height: 400px;
      border: 2px solid rgb(183, 183, 172);
      padding: 5px;
    }

    .title {
      font-size: 1.7rem;
    }

    .preview {
      margin-left: 60px;
    }

    .chooseitem {
      margin: 10px;
      flex-shrink: 0;
      border-bottom: 2px dashed rgb(183, 183, 172);
    }

    .previewhead {
      width: 50%;
      height: 30px;
      border: 2px solid rgb(183, 183, 172);
      margin: 0 auto;
      margin-bottom: 20px;
      border-radius: 30px;
      flex-shrink: 0;
    }

    .beizhu {
      border-top: 2px dashed rgb(183, 183, 172);
      height: 50px;
      flex-shrink: 0;

      :deep(.el-input__inner) {
        border: 0;
        font-size: 2rem;
      }
    }

    .erweima {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      max-height: 250px;
      min-height: 10px;
      max-width: 100%;
      margin: 10px;
      align-items: center;

      .img {
        height: 100%;
      }
    }
  }

  .previewitem {
    margin: 0.5px;
  }

  .previewmain {
    display: flex;
    flex-direction: column;
    margin: 10px;
    padding: 5px 15px !important;
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .defaultPaper {
    margin-bottom: 10px;
  }
</style>
