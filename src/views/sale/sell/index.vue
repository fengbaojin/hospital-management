<template>
    <div id="person_index">
      <!-- 行内表单组件，搜索 -->
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="药品名称">
            <el-input v-model="drugName" clearable placeholder="输入药品名称搜索"></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="startMoney" clearable placeholder="最低价" style="width:100px"></el-input>
             <span style="margin-left: 10px; margin-right: 10px">-</span>
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
          <el-form-item label="描述">
            <el-input v-model="describe" clearable placeholder="输入药品描述"></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="quantity" style="width:120px" clearable placeholder="输入药品数量"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="btnSearch()">搜索</el-button>
          </el-form-item>
        </el-form>
          <!-- 表格组件 -->
        <div class="containDrug">
             <div class="shopSell" v-for="item in  drugList" :key="item.drugId">
                 <div class="shopSellContain">药名：{{item.drugName}}</div>
                 <div class="shopSellContain">价格：{{item.money}}</div>
                 <div class="shopSellContain">售价：{{item.sellingPrice}}</div>
                  <div class="shopSellContain">数量：{{item.quantity}}</div>
                 <div class="shopSellContain" style="font-size: 10px">描述：{{item.describe}}</div>
                 <div class="shopSellContain">
                    <el-input-number v-model="item.saleQuantity" :min="0"></el-input-number>
                    <span style="margin-left: 10px ">支</span>
                 </div>
                 <div class="shopSellButton">
                    <el-button type="primary" style="margin-left: 40px;" @click="saleOfDrugs(item)">出售</el-button>
                 </div>
             </div>
             
        </div>

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

</template>

<script>

import { listDrugPage, updateDrug, getDrugNoteList,saleOfDrugs } from '@/api/APIDrugInventory'

export default {
  name: "sell",
  data() {
    return{
      drugName: "",
      describe: "",
      quantity: null,
      confirmJoinTime: [],
      pageIndex: 1,
      pageSize: 10,
      startMoney: null,
      endMoney: null,
      tablenone: "none",
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
    saleOfDrugs(row){
      const params = {
        drugId: row.drugId,
        quantity: row.saleQuantity
      }
      saleOfDrugs(params).then((res) => {
          this.loadData();
          if(res.code === 0){
            this.$message({
              type:'success',
              setTimeout:"400",
              message: '出售成功！'
            })
          }
          if(res.code === -1 ) {
            this.$message({
              type: 'error',
              setTimeout:"400",
              message: res.error_description
            });
          }
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
    },
    enter() {
      console.log("hhh");
      this.tablenone = "block"
      
    },
    leave() {
      console.log("ttt");
    },
    mouseover() {
      console.log("hhh2");
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
.containDrug{
  width: 100%;
  height: 700px;
 
}
.shopSell {
  width: 210px;
  height: 210px;
  position: relative;
  float: left;
  padding: 20px;
  margin-left: 40px;
   margin-right: 40px;
  background-color: rgb(248, 248, 248);
  margin-bottom: 50px;
  margin-top: 40px;
}
.suspendiv{
  width: 100px;
  height: 100px;
  display: none;
  position: absolute;
  border: 1px solid #fcfbfb;
}
.shopSellContain{
  height: 37.3;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-top: 5px;
}
.shopSellButton{
  height: 37.3px;
  padding-bottom: 5px;
  padding-left: 30px;
  padding-top: 10px;
}
</style>

