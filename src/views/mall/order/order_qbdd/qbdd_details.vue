<template>
  <div>
      <bread-nav :data="navs"></bread-nav>
      <div class="details-body">
          <div class="details-body-top">
              <span>订单号 ：{{details.ddh}}</span>
              <span>下单时间 ：{{step[0].time}}</span>
          </div>
          <div class="order-body-jy">
            <div>
                <div class="order-body-jy-left">
                    <b>{{details.ddzt==4?'交易关闭':step[details.ddzt].label}}</b>
                </div>
                <div class="order-body-jy-right">
                    <el-steps :active="details.ddzt==4?-1:details.ddzt+1" align-center>
                        <el-step
                            v-for="(item,index) in step"
                            :key="index"
                            :title="item.label"
                            :description="item.time"
                            icon="el-icon-circle-check"
                        ></el-step>
                    </el-steps>
                </div>
            </div>
            <div>
                <span>商家备注 :</span>
                <div>{{details.sjbz}}</div>
            </div>
          </div>
          <div class="order-body-lxr">
              <div
                v-for="item in lxrInfo"
                :key="item.label"
              >
                <p><b>{{item.label}}</b></p>
                <ul>
                    <li
                        v-for="info in item.infos"
                        :key="info.prop"
                    >
                        <span>{{info.label}} : </span>
                        <div>{{details[info.prop]}}</div>
                    </li>
                </ul>
              </div>
          </div>
          <div class="order-body-table">
              <div class="order-body-table-item order-body-table-header">
                  <div
                    v-for="col in colModel"
                    :key="col.prop"
                    :style="{width:col.width}"
                  >{{col.label}}</div>
              </div>
              <order-detail-row :data="details.spList" :columns="colModel" :gift="details.gift"></order-detail-row>
          </div>
      </div>
      <refund v-if="dialog.show" :views="dialog" :gift="0"></refund>
  </div>
</template>
<script>
import breadNav from '../../../../components/breadNav/index'
import orderDetailRow from './orderDetailRow'
import refund from './refund'
import {Loading} from '../../../../func/loading'
export default {
  data(){
      return {
        navs:[
          {label:'订单列表',path:'/main/mall/shop/order'},
          {label:'订单详情'}
        ],  
        //'买家下单','买家付款','商家发货','交易完成'
        step:[
            {label:'买家下单',time:''},
            {label:'买家付款',time:''},
            {label:'商家发货',time:''},
            {label:'交易完成',time:''}
        ],
        lxrInfo:[
            {
                label:'联系人信息',
                infos:[
                    {label:'联系人',prop:'lxrname'},
                    {label:'联系电话',prop:'lxrphone'}
                ]
            },{
                label:'付款信息',
                infos:[
                    {label:'实付金额',prop:'zfje'},
                    {label:'支付方式',prop:'zffs'},
                    {label:'付款时间',prop:'fksj'}
                ]
            },{
                label:'买家信息',
                infos:[
                    {label:'买家',prop:'mjname'},
                    {label:'买家留言',prop:'mjly'}
                ]
            }
        ],
        details:{
            ddh:'',
            ddzt:1,
            sjbz:'',
            lxrname:'赵普',
            lxrphone:'',
            zfje:0,
            zffs:'微信支付',
            mjname:'',
            mjly:'',
            spList:[]
        },
        colModel:[
            {label:'商品',prop:'name',width:'30%'},
            {label:'单价(元)/数量',prop:'dj',width:'20%'},
            {label:'小计(元)',prop:'xj',width:'13%'},
            {label:'发货状态',prop:'ffzt',width:'10%'},
            {label:'退款状态',prop:'tkzt',width:'15%'},
            {label:'优惠(元)',prop:'yhje',width:'12%'}
        ],
        dialog:{
            show:false
        }
      }
  },
  computed:{
      getOrderStatus(){

      }
  },
  methods:{
      formatDetails(obj){
          var row=obj.List[0];
          var shrxx=JSON.parse(row.shrxx);
          var mjxx=JSON.parse(row.extend);
          this.details.ddh=row.ddh;
          this.details.ddzt=row.ddzt;
          this.details.sjbz=mjxx.remark;
          this.details.lxrname=shrxx.shr;
          this.details.lxrphone=shrxx.shrlxfs;
          this.details.mjname=mjxx.mjname;
          this.details.fksj=row.zfrq;
          this.details.mjly=mjxx.mjly;
          this.details.gift=mjxx.gift;
          this.step[0].time=row.zdrq;
          this.step[1].time=row.zfrq;
          this.step[2].time=row.fhrq;
          this.step[3].time=row.wcrq;
          this.details.zfje=obj.List.reduce((total,item)=>{
              return total+JSON.parse(item.extend).zje;
          },0);
          this.details.spList=[];
          for(let item of obj.List){
              var sp=JSON.parse(item.spdetail);
              this.details.spList.push({
                  sppic:sp.sptpFirst,
                  name:sp.spname,
                  dj:parseFloat(sp.spdj),
                  sl:item.sl,
                  xj:item.sl*parseFloat(sp.spdj),
                  fhzt:item.fhzt?'已发货':'未发货',
                  tkzt:item.tkzt,
                  yhje:0,
                  sply:''
              });
          }
          this.details.spList=this.details.spList.concat(this.details.spList)
      },
      getDetails(ddh){
          Loading.open({
              height:document.body.offsetHeight
          });
          this.$http('/api/x6/getOrderByDdh.do',{
              ddh:ddh
          }).then(res=>{
              Loading.close();
              this.formatDetails(res.VO);
          },err=>{
              Loading.close();
          });
      }
  },
  mounted(){
      var ddh=this.$route.params.ddh;
      this.getDetails(ddh);
  },
  activated(){
      var ddh=this.$route.params.ddh;
      this.getDetails(ddh);
  },
  components:{
      breadNav,
      orderDetailRow,
      refund
  }
}
</script>
<style lang="less" scoped>
    @import './details.less';
</style>
