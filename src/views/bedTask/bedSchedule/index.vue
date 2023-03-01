<template>
  <njp-table-config ref="styleLibListEl" :query-form-data="state.queryFormData" @selection-change="handleSelectionChange">
    <template #queryFormItem>
      <el-form-item label="生产订单" prop="produceOrderCode">
        <el-input v-model="state.queryFormData.produceOrderCode" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="床次计划号" prop="bedPlanNo">
        <el-input v-model="state.queryFormData.bedPlanNo" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="款式编号" prop="styleCode">
        <el-input v-model="state.queryFormData.styleCode" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="statu">
        <el-select v-model="state.queryFormData.statu" clearable filterable>
          <el-option v-for="item in state.statu" :key="item.name" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
    </template>

    <template #operationExtBtn>
      <el-button type="primary" style="order: 3" @click="handleClick(false, null, '新增床次计划')">新增</el-button>
      <el-button type="primary" style="order: 3" @click="importMethod">导入</el-button>
      <el-button type="success" style="order: 3" @click="examine">审核</el-button>
      <el-button type="danger" style="order: 3" @click="mov">删除</el-button>
    </template>

    <template #styleImage="{ row }">
      <ImgModular :img="row.styleImage" />
    </template>

    <template #shelfLength="{ row }">
      <!-- <span>{{ row.shelfLength.toFixed(0) }} </span> -->
    </template>
    <template #spreadClothLength="{ row }">
      <!-- <span>{{ row.spreadClothLength.toFixed(0) }} </span> -->
    </template>

    <template #statu="{ row }">
      <el-tag v-if="row.statu" class="ml-2" :type="tagType.get(row.statu)"> {{ bedScheduleType.get(row.statu) }}</el-tag>
    </template>

    <template #actionExtBtn="{ row }">
      <el-button link type="primary" style="order: 3" @click="handleClick(true, row, '查看床次计划')">查看</el-button>
      <el-button v-if="row.statu === 1" link type="primary" style="order: 3" @click="handleClick(false, row, '编辑床次计划')">编辑</el-button>
      <el-button v-if="row.statu === 2" link type="primary" style="order: 3" @click="revoke(row)">撤销</el-button>
    </template>
  </njp-table-config>

  <!-- 删除 -->
  <el-dialog v-model="state.dialogVisible" title="提示" width="30%">
    <span>确定要删除该数据吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 导出  -->
  <el-dialog v-if="state.export.importType" v-model="state.export.importType" :draggable="false" :close-on-click-modal="false" title="导入" width="400px">
    <ImportDialog :export="state.export" :get-list="getList" :confirm="confirm" />
    <template #footer>
      <el-button style="order: 3" @click="exportEvents(false)">取消</el-button>
      <el-button type="primary" style="order: 3" @click="exportEvents(true)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { ElMessage } from 'element-plus'
  import { isEmpty } from 'lodash'

  import { bedScheduleType, tagType } from '@/components/conifgs'
  import ImgModular from '@/components/imgModular/index.vue'
  import ImportDialog from '@/components/dialog-import-table/index.vue'
  import { exportData } from './modules/conifgs'
  const { proxy } = getCurrentInstance() as any

  const styleLibListEl = ref()

  const state: any = reactive({
    dialogVisible: false, //删除弹窗
    //导出
    export: {
      type: 'bedSchedule',
      data: exportData,
      width: '1500px',
      importType: false,
      list: [],
      template: '/template/床次计划模板.xlsx', //引入的是V1的

      interface: '/jack-ics-api/bedPlan/import'
    },
    //打印状态
    printType: false,
    workType: false,

    row: {},
    dialogType: true,
    dialogTableVisible: false,
    dialogTitle: '查看床次计划',
    statu: [
      { name: '未审核', value: '1' },
      { name: '已审核', value: '2' },
      { name: '进行中', value: '3' },
      { name: '已完成', value: '4' }
    ],

    queryFormData: {
      produceOrderCode: '',
      bedPlanNo: '',
      styleCode: '',
      statu: ''
    },
    title: '上传',
    fileList: [],
    rowData: {},
    limit: 6,
    ids: []
  })
  //刷新数据
  const refreshTable = () => {
    styleLibListEl.value.refreshTable()
  }

  //清空选中项
  const onFormQuery = (params = {}) => {
    styleLibListEl.value.onFormQuery()
  }
  //撤销
  const revoke = (row: any) => {
    proxy.$baseService.post('/jack-ics-api/bedPlan/cancel', { id: row.id }).then((res: any) => {
      if (res.code === 0) {
        ElMessage({
          message: '撤销成功',
          type: 'success'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
      refreshTable()
    })
  }
  //新增、编辑、查看
  const handleClick = (type: any, row: any, title: any) => {
    state.row = row
    toViewFun(row, type, title)
  }

  //跳转详情
  const toViewFun = (row: any, type: any, title: any) => {
    if (row) {
      proxy.$routerToView({
        path: `/bedTask/bedSchedule/view-dialog-content`,
        // /bedTask/bedSchedule/view-dialog-content
        query: {
          _mt: title,
          id: row.id,
          typeValue: type,

          bedPlanId: row.bedPlanId,
          deviceId: row.deviceId,
          spreadClothLevel: row.spreadClothLevel
        }
      })
    } else {
      proxy.$routerToView({
        path: `/bedTask/bedSchedule/view-dialog-content`,
        query: {
          _mt: title,
          typeValue: type
        }
      })
    }
  }

  //审核
  const examine = () => {
    if (!isEmpty(state.ids)) {
      proxy.$baseService.post('/jack-ics-api/bedPlan/audit', { idList: Object.values(state.ids) }).then((res: any) => {
        if (res.code === 0) {
          state.ids = [] //清空选中项
          ElMessage({
            message: '审核成功',
            type: 'success'
          })
          refreshTable()
          onFormQuery()
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    } else {
      ElMessage({
        message: '至少选择一个',
        type: 'warning'
      })
    }
  }

  //删除
  const mov = () => {
    if (!isEmpty(state.ids)) {
      state.dialogVisible = true
    } else {
      ElMessage({
        message: '至少选择一个',
        type: 'warning'
      })
    }
  }
  const confirmDelete = () => {
    proxy.$baseService.delete('/jack-ics-api/bedPlan/delete', state.ids).then((res: any) => {
      if (res.code === 0) {
        state.ids = [] //清空选中项
        onFormQuery()
        ElMessage({
          message: '删除成功',
          type: 'success'
        })
        state.dialogVisible = false
        refreshTable()
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }

  //关闭 弹窗
  // const close = () => {
  //   state.dialogTableVisible = false
  //   refreshTable()
  // }
  //------------------------------导出-------------------------------
  //打开弹窗-【导出】
  const importMethod = () => {
    state.export.importType = true
  }

  //获取导出数据
  const getList = (e: any) => {
    state.export.list = e
  }

  const confirm = () => {
    exportEvents(true)
  }

  //关闭弹窗-【导出】-保存
  const exportEvents = (type: any) => {
    if (type === true) {
      let saveData = state.export.list
      let data: any = []
      saveData.forEach((item: any) => {
        data.push({
          styleImage: !isEmpty(item.styleUrlList) ? item.styleUrlList[0].url : null, //款图
          name: item.name,
          sn: item.sn,
          spec: item.spec,
          ...item
        })
      })
      //处理唛架图
      data.map((item: any) => {
        let shelfFile = item.shelfImageList[0]
        if (!isEmpty(shelfFile)) {
          const { heigh, width, sumArea } = shelfFile.response.data
          item.shelfFileName = shelfFile.name
          item.shelfFileUrl = shelfFile.response.data.shelfFileUrl
          item.shelfImage = shelfFile.url

          let useRate = (sumArea / (heigh * Number(Number(width) + 30))) * 100
          //处理唛架图问题
          ;(item.shelfWidth = heigh), //唛架门幅
            (item.shelfLength = width), //唛架长度
            (item.spreadClothLength = Number(width) + 30), //铺布长度1
            (item.useRate = useRate)
        }
      })
      //处理排麦比例的返回值
      data.map((item: any) => {
        if (!isEmpty(item.numList)) {
          //英文逗号全部转中文逗号
          item.numList.map((v: any) => {
            v.shelfScale = v.shelfScale.replaceAll(',', '，')
          })
        }
      })
      // data.map((item: any) => {
      //   let str = item.shelfScale.replaceAll(',','，');
      //   let shelfScale = str.split('，')

      //   let shelfScaleDome: any = []
      //   let levelClothSum = 0
      //   let bedSum = 0

      //   if (!isEmpty(shelfScale)) {
      //     shelfScale.map((v: any) => {
      //       let index = Demo(v)
      //       shelfScaleDome.push(v.slice(index + 1))
      //     })
      //   }

      //   if (!isEmpty(shelfScaleDome)) {
      //     shelfScaleDome.forEach((i: any) => {
      //       levelClothSum += Number(i)
      //       bedSum += i * item.spreadClothLevel
      //     })
      //   }
      //   item.levelClothSum = levelClothSum
      //   item.bedSum = bedSu m
      // })

      // numList -》shelfScale
      if (!isEmpty(data)) {
        proxy.$baseService.post('/jack-ics-api/bedPlan/saveBatch', { bedPLanList: data }).then((res: any) => {
          refreshTable()
          state.export.importType = false
          ElMessage({
            message: '添加成功',
            type: 'success'
          })
        })
      } else {
        ElMessage({
          message: '未导入模板',
          type: 'warning'
        })
      }
    }
    if (type === false) {
      state.export.importType = false
    }
  }

  //选中id
  const handleSelectionChange = (val: any) => {
    if (!isEmpty(val)) {
      let ids: any = []
      val.map((item: any) => {
        ids.push(item.id)
      })
      state.ids = ids
    }
  }
</script>
