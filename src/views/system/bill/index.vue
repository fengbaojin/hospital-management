<template>
    <div id="person_index">
      <!-- 行内表单组件，搜索 -->
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="菜单名称">
            <el-input v-model="name" placeholder="输入菜单名称搜索" clearable @change="btnSearch() "></el-input>
          </el-form-item>
          <el-form-item>
          <el-button type="primary"  @click="addPerson()">添加菜单</el-button>
          </el-form-item>
        </el-form>
          <!-- 表格组件 -->
        <el-table :data="menuList" border 
                v-loading="loading"
                element-loading-text="读取中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"     
                style="width: 100%; margin-bottom: 20px; text-align: center">
            <el-table-column
                prop="name"
                style="width: 16%;"
                label="菜单名称">
            </el-table-column>
            <el-table-column
                prop="path"
                style="width: 16%"
                label="菜单路径">
            </el-table-column>
            <el-table-column
                style="width: 16%"
                label="图标">
                 <template slot-scope="scope" >
                    <i :class="scope.row.icon" ></i>
                </template>
            </el-table-column>
            <el-table-column
                prop="pidName"
                type="text"
                style="width: 16%"
                label="父级菜单">
            </el-table-column>
            <el-table-column
                prop="pagePath"
                style="width: 16%"
                label="页面路径">
            </el-table-column>
            <el-table-column
                label="操作"
                style="width: 16%">
                <template slot-scope="scope">
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
				<el-form-item label="菜单名称" prop="name" class="form-item">
					<el-input v-model="dataForm.name" autocomplete="off"></el-input>
				</el-form-item>
        <el-form-item label="菜单路径" prop="path" class="form-item">
					<el-input v-model="dataForm.path" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="图标" prop="icon"  class="form-item">
            <i :class="dataForm.icon" ></i>
				</el-form-item>
				 <el-form-item label="父级菜单" prop="pid" class="form-item" >
					<el-select v-model="dataForm.pid" clearable placeholder="选择父级菜单" style="width: 200px">
            <el-option v-for="item in pidList" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
					</el-select>
				</el-form-item>
        <el-form-item label="页面路径" prop="pagePath"  class="form-item">
					<el-input v-model="dataForm.pagePath" autocomplete="off"></el-input>
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

import { getAllMenu , getPidMenu, addMenu} from '@/api/ApiMenu'

export default {
  name: "bill",
  data() {
    return{
      name: "",
      pageIndex: 1,
      pageSize: 10,
      total:0,
      menuList: [],
      dialogVisible: false,
      pidList: [],
      dataForm: {
        menuId: null,
        name: "",
        icon: "",
        ispid: 1,
        pid: null,
        pagePath: ""
      },
      loading: true,
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: ['blur', 'change'] }
        ],
        pagePath: [
          { required: true, message: '请输入页面路径', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    loadData() {
      this.loading = true;
      const params = {
        name: this.name,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }
      getAllMenu(params).then(res => {
        if (res.code === 0) {
          this.loading = false;
          this.menuList = res.data.data
          this.total = res.data.total
        }
      })
    },
    btnSearch() {
      this.pageIndex = 1
      this.loadData();
    },
    addPerson() {
      this.$set(this, 'dialogVisible', true)
      this.dataForm = {
        menuId: "",
        name: "",
        icon: "",
        pid: null,
        pagePath: ""
      }
    },
    handleSizeChange(val) {
      this.$set(this, 'pageSize', val);
      this.loadData();
    },
    handleCurrentChange(val) {
      this.$set(this, 'pageIndex', val);
      this.loadData();
    },
    resetForm(insertForm) {
          this.$refs[insertForm].resetFields()
          this.$set(this, 'dialogVisible', false)
    },
    changeDate() {

    },
    handleSave() {
      this.$refs['insertForm'].validate((valid) => {
      if (valid) {
            addMenu(this.dataForm).then((res) => {
              this.loadData();
              this.$set(this, 'dialogVisible', false);
              if(res.code === -1 ) {
                this.$message({
                  type: 'error',
                  setTimeout:"400",
                  message: res.error
                });
              }
            });
          }
      });
    },
    btnModify(row) {
      this.$set(this, 'dialogVisible', true);
      this.dataForm = {
        ...row
      }
    },
    checkmate(data) {
      data.forEach(item => {
        item.path = item.path == null ? '' : item.path
      });
      return data
    },
    getPidMenuList(){
       getPidMenu().then(res => {
        if(res.code === 0 ){
          this.pidList = res.data
        }
      })
    }
  },
  created() {
    this.loadData();
    this.getPidMenuList();
  }
}
</script>

<style>
.form-item {
 width: 320px;
}
</style>

