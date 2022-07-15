<template>
    <div id="person_index">
      <!-- 行内表单组件，搜索 -->
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="药品名称">
            <el-input v-model="drugName" clearable @keyup.enter.native="iptNameEnter" placeholder="输入药品名称搜索"></el-input>
          </el-form-item>
          <el-form-item label="入库日期">
            <el-date-picker
              v-model="confirmJoinTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeDate()"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="btnSearch()">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="addPerson()">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addWareHouseExcel()">文件上传</el-button>
          </el-form-item>
           <el-form-item>
            <el-button type="primary" @click="downLoad()">文件导出</el-button>
          </el-form-item>
        </el-form>
          <!-- 表格组件 -->
        <el-table :data="drugWareHouseList" 
                v-loading="loading"
                element-loading-text="读取中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"     
                style="width: 100%; margin-bottom: 20px;text-align: center">
            <el-table-column
                prop="drugName"
                style="width: 16%"
                label="药品名称">
            </el-table-column>
            <el-table-column
                prop="productionDate"
                style="width: 16%"
                label="生产日期">
            </el-table-column>
            <el-table-column
                prop="quantity"
                style="width: 16%"
                label="数量">
            </el-table-column>
            <el-table-column
                prop="describe"
                type="text"
                style="width: 16%"
                label="描述">
            </el-table-column>
            <el-table-column
                prop="createdName"
                style="width: 16%"
                label="入库人">
            </el-table-column>
            <el-table-column
                prop="createdDate"
                style="width: 10%"
                label="入库时间">
            </el-table-column>
            <!-- <el-table-column
                label="操作"
                style="width: 16%">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="btnDelete(scope.row.userId)">删除</el-button>
                </template>
            </el-table-column> -->
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
				<el-form-item label="药品名称" prop="drugName" class="form-item">
					<el-input v-model="dataForm.drugName" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="价格" prop="money"  class="form-item">
          <el-input-number  v-model="dataForm.money" :precision="2" :step="0.1" ></el-input-number>
          <span style="margin-left: 10px ">元</span>
				</el-form-item>
				<el-form-item label="数量" prop="quantity"  class="form-item">
          <el-input-number v-model="dataForm.quantity" :step="2"></el-input-number>
          <span style="margin-left: 10px ">支</span>
				</el-form-item>
        <el-form-item label="生产日期" prop="productionDate"  class="form-item">
            <el-date-picker
              v-model="dataForm.productionDate"
              type="date"
              ype="daterange"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
				</el-form-item>
        <el-form-item label="生产公司" prop="companyName"  class="form-item">
					<el-input v-model="dataForm.companyName" autocomplete="off"></el-input>
				</el-form-item>
        <el-form-item label="描述" prop="describe"  class="form-item">
					<el-input v-model="dataForm.describe" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="resetForm('insertForm')">取 消</el-button>
				<el-button size="mini" type="primary" @click="handleSave">保 存</el-button>
			</div>
		</el-dialog>


    <el-dialog title="上传入库文件" width="25%" center :visible.sync="dialogUploadFormVisible">
              <el-form ref="uploadForm" :model="uploadForm" :rules="rules" size="mini"  label-width="120px">
                  <el-form-item label="药品入库文件" required>
                      <el-upload
                          action=""
                          ref="uploadFile"
                          :http-request="handleFile"
                          :on-remove="handleRemove"
                          :on-exceed="handleExceed"
                          accept=".xlsx,.xls"
                          :multiple=false
                          :limit="1">
                          <el-button size="mini" type="primary">选择文件</el-button>
                          <div slot="tip" class="el-upload__tip">只能上传xlsx和xls文件</div>
                      </el-upload>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button size="mini" @click="dialogUploadFormVisible= false">取 消</el-button>
                  <el-button size="mini" type="primary" @click="submit">提 交</el-button>
              </div>
    </el-dialog>
    
   </div>

</template>

<script>

import { listDrugRecordPage, insetDrugWareHouse , importStore} from '@/api/APIDrugInventory'

export default {
  name: "warehousing",
  data() {
    return{
      drugName: "",
      confirmJoinTime: [],
      pageIndex: 1,
      pageSize: 10,
      total:0,
      drugWareHouseList: [],
      dialogVisible: false,
      dataForm: {
        drugName: "",
        money: 0,
        quantity: 0,
        productionDate: null,
        companyName: "",
        describe: "",
      },
      dialogUploadFormVisible: false,
      loading: true,
      uploadForm: {
          file: null
      },
      rules: {
        drugName: [
          { required: true, message: '请输入药品名称', trigger: ['blur', 'change'] }
        ],
        money: [
          { required: true, message: '请输入药品价格', trigger: ['blur', 'change'] }
        ],
        quantity: [
          { required: true, message: '请选择药品价格', trigger: ['blur', 'change'] }
        ],
        productionDate: [
          { required: true, message: '请选择生产日期', trigger: ['blur', 'change'] }
        ],
        companyName: [
          { required: true, message: '请输入生产公司', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    loadData() {
      this.loading = true;
      const params = {
        drugName: this.drugName,
        startDate: this.confirmJoinTime === null ? '' : this.confirmJoinTime[0],
        endDate: this.confirmJoinTime === null ? '' : this.confirmJoinTime[1],
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }
      listDrugRecordPage(params).then(res => {
        if (res.code === 0) {
          this.loading = false;
          this.drugWareHouseList = res.data.data
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
    },
    handleSizeChange(val) {
      this.$set(this, 'pageSize', val);
      this.loadData();
    },
    handleCurrentChange(val) {
      this.$set(this, 'pageIndex', val);
      this.loadData();
    },
    handleFile: function(item) {
          var testmsg = item.file.name.substring(item.file.name.lastIndexOf('.') + 1)
          const extension = testmsg === 'xls'
          const extension2 = testmsg === 'xlsx'
          if (!extension && !extension2) {
              this.$message({
                  message: '上传文件只能是 xls、xlsx格式!',
                  type: 'warning'
              });

              this.uploadForm.file = null;
              this.$refs.uploadFile.clearFiles();
          } else {
              this.uploadForm.file = item.file;
          }
    },
    handleRemove(file, fileList) {
            this.uploadForm.file = null;
    },
     handleExceed(files, fileList) {
            this.$message.warning(`当前限制只能选择 1 个文件`);
    },
    resetForm(insertForm) {
          this.$refs[insertForm].resetFields()
          this.$set(this, 'dialogVisible', false)
    },
    changeDate() {

    },
    addWareHouseExcel() {
        this.$set(this, 'dialogUploadFormVisible', true);
    },
    handleSave() {
      this.$refs['insertForm'].validate((valid) => {
      if (valid) {
            insetDrugWareHouse(this.dataForm).then((res) => {
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
    submit: function() {
            var self = this;
            self.$refs['uploadForm'].validate((valid) => {
                if (valid) {
                    if (!self.uploadForm.file) {
                        self.$message({
                            type: 'error',
                            message: '请选择文件'
                        });
                        return false;
                    }

                    // 提交数据
                    self.submitData();
                }
            });
    },
    submitData: function() {
            var self = this;
            var formData = new FormData();
            console.log('hhh')
            formData.append('file', self.uploadForm.file);

            importStore(formData).then((res) => {
                if (res.code > -1) {
                    self.$set(self, 'dialogUploadFormVisible', false);
                    self.$refs['uploadForm'].resetFields();
                    self.uploadForm.file = null;
                    self.$refs.uploadFile.clearFiles();
                    self.$message({
                        type: 'success',
                        message: '上传成功!'
                    });

                    self.loadData();
                } else {
                    self.$message({
                        type: 'error',
                        message: res.error
                    });
                }
            });
        }
  },
  created() {
    this.loadData();
  }
}
</script>

<style>
.form-item {
 width: 320px;
}
</style>

