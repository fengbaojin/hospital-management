<template>
    <div id="person_index">
      <!-- 行内表单组件，搜索 -->
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="药品名称">
            <el-input v-model="drugName" clearable placeholder="输入药品名称搜索"></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="startMoney" clearable placeholder="最低价" style="width:100px" size="mini"></el-input>
             <span style="margin-left: 20px; margin-right: 20px">-</span>
            <el-input v-model="endMoney" clearable placeholder="最高价" style="width:100px"></el-input>
          </el-form-item>
          <el-form-item label="生产日期">
            <el-date-picker
              v-model="confirmJoinTime"
              type="daterange"
              range-separator="至"
              start-placeholder="生产日期起始时间"
              end-placeholder="生产日期结束时间"
              @change="changeDate()"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="btnSearch()">搜索</el-button>
          </el-form-item>
        </el-form>
          <!-- 表格组件 -->
        <el-table :data="drugList" border 
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
                prop="money"
                style="width: 16%"
                label="价格">
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
                label="操作"
                style="width: 16%">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="update(scope.row)">修改</el-button>
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
				<el-form-item label="药品名称" prop="drugName" class="form-item">
					<el-input v-model="dataForm.drugName" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="价格" prop="money"  class="form-item">
          <el-input-number v-model="dataForm.money" :step="2"></el-input-number>
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
        <el-form-item label="描述" prop="describe"  class="form-item">
					<el-input v-model="dataForm.describe" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
      <div class="errorContent remark" v-if="recordList.length>0 ">
            <div class="remark-list" v-for="item in recordList" :key="item.id">
                {{ item.createdName+'修改了药品  '+item.drugName +'：' + item.describe + ' ' +item.createdDate }} 
            </div>
      </div>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="resetForm('insertForm')">取 消</el-button>
				<el-button size="mini" type="primary" @click="handleSave">保 存</el-button>
			</div>
		</el-dialog>


   </div>

</template>

<script>

import { listDrugPage, updateDrug, getDrugNoteList } from '@/api/APIDrugInventory'

export default {
  name: "stock",
  data() {
    return{
      drugName: "",
      confirmJoinTime: [],
      pageIndex: 1,
      pageSize: 10,
      startMoney: null,
      endMoney: null,
      total:0,
      drugList: [],
      dialogVisible: false,
      dataForm: {
        drugName: "",
        money: 0,
        quantity: 0,
        productionDate: null,
        describe: "",
      },
      loading: true,
      recordList: [],
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
        ]
      }
    }
  },
  methods: {
    loadData() {
      this.loading = true;
      const params = {
        drugName: this.drugName,
        startMoney: this.startMoney,
        endMoney: this.endMoney,
        startProductionDate: this.confirmJoinTime === null ? '' : this.confirmJoinTime[0],
        endProductionDate: this.confirmJoinTime === null ? '' : this.confirmJoinTime[1],
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }
      listDrugPage(params).then(res => {
        if (res.code === 0) {
          this.loading = false;
          this.drugList = res.data.data
          this.total = res.data.total
        }
      })
    },
    btnSearch() {
      this.pageIndex = 1
      this.loadData();
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
    update(row) {
      this.dataForm = {
        ...row
      };
      getDrugNoteList({drugId: row.drugId }).then(res => {
        if(res.code === 0 ) {
              this.recordList = res.data
            }
      })
        this.$set(this, 'dialogVisible', true)
    },
    handleSave() {
      this.$refs['insertForm'].validate((valid) => {
      if (valid) {
            updateDrug(this.dataForm).then((res) => {
              this.loadData();
              this.$set(this, 'dialogVisible', false);
              if(res.code === -1 ) {
                this.$message({
                  type: 'error',
                  message: res.error
                });
              }
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
.remark-list{
  font-size: 10px;
  text-align: center;
  border-bottom: 1px solid #ccc;
  padding: 4px;
}
</style>

