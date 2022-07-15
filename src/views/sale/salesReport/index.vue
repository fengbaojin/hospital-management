<template>
   <div id="sales_report_index">
       <div class="left-sales">
            <div class="grid-content" >
                  <!-- 行内表单组件，搜索 -->
                  <el-form :inline="true" class="demo-form-inline">
                      <el-form-item label="日期">
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
                      <span class="grid-text">*默认显示当前一个月</span>
                  </el-form>
                  
                   <!-- 表格组件 -->
                  <el-table :data="everyNameSellList" border 
                        v-loading="loading"
                        element-loading-text="读取中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                        @sort-change='sortChange'     
                        style="width: 100%; margin-bottom: 20px;text-align: center">
                    <el-table-column
                        prop="name"
                        label="员工姓名">
                    </el-table-column>
                    <el-table-column
                        sortable='custom'
                        prop="salesVolume"
                        label="销售额(元)">
                    </el-table-column>
                    <el-table-column
                        sortable='custom'
                        prop="amount"
                        label="销售数量">
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
            </div>
            <div class="trid-content" >
                <div class="block" style="height: 40px;">
                  <span class="demonstration" style="margin-right: 5px">选择月份</span>
                  <el-date-picker
                    size="mini"
                    v-model="monthTwo"
                    clearable
                    type="month"
                    value-format="yyyy-MM"
                    @change="changeMonthOne()"
                    placeholder="选择月份">
                  </el-date-picker>
                </div>
                <div id="salesVolume" class="trid-content-salesVolume" style="height: 600px;"></div>
                <!-- <div id="amount" class="trid-content-amount" style="height: 200px;"></div> -->
            </div>
       </div>
       <div class="chart">
            <div class="block" style="height: 40px;">
              <span class="demonstration" style="margin-right: 5px">选择月份</span>
              <el-date-picker
                size="mini"
                v-model="month"
                clearable
                type="month"
                value-format="yyyy-MM"
                @change="changeMonth()"
                placeholder="选择月份">
              </el-date-picker>
            </div>
            <div id="main" class="blockTwo"  style="height: 280px;"></div>
       </div>
   </div>
</template>

<script>

import moment from 'moment'
import { getTurnoverByLastThirtyDay, getTurnoverByEveryMonth, getRankingByEveryMonth ,getSalesVolumeByName , getAmountByName, getSaleByName } from '@/api/APIDrugInventory'
import * as echarts from 'echarts'

export default {
  name: "salesReport",
  data() {
    return{
      orderBy: null,
      pageIndex: 1,
      pageSize: 10,
      total:0,
      sales: {},
      confirmJoinTime: [],
      lastMonthSell:{},
      everyMonthSellList:[],
      salesVolumeList: [],
      amountList:[],
      everyNameSellList:[],
      loading: false,
      month: "",
      monthTwo: "",
      a:[],
      option: {
        title: {
          text: '每天销售',
          subtext: '趋势图',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['销售额', '销售数量', '盈利额']
        },
        xAxis: {
           type: 'category',
           interval: 0,
           boundaryGap: false,
           data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: "销售额",
            data: [],
            type: 'line'
          },
          {
            name: "销售数量",
            data: [],
            type: 'line'
          },
          {
            name: "盈利额",
            data: [],
            type: 'line'
          }
        ]
      },
      pieOption: {
        title: {
          text: '药品销售统计',
          subtext: '比例图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: "销售额",
            type: 'pie',
            radius: '40%',
            center: ['25%', '50%'],
            data: [
            
            ],  
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          {
            name: "销售数量",
            type: 'pie',
            radius: '40%',
            center: ['75%', '50%'],
            data: [
             
            ],  
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
      }
    }
  },
  methods: {
    // 获取排序
    sortChange(column) {
        this.orderBy = ''
        var fileName = column.prop;
        var orderType = column.order
        if (orderType === 'ascending') {
          this.orderBy = fileName + ' asc'
        } else {
          this.orderBy = fileName + ' desc'
        }
        console.log(this.orderBy)
        this.getRankingByEveryMonth()
    },
     // 驼峰命名转成短横线
    // getKebabCase(str) {
    //   return str.replace(/[A-Z]/g, function(i) {
    //     return '_' + i.toLowerCase();
    //   })
    // },
    handleSizeChange(val) {
      this.$set(this, 'pageSize', val);
      this.getRankingByEveryMonth();
    },
    handleCurrentChange(val) {
      this.$set(this, 'pageIndex', val);
      this.getRankingByEveryMonth();
    },
    getTurnoverByLastThirtyDay() {
      getTurnoverByLastThirtyDay().then(res => {
        if (res.code === 0) {
          this.lastMonthSell = res.data
        }
      })
    },
    getTurnoverByEveryMonth() {
      const params = {
          month: this.month
      }
      getTurnoverByEveryMonth(params).then(res => {
        if (res.code === 0) {
          this.everyMonthSellList = res.data
        }
        this.option.xAxis.data = this.everyMonthSellList.map(item => item.date)
        this.option.series[0].data = this.everyMonthSellList.map(item =>item.salesVolume)
        this.option.series[1].data = this.everyMonthSellList.map(item =>item.amount)
        this.option.series[2].data = this.everyMonthSellList.map(item =>item.profitNumber)
        this.xuanRan("main",this.option);
      })
    },
    getSalesVolume(params) {
      getSalesVolumeByName(params).then(res => {
        if (res.code === 0) {
          this.salesVolumeList = res.data
        }
        this.pieOption.series[0].data = this.salesVolumeList.map(item => ({
          name: item.drugName,
          value: item.salesVolume
        }))
      })
    },
    getAmount(params) {
      getAmountByName(params).then(res => {
        if (res.code === 0) {
          this.amountList = res.data
        }
        this.pieOption.series[1].data = this.amountList.map(item => ({
          name: item.drugName,
          value: item.amount
        }))
      })
    },
    getSalleByMonth() {
      const params = {
          month: this.monthTwo
      }
      // this.getSalesVolume(params)
      // this.getAmount(params)
      getSaleByName(params).then(res => {
          if (res.code === 0) {
            this.sales = res.data
          }
          this.pieOption.series[0].data = this.sales.salesVolumeList.map(item => ({
            name: item.drugName,
            value: item.salesVolume
          }))
          this.pieOption.series[1].data = this.sales.amountList.map(item => ({
            name: item.drugName,
            value: item.amount
          }))
          this.xuanRan("salesVolume",this.pieOption);
      })
    },
    xuanRan(row,option) {
      var chartDom = document.getElementById(row);
      var myChart = echarts.init(chartDom);
      myChart.setOption(option);
    },
    getRankingByEveryMonth() {
      this.loading = true;
      const params = {
        startDate: this.confirmJoinTime === null ? '' : this.confirmJoinTime[0],
        endDate: this.confirmJoinTime === null ? '' : this.confirmJoinTime[1],
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        orderBy: this.orderBy
      }
      getRankingByEveryMonth(params).then(res => {
        if (res.code === 0) {
          this.everyNameSellList = res.data.data
          this.total = res.data.total
          this.loading=false
        }
        if(res.code === -1 ) {
          this.loading=false
          this.$message({
            type: 'error',
            setTimeout:"400",
            message: res.error_description
          });
        }
      })
    },
    changeDate(){
      this.getRankingByEveryMonth();
    },
    changeMonthOne() {
      this.getSalleByMonth();
    },
    changeMonth() {
      this.getTurnoverByEveryMonth();
    }
  },
  created() {
    this.month = moment().format('YYYY-MM')
    this.monthTwo = moment().format('YYYY-MM')
    // 本月销售情况
    this.getTurnoverByLastThirtyDay();
    // 当前月份每天销售情况
    this.getTurnoverByEveryMonth();
    // 销售情况(按人民)
    this.getRankingByEveryMonth();
     // 销售情况(饼图数据)
    this.getSalleByMonth()
  },
  mounted() { 
    // var chartDom = document.getElementById("salesVolume");
    //   var myChart = echarts.init(chartDom);
    //   myChart.setOption(this.pieOption);
  }
}
</script>

<style>
.left-sales{
  width: 100%;
  height: 500px;
}
.chart{
  width: 100%;
  height: 320px;
}
.grid-content{
  width: 49%;
  height: 100%;
  position: relative;
  float: left;
  border: 1px;
  margin-right: 2%;
}
.trid-content{
  width: 49%;
  height: 100%;
  float: left;
}
.grid-text{
  margin-left: 20px;
  font-size: 12px;
  color: red;
}

</style>
