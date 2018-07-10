<template>
  <div class="container" @click="editForm.show=false;pfModel.show=false">
      <div class="comments-head">
        <span><i style="color:red;">*</i>日期</span>
        <el-date-picker
            v-model="date"
            type="daterange"
            size="small"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <div class="comments-body">
          <el-table
            border
            height="100%"
            stripe
            :data="List"
          >
            <el-table-column
                v-for="item in colModels"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                header-align="center"
                :align="item.align||'center'"
            >
                <template slot-scope="scope">
                    <div v-if="item.rate" @click.stop="item.click(scope.row,item.prop)">
                        <el-rate
                            v-if="scope.row[item.prop]"
                            v-model="scope.row[item.prop]"
                            disabled>
                        </el-rate>
                    </div>
                    <span
                        v-else
                        class="cell-span"
                        :class="{'cell-span-blue':item.click}"
                        @click="item.click?item.click(scope.row):null">
                        {{scope.row[item.prop]}}
                        <span v-if="item.prop=='hyname'&&scope.row.ishide" style="color:#ccc !important;">(匿名)</span>
                    </span>
                </template>
            </el-table-column>
          </el-table>
          <transition name="slideRight">
              <pf-details v-if="pfModel.show" :views="pfModel"></pf-details>
              <edit-member v-if="editForm.show" :views="editForm" :disabled="true"></edit-member>
          </transition>
      </div>
      <pagination :data="pagination" @current-change="changePage"></pagination>
      <!-- 单据详情 -->
      <order v-if="orderModel.show" :views="orderModel"></order>
  </div>
</template>
<script>
import pagination from '../../components/pagination/index'
import pfDetails from './details'
import order from './order'
import editMember from '../client/editMember'
export default {
  data(){
      return{
          date:[],
          pagination:{
            size:20,
            page:1,
            rows:0
          },
          colModels:[
              {label:'用户名称',prop:'hyname',width:150,click:this.openCustomer,format:this.formatName},
              {label:'商品评论',prop:'rate1',rate:true,click:this.openComments},
              {label:'门店评论',prop:'rate3',rate:true,click:this.openComments},
              {label:'营业员评论',prop:'rate2',rate:true,click:this.openComments},
              {label:'关联订单',prop:'djh',width:150,click:this.openOrder},
              {label:'门店',prop:'ssgsname',width:150,align:'left'},
              {label:'营业员',prop:'ywyname',width:100},
              {label:'评论时间',prop:'zdrq',width:150}
          ],
          List:[],
          allList:[],
          pfModel:{
              show:false,
              data:null,
              index:0
          },
          orderModel:{
            show:false,
            data:null
          },
          editForm:{
              show:false,
              data:null
          },
          pickerOptions: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
                }
            }]
          }
      }
  },
  methods:{
      changePage(page){
        this.pagination.page=page;
        this.List=this.allList.slice((this.pagination.page-1)*this.pagination.size,this.pagination.page*this.pagination.size);
        for(let obj of this.List){
            var temp=JSON.parse(obj.data.value);
            obj.rate1=temp.rate1;
            obj.rate1pic=temp.rate1pic;
            obj.ratecontent1=temp.ratecontent1;
            obj.rate2=temp.rate2;
            obj.rate2pic=temp.rate2pic;
            obj.ratecontent2=temp.ratecontent2;
            obj.rate3=temp.rate3;
            obj.rate3pic=temp.rate3pic;
            obj.ratecontent3=temp.ratecontent3;
            obj.ishide=temp.ishide;
            obj.ssgsname=this.$util.getCompanyInfo(obj.ssgsid).name;
            obj.ywyname=this.$util.getYgInfo(obj.ywydm).name;
        }
      },
      getList(){
        this.$http('/api/x6/crmGetRateList.do',{
            fsrqq:this.date[0],
            fsrqz:this.date[1]
        }).then(res=>{
            this.allList=res.List;
            this.pagination.rows=res.List.length;
            this.changePage(1);
        });
      },
      //打开单据
      openOrder(row){
        this.$http('/api/x6/loadLsBill.do',{
            djh:row.djh
        }).then(res=>{
            this.orderModel.data=res.List;
            this.orderModel.show=true;
        });
      },
      openCustomer(row){
        this.$http('/api/x6/getHyHyxxDetail.do', {
            id: row.hyid
        }).then((res) => {
            res.hyxx.tags=JSON.parse(res.hyxx.tags);
            this.editForm.data=res.hyxx;
            this.editForm.show=true;
        });
      },
      openComments(row,prop){
          if(!row[prop]){
              this.$message('用户未对此作出评价','error');
          }else{
              var title=prop=='rate1'?'商品评论':prop=='rate2'?'营业员评论 ('+row.ywyname+')':'门店评论 ('+row.ssgsname+')';
              this.pfModel.index=prop=='rate1'?1:prop=='rate2'?2:3;
              this.pfModel.data=Object.assign({},{title:title},row);
              this.pfModel.show=true;
          }
      },
      formatName(row){
          return row.hyname;
      }
  },
  mounted(){
      this.date.push(this.$util.getCurrentDate(-7));
      this.date.push(this.$util.getCurrentDate());
      this.getList();
  },
  components:{
      pagination,
      pfDetails,
      order,
      editMember
  }
}
</script>
<style lang="less" scoped>
    .container{
        width: 100%;
        height: 100%;
        background: #fff;
        .comments-head{
            box-sizing: border-box;
            padding:20px 10px;
        }
        .comments-body{
            height: ~"calc(100% - 125px)";
            position:relative;
        }
    }
</style>
