<template>
  <!-- 非票列表 -->
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" @click="printAll">批量打印</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="state.dataList" border style="width: 100%" class="tickettable" :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
      <el-table-column label="二维码" width="80" align="center">
        <template #header>
          <div class="item">
            <el-checkbox v-model="state.allCheck" size="small" @change="selectAll" />
          </div>
        </template>
        <template #default="scope">
          <div>
            <el-checkbox v-model="scope.row.check" size="small" />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="工票信息" align="center">
        <template #default="scope">
          <div class="produce_info">
            <div class="info_item">
              <div><span class="title">款名：</span>{{ scope.row.styleName ? scope.row.styleName : '-' }}</div>
              <div><span class="title">数量：</span>{{ scope.row.num }}</div>

              <div><span class="title">颜色：</span>{{ scope.row.color }}</div>
              <div><span class="title">缸号：</span>{{ scope.row.batchNo ? scope.row.batchNo : '无' }}</div>
              <div>
                <span v-show="scope.row.serialNumber" class="title">流水号：</span>
                {{ scope.row.serialNumber ? scope.row.serialNumber : '无' }}
              </div>
            </div>
            <div class="info_item">
              <div><span class="title">款号：</span>{{ scope.row.styleCode ? scope.row.styleCode : '-' }}</div>
              <div><span class="title">扎号：</span>{{ scope.row.packageNo }}</div>
              <div><span class="title">尺码：</span>{{ scope.row.size }}</div>
              <div><span class="title">床号：</span>{{ scope.row.bedNo ? scope.row.bedNo : '无' }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('handle')" width="99" fixed="right" align="center">
        <template #default="scope">
          <div class="button_group">
            <el-button type="primary" @click="editTicket(scope.row)">编辑</el-button>
            <el-button type="primary" @click="printSingle(scope.row)"> 打印 </el-button>

            <el-button type="danger" @click="deleteTicket(scope.row.id)">
              {{ $t('delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="state.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="state.limit"
      :total="state.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"
    />
    <el-dialog v-model="state.ticketVisible" title="工票改数" width="20%" :show-close="false">
      <div class="dialog">
        <div class="close" @click="closeTicket">
          <svg t="1646201856818" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2035" width="30" height="30">
            <path d="M872.802928 755.99406 872.864326 755.99406 872.864326 755.624646Z" p-id="2036" fill="#707070" />
            <path
              d="M927.846568 511.997953c0-229.315756-186.567139-415.839917-415.838893-415.839917-229.329059 0-415.85322 186.524161-415.85322 415.839917 0 229.300406 186.524161 415.84094 415.85322 415.84094C741.278405 927.838893 927.846568 741.29836 927.846568 511.997953M512.007675 868.171955c-196.375529 0-356.172979-159.827125-356.172979-356.174002 0-196.374506 159.797449-356.157629 356.172979-356.157629 196.34483 0 356.144326 159.783123 356.144326 356.157629C868.152001 708.34483 708.352505 868.171955 512.007675 868.171955"
              p-id="2037"
              fill="#707070"
            />
            <path
              d="M682.378947 642.227993 553.797453 513.264806 682.261267 386.229528c11.661597-11.514241 11.749602-30.332842 0.234337-41.995463-11.514241-11.676947-30.362518-11.765975-42.026162-0.222057L511.888971 471.195665 385.223107 344.130711c-11.602246-11.603269-30.393217-11.661597-42.025139-0.059352-11.603269 11.618619-11.603269 30.407544-0.059352 42.011836l126.518508 126.887922L342.137823 639.104863c-11.662621 11.543917-11.780301 30.305213-0.23536 41.96988 5.830799 5.89015 13.429871 8.833179 21.086248 8.833179 7.53972 0 15.136745-2.8847 20.910239-8.569166l127.695311-126.311801L640.293433 684.195827c5.802146 5.8001 13.428847 8.717546 21.056572 8.717546 7.599072 0 15.165398-2.917446 20.968567-8.659217C693.922864 672.681586 693.950494 653.889591 682.378947 642.227993"
              p-id="2038"
              fill="#707070"
            />
          </svg>
        </div>
        <el-divider />
        <div class="content">
          <div class="title">
            <div class="text">款名：</div>
            <div>{{ state.styleName }}</div>
          </div>
          <div class="title">
            <div class="text">款号：</div>
            <div>{{ state.styleNo }}</div>
          </div>
          <div class="title">
            <div class="text">工票：</div>
            <div>{{ state.ticketNo }}</div>
          </div>
          <div class="title">
            <div class="text">颜色：</div>
            <div>{{ state.color }}</div>
          </div>
          <div class="title">
            <div class="text">尺码：</div>
            <div>{{ state.size }}</div>
          </div>
          <div class="title">
            <div class="text">扎号：</div>
            <div>{{ state.pacNo }}</div>
          </div>
          <div class="ticketNum">
            <div class="text">数量：</div>
            <div>
              <el-input v-model.number="state.ticketNum" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="updadeTicket">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="state.codeVisible" width="30%" :show-close="false">
      <div class="center">
        <vue-qr :logo-src="qrImage" :text="state.showCode" style="height: 100%" margin="0" :size="200" logo-scale="0.2" />
        <!-- <qrcode-vue :value="showCode" :size="200" level="H" class="img" /> -->
        <div>&nbsp;</div>
        <div>{{ state.showCode }}</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button style="text-align: center" @click="state.codeVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance, onMounted } from 'vue'
  import vueQr from 'vue-qr/src/packages/vue-qr.vue'
  import qrImage from '@/components/img/jack.png'
  import { useRoute } from 'vue-router'
  import './index.less'
  import { isEmpty } from 'lodash'

  const route = useRoute()

  const { proxy }: any = getCurrentInstance()

  const state = reactive({
    deleteURL: '/ycgp/ycgpticket',
    allCheck: false,
    page: 1,
    limit: 5,
    total: 0,
    qrImage: qrImage,
    dataList: [] as any,
    ticketVisible: false,
    detailVisible: false,
    detailData: [] as any,
    detailNum: 0,
    ifData: false,
    codeVisible: false,
    dataForm: {
      keyWord: ''
    },
    productionNo: '',
    styleName: '',
    styleNo: '',
    ticketNo: '',
    color: '',
    size: '',
    pacNo: '',
    ticketNum: 0,
    ticketId: '',
    styleId: '',
    showCode: '',
    showTicket: '',
    cutId: '',
    editCutId: '', //正在修改工票的cutId
    productionId: ''
  })

  onMounted(() => {
    state.cutId = proxy.$route.query.cutId
  })
  const init = () => {
    let data = {
      bedPlanId: route.query.id
    }
    proxy.$baseService.get('/jack-ics-api/ticket/listTicketByBed', data).then((res: any) => {
      if (res.code === 0) {
        state.total = res.data.total
        state.dataList = res.data
        if (!isEmpty(state.dataList)) {
          state.dataList.forEach((item: any) => {
            item['check'] = false
          })
        }
      }
    })
  }

  init()

  const pageSizeChangeHandle = (val: number) => {
    state.page = 1
    state.limit = val
  }
  // 分页, 当前页
  const pageCurrentChangeHandle = (val: number) => {
    state.page = val
  }
  //打印
  const printSingle = (row: any) => {
    let ids = [row.id]
    proxy.$routerToView({
      path: `/daFei/cutting/view-dialog-cuttingPreview`,
      query: {
        _mt: '裁剪打印',
        type: 'idList',
        id: route.query.id,
        idList: ids
      }
    })
  }
  // 多选打印
  const printAll = () => {
    let array = [] as any
    state.dataList.forEach((item: any) => {
      if (item.check == true) {
        array.push(item.id)
      }
    })
    if (array.length == 0) {
      proxy.$message.error('未选择工票！')
      return false
    }

    proxy.$routerToView({
      path: `/daFei/cutting/view-dialog-cuttingPreview`,
      query: {
        _mt: '裁剪打印',
        type: 'idList',
        id: route.query.id,
        idList: array
      }
    })
  }
  const deleteTicket = (val: any) => {
    proxy
      .$confirm('确认删除这个工票吗？')
      .then(() => {
        let arr: any = []
        arr.push(val)
        baseService.delete('/fei/ticket', arr).then(res => {
          if (res.code !== 0) {
            return proxy.$message.error(res.msg)
          }
          proxy.$message.success('删除成功！')

          getDataList()
        })
      })
      .catch(() => {
        proxy.$message('操作取消！')
      })
  }

  // 全选
  const selectAll = () => {
    if (state.allCheck == true) {
      state.dataList.forEach((item: any) => {
        item.check = true
      })
    } else {
      state.dataList.forEach((item: any) => {
        item.check = false
      })
    }
  }
  const editTicket = (row: any) => {
    state.productionNo = row.billNo
    state.styleName = row.styleName
    state.styleNo = row.styleNo
    state.ticketNo = row.ticketNo
    state.color = row.color
    state.size = row.size
    state.pacNo = row.packageNo
    state.ticketNum = row.num
    state.ticketId = row.id
    state.styleId = row.styleId
    state.editCutId = row.cutId
    state.productionId = row.productionId
    state.ticketVisible = true
  }
  const closeTicket = () => {
    state.ticketVisible = false
  }
  const updadeTicket = () => {
    let obj = { ticketId: '', num: 0, cutId: '', productionId: '' }
    obj.ticketId = state.ticketId
    obj.cutId = state.editCutId
    obj.num = state.ticketNum
    obj.productionId = state.productionId
    // baseService.post('/fei/ticket/updateNum', obj).then(res => {
    //   if (res.code !== 0) {
    //     return proxy.$message.error(res.msg)
    //   }
    //   proxy.$message.success('修改成功')
    //   state.ticketVisible = false
    //   getDataList()
    // })
  }


</script>

<style lang="less" scoped>
  .dialog {
    .content {
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .ticketNum {
        margin: 5px 0;
        display: flex;

        .text {
          width: 60px;
          height: 32px;
          line-height: 32px;
          text-align: right;
        }

        :deep(.el-input__inner) {
          text-align: center;
          width: 50px;
          padding: 0;
        }
      }

      .title {
        display: flex;

        .text {
          width: 60px;
          text-align: right;
        }

        margin: 10px 0;
      }
    }

    :deep(.el-divider--horizontal) {
      margin: 0;
      margin-bottom: 10px;
    }
  }

  // 清除element按钮默认margin
  .button_group {
    height: 119px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
  }
  :deep(.el-dialog__body) {
    padding: 0;
  }
  :deep(.el-dialog__footer) {
    text-align: center;
  }
  .produce_info {
    width: 200px;
    margin: 0 auto;
  }
</style>
