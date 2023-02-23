<template>
  <div class="content">
    <div class="left">
      <div class="leftContent">
        <div class="title">
          <span class="rectangle"></span>
          <span class="text">班组</span>
        </div>
        <div class="team">
          <div v-for="(item, index) in baseData.teamData" :key="index" class="item" :class="{ point: currentIndex === index }" @click="selectTeam(index, item.id)">
            <el-checkbox v-model="item.type" class="checkbox" @change="checkTeam(item.id, item.type)" />
            <div class="teamName">{{ item.name }}</div>
            <span class="choose" @click.stop="changeTeamMessage(index, item.id)">修改</span>
          </div>
        </div>
        <el-divider class="divider" />
        <div class="operation">
          <div style="display: flex; flex-direction: row-reverse">
            <el-button type="danger" @click="delTeam">删除</el-button>
            <el-button type="primary" @click="addTeam">新增</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div v-loading="loading" class="rightContent">
        <el-table :data="baseData.tableData" style="width: 100%" border :header-cell-style="textCenter" :cell-style="textCenter">
          <el-table-column prop="order" label="序号" width="80" center />
          <el-table-column prop="userName" label="人员名称" center />
          <el-table-column prop="departmentName" label="所属部门" center />
          <el-table-column prop="roleName" label="人员角色" center />
          <el-table-column label="状态" center width="150">
            <template #default="{ row }">
              <span v-if="row.status == 1">已启用</span>
              <span v-else>未启用</span>
              <span class="circle" :style="row.status === 1 ? { backgroundColor: '#46C253' } : { backgroundColor: '#FB602D' }"></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" center width="150">
            <template #default="{ row }">
              <span class="del" @click="deleteUser(baseData.currentTeamId, row.userId)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" :title="baseData.dialogTitle" :draggable="false" @close="dialogClose">
      <el-form ref="ruleForm" :model="baseData.dialogFormData" inline label-position="top" style="display: felx; justify-content: space-around" :rules="rules">
        <el-form-item label="班组名称" style="width: 26%" prop="name">
          <el-input v-model="baseData.dialogFormData.name" style="width: 100%" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="班组编码" style="width: 26%">
          <el-input v-model="baseData.dialogFormData.code" disabled style="width: 100%" />
        </el-form-item>
        <el-form-item label="班组班次" style="width: 26%" prop="teamScheduleIdList">
          <el-select v-model="baseData.dialogFormData.teamScheduleIdList" multiple placeholder="请选择班次" style="width: 100%">
            <el-option v-for="(item, index) in baseData.ScheduleOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="班组能力" style="width: 26%" prop="ability">
          <el-select v-model="baseData.dialogFormData.ability" placeholder="请选择任务" style="width: 100%">
            <el-option v-for="(item, index) in equipmentType" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <span style="width: 28%"></span>
        <span style="width: 28%"></span>
      </el-form>
      <div style="width: 100%; height: 40px; position: relative">
        <span class="dialogRectangle"></span>
        <span class="dialogTitle">人员安排</span>
      </div>
      <div style="display: flex; justify-content: center">
        <el-transfer v-model="baseData.transferRightUser" :data="baseData.transferLeftUser" :titles="['所有人员', '已选人员']" :props="{ key: 'id', label: 'realName' }" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancle(ruleForm)">取消</el-button>
          <el-button type="primary" @click="save(ruleForm)"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- <dialog-addTeam ref="dialogRef" /> -->
  </div>
</template>

<script lang="ts" setup>
  import './modules/index.less'
  // import dialogAddTeam from './modules/dialog-addTeam.vue'
  import { ElMessage } from 'element-plus'
  import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
  import { isEmpty } from 'lodash'
  import { equipmentType } from '@/components/conifgs'
  const { proxy }: any = getCurrentInstance()
  let currentIndex = ref(0)
  //ref引用
  const ruleForm = ref()
  // const dialogRef = ref<any>()
  const loading = ref(false)

  const textCenter = { 'text-align': 'center' }
  //dialog 显示控制
  let dialogVisible = ref(false)
  const baseData = reactive({
    dialogTitle: '',
    tableData: [] as any,
    dialogFormData: {
      id: '',
      name: '',
      code: '',
      ability: '',
      teamScheduleIdList: [],
      userIdList: []
    },
    teamData: [] as any,
    idList: [] as any,
    transferLeftUser: [] as any,
    transferRightUser: [] as any,
    currentTeamId: '',
    ScheduleOptions: [] as any
  })
  //dialogForm表单验证规则
  const rules = reactive({
    name: [{ required: true, message: '请输入班组姓名', trigger: 'blur' }],
    teamScheduleIdList: [{ required: true, message: '请选择班次', trigger: 'change' }],
    ability: [{ required: true, message: '请选择能力', trigger: 'change' }]
  })
  onMounted(() => {
    getTeamList()
  })
  //请求左侧班组列表数据
  const getTeamList = () => {
    proxy.$baseService.get('/jack-ics-api/team/list').then((res: any) => {
      res.data.forEach((element: any) => {
        element['type'] = false
      })
      baseData.teamData = res.data
      getTeamUser(res.data[currentIndex.value].id)
    })
  }
  //左侧新增按钮点击事件，点击dialog显示
  const addTeam = () => {
    baseData.dialogTitle = '班组管理新增'
    getSchedule()
    getUser()
    dialogVisible.value = true
  }
  // 修改分组信息事件
  const changeTeamMessage = async (index: number, id: string) => {
    baseData.dialogTitle = '班组信息修改'
    //获取全部员工信息
    getSchedule()
    await getUser()
    await getTeamDetail(id)
    dialogVisible.value = true
  }
  //左侧班组选中，赋值对应的index，更改背景颜色,请求对应得员工
  const selectTeam = (index: any, id: string) => {
    loading.value = true
    baseData.currentTeamId = id
    currentIndex.value = index
    getTeamUser(id)
  }
  //checkbox选中事件,得出需要删除的idList
  const checkTeam = (id: string, type: boolean) => {
    if (type === true) {
      baseData.idList.push(id)
    } else {
      let temp = baseData.idList.filter((item: any) => {
        return item !== id
      })
      baseData.idList = temp
    }
  }
  //dialog 关闭时调用
  const dialogClose = () => {
    ruleForm.value.clearValidate('name', 'teamScheduleIdList', 'ability')
    ruleForm.value.resetFields() //重置以清除非必要的表单验证
    baseData.dialogFormData.name = ''
    baseData.dialogFormData.ability = ''
    baseData.dialogFormData.code = ''
    baseData.dialogFormData.id = ''
    baseData.dialogFormData.userIdList = []
    baseData.dialogFormData.teamScheduleIdList = []

    //关闭之后并将穿梭框右侧内容清空
    baseData.transferLeftUser = []
    baseData.transferRightUser = []
  }
  //dialog 取消
  const cancle = (ruleForm: any) => {
    // ruleForm.resetFields()
    dialogVisible.value = false
  }
  //dialog 保存
  const save = async (ruleForm: any) => {
    if (!ruleForm) return
    // console.log(baseData.dialogFormData)

    await ruleForm.validate((valid: any, fields: any) => {
      if (valid) {
        let formData: any = baseData.dialogFormData
        formData.ability = Number(formData.ability)
        formData.userIdList = baseData.transferRightUser
        proxy.$baseService
          .post('/jack-ics-api/team/save', formData)
          .then((res: any) => {
            if (res.code === 0) {
              ElMessage({
                message: '保存成功',
                type: 'success'
              })
              // ruleForm.resetFields() 成功后清除form表单的信息
              dialogVisible.value = false
              getTeamList()
              getTeamUser(baseData.currentTeamId)
            } else {
              formData.ability = String(formData.ability) //函数一开始修改同一个对象中的ablity的类型，导致函数执行到这一步，界面无法正常显示能力的label
              ElMessage({
                message: res.msg,
                type: 'error'
              })
            }
          })
          .catch((err: any) => {
            ElMessage({
              message: err.msg,
              type: 'error'
            })
          })
      } else {
        ElMessage({
          message: '必填项不能为空',
          type: 'error'
        })
      }
    })
  }
  //team删除方法
  const delTeam = () => {
    if (baseData.idList.length == 0) {
      return ElMessage({
        message: '请选择需要删除的班组',
        type: 'error'
      })
    }
    proxy.$baseService
      .delete('/jack-ics-api/team/delete', baseData.idList)
      .then((res: any) => {
        ElMessage({
          message: '删除成功',
          type: 'success'
        })
        //删除成功后更新teamlist
        getTeamList()
      })
      .catch((err: any) => {
        ElMessage({
          message: err.msg,
          type: 'error'
        })
      })
  }
  // //获取穿梭框右侧所有的人员信息
  const getUser = () => {
    return new Promise((resolve, reject) => {
      let data = {
        page: 1,
        limit: 999999,
        systemId: localStorage.getItem('v1@systemId'),
        tenantCode: localStorage.getItem('v1@tenantCode')
      }
      proxy.$baseService
        .get('/njp-plus-admin-api/sys/user/page', data)
        .then((res: any) => {
          if (!isEmpty(data)) {
            baseData.transferLeftUser = res.data.list
            resolve(true)
          }
        })
        .catch((err: any) => {
          ElMessage({
            message: err.msg,
            type: 'error'
          })
        })
    })
  }
  //获取右侧表格班组成员
  const getTeamUser = (id: string) => {
    proxy.$baseService
      .get('/jack-ics-api/team/listTeamUsr', { teamId: id })
      .then((res: any) => {
        baseData.tableData = res.data
        baseData.tableData?.forEach((el: any, index: number) => {
          el['order'] = index + 1
        })
        loading.value = false
      })
      .catch((err: any) => {
        ElMessage({
          message: err.msg,
          type: 'error'
        })
      })
  }
  //删除指定班组下的成员
  const deleteUser = (teamId: string, userId: string) => {
    proxy.$baseService
      .delete(`/jack-ics-api/team/deleteUser?teamId=${teamId}&userId=${userId}`)
      .then((res: any) => {
        ElMessage({
          message: '删除成功',
          type: 'success'
        })
        getTeamUser(teamId)
      })
      .catch((err: any) => {
        ElMessage({
          message: err.msg,
          type: 'error'
        })
      })
  }
  //获取穿梭框左侧班组详情
  const getTeamDetail = (id: string) => {
    return new Promise((resolve, reject) => {
      let temp: any = []
      proxy.$baseService
        .get('/jack-ics-api/team/get', { id: id })
        .then((res: any) => {
          baseData.dialogFormData = res.data
          res.data.userIdList.forEach((id: string) => {
            // let obj: any = {}
            baseData.transferLeftUser.forEach((el: any) => {
              if (id === el.id) {
                temp.push(el.id)
              }
            })
          })
          baseData.transferRightUser = temp
          resolve(true)
        })
        .catch((err: any) => {
          ElMessage({
            message: err.msg,
            type: 'error'
          })
          reject(false)
        })
    })
  }
  // //获取班次信息
  const getSchedule = () => {
    proxy.$baseService
      .get('/jack-ics-api/teamSchedule/pageList')
      .then((res: any) => {
        baseData.ScheduleOptions = res.data.list
      })
      .catch((err: any) => {
        ElMessage({
          message: err.msg,
          type: 'error'
        })
      })
  }
</script>

<style lang="less" scoped>
  .dialogRectangle {
    display: inline-block;
    height: 50%;
    width: 3px;
    background-color: #3e8ff7;
    border-radius: 1px;
    margin-left: 4%;
  }
  .dialogTitle {
    position: relative;
    bottom: 3px;
    font-weight: 700;
    padding: 10px;
  }
  .point {
    background-color: rgb(244, 247, 255);
  }
</style>
