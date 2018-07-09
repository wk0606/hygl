<template>
  <pop-up
    title="单据详情"
    width="750"
    :views="views"
  >
    <div class="content" slot="content">
        <div class="o-header">
            <span
                v-for="item in headers"
                :key="item.prop"
            >{{item.label}} ：<span></span>{{views.data.header[item.prop]}}</span>
        </div>
        <div class="o-body">
            <el-table
                :data="views.data.billList"
                border
                stripe
                height="100%"
            >
                <!-- <el-table-column
                    type="index"
                    width="50"
                    align="center">
                </el-table-column> -->
                <el-table-column
                    v-for="col in colModel"
                    :key="col.prop"
                    :prop="col.prop"
                    :label="col.label"
                    header-align="center"
                    :align="col.align"
                    :width="col.width"
                >
                    <template slot-scope="scope">
                        <span class="cell-span" :title="scope.row[col.prop]">{{col.currency?$util.formatCash(scope.row[col.prop]):scope.row[col.prop]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="绑定"
                    width="90"
                    align="center"
                >
                    <template slot-scope="scope">
                        <i class="iconfont icon-icon3" :class="{highlight1:scope.row.zpsl>0}" @click="openZp(scope.row)"></i>
                        <i class="iconfont icon-xinhao" :class="{highlight2:scope.row.tcdm}" @click="openTc(scope.row)"></i>
                    </template>
                </el-table-column>
            </el-table>
            <transition name="slideRight">
                <!-- 赠品 -->
                <div class="o-slide" v-if="zpInfo.show">
                    <div class="o-solid-title">
                        <span>赠品详情</span>
                        <i class="el-icon-close" @click="zpInfo.show=false"></i>
                    </div>
                    <div
                        class="o-zp-item"
                        v-for="(item,index) in zpInfo.data"
                        :key="index"
                    >
                        <span>{{item.qspmc}}</span>
                        <span>×{{item.sl}}</span>
                    </div>
                </div>
                <!-- 套餐 -->
                <div class="o-slide" v-if="tcInfo.show">
                    <div class="o-solid-title">
                        <span>套餐详情</span>
                        <i class="el-icon-close" @click="tcInfo.show=false"></i>
                    </div>
                    <div
                        class="o-zp-item o-tc-item"
                        v-for="tc in tcModel"
                        :key="tc.prop"
                    >
                        <span>{{tc.label}}</span>
                        <span>{{tcInfo.data[tc.prop]}}</span>
                    </div>
                    <div class="o-zp-item o-tc-item">
                        <span>手机号码</span>
                        <div>
                            <span v-for="phone in tcInfo.data.phone" :key="phone.tcphone">{{phone.tcphone}}</span>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
  </pop-up>
</template>
<script>
import popUp from '../../components/popUp/index'
export default {
  props:['views'],
  data(){
      return{
          headers:[
              {prop:'fsrq',label:'日期'},
              {prop:'hyname',label:'客户'},
              {prop:'ywymc',label:'营业员'},
              {prop:'ckmc',label:'仓库'}
          ],
          colModel:[
              {prop:'ch',label:'序列号',align:'center'},
              {prop:'qspmc',label:'商品名称'},
              {prop:'sl',label:'数量',align:'right',width:80},
              {prop:'dj',label:'单价',align:'right',currency:true,width:120},
              {prop:'je',label:'金额',align:'right',currency:true,width:120}
          ],
          zpInfo:{
              show:false,
              data:null
          },
          tcInfo:{
              show:false,
              data:null
          },
          tcModel:[
              {prop:'tcname',label:'套餐名称'},
              {prop:'ywlx',label:'业务类型'},
              {prop:'cz',label:'上缴运营商'},
              {prop:'yj',label:'运营商返款'},
          ]
      }
  },
  methods:{
      openZp(row){
          if(row.zpsl<=0){
              this.$message('当前商品未绑定赠品','error');
              return;
          }
          this.$http('/api/x6/getLsZpList.do',{
              djh:row.djh,
              line:row.line
          }).then(res=>{
              this.zpInfo.data=[];
              for(let obj of res.zpList){
                this.zpInfo.data.push({
                    qspmc:obj.qspmc,
                    sl:obj.sl
                });
              }
              this.zpInfo.show=true;
          });
      },
      openTc(row){
        if(!row.tcdm){
            this.$message('当前商品未绑定套餐','error');
            return;
        }
        this.tcInfo.data={};
        this.tcInfo.data.tcname=row.tcname;
        this.tcInfo.data.cz=row.cz;
        this.tcInfo.data.yj=row.yj;
        this.tcInfo.data.phone=JSON.parse(row.tcdetail);
        this.tcInfo.data.ywlx=this.$util.getTcYwlx(row.tcywlx,'yxbz');
        this.tcInfo.show=true;
      }
  },
  components:{
      popUp
  }
}
</script>
<style lang="less" scoped>
    .content{
        overflow: hidden;
      .o-header{
          font-size: 12px;
          margin-bottom: 10px;
          >span{
              margin-left: 20px;
          }
          >span:nth-child(1){margin-left: 0;}
      }
      .o-body{
          height: 300px;
          position: relative;
          width: 100%;
          .o-slide{
              position: absolute;
              top:0;
              right: 0;
              width: 300px;
              height: 300px;
              background: #fff;
              box-shadow: -2px 1px 5px 1px #ccc;
              box-sizing: border-box;
              padding: 10px;
              overflow-y: auto;
              .o-solid-title{
                  display: flex;
                  justify-content: space-between;
                  font-size: 14px;
                  font-weight: bold;
                  i{cursor: pointer;}
              }
              .o-zp-item{margin: 15px 0;}
              .o-tc-item{
                  display: flex;
                  align-items: flex-start;
                  >span{flex-shrink: 0;}
                  >span:nth-child(1){
                      width:60px;
                      text-align: right;
                      margin-right: 10px;
                  }
                  div{
                      display: inline-flex;
                      flex-direction: column;
                      span{margin-bottom: 5px;}
                  }
              }
          }
      }
      .highlight1{color:#F56C6C !important;} 
      .highlight2{color:#409EFF !important;} 
      .iconfont{cursor: pointer;color:#999;} 
    }
</style>
