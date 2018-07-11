<template>
  <div>
      <div class="jymx-header">
          <div>
            <el-select v-model="searchParams.type" size="mini">
                <el-option label="创建时间" value="1"></el-option>
                <el-option label="结算时间" value="2"></el-option>
            </el-select>
            <el-date-picker
                v-model="searchParams.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                size="mini">
            </el-date-picker>
            <span class="span-label">单号:</span>
            <el-input size="mini" v-model="searchParams.djh" placeholder="订单号/退款单号/交易号"></el-input>
          </div>
          <div>
              <el-button size="mini" type="primary">查询</el-button>
              <el-button size="mini">导出</el-button>
          </div>
      </div>
      <div class="wdsp-tab">
          <div
            v-for="item in tabs"
            :key="item.value"
            :class="{selected:item.value==currentValue}"
          >{{item.label}}</div>
      </div>
      <div>
          <m-table :data="List" :colModel="colModel"></m-table>
      </div>
      <div>
          <pagination :data="page"></pagination>
      </div>
  </div>
</template>
<script>
import mTable from '../../../components/table/index'
import pagination from '../../../components/pagination/index'
export default {
  data(){
      return {
         searchParams:{
             type:"1",
             date:[],
             djh:''
         },
         tabs:[
              {label:'全部',value:'1'},
              {label:'已结算',value:'2'},
              {label:'未结算',value:'3'}
         ],
         currentValue:'1',
         colModel:[
             {label:'分类',prop:'lx'},
             {label:'创建时间',prop:'zdrq'},
             {label:'名称/对方/交易号',prop:'title'},
             {label:'金额/明细',prop:'mx'},
             {label:'状态',prop:'status'},
         ],
         List:[],
         page:{
             no:1,
             size:20,
             rows:30
         },
      }
  },
  mounted(){
      this.searchParams.date.push(this.$util.getDateByDistance(-7));
      this.searchParams.date.push(this.$util.getCurrentDate());
  },
  components:{
      mTable,
      pagination
  }
}
</script>
<style lang="less" scoped>
    .jymx-header{
        display: flex;
        justify-content: space-between;
        .el-select{width:150px;margin-right: 10px;}
        .el-input{width: 200px;}
        .span-label{margin-left: 10px;margin-right: 5px;}
    }
    .wdsp-tab{
        margin: 15px 0;
    }
</style>
