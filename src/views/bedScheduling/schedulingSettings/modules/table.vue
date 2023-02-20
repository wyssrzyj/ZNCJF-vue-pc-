<!--
 * @Author: lyj
 * @Date: 2022-08-10 14:58:02
 * @LastEditTime: 2023-02-20 15:13:01
 * @Description: 
 * @LastEditors: lyj
-->
<template>
  <div class="table">
    <el-table
      ref="singleTableRef"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      :data="state.tableData"
      :height="350"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column property="produceOrderCode" label="床次" />
      <el-table-column property="bedPlanNo" label="面料" />
      <el-table-column property="styleName" label="主料/辅料" />
      <el-table-column property="styleCode" label="计划层数" />
      <el-table-column property="styleBedNo" label="计划件数" />

      <el-table-column property="customName" label="排唛比例">
        <template #default="{ row }">
          <img :src="edit" alt="" class="schedulingSettings-edit" @click="shippingMarks(row)" />
        </template>
      </el-table-column>
      <el-table-column property="customName" label="计划开始时间" />
      <el-table-column property="customName" label="计划结束时间" />
      <el-table-column property="customName" label="铺布任务">
        <template #default="scope">
          <div class="tableContainer">
            <div class="check-customName">
              <div class="innerCircle"></div>
            </div>
            <div :class="scope.row.cloth === true ? 'progress-customName' : 'progress-customName-no'"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="cloth" label="贴标任务">
        <template #default="scope">
          <div class="tableContainer">
            <div :class="scope.row.cloth === true ? 'progress' : 'progress-no'"></div>
            <div :class="scope.row.cloth === true ? 'check' : 'unchecked'">
              <div v-if="scope.row.cloth === true" class="innerCircle"></div>
            </div>
            <div :class="scope.row.labeling === true || scope.row.cropping === true ? 'progress' : 'progress-no'"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="labeling" label="裁剪任务">
        <template #default="scope">
          <div class="tableContainer">
            <div :class="scope.row.labeling === true ? 'progress-cropping' : 'progress-cropping-no'"></div>
            <div :class="scope.row.labeling === true ? 'check-cropping' : 'check-cropping-no'">
              <div v-if="scope.row.labeling === true" class="innerCircle"></div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 排唛比例 -->
  <el-dialog v-if="state.dialogTableVisible" v-model="state.dialogTableVisible" :close-on-click-modal="false" :draggable="false" title="排唛比例" width="1200px">
    <PopModule :type="false" :operation="operation" :form="state.form" />
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, getCurrentInstance, onMounted } from 'vue'
  import { isEmpty } from 'lodash'
  import { ElMessage } from 'element-plus'

  import edit from '@/components/icon/edit.png'
  import PopModule from './dialog-forms.vue'

  import './table.less'
  const { proxy } = getCurrentInstance() as any

  const state: any = reactive({
    tableData: [],
    dialogTableVisible: false,
    form: {} //排麦比例需要的数据
  })

  const init = () => {
    let a = [
      {
        color: 'B00标准白',
        sizeAndAmountList: [
          {
            size: 'L',
            levelClothSum: 3
          },
          {
            size: 'XL',
            levelClothSum: 2
          },
          {
            size: 'XXL',
            levelClothSum: 2
          }
        ],
        spreadClothLevel: 20,
        rowFlag: 1,
        unique: 'B00标准白0'
      },
      {
        color: 'B01米白',
        sizeAndAmountList: [
          {
            size: 'L',
            levelClothSum: 3
          },
          {
            size: 'XL',
            levelClothSum: 2
          },
          {
            size: 'XXL',
            levelClothSum: 2
          }
        ],
        spreadClothLevel: 20,
        rowFlag: 2,
        unique: 'B01米白1'
      },
      {
        color: 'B02浅黄',
        sizeAndAmountList: [
          {
            size: 'L',
            levelClothSum: 3
          },
          {
            size: 'XL',
            levelClothSum: 2
          },
          {
            size: 'XXL',
            levelClothSum: 2
          }
        ],
        spreadClothLevel: 20,
        rowFlag: 3,
        unique: 'B02浅黄2'
      },
      {
        color: 'B03橘黄',
        sizeAndAmountList: [
          {
            size: 'L',
            levelClothSum: 3
          },
          {
            size: 'XL',
            levelClothSum: 2
          },
          {
            size: 'XXL',
            levelClothSum: 2
          }
        ],
        spreadClothLevel: 20,
        rowFlag: 4,
        unique: 'B03橘黄3'
      }
    ]
    proxy.$baseService.get('/jack-ics-api/index/bedTask').then((res: any) => {
      let demoList = [
        {
          fabricColor: 'B01米白,B02浅黄,B00标准白,B03橘黄',
          shelfList: a,
          sizeList: [
            {
              size: 'L'
            },
            {
              size: 'XL'
            },
            {
              size: 'XXL'
            }
          ],
          id: '1623853129071763457',
          styleImage: '',
          styleCode: '1125',
          styleName: '25号梭织',
          produceOrderCode: '68553',
          customName: '',
          bedPlanNo: 'BP-202211250899',
          styleBedNo: '1',
          fabricCode: 'S002',
          fabricName: '梭织面料',
          overViewList: '1,2,3',
          finishList: null,
          nextTaskType: null
        },
        {
          id: '1623853129071763457',
          shelfList: a,
          sizeList: [
            {
              size: 'L'
            },
            {
              size: 'XL'
            },
            {
              size: 'XXL'
            }
          ],
          styleImage: '',
          styleCode: '1125',
          styleName: '25号梭织',
          produceOrderCode: '68553',
          customName: '',
          bedPlanNo: 'BP-202211250899',
          styleBedNo: '1',
          fabricCode: 'S002',
          fabricName: '梭织面料',
          fabricColor: '黑，绿',
          overViewList: '1,2,3',
          finishList: '1',
          nextTaskType: 1
        },
        {
          shelfList: a,
          sizeList: [
            {
              size: 'L'
            },
            {
              size: 'XL'
            },
            {
              size: 'XXL'
            }
          ],
          id: '1623853129071763457',
          styleImage: '',
          styleCode: '1125',
          styleName: '25号梭织',
          produceOrderCode: '68553',
          customName: '',
          bedPlanNo: 'BP-202211250899',
          styleBedNo: '1',
          fabricCode: 'S002',
          fabricName: '梭织面料',
          fabricColor: '黑，绿',
          overViewList: '1,2,3',
          finishList: '1,2',
          nextTaskType: 1
        }
      ]
      if (!isEmpty(res.data)) {
        // state.total = res.data.total
        state.total = demoList
        //添加任务状态
        // let list = res.data.list
        let list = demoList
        if (!isEmpty(list)) {
          list.map((item: any) => {
            if (item.finishList) {
              item.finishList = item.finishList.split(',')

              if (item.finishList.includes('1')) {
                item.cloth = true
              }
              if (item.finishList.includes('2')) {
                item.labeling = true
              }
              //
              // if (item.finishList.includes('3')) {
              //   item.cropping = true
              // }
            }
          })
        }
        state.tableData = list
      }
    })
  }
  //弹窗展示
  const shippingMarks = (e: any) => {
    proxy.$baseService.get('/jack-ics-api/bedPlan/get', { id: e.id }).then((res: any) => {
      state.form = res.data
      state.dialogTableVisible = true
    })
  }

  const formattingData = (list: any, condition: any) => {
    //list 数据
    //condition 判断条件
    let map = {}
    let data: any = []

    list.forEach((item: any) => {
      //判断对象是否有
      //有就添加
      // 没有就创建
      if (map[item[condition]]) {
        map[item[condition]].push(item)
      } else {
        map[item[condition]] = [item]
      }
    })
    Object.keys(map).forEach(key => {
      data.push({
        color: key,
        data: map[key]
      })
    })

    return data
  }

  //弹窗事件
  const operation = (e: any) => {
    if (e.type === 'cancel') {
      state.dialogTableVisible = false
    }
    if (e.type === 'confirm') {
      e.data.map((item: any) => {
        item.type = ''
      })

      //颜色一样的尺码数据不能一样
      let type = false
      let colorData = formattingData(e.data, 'color')
      if (!isEmpty(colorData)) {
        colorData.forEach((v: any) => {
          if (v.data.length > 1) {
            //判断颜色一样的值是否一样
            if (!isEmpty(v.data)) {
              v.data.forEach((item: any) => {
                let a = JSON.stringify(v.data[0].sizeAndAmountList)
                let b = JSON.stringify(item.sizeAndAmountList)
                //尺码数据不能相同
                if (a == b) {
                  type = true
                } else {
                  type = false
                }
              })
            }
          }
        })
      }

      //如果尺码一样提示
      if (type) {
        ElMessage({
          message: '颜色相同，尺码下的数量不能相同',
          type: 'warning'
        })
      } else {
        setShelfList(e)
      }
    }
  }

  //去重
  let dataRepeat = (arr: any) => {
    let newArr = arr.filter(function (value: any, index: any, self: any) {
      return self.indexOf(value) === index
    })
    return newArr
  }
  //单层间数的计算
  const setLevelClothSum = (size: any, data: any) => {
    let arr = data.filter((item: any) => item.size === size)
    arr.map((item: any) => {
      item.levelClothSum = item.levelClothSum === undefined ? 0 : item.levelClothSum
    })
    let max = Math.max.apply(
      Math,
      arr.map((item: any) => {
        return item.levelClothSum
      })
    )
    //获取当前尺码的最大值

    return max
  }
  // 排唛比例保存
  const setForm = async () => {
    let api = '/jack-ics-api/bedPlan/save'
    proxy.$baseService.post(api, state.form).then((res: any) => {
      if (res.code === 0) {
        ElMessage({
          message: '保存成功',
          type: 'success'
        })
        //关闭
        state.dialogTableVisible = false
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }
  //排唛比例- 保存- 数据处理
  const setShelfList = (e: any) => {
    let list = e.data

    let bedSum = 0 //床次总件数
    let levelClothSum = 0 //单层件数
    let data: any = { color: [], size: [], newColor: [], newSize: [] }

    //尺码
    let size = list[0].sizeAndAmountList
    if (!isEmpty(size)) {
      let sizeList: any = []
      size.map((item: any) => {
        sizeList.push({ size: item.size })
      })
      state.form.sizeList = sizeList //
    }
    if (!isEmpty(list)) {
      //床次总件数
      list.forEach((item: any) => {
        bedSum += item.bedSum
        data.color.push(item.color)
        data.size.push(item.size)
      })

      data.newColor = dataRepeat(data.color)
      data.newSize = dataRepeat(data.size)
      //单层件数----------------------------
      let levelData: any = []
      list.forEach((v: any) => {
        levelData.push(v.sizeAndAmountList)
      })
      let level = levelData.flat(Infinity)

      state.form.sizeList.forEach((item: any) => {
        levelClothSum += setLevelClothSum(item.size, level)
      })
      // ----------------------------
      //铺布层数
      let levelSum = 0
      list.forEach((item: any) => {
        levelSum += item.spreadClothLevel
      })
      state.form.spreadClothLevel = levelSum

      //********用于回显和保存********* */
      //添加后端唯一判断值
      list.map((item: any, index: any) => {
        item.rowFlag = index
      })
      //过滤床次总件数为空
      let newList = list.filter((item: any) => item.bedSum > 0)
      //过滤数据为空的数据
      newList.map((item: any) => {
        item.sizeAndAmountList = item.sizeAndAmountList.filter((item: any) => item.levelClothSum != 0)
      })
      //数据
      state.form.shelfList = newList //排唛比例数据赋值
      //**************************/
      state.form.bedSum = bedSum
      state.form.levelClothSum = levelClothSum

      //保存到后端
      setForm()
    }
  }

  onMounted(() => {
    init()
  })
</script>
<style lang="less" scoped>
  /deep/ .el-input__inner {
    text-align: left !important; //输入框左对齐
  }

  .table {
    width: 66vw;
  }
</style>
