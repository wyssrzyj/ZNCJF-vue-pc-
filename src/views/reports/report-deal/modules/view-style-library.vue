<template>
  <njp-view-detail>
    <template #button> </template>
    <!---------------------------------------------------------- 表单区域 ---------------------------------------------------------->
    <div>
      <el-tabs v-model="state.topTypeValue" class="tabs-to-top" type="card" @tab-click="handleTopTabClick">
        <el-tab-pane v-for="item in state.topTypeList" :key="item.typeCode" :label="item.typeName" :name="item.typeCode" />
      </el-tabs>
    </div>
    <el-form ref="formEl" class="form-row" :model="state.formData" :rules="state.formRules" label-position="top">
      <div v-show="state.topTypeValue === 1">
        <el-row>
          <el-col :span="18">
            <el-row>
              <el-form-item label="款号" prop="styleNo">
                <el-input v-model="state.formData.styleNo" disabled placeholder="无" />
              </el-form-item>
              <el-form-item label="阶段" prop="stage">
                <el-input v-model="state.formData.stage" disabled placeholder="无" />
              </el-form-item>
              <el-form-item label="季节">
                <el-input v-model="state.formData.season" disabled placeholder="无" />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="品牌">
                <el-input v-model="state.formData.brand" disabled placeholder="无" />
              </el-form-item>
              <el-form-item label="品名">
                <el-input v-model="state.formData.productName" disabled placeholder="无" />
              </el-form-item>
              <el-form-item label="性别">
                <el-input v-model="state.formData.gender" disabled placeholder="无" />
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-form-item label="款式图">
              <el-image
                v-if="state.formData.styleUrlList && state.formData.styleUrlList.length"
                style="width: 110px; height: 110px"
                :src="find(state.formData.styleUrlList, { topic: 1 }) ? find(state.formData.styleUrlList, { topic: 1 }).url : state.formData.styleUrlList[0].url"
                :preview-src-list="state.formData.styleUrlList.map(item => item.url)"
                :preview-teleported="true"
              />
              <svg-icon v-else width="110px" height="110px" name="empty_table" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="样办类型">
            <el-input v-model="state.formData.ybType" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="材料配套期">
            <el-date-picker v-model="state.formData.materialMatchPeriod" type="date" value-format="YYYY-MM-DD" disabled placeholder="无" style="width: 100%" />
          </el-form-item>
          <el-form-item label="打样总次数">
            <el-input v-model="state.formData.prooCount" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="样衣件数">
            <el-input v-model="state.formData.total" disabled placeholder="无" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="系列">
            <el-input v-model="state.formData.series" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="业务员">
            <el-input v-model="state.formData.salesman" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="打样工厂">
            <el-input v-model="state.formData.prooFactory" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="销售地区">
            <el-input v-model="state.formData.salesRegion" disabled placeholder="无" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="state.formData.remark" disabled placeholder="无" type="textarea" :autosize="{ minRows: 3 }" />
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
      </div>
      <div v-show="state.topTypeValue === 2">
        <el-row>
          <el-form-item label="参考样衣">
            <el-input v-model="state.formData.referenceSample" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="要求完成日期">
            <el-date-picker v-model="state.formData.plantCompletDate" type="date" value-format="YYYY-MM-DD" disabled placeholder="无" style="width: 100%" />
          </el-form-item>
          <el-form-item label="实际完成日期">
            <el-date-picker v-model="state.formData.actCompletDate" type="date" value-format="YYYY-MM-DD" disabled placeholder="无" style="width: 100%" />
          </el-form-item>
          <el-form-item label="前次缝制人">
            <el-input v-model="state.formData.preStitcher" disabled placeholder="无" />
          </el-form-item>
        </el-row>
      </div>
      <div v-show="state.topTypeValue === 3">
        <el-row>
          <el-form-item label="指定版师">
            <el-input v-model="state.formData.publisher" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="要求完成日期">
            <el-date-picker v-model="state.formData.prPlantCompletDate" type="date" value-format="YYYY-MM-DD" disabled placeholder="无" style="width: 100%" />
          </el-form-item>
          <el-form-item label="实际完成日期">
            <el-date-picker v-model="state.formData.prActCompletDate" type="date" value-format="YYYY-MM-DD" disabled placeholder="无" style="width: 100%" />
          </el-form-item>
          <el-form-item label="制版系数">
            <el-input v-model="state.formData.makingCoe" disabled placeholder="无" />
          </el-form-item>
        </el-row>
        <el-row>
          <!-- <el-form-item label="打样总次数">
            <el-input v-model="state.formData.prTotal" disabled placeholder="无" />
          </el-form-item> -->
          <el-form-item label="该阶段打样次数">
            <el-input v-model="state.formData.prProoTotal" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="是否需要3D">
            <el-select v-model="state.formData.ddd" disabled placeholder="无">
              <el-option v-for="item in state.dddList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="参考版型">
            <el-input disabled placeholder="无" />
          </el-form-item>
          <el-form-item />
        </el-row>
      </div>
      <div v-show="state.topTypeValue === 4">
        <el-row>
          <el-form-item label="工艺岗">
            <el-input v-model="state.formData.technologist" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="明缝针距">
            <el-input v-model="state.formData.openStitchPitch" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="暗缝针距">
            <el-input v-model="state.formData.darkStitchPitch" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="拷边针距">
            <el-input v-model="state.formData.hemStitchDist" disabled placeholder="无" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="水洗方法">
            <el-input v-model="state.formData.washingMethod" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="用衬要求">
            <el-input v-model="state.formData.liningReq" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="核料要求">
            <el-input v-model="state.formData.materialVerifiReq" disabled placeholder="无" />
          </el-form-item>
          <el-form-item label="整烫要求">
            <el-input v-model="state.formData.ironingReq" disabled placeholder="无" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="工艺编码">
            <el-input disabled placeholder="无" />
          </el-form-item>
          <el-form-item />
          <el-form-item />
          <el-form-item />
        </el-row>
      </div>
    </el-form>
    <!---------------------------------------------------------- 列表区域 ---------------------------------------------------------->
    <div>
      <el-tabs v-model="state.typeValue" type="card" @tab-click="handleTabClick">
        <el-tab-pane v-for="item in state.typeList" :key="item.typeCode" :label="item.typeName" :name="item.typeCode" />
      </el-tabs>
    </div>
    <div class="mgt20">
      <el-tabs v-model="state.listTypeValue" type="card">
        <el-tab-pane v-for="item in state.listTypeList" :key="item.typeCode" :label="item.typeName" :name="item.typeCode" />
      </el-tabs>
      <!-------------------------------------------------------- 色组明细 ------------------------------------------------------->
      <njp-table-config v-show="state.listTypeValue === 1" comp-key="colourCell" @on-refactor-query-params="refactorQueryParams" />
      <!-------------------------------------------------------- 内部意见 ------------------------------------------------------->
      <njp-table-config v-show="state.listTypeValue === 2" comp-key="internalOpinions" @on-refactor-query-params="refactorQueryParams">
        <template #type="{ row }">
          <span>{{ store.state.selectOptions.selectOpinionsType[row.type] }}</span>
        </template>
        <template #state="{ row }">
          <span>{{ row.state == 1 ? '是' : '否' }}</span>
        </template>
      </njp-table-config>
      <!-------------------------------------------------------- 客户意见 ------------------------------------------------------->
      <njp-table-config v-show="state.listTypeValue === 3" comp-key="customerOpinions" @on-refactor-query-params="refactorQueryParams" />
      <!-------------------------------------------------------- 开发bom明细 ------------------------------------------------------->
      <njp-table-config v-show="state.listTypeValue === 4" comp-key="kfBom" @on-refactor-query-params="refactorQueryParams" />
      <!--------------------------------------------------------- 工艺bom明细 ------------------------------------------------------->
      <njp-table-config v-show="state.listTypeValue === 5" comp-key="gyBom" @on-refactor-query-params="refactorQueryParams" />
      <!-------------------------------------------------------- 尺寸表 ------------------------------------------------------->
      <!--      <njp-table-config v-show="state.listTypeValue === 6" comp-key="size" @on-refactor-query-params="refactorQueryParams" />-->
      <!-------------------------------------------------------- 印绣花尺寸 ------------------------------------------------------->
      <!--      <njp-table-config v-show="state.listTypeValue === 7" comp-key="yxhSize" @on-refactor-query-params="refactorQueryParams" />-->
      <!-------------------------------------------------------- 拉链尺寸 ------------------------------------------------------->
      <!--      <njp-table-config v-show="state.listTypeValue === 8" comp-key="llSize" @on-refactor-query-params="refactorQueryParams" />-->
      <!-------------------------------------------------------- 扁机尺寸 ------------------------------------------------------->
      <!--      <njp-table-config v-show="state.listTypeValue === 9" comp-key="bjSize" @on-refactor-query-params="refactorQueryParams" />-->
      <!------------------------------------------------------- 充绒量 ------------------------------------------------------->
      <!--      <njp-table-config v-show="state.listTypeValue === 10" comp-key="crl" @on-refactor-query-params="refactorQueryParams" />-->
      <!-------------------------------------------------------- 工艺路线 ------------------------------------------------------->
      <!--      <njp-table-config v-show="state.listTypeValue === 11" comp-key="process" @on-refactor-query-params="refactorQueryParams" />-->
      <!-------------------------------------------------------- 样版文件 ------------------------------------------------------->
      <njp-table-config v-show="state.listTypeValue === 12" comp-key="patternFile" @on-refactor-query-params="refactorQueryParams">
        <template #actionExtBtn="{ row }">
          <njp-download-file v-if="row.url" :url="row.url" :name="row.name" />
        </template>
      </njp-table-config>
      <!-------------------------------------------------------- 3D渲染文件 ------------------------------------------------------->
      <njp-table-config v-show="state.listTypeValue === 13" comp-key="3dFile" @on-refactor-query-params="refactorQueryParams">
        <template #actionExtBtn="{ row }">
          <njp-download-file v-if="row.url" :url="row.url" :name="row.name" />
        </template>
      </njp-table-config>
      <!-------------------------------------------------------- 样衣明细 ------------------------------------------------------->
      <!--      <njp-table-config v-show="state.listTypeValue === 14" comp-key="sampleClothesDetail" @on-refactor-query-params="refactorQueryParams" />-->
      <!-------------------------------------------------------- tp资料 ------------------------------------------------------->
      <njp-table-config v-show="state.listTypeValue === 15" comp-key="tpFile" @on-refactor-query-params="refactorQueryParams">
        <template #actionExtBtn="{ row }">
          <njp-download-file v-if="row.url" :url="row.url" :name="row.name" />
        </template>
      </njp-table-config>
    </div>
  </njp-view-detail>
</template>

<script lang="ts" setup>
  /*---------------------------------------------------------------init--------------------------------------------------------------------------*/
  import { reactive, onMounted, getCurrentInstance } from 'vue'
  import { useRoute } from 'vue-router'
  import { find } from 'lodash'
  import { ElMessage } from 'element-plus'
  import { useStore } from 'vuex'

  const store = useStore()
  const route = useRoute()
  const { proxy } = getCurrentInstance()

  /*---------------------------------------------------------------props----------------------------------------------------------------------*/

  const state = reactive({
    formData: {
      styleNo: '',
      stage: '',
      season: '',
      brand: '',
      productName: '', // 品名   接口不需要传参
      gender: '', // 性别   接口不需要传参
      styleUrlList: [],
      ybType: null,
      materialMatchPeriod: null, // 材料配套期
      prooCount: null,
      total: 0,
      series: null,
      salesman: null,
      prooFactory: null,
      salesRegion: null,
      remark: null,
      referenceSample: null,
      plantCompletDate: null,
      actCompletDate: null,
      preStitcher: null,
      publisher: null,
      prPlantCompletDate: null,
      prActCompletDate: null,
      makingCoe: null,
      prTotal: null,
      prProoTotal: null,
      ddd: null,
      technologist: null,
      openStitchPitch: null,
      darkStitchPitch: null,
      hemStitchDist: null,
      washingMethod: null,
      liningReq: null,
      materialVerifiReq: null,
      ironingReq: null
    },
    topTypeValue: 1,
    topTypeList: [
      {
        typeName: '款式信息',
        typeCode: 1
      },
      {
        typeName: '打样要求',
        typeCode: 2
      },
      {
        typeName: '版师要求',
        typeCode: 3
      },
      {
        typeName: '工艺要求',
        typeCode: 4
      }
    ],
    listTypeValue: 1,
    listTypeList: [
      {
        typeName: '色组明细',
        typeCode: 1
      },
      {
        typeName: '内部意见',
        typeCode: 2
      },
      {
        typeName: '客户意见',
        typeCode: 3
      },
      {
        typeName: '开发bom明细',
        typeCode: 4
      },
      {
        typeName: '工艺bom明细',
        typeCode: 5
      },
      /*{
      typeName: '尺寸表',
      typeCode: 6
    },
    {
      typeName: '印绣花尺寸表',
      typeCode: 7
    },
    {
      typeName: '拉链尺寸',
      typeCode: 8
    },
    {
      typeName: '扁机尺寸',
      typeCode: 9
    },
    {
      typeName: '充绒量',
      typeCode: 10
    },
    {
      typeName: '工艺路线',
      typeCode: 11
    },*/
      {
        typeName: '样版文件',
        typeCode: 12
      },
      {
        typeName: '3D渲染文件',
        typeCode: 13
      },
      // {
      //   typeName: '样衣明细',
      //   typeCode: 14
      // },
      {
        typeName: 'tp资料',
        typeCode: 15
      }
    ],
    dddList: [
      {
        label: '是',
        value: 1
      },
      {
        label: '否',
        value: 0
      }
    ]
  })

  /*---------------------------------------------------------------methods----------------------------------------------------------------------*/

  const refactorQueryParams = e => {
    e.dsrProoNoticeId = route.query.id
    e.dsrStyleId = route.query.dsrStyleId
  }

  const getDetail = () => {
    proxy.$baseService.get(`/njp-dsr-api/dsr/dsrproonotice/${route.query.id}`).then(res => {
      if (res.code !== 0) return ElMessage.error(res.msg)
      state.formData = res.data
    })
  }

  onMounted(() => {
    getDetail()
  })
</script>

<style lang="less" scoped>
  .el-row {
    .el-form-item {
      margin-right: 30px;
    }
  }
</style>
