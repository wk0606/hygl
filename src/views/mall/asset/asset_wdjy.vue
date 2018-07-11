<template>
  <div>
      <div class="asset-body-header">
          <p>说明:</p>
          <p>1.针对店铺门店和网点的销售和退款情况的统计</p>
          <p>2.净销售额 = 销售小计金额 - 退款小计金额</p>
      </div>
      <div class="asset-body-bar">
          <span>时间选择 : </span>
          <div>
              <div>
                <el-date-picker
                    v-model="date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    size="mini">
                </el-date-picker>
                <span
                    v-for="item in datePickes"
                    :key="item.value"
                    class="span-btn"
                >{{item.label}}</span>
              </div>
              <div>
                  <el-button size="mini" type="primary">查询</el-button>
                  <el-button size="mini" @click="exportExcel">导出</el-button>
              </div>
          </div>
      </div>
      <div>
          <el-table
            :data="List"
          >
            <el-table-column
                label="日期"
                prop="fsrq"
                align="left"
            >
                <template slot-scope="scope">
                    <span class="cell-span">{{scope.row.fsrq}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="净销售金额"
                prop="xsje"
                align="left"
            >
                <template slot-scope="scope">
                    <span class="cell-span">{{scope.row.xsje | currency}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="销售小计"
                prop="xsxj"
                align="left"
                header-align="left"
            >
                <template slot-scope="scope">
                    <p><span class="cell-span">{{scope.row.xsxj.je | currency}}元</span></p>
                    <p><span class="cell-span">{{scope.row.xsxj.sl}}笔</span></p>
                </template>
            </el-table-column>
            <el-table-column
                label="退款小计"
                prop="xsxj"
                align="left"
                header-align="left"
            >
                <template slot-scope="scope">
                    <p><span class="cell-span">{{scope.row.tkxj.je | currency}}元</span></p>
                    <p><span class="cell-span">{{scope.row.tkxj.sl}}笔</span></p>
                </template>
            </el-table-column>
          </el-table>
          <div>
              <pagination :data="page"></pagination>
          </div>
      </div>
  </div>
</template>
<script>
import pagination from '../../../components/pagination/index'
import {excel} from '../../../func/excel'
export default {
  data(){
    return {
      tabs:[
        {label:'网点交易',component:'wdjy'},
        {label:'交易明细',component:'jymx'}
      ],
      currentTab:'wdjy',
      date:[],
      datePickes:[
          {label:'今',value:0},
          {label:'昨',value:-1},
          {label:'最近7日',value:-7},
          {label:'最近30日',value:-30},
      ],
      page:{
          no:1,
          size:10,
          rows:23
      },
      List:[
          {fsrq:'2018-09-12',xsje:766,xsxj:{je:76,sl:4},tkxj:{je:17,sl:7}},
          {fsrq:'2018-09-12',xsje:766,xsxj:{je:76,sl:4},tkxj:{je:17,sl:7}},
          {fsrq:'2018-09-12',xsje:766,xsxj:{je:76,sl:4},tkxj:{je:17,sl:7}},
          {fsrq:'2018-09-12',xsje:766,xsxj:{je:76,sl:4},tkxj:{je:17,sl:7}}
      ],
      exportDatas: {
        fileName: "网店交易",
        title: "网店交易",
        data: [],
        columns: [],
        condition: ''
      }
    }
  },
  methods:{
      calcTotal(){
          var temp={
              fsrq:'总计',
              xsje:0,
              xsxj:{
                je:0,
                sl:0
              },
              tkxj:{
                je:0,
                sl:0
              }
          };
          for(let obj of this.List){
              temp.xsje+=obj.xsje;
              temp.xsxj.je+=obj.xsxj.je;
              temp.xsxj.sl+=obj.xsxj.sl;
              temp.tkxj.je+=obj.tkxj.je;
              temp.tkxj.sl+=obj.tkxj.sl;
          }
          this.List.splice(0,0,temp);
      },
      exportExcel(){
          this.exportDatas.condition=this.date.join('--');
          var cols=[
            {label:'日期',prop:'fsrq'},
            {label:'净销售金额',prop:'xsje'},
            {label:'销售小计',prop:'xsxj'},
            {label:'退款小计',prop:'tkxj'}
          ];
          for(let obj of cols){
            this.exportDatas.columns.push({colName: obj.label});
          }
          for(let row of this.List){
            let _temp=[];
            for(let obj of cols){
              if(obj.prop=='xsxj'||obj.prop=='tkxj'){
                  _temp.push(`${row[obj.prop].je}元 / ${row[obj.prop].sl}笔`);
              }else{
                  _temp.push(row[obj.prop]||0);
              }
            }
            this.exportDatas.data.push(_temp);
          }
          excel.open(this.exportDatas);
      }
  },
  mounted(){
      this.date.push(this.$util.getDateByDistance(-7));
      this.date.push(this.$util.getCurrentDate());
      this.calcTotal();
  },
  components:{
      pagination
  }
}
</script>
<style lang="less" scoped>
  .asset-body-header{
      font-size: 12px;
      color:#999;
      padding-bottom:15px;
      p{
          line-height: 18px;
      }
  }
  .asset-body-bar{
      box-sizing: border-box;
      padding: 15px;
      background: #fafafa;
      display: flex;
      align-items: flex-start;
      >span{margin-right: 5px;line-height: 28px;}
      >div{
          .span-btn{
              cursor: pointer;
              color:#ddd;
              margin-left: 10px;
              padding: 2px 5px;
              border: 1px solid #ddd;
              border-radius: 2px;
          }
      }
      .el-button{margin-top: 15px;}
  }
</style>
