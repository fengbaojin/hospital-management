<template>
   <div id="person_index">
      <!-- 行内表单组件，搜索 -->
        <el-form :inline="true" :model="personSearch" class="demo-form-inline">
          <el-form-item label="科室">
            <el-select v-model="personSearch.departmentId" placeholder="选择科室" clearable>
                <el-option v-for="item in departmentList" :key="item.departmentId" :label="item.departmentName" :value="item.departmentId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" >
            <el-select v-model="personSearch.status" clearable placeholder="选择状态">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="personSearch.name" clearable @keyup.enter.native="iptNameEnter" placeholder="输入名字或手机号搜索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="btnSearch">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addPerson()">添加</el-button>
          </el-form-item>
        </el-form>
          <!-- 表格组件 -->
        <el-table :data="personList" border 
                v-loading="loading"
                element-loading-text="读取中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"     
                style="width: 100%; margin-bottom: 20px;text-align: center">
            <el-table-column
                prop="name"
                style="width: 20%"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="gender"
                style="width: 16%"
                label="性别">
            </el-table-column>
            <el-table-column
                prop="departmentName"
                style="width: 16%"
                label="所属科室">
            </el-table-column>
            <el-table-column
                prop="telephone"
                style="width: 16%"
                label="联系方式">
            </el-table-column>
            <el-table-column
                prop="statusName"
                style="width: 10%"
                label="状态">
            </el-table-column>
			 <el-table-column
                prop="roleName"
                style="width: 16%"
                label="角色">
            </el-table-column>
            <el-table-column
                label="操作"
                style="width: 16%">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="btnDelete(scope.row.userId)">删除</el-button>
                    <el-button type="primary" size="mini" @click="btnModify(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
         <!-- 分页组件 -->
        <div class="pagination-container" style="margin-top: 10px">
          <el-pagination 
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageIndex"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="pageSize"
            :pager-count="11"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>

		<!-- 添加组件 -->
		<el-dialog width="480px" center :visible.sync="dialogVisible" @close="resetForm('insertForm')">
			<el-form ref="insertForm" :model="dataForm" :rules="rules" size="mini" label-width="100px">
				<el-form-item label="姓名" prop="name" class="form-item">
					<el-input v-model="dataForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="gender" class="form-item">
					<el-radio v-model="dataForm.gender" label="男">男</el-radio>
  					<el-radio v-model="dataForm.gender" label="女">女</el-radio>
				</el-form-item>
				<el-form-item label="科室" prop="departmentId" class="form-item">
					<el-select v-model="dataForm.departmentId" placeholder="请选择科室" clearable style="width: 200px">
						<el-option v-for="item in departmentList" :key="item.departmentList" :label="item.departmentName" :value="item.departmentId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机号" prop="telephone"  class="form-item">
					<el-input v-model="dataForm.telephone" autocomplete="off"></el-input>
				</el-form-item>
				 <el-form-item label="员工状态" prop="status" class="form-item">
					<el-select v-model="dataForm.status" clearable placeholder="选择员工状态" style="width: 200px">
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="角色" prop="roleId"  class="form-item">
					<el-select v-model="dataForm.roleId" placeholder="请选择角色" clearable style="width: 200px">
						<el-option v-for="item in roleList" :key="item.roleId" :label="item.name" :value="item.roleId"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="resetForm('insertForm')">取 消</el-button>
				<el-button size="mini" type="primary" @click="handleSave">保 存</el-button>
			</div>
		</el-dialog>


   </div>

</template>

<script>

import { getUserList , saveUser, deleteUser} from '@/api/APISystem'
import { getDepartmentList } from '@/api/APIDepartment'
import { getRoleList } from '@/api/APIRole'

export default {
  name: "user",
  data() {
    return {
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      departmentList: [],
      personList: [],
      personSearch: {
        departmentId: null,
        status: null,
        name: ''
      },
      statusOptions: [
          {
              value: 1,
              label: '在职中'
          },
          {
              value: 2,
              label: '休假中'
          },
          {
              value: 3,
              label: '离职中'
          }
      ],
      dialogVisible: false,
      dataForm: {
        name: '',
        gender:"",
        departmentId: null,
        telephone: '',
        status: null,
        roleId: null

      },
      dedefaultForm: {
        name: '',
        gender:"男",
        departmentId: null,
        telephone: '',
        status: null,
        roleId: null

      },
      roleList: [],
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: ['blur', 'change'] }
        ],
        gender: [
          { required: true, message: '请输入岗位名称', trigger: ['blur', 'change'] }
        ],
        departmentId: [
          { required: true, message: '请选择科室', trigger: ['blur', 'change'] }
        ],
        telephone: [
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] }
        ],
        status: [
          { required: true, message: '请选择员工状态', trigger: ['blur', 'change'] }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: ['blur', 'change'] }
        ],
      }
    }
  },
  methods: {
    loadData: function() {
      this.loading = true;
      const params = {
        ...this.personSearch,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
        };
      getUserList(params).then(res => {
        if (res.code === 0) {
          this.loading = false;
          this.personList = res.data.data
          this.total = res.data.total;
        }
      })
    },
    getAllDepartment() {
        getDepartmentList().then(res => {
          if(res.code === 0 ){
            this.departmentList = res.data
          }
        })
    },
    getRoleAllList() {
      getRoleList().then(res => {
        if(res.code === 0 ){
          this.roleList = res.data
        }
      })
    },
    handleSizeChange(val) {
      this.$set(this, 'pageSize', val);
      this.loadData();
    },
    handleCurrentChange(val) {
      this.$set(this, 'pageIndex', val);
      this.loadData();
    },
    btnSearch() {
      this.pageIndex = 1
      this.loadData();
    },
    resetForm(insertForm) {
          this.$refs[insertForm].resetFields()
          this.$set(this, 'dialogVisible', false)
    },
    addPerson() {
      this.dataForm = this.dedefaultForm
      this.$set(this, 'dialogVisible', true)
    },
    handleSave() {
       this.$refs['insertForm'].validate((valid) => {
       if (valid) {
            saveUser(this.dataForm).then((res) => {
              this.loadData();
              this.$set(this, 'dialogVisible', false);
            });
          }
        });
    },
    btnDelete(id) {
      this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
        deleteUser({ deleteUserId: id }).then((res) => {
        this.loadData();
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        });
      });
    },
    btnModify(row) {
      this.$set(this, 'dialogVisible', true);
      this.dataForm = {
        ...row
      };
    }
  },
  created() {
      this.getAllDepartment();
	    this.getRoleAllList();
      this.loadData();

  }
}
</script>

<style>
.form-item {
 width: 300px;
}
</style>
