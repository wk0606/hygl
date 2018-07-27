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
            :picker-options="pickerOptions"
            @change="handleChange">
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
                :width="item.width"
            >
                <template slot-scope="scope">
                    <div v-if="item.rate" @click.stop="item.click(scope.row,item.prop)" style="position:relative;">
                        <el-rate
                            v-if="scope.row[item.prop]"
                            v-model="scope.row[item.prop]"
                            disabled>
                        </el-rate>
                        <div
                            class="mask"
                        ></div>
                    </div>
                    <span
                        v-if="item.prop=='detail'"
                        class="cell-span cell-span-blue"
                        @click.stop="openAllComments(scope.row)"
                        >查看详情</span>
                    <span
                        v-if="!item.rate&&item.prop!='detail'"
                        class="cell-span"
                        :class="{'cell-span-blue':item.click}"
                        @click="item.click?item.click(scope.row):null">
                        {{scope.row[item.prop]}}
                        <span v-if="item.prop=='hyname'&&scope.row.ishide" style="color:#ccc !important;position:absolute;right:8px;top:12px;">(匿名)</span>
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
              {label:'评论详情',prop:'detail',width:90},
              {label:'关联订单',prop:'djh',width:150,click:this.openOrder},
              {label:'门店',prop:'ssgsname',width:150,align:'left'},
              {label:'营业员',prop:'ywyname',width:100},
              {label:'评论时间',prop:'zdrq',width:150}
          ],
          List:[],
          allList:[],
          pfModel:{
              show:false,
              data:[]
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
      handleChange(){
          this.getList();
      },
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
              this.pfModel.data=this.createGroup(row,[prop]);
              this.pfModel.show=true;
          }
      },
      //打开所有评论
      openAllComments(row){
          var props=['rate1','rate2','rate3'];
          this.pfModel.data=this.createGroup(row,props);
          this.pfModel.show=true;
      },
      createGroup(row,propList){
        var array=[];
        for(let prop of propList){
            if(!row[prop])
                continue;
            var index=prop=='rate1'?1:prop=='rate2'?2:3;
            var temp={};
            temp.icon=prop=='rate1'?'icon-shangpin-':prop=='rate2'?'icon-fl-renyuan':'icon-mendiantianchong';
            temp.color=prop=='rate1'?'#F56C6C':prop=='rate2'?'#67C23A':'#409EFF';
            temp.title=prop=='rate1'?'商品评论':prop=='rate2'?'营业员评论 ('+row.ywyname+')':'门店评论 ('+row.ssgsname+')';
            temp.rate=row[prop];
            temp.content=row['ratecontent'+index];
            temp.pics=row['rate'+index+'pic']?row['rate'+index+'pic'].split(','):[];
            array.push(temp);
        }
        return array;
      },
      formatName(row){
          return row.hyname;
      }
  },
  mounted(){
      this.date.push(this.$util.getDateByDistance(-90));
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
    .mask{
        width:100%;
        height:100%;
        position:absolute;
        top:0;
        left:0;
        cursor: pointer;
    }
</style>
