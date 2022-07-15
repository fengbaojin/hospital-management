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
          <el-form-item>
            <el-button type="primary" @click="batchAdd()">批量添加</el-button>
          </el-form-item>
        </el-form>

        <div class="auto">
            <div class="autoOne">
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
                    <el-table-column    prop="sellingPrice" type="text" style="width: 16%" label="售价(元)">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        style="width: 16%">
                        <template slot-scope="scope"  >
                            <el-button  v-if="scope.row.sellingPrice !== null " type="primary" size="mini" @click="updatePrice(scope.row)">修改</el-button>
                            <el-button  v-if="scope.row.sellingPrice === null " type="info" size="mini" @click="addPrice(scope.row)">添加</el-button>
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
            </div>
            <div class="autoTwo">
                <div class="autoTree" v-show="autoTreeShow">
                    <el-form ref="insertForm" :model="dataForm" :rules="rules" size="mini" label-width="100px">
                        <el-form-item label="药品名称" prop="drugName" class="form-item">
                            <el-input v-model="dataForm.drugName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="售价" prop="sellingPrice"  class="form-item">
                            <el-input-number v-model="dataForm.sellingPrice" :precision="2" :step="0.1" :min="0"></el-input-number>
                            <span style="margin-left: 10px ">元</span>
                        </el-form-item>
                        <el-form-item label="描述" prop="comment"  class="form-item">
                            <el-input v-model="dataForm.comment" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="mini" type="primary" @click="handleSave">保 存</el-button>
                        <el-button size="mini" style="margin-left: 14px;" @click="resetForm('insertForm')">取 消</el-button>
                    </div>
                </div>
                <div class="autoFour" v-show="autoFourShow">
                    <el-form ref="batchInsertFrom" :model="noSellingPriceList" size="mini" label-width="100px">
                        <el-row>
                            <el-col :span="24" style="text-align: center; margin-top: 10px; margin-bottom: 10px">
                                批量添加售价
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" style="text-align: center; margin-top: 10px; margin-bottom: 10px">
                                    药品名
                            </el-col>
                            <el-col :span="12" style="text-align: center; margin-top: 10px; margin-bottom: 10px">
                                    售价
                            </el-col>
                        </el-row>
                        <el-row v-for="item in noSellingPriceList" :key="item.drugId">
                            <el-col :span="12" style="margin-bottom: 20px">
                                <el-form-item prop="item.drugName" style="width: 320px">
                                    <el-input v-model="item.drugName" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" style="text-align: center; margin-top: 10px; margin-bottom: 10px">
                                <!-- <el-form-item  prop="item.sellingPrice" style="width: 320px">
                                    <el-input v-model="item.sellingPrice" autocomplete="off"></el-input>
                                </el-form-item> -->
                                <el-form-item  prop="item.sellingPrice"  style="width: 320px">
                                    <el-input-number v-model="item.sellingPrice" :precision="2" :step="0.1" :min="0"></el-input-number>
                                    <span style="margin-left: 10px ">元</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                     <div slot="footer" class="dialog-footer">
                        <el-button size="mini" type="primary" style="margin-left: 34%" @click="batchSave">保 存</el-button>
                        <el-button size="mini" style="margin-left: 14px;" @click="resetBtachForm('batchInsertFrom')">取 消</el-button>
                    </div>
                </div>
            </div>
        </div>
         

   </div>

</template>

<script>

import { listDrugPage, updateDrug, getDrugNoteList, updateSellingPrice, getNoSellingPrice, batchSellingPrice } from '@/api/APIDrugInventory'

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
      noSellingPriceList: [],
      dialogVisible: false,
      dataForm: {
        drugId: 0,
        drugName: "",
        sellingPrice: "",
        comment: "",
      },
      autoTreeShow: false,
      autoFourShow: false,
      loading: true,
      recordList: [],
      rules: {
        drugName: [
          { required: true, message: '请输入药品名称', trigger: ['blur', 'change'] }
        ],
        sellingPrice: [
          { required: true, message: '请输入售价', trigger: ['blur', 'change'] }
        ],
        comment: [
          { required: false, message: '请输入备注', trigger: ['blur', 'change'] }
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
          this.drugList =res.data.data
          console.log(this.drugList)
          this.total = res.data.total
        }
      })
    },
    check(data){
        return data.forEach(p => {
           p.sellingPrice = p.sellingPrice === null ? '' : p.sellingPrice
        });
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
      this.$set(this, 'autoTreeShow', false)
    },
    resetBtachForm(insertForm){
        this.$refs[insertForm].resetFields()
        this.$set(this, 'autoFourShow', false)
    },
    addPrice(row) {
       this.$set(this, 'autoTreeShow', true)
       this.$set(this, 'autoFourShow', false)
       this.dataForm = {
        ...row
      };
    },
    batchAdd(){
        this.$set(this, 'autoTreeShow', false)
        this.$set(this, 'autoFourShow', true)
        this.getNoSellingPriceList()
    },
    updatePrice(row) {
        console.log(row)
        this.$set(this, 'autoTreeShow', true)
        this.$set(this, 'autoFourShow', false)
         this.dataForm = {
                ...row
         };
    },
    getNoSellingPriceList() {
       getNoSellingPrice().then(res => {
        if(res.code === 0 ) {
              this.noSellingPriceList = res.data
              this.noSellingPriceList.forEach(item => {
                item.sellingPrice = item.sellingPrice === null ? "" :item.sellingPrice 
              })
        }
      })
    },
    handleSave() {
      this.$refs['insertForm'].validate((valid) => {
      if (valid) {
            updateSellingPrice(this.dataForm).then((res) => {
              this.loadData();
              this.$set(this, 'autoTreeShow', false);
              if(res.code === -1 ) {
                this.$message({
                  type: 'error',
                  message: res.error
                });
              }
            });
          }
      });
    },
    batchSave() {
        this.$refs['batchInsertFrom'].validate((valid) => {
        if (valid) {
            var data = this.noSellingPriceList.filter(p => p.drugName != null && p.sellingPrice != null).map(item => ({
              drugId: item.drugId,
              sellingPrice: item.sellingPrice,
            }))
            console.log(data);
            batchSellingPrice(data).then((res) => {
              this.loadData();
              this.$set(this, 'autoFourShow', false);
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
    // this.getNoSellingPriceList();
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
.auto{
  height: 700px;
}
.autoOne{
    position: relative;
    float: left;
    width: 50%;
    height: 100%;
}
.autoTwo{
   float: left;
    width: 50%;
    height: 100%;
}

.autoTree{
    width: 50%;
    margin: auto;
}
.dialog-footer{
    width: 50%;
    margin: auto;
    
}
</style>

