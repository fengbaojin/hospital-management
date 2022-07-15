<template>
   <div id ="role">
      <div style="width: 100%; margin-bottom: 20px; text-align:right;">
        <el-button type="primary" @click="btnAdd">添加</el-button>
      </div>

      <el-table :data="roleList" border 
                v-loading="loading"
                element-loading-text="读取中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"  
                style="width: 70%; text-align:center;">
        <el-table-column
          prop="name"
          label="角色名"
          style="width: 50%">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
              <!-- <el-button type="danger" size="small">删除</el-button> -->
              <el-button type="primary" size="small" @click="btnModify(scope.row)">修改</el-button>
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
		<el-dialog width="780px" center :visible.sync="dialogVisible" @close="resetForm('insertForm')">
			  <el-form ref="insertForm" :label-position="labelPosition" label-width="80px" :model="role" size="small" style="width: 680px; margin: 20px auto;">
            <el-form-item label="名称" prop="name">
              <el-input v-model="role.name" style="width: 185px;"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" v-model="role.description" :rows="5" placeholder="输入该角色的描述" style="width: 492px; resize:none;"></el-input>
            </el-form-item>
            <el-form-item label="权限">
              <el-transfer v-model="role.menuIds" :data="permissionData" :titles="titles"></el-transfer>
            </el-form-item>
            <el-form-item label="" style="text-align: center;">
                  <el-button type="primary" size="mini"  @click="btnConfirm">确定</el-button>
                  <el-button type="normal" size="mini" @click="resetForm('insertForm')">返回</el-button>
            </el-form-item>
        </el-form>
		</el-dialog>


      

   </div>
</template>

<script>

import { getRoleListPage } from '@/api/APIRole'
import { getMenuList , getMenuListByRoleId, updateMenu} from '@/api/APIBill'

export default {
  name: "role",
  data() {
    return{
      labelPosition: 'right',
      roleList:[],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      dialogVisible: false,
      menus:[],
      role: {
          roleId: 0,
          name: '', //  角色名称
          description: '', //  角色描述
          menuIds: [] // 角色权限
      },
      permissionData: [],
      titles: ['可添加权限', '已添加权限'],
    }
  },
  methods: {
    localDate() {
      this.loading = true;
      const params= {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      getRoleListPage(params).then(res => {
        if(res.code === 0 ){
          this.loading = false;
          this.roleList = res.data.data
          this.total = res.data.total;
        }
      })
    },
    resetForm(insertForm) {
          this.$refs[insertForm].resetFields()
          this.$set(this, 'dialogVisible', false)
    },
    btnAdd() {
      this.$set(this, 'dialogVisible', true)
      this.role = {
          name: '', //  角色名称
          description: '', //  角色描述
          menuIds: [] // 角色权限
      }
    },
    btnModify(row) {
      console.log(row)
      this.$set(this, 'dialogVisible', true)
      getMenuListByRoleId({roleId: row.roleId}).then(res => {
        if(res.code === 0 ){
          this.role.roleId = row.roleId
          this.role.name = row.name
          this.role.description = row.description
          this.role.menuIds = res.data.map(p => p.menuId)
        }
      })
    },
    handleSizeChange(val) {
      this.$set(this, 'pageSize', val);
      this.getRankingByEveryMonth();
    },
    handleCurrentChange(val) {
      this.$set(this, 'pageIndex', val);
      this.getRankingByEveryMonth();
    },
    getAllMenuList() {
      getMenuList().then(res => {
        if(res.code === 0 ){
          this.menus = res.data;
          this.menus.forEach(item => {
            this.importPermissionData(item);
          });
        }
      })
    },
    importPermissionData(item) {
        this.permissionData.push({
          key: item.menuId,
          label: item.name
        })
    },
    btnConfirm() {
      updateMenu(this.role).then(res => {
        if(res.code === -1 ) {
        this.loading=false
        this.$message({
            type: 'error',
            setTimeout:"400",
            message: res.error_description
          });
        }     
        this.resetForm('insertForm')
      })
    }
  },
  created() {
    this.getAllMenuList();
    this.localDate();
  }
}
</script>

<style>
</style>
