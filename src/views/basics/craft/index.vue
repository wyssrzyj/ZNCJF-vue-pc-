<template>
  <div class="content">
    <div class="left">
      <div class="leftContent">
        <div class="title">
          <span class="rectangle"></span>
          <span class="text">工艺</span>
        </div>
        <div class="craft">
          <div v-for="(item, index) in baseData.craftData" :key="index" class="item" :class="{ point: currentIndex === index }" @click="selectCraft(index, item.id)">
            <el-checkbox v-model="item.type" class="checkbox" @change="checkCraft(item.id, item.type)" />
            <div class="craftName">{{ item.name }}</div>
          </div>
        </div>
        <el-divider class="divider" />
        <div class="operation">
          <div style="display: flex; flex-direction: row-reverse">
            <el-button type="danger" @click="delCraft">删除</el-button>
            <el-button type="primary" @click="addCraft">新增</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div v-loading="loading" class="rightContent">
        <div class="ContentTop">
          <div class="description">
            <span class="rectangle"></span>
            <span class="text">工艺描述</span>
            <div class="textarea">
              <el-input v-model="baseData.textArea" :rows="5" type="textarea" placeholder="请输入" resize="none" />
            </div>
          </div>
          <div class="fabric">
            <span class="rectangle"></span>
            <span class="text">关联面料</span>
            <div class="tag">
              <el-tag v-for="tag in baseData.tags" :key="tag" class="mx-1" style="margin-top: 10px" closable :disable-transitions="false" @close="closeTag(tag, tag.id)">
                {{ tag.name }}
              </el-tag>
              <el-button class="button-new-tag ml-1" type="success" size="small" style="margin-left: 10px" @click="addTag"> + New Tag </el-button>
            </div>
          </div>
        </div>
        <div class="ContentBottom">
          <el-table :data="baseData.tableData" style="width: 100%" border :header-cell-style="textCenter" :cell-style="textCenter" max-height="49vh">
            <el-table-column prop="num" label="工序序号" center width="100" />
            <el-table-column prop="name" label="工序名称" center>
              <template #default="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="use" label="启用" center width="100">
              <template #default="{ row }">
                <div>
                  <el-switch v-model="row.enableFlag" :active-value="1" :inactive-value="0" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="formula" label="计算公式" center>
              <template #default="{ row }">
                <div>
                  <el-select v-model="row.formulaId">
                    <el-option v-for="(item, index) in row.formula" :key="index" :label="item.name" :value="item.id" />
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="适用资源" center>
              <template #default="{ row }">
                <span>{{ getResourceList(row.name, row.formulaId) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="button" style="display: flex; justify-content: flex-end; margin-top: 10px">
          <el-button>取消</el-button>
          <el-button type="primary" @click="updataCraft">保存</el-button>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="新增工艺" :draggable="false" width="40%" @close="dialogClose">
      <el-form ref="formRef" inline label-position="top" :model="baseData.addCraftDialog" :rules="rules">
        <el-form-item label="工艺名称" style="width: 40%" prop="craftName">
          <el-input v-model="baseData.addCraftDialog.craftName" style="width: 100%" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div style="width: 60%; margin-top: 20px">
        <span class="dialogRectangle"></span>
        <span class="dialogText">工艺描述</span>
        <div style="margin-top: 10px">
          <el-input v-model="baseData.addCraftDialog.description" :rows="5" type="textarea" placeholder="请输入" resize="none" />
        </div>
      </div>
      <div style="height: 200px; margin-top: 20px">
        <span class="dialogRectangle"></span>
        <span class="dialogText">关联面料</span>
        <div style="margin-top: 10px; display: flex; justify-content: flex-start">
          <el-tag v-for="item in baseData.addCraftDialog.Tags" :key="item" class="mx-1" closable :disable-transitions="false" @close="handleClose(item, item.id)">
            {{ item.name }}
          </el-tag>
          <el-button class="button-new-tag ml-1" style="margin-left: 10px" type="success" size="small" @click="showInput"> + New Tag </el-button>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save(formRef)"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="baseData.addFabricDialog" :draggable="false" title="关联面料" width="30%">
      <div style="display: inline-block">
        <span style="margin-left: 10px">关联面料：</span>
        <div v-if="flag">
          <el-select v-model="baseData.data" multiple placeholder="请选择关联面料" style="width: 270px">
            <el-option v-for="item in baseData.options" :key="item.value" :label="item.name" :value="item.id" />
          </el-select>
        </div>
        <div v-else>
          <el-select v-model="baseData.rightData" multiple placeholder="请选择关联面料" style="width: 270px">
            <el-option v-for="item in baseData.options" :key="item.value" :label="item.name" :value="item.id" />
          </el-select>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="baseData.addFabricDialog = false">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
-->

<script setup lang="ts">
  import './modules/index.less'
  import { ElMessage } from 'element-plus'
  import { ref, reactive, getCurrentInstance, onMounted, watch } from 'vue'
  const loading = ref(false)
  const { proxy }: any = getCurrentInstance()
  const textCenter = { 'text-align': 'center' }
  const flag = ref(false)
  let dialogVisible = ref(false)
  const currentIndex = ref(0)
  const formRef = ref()
  const rules = reactive({ craftName: [{ required: true, message: '请输入班组姓名', trigger: 'blur' }] })
  //模拟工艺数据
  const baseData = reactive({
    addFabricDialog: false,
    currentId: '',
    craftData: [] as any,
    craftIdList: [] as any,
    addCraftDialog: {
      craftName: '',
      description: '',
      Tags: [] as any
    },
    options: [] as any,
    data: [] as any,
    rightData: [] as any,
    Process: '',
    tags: [] as any,
    textArea: '',
    tableData: [] as any,
    formulaId: '',
    formulaData: [] as any, //计算公式的数据
    processOne: [] as any, //工序一的计算公式数组
    processTwo: [] as any, //工序二的计算公式数组
    processThree: [] as any //工序三的计算公式数组
  })
  onMounted(async () => {
    //挂载后获取工艺列表
    await getCraft()
    //页面挂载后获取第一个工艺的信息
    selectCraft(0, baseData.craftData[0].id)
  })
  const getCraft = () => {
    //获取工艺数组，循环添加type，默认为false
    return proxy.$baseService.get('/jack-ics-api/technology/list').then((res: any) => {
      baseData.craftData = res.data
      baseData.craftData.forEach((item: any) => {
        item['type'] = false
      })
    })
  }

  //左侧工艺选中，赋值对应的index，更改背景颜色
  const selectCraft = async (index: any, id: string) => {
    loading.value = true
    //将请求三个不同工序下公式列表的方法放在这里，先请求到所属的公式列表
    getFormual()
    baseData.tableData = []
    baseData.currentId = id
    //需要请求不同工艺下的相关信息
    currentIndex.value = index
    await proxy.$baseService
      .get('/jack-ics-api/technology/get', { id: id })
      .then((res: any) => {
        baseData.textArea = res.data.technologyDescribe
        baseData.tags = res.data.fabricList
        //选择不同的工艺后清空右侧tag弹框中的select数据
        baseData.rightData = []
        baseData.tags.forEach((item: any) => {
          baseData.rightData.push(item.id)
        })
      })
      .catch((err: any) => {
        ElMessage({
          message: err.msg,
          type: 'error'
        })
      })
    await craftDetail(id)
    loading.value = false
  }
  //获取工艺中的工序信息
  const craftDetail = (id: string) => {
    return new Promise((resolve, reject) => {
      let params = {
        technologyId: id
      }
      proxy.$baseService
        .get('/jack-ics-api/technology/listProcess', params)
        .then((res: any) => {
          baseData.tableData = res.data
          baseData.tableData.forEach((item: any, index: number) => {
            item['num'] = index + 1
            // item['only'] = item['name'] //添加唯一值
          })
          //拿到tableData之后在初始化公式数据（否则会出现回显延迟）
          assignmentFormula('铺布', baseData.processOne)
          assignmentFormula('打标/唛架纸', baseData.processTwo)
          assignmentFormula('裁剪', baseData.processThree)
          resolve(true)
        })
        .catch(() => {
          reject(false)
        })
    })
  }

  //表格赋值计算公式
  const assignmentFormula = (name: any, data: any) => {
    baseData.tableData.map((item: any) => {
      if (item.name === name) {
        item.formula = data
      }
    })
  }

  //获取工艺中公式信息
  const getFormual = async () => {
    //获取不同工序对应的计算公式
    //请求参数 铺布 type = 1 打标/唛架纸 type = 2 裁剪type = 3
    //后续工序出现变动，会有问题
    for (let index = 1; index <= 3; index++) {
      // formulaData
      await proxy.$baseService.get('/jack-ics-api/formulaContainer/pageList', { type: index }).then((res: any) => {
        if (index === 1) {
          // assignmentFormula('铺布', res.data.list)
          baseData.processOne = res.data.list
        }
        if (index === 2) {
          // assignmentFormula('打标/唛架纸', res.data.list)
          baseData.processTwo = res.data.list
        }
        if (index === 3) {
          // assignmentFormula('裁剪', res.data.list)
          baseData.processThree = res.data.list
        }
      })
    }
  }
  //左侧工艺checkbox选中
  const checkCraft = (id: string, type: boolean) => {
    if (type === true) {
      baseData.craftIdList.push(id)
    } else {
      let temp = baseData.craftIdList.filter((item: any) => {
        return item !== id
      })
      baseData.craftIdList = temp
    }
  }
  //新增工艺
  const addCraft = () => {
    flag.value = true
    dialogVisible.value = true
  }
  //删除工艺
  const delCraft = () => {
    if (baseData.craftIdList.length == 0) {
      return ElMessage({
        message: '选择需要删除的工艺',
        type: 'error'
      })
    }
    proxy.$baseService
      .delete('/jack-ics-api/technology/delete', baseData.craftIdList)
      .then((res: any) => {
        ElMessage({
          message: '删除成功',
          type: 'success'
        })
        //删除后重新刷新工艺列表
        getCraft()
      })
      .catch((err: any) => {
        ElMessage({
          message: err.msg,
          type: 'error'
        })
      })
  }
  //dialog关闭事件
  const dialogClose = () => {
    //dialog关闭清空数据
    formRef.value.resetFields()
    baseData.addCraftDialog.description = ''
    baseData.addCraftDialog.Tags = []
    baseData.data = []
  }
  //新增dialog点击取消关联面料
  const handleClose = (item: any, id: string) => {
    baseData.addCraftDialog.Tags = baseData.addCraftDialog.Tags.filter((tag: any) => {
      return tag !== item
    })
    baseData.data = baseData.data.filter((tagid: string) => {
      return id !== tagid
    })
  }
  //右侧关联面料点击取消操作
  const closeTag = (tag: any, id: string) => {
    baseData.tags = baseData.tags.filter((item: any) => {
      return item !== tag
    })
    baseData.rightData.splice(baseData.rightData.indexOf(id), 1)
  }
  const showInput = () => {
    proxy.$baseService
      .get('/jack-ics-api/fabric/pageList')
      .then((res: any) => {
        baseData.options = res.data.list
        baseData.addFabricDialog = true
      })
      .catch((err: any) => {
        ElMessage({
          message: err,
          type: 'error'
        })
      })
  }
  const confirm = () => {
    // if (flag.value === false) {
    //   let temp = baseData.tags.concat(baseData.tempArr)
    //   baseData.tags = temp
    // }
    // console.log(baseData.data)
    // baseData.addCraftDialog.Tags = baseData.data
    baseData.addFabricDialog = false
  }
  const save = async (formRef: any) => {
    if (!formRef) return
    // console.log(baseData.dialogFormData)
    let data = {
      name: baseData.addCraftDialog.craftName,
      technologyDescribe: baseData.addCraftDialog.description,
      fabricList: baseData.addCraftDialog.Tags
    }
    await formRef.validate((valid: any, fields: any) => {
      if (valid) {
        proxy.$baseService
          .post('/jack-ics-api/technology/save', data)
          .then((res: any) => {
            ElMessage({
              message: '保存成功',
              type: 'success'
            })
            getCraft()
            dialogVisible.value = false
          })
          .catch((err: any) => {
            ElMessage({
              message: err,
              type: 'error'
            })
          })
      } else {
        ElMessage({
          message: '工艺名称不能为空',
          type: 'error'
        })
      }
    })
  }
  const addTag = () => {
    proxy.$baseService
      .get('/jack-ics-api/fabric/pageList')
      .then((res: any) => {
        baseData.options = res.data.list
        baseData.addFabricDialog = true
      })
      .catch((err: any) => {
        ElMessage({
          message: err.msg,
          type: 'error'
        })
      })
    flag.value = false
    baseData.addFabricDialog = true
  }
  //修改工艺信息保存操作
  const updataCraft = async () => {
    //收集工艺信息
    let data = {
      id: baseData.currentId,
      technologyDescribe: baseData.textArea,
      fabricList: baseData.tags
    }
    let temp = baseData.tableData
    temp.forEach((item: any) => {
      item.formula.forEach((obj: any) => {
        if (item.formulaId === obj.id) {
          item['formulaName'] = obj.name
          item['resource'] = obj.resourceList
        }
      })
    })

    let processData = {
      technologyId: baseData.currentId,
      processList: temp
    }
    await proxy.$baseService.post('/jack-ics-api/technology/save', data)
    await proxy.$baseService
      .post('/jack-ics-api/technology/updateProcess', processData)
      .then((res: any) => {
        selectCraft(currentIndex.value, baseData.currentId)
        ElMessage({
          message: '保存成功',
          type: 'success'
        })
      })
      .catch((err: any) => {
        ElMessage({
          message: err.msg,
          type: 'error'
        })
      })
  }
  //选择不同的公式展示不同的资源
  const getResourceList = (name: string, id: string) => {
    let source = ''
    baseData.tableData.forEach((item: any) => {
      if (item.name === name) {
        item.formula?.forEach((obj: any) => {
          if (id === obj.id) {
            source = obj.resourceList
          }
        })
      }
    })
    return source
  }
  watch(
    () => baseData.data,
    newValue => {
      let arr = [] as any
      newValue.forEach((id: string) => {
        baseData.options.forEach((item: any) => {
          if (id === item.id) {
            arr.push(item)
          }
        })
      })
      baseData.addCraftDialog.Tags = arr
    }
  ),
    watch(
      () => baseData.rightData,
      newValue => {
        // let arr = [] as any
        //当newValue值为空时将tags数组置空
        if (newValue.length == 0) {
          baseData.tags = []
        }
        newValue.forEach((id: string) => {
          baseData.options.forEach((item: any) => {
            if (id == item.id) {
              let flag = baseData.tags.some((item: any) => {
                return id === item.id
              })
              if (!flag) {
                //tags中不存在相同布料，点击添加
                baseData.tags.push(item)
              } else {
                //tags中存在点击清除tags中的布料
                baseData.tags = baseData.tags.filter((item: any) => {
                  return item.id === id
                })
              }
            }
          })
        })
        // baseData.tempArr = arr
      }
    )
</script>

<style scoped lang="less">
  .point {
    background-color: rgb(244, 247, 255);
  }
  .el-select {
    border: 1px solid rgb(234, 234, 234);
    border-radius: 2%;
  }
  .dialogRectangle {
    display: inline-block;
    height: 20px;
    width: 3px;
    background-color: #3e8ff7;
    margin-right: 10px;
    border-radius: 1px;
  }
  .dialogText {
    position: relative;
    top: -5px;
  }
</style>
