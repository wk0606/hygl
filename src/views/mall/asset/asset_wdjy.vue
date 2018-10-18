<template>
  <div>
      <div class="asset-body-header">
          <p>说明:</p>
          <p>1.针对网店的销售和退款情况的统计</p>
          <p>2.净销售额 = 销售小计金额 - 退款小计金额</p>
      </div>
      <div class="asset-body-bar">
          <span>时间选择 : </span>
          <div>
              <div>
                <date-picker :date.sync="date" need-option></date-picker>
              </div>
              <div>
                  <el-button size="mini" type="primary" @click="getList">查询</el-button>
                  <el-button size="mini" @click="exportExcel">导出</el-button>
              </div>
          </div>
      </div>
      <div>
          <el-table
            :data="List"
          >
            <div slot="empty" class="empty-tip">
                <i class="iconfont icon-zanwushuju"></i>
                <span>暂无数据</span>
            </div>
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
                    <span class="cell-span">￥{{scope.row.jxsxj | currency}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="销售小计"
                prop="xsxj"
                align="left"
                header-align="left"
            >
                <template slot-scope="scope">
                    <p v-if="List.length"><span class="cell-span">￥{{scope.row.xsxj | currency}}</span></p>
                    <p v-if="List.length"><span class="cell-span">{{scope.row.xssl}}笔</span></p>
                </template>
            </el-table-column>
            <el-table-column
                label="退款小计"
                prop="tkxj"
                align="left"
                header-align="left"
            >
                <template slot-scope="scope">
                    <p v-if="List.length"><span class="cell-span">￥{{scope.row.tkxj | currency}}</span></p>
                    <p v-if="List.length"><span class="cell-span">{{scope.row.tksl}}笔</span></p>
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
import datePicker from '../../../components/datePicker/index'
import {excel} from '../../../func/excel'
export default {
  data(){
    return {
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
          rows:0
      },
      List:[],
      exportDatas: {
        fileName: "网店交易",
        title: "网店交易",
        data: [],
        columns: [],
        condition: '',
        exportFlag:1,
        paramData:{},
        url:'/api/x6/exportWdjyExcel.do'
      }
    }
  },
  methods:{
      //日期快捷选择
      selectDate(d) {
        this.date = [this.$util.getDateByDistance(d), this.$util.getCurrentDate()];
      },
      getList(){
          this.$http('/api/x6/getWdjyList.do',{
              fsrqs:this.date[0]||'',
              fsrqz:this.date[1]||'',
              pageSize:this.page.size,
              pageNo:this.page.no
          }).then(res=>{
              this.List=res.rows;
              this.page.rows=res.totalRows;
          });
      },
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
            {label:'日期',colLx:'fsrq'},
            {label:'净销售金额',colLx:'jxsxj',isSum:1,align:'right'},
            {label:'销售金额小计',colLx:'xsxj',isSum:1,align:'right'},
            {label:'销售数量小计',colLx:'xssl',isSum:1,align:'right'},
            {label:'退货金额小计',colLx:'tkxj',isSum:1,align:'right'},
            {label:'退货数量小计',colLx:'tksl',isSum:1,align:'right'}
          ];
          for(let obj of cols){
            var temp = {};
            temp.colName = obj.label;
            temp.colLx=obj.colLx;
            if (obj.hasOwnProperty('isSum'))
                temp.isSum = obj.isSum;
            if (obj.hasOwnProperty('align'))
                temp.align = obj.align;
            this.exportDatas.columns.push(temp);
          }
          this.exportDatas.paramData={
              fsrqs:this.date[0]||'',
              fsrqz:this.date[1]||''
          };
          excel.open(this.exportDatas);
      }
  },
  mounted(){
      this.date.push(this.$util.getDateByDistance(-7));
      this.date.push(this.$util.getCurrentDate());
      //this.calcTotal();
  },
  components:{
      pagination,
      datePicker
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
