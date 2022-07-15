<template>
    <div id="person_index">
      <!-- 行内表单组件，搜索 -->
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="药品名称">
            <el-input v-model="drugName" clearable @keyup.enter.native="iptNameEnter" placeholder="输入药品名称搜索"></el-input>
          </el-form-item>
          <el-form-item label="出库日期">
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
            <el-button type="primary"  @click="saleOfDrugs()">出库</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addWareHouseExcel()">文件上传</el-button>
          </el-form-item>
        </el-form>
          <!-- 表格组件 -->
        <el-table :data="drugWareHouseList" border 
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
                prop="comment"
                type="text"
                style="width: 16%"
                label="描述">
            </el-table-column>
            <el-table-column
                prop="createdName"
                style="width: 16%"
                label="出库人">
            </el-table-column>
            <el-table-column
                prop="createdDate"
                style="width: 10%"
                label="出库时间">
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
				<!-- <el-form-item label="药品名称" prop="drugName" class="form-item">
					<el-input v-model="dataForm.drugName" autocomplete="off"></el-input>
				</el-form-item> -->
        <el-form-item label="药品名称" prop="drugName" class="form-item">
					<el-select v-model="dataForm.drugId" filterable placeholder="请选择">
            <el-option
              v-for="item in drugList"
              :key="item.drugId"
              :label="item.drugName"
              :value="item.drugId">
            </el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="数量" prop="quantity"  class="form-item">
          <el-input-number v-model="dataForm.quantity" :min="0" ></el-input-number>
          <span style="margin-left: 10px ">支</span>
				</el-form-item>
       <el-form-item label="描述" prop="drugName" class="form-item">
					<el-input v-model="dataForm.comment" autocomplete="off"></el-input>
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

import { listDrugSaleRecordPage, saleOfDrugs, getDrugByName } from '@/api/APIDrugInventory'

export default {
  name: "retrieval",
  data() {
    return{
      drugName: "",
      drugList: [],
      confirmJoinTime: [],
      pageIndex: 1,
      pageSize: 10,
      total:0,
      drugWareHouseList: [],
      dialogVisible: false,
      dataForm: {
        drugId: null,
        quantity: 0,
        comment: "",
      },
      initialization: {
        drugId: null,
        quantity: 0,
        comment: "",
      },
      loading: true,
      rules: {
        drugId: [
          { required: true, message: '请输入药品名称', trigger: ['blur', 'change'] }
        ],
        quantity: [
          { required: true, message: '请输入药品数量', trigger: ['blur', 'change'] },
        ],
        comment: [
          { required: true, message: '请输入药品名称', trigger: ['blur', 'change'] }
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
      listDrugSaleRecordPage(params).then(res => {
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
    saleOfDrugs() {
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
    resetForm(insertForm) {
          this.dataForm = this.initialization
          this.$refs[insertForm].resetFields()
          this.$set(this, 'dialogVisible', false)
    },
    changeDate() {

    },
    handleSave() {
      this.$refs['insertForm'].validate((valid) => {
      if (valid) {
            saleOfDrugs(this.dataForm).then((res) => {
              this.loadData();
              this.$set(this, 'dialogVisible', false);
              if(res.code === -1 ) {
                this.$message({
                  type: 'error',
                  setTimeout:"400",
                  message: res.error_description
                });
              }
            });
          }
      });
    },
    getDrugByNameList() {
      getDrugByName().then(res => {
        if (res.code === 0) {
          this.drugList = res.data
        }
      })
    }
  },
  created() {
    this.loadData();
    this.getDrugByNameList();
  }
}
</script>

<style>
.form-item {
 width: 320px;
}
</style>




