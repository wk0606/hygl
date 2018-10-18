<template>
  <div>
      <bread-nav :data="navs"></bread-nav>
      <div class="details-body">
          <div class="details-body-top">
              <span>订单号 ：{{details.ddh}}</span>
              <span>下单时间 ：{{step[0].time}}</span>
              <span v-if="details.kddh">快递单号 ：{{details.kddh}}</span>
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
                        v-if="info.prop!=='lxrdz'||showAddress"
                    >
                        <span v-if="info.click" class="cell-span-blue" @click="info.click">{{info.label}}</span>
                        <span v-else>{{info.label}} : </span>
                        <div>
                            {{info.currency?$util.formatCash(details[info.prop]):details[info.prop]}}
                        </div>
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
              <order-detail-row
                :data="details.spList"
                :columns="colModel"
                :gift="gift"
                :records="records"
                :ddh="details.ddh"
                :zfje="details.zfje"
              ></order-detail-row>
          </div>
      </div>
  </div>
</template>
<script>
import breadNav from '../../../../components/breadNav/index'
import orderDetailRow from './orderDetailRow'
import {Loading} from '../../../../func/loading'
import {refund} from '../refund'
export default {
  data(){
      return {
        showAddress:false,
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
                    {label:'联系电话',prop:'lxrphone'},
                    {label:'收货地址',prop:'lxrdz'}
                ]
            },{
                label:'付款信息',
                infos:[
                    {label:'实付金额',prop:'zfje',currency:true},
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
            // ,{
            //     label:'退款操作信息',
            //     infos:[
            //         {label:'退款类型',prop:'tklx2'},
            //         {label:'操作时间',prop:'tkrq'},
            //         {label:'操作人员',prop:'tkr'},
            //         {label:'更多',click:this.openTkDetails}
            //     ]
            // }
        ],
        details:{
            ddh:'',
            kddh:'',
            ddzt:1,
            sjbz:'',
            lxrname:'赵普',
            lxrphone:'',
            zfje:0,
            zffs:'微信支付',
            mjname:'',
            mjly:'',
            spList:[],
            tkr:'',
            tkrq:'',
            line:'',
            tklx:'',
            tklx2:'',
            tkzt:''
        },
        colModel:[
            {label:'商品',prop:'name',width:'30%'},
            {label:'单价(元)/数量',prop:'dj',width:'10%'},
            {label:'实付金额',prop:'sfje',width:'10%'},
            {label:'优惠(元)',prop:'yhje',width:'10%'},
            {label:'订单状态',prop:'ddzt',width:'10%'},
            {label:'退款状态',prop:'tkzt',width:'10%'},
            
            {label:'退款',prop:'cz',width:'10%'},
            {label:'操作',prop:'fh',width:'10%'}
        ],
        dialog:{
            show:false,
            ddh:'',
            gift:0,
            fhzt:0,
            tkzt:0,
            line:''
        },
        order:{
            show:false,
            lx:0,//0 快递 1 自提
            data:null
        },
        records:[],
        gift:0
      }
  },
  computed:{
      hideAddress(){
          console.log(51515151)
          return true;
      }
  },
  methods:{
      formatDetails(obj){
          var row=obj.List[0];
          var shrxx=JSON.parse(row.shrxx);
          var mjxx=JSON.parse(row.extend);
          this.gift=mjxx.gift;
          this.details.ddh=row.ddh;
          this.details.kddh=row.kddh;
          this.details.ddzt=row.ddzt;
          this.details.sjbz=mjxx.remark;
          this.details.lxrname=shrxx.shr||'无';
          this.details.lxrphone=shrxx.shrlxfs||'无';
          this.details.lxrdz=shrxx.shdz.province+shrxx.shdz.city+shrxx.shdz.town+shrxx.shdz.dz;
          this.details.mjname=mjxx.mjname;
          this.details.fksj=row.zfrq;
          this.details.mjly=mjxx.mjly;
          this.step[0].time=row.zdrq;
          this.step[1].time=row.zfrq;
          this.step[2].time=obj.List[0].psfs?row.ztrq:row.fhrq;
          this.step[3].time=row.wcrq;
          this.details.zfje=mjxx.zje;
          this.showAddress=obj.List[0].psfs?false:true;
          this.details.spList=[];
          for(let item of obj.List){
              let sp=JSON.parse(item.spdetail);
              this.details.spList.push({
                  sppic:sp.sptpFirst,
                  name:sp.spname,
                  dj:parseFloat(sp.spdj),
                  sl:item.sl,
                  xj:item.sl*parseFloat(sp.spdj),
                  fhzt:item.fhzt,
                  tkzt:item.tkzt,
                  yhje:0,
                  sply:'',
                  line:item.line,
                  spgg:JSON.parse(item.extend).spgg,
                  spdm:item.spdm,
                  spname:sp.spname,
                  ddzt:item.ddzt,
                  psfs:item.psfs,
                  ddh:item.ddh,
                  shr:shrxx.shr,
                  shrlxfs:shrxx.shrlxfs,
                  hyid:item.hyid,
                  id:item.id,
                  isch:mjxx.isch,
                  je:item.je,
                  spdj:JSON.parse(item.extend).dyjg,
                  gift:mjxx.gift,
                  mjname:mjxx.mjname
              });
          }
          this.records=mjxx.tkrecords;
          if(this.records.length){
            let i=1;
            let j=1;
            for(let obj of this.records){
                if(obj.tkzt==1){
                    this.$set(obj,'label',`退款申请${i}`);
                    i++;
                }else{
                    this.$set(obj,'label',`存在退款记录${j}`);
                    j++;
                }
            }
          }
      },
      getDetails(){
          Loading.open({
              height:document.body.offsetHeight
          });
          this.$http('/api/x6/getOrderByDdh.do',{
              ddh:this.$route.params.ddh
          }).then(res=>{
                Loading.close();
                this.details.tkr=this.$util.getYgInfo(res.VO.tkr).name;
                this.details.line=res.VO.lines;
                this.details.tkrq=res.VO.tkrq;
                this.details.tklx=res.VO.tklx;
                this.details.tkzt=res.VO.tkzt;
                this.details.tklx2=res.VO.tklx?'同意退款':'主动退款'
                this.formatDetails(res.VO);
                this.step[2].label=res.VO.List[0].psfs?'买家自提':'商家发货';
          },err=>{
              Loading.close();
          });
      },
      openTkDetails(){
          refund.open({
              ddh:this.details.spList[0].ddh,
              tkzt:this.details.tkzt,
              line:this.details.line,
              gift:this.gift,
              ddzt:this.details.spList[0].ddzt,
              callback:null
          });   
      }
  },
  mounted(){
      this.getDetails();
  },
  activated(){
      var ddh=this.$route.params.ddh;
      this.getDetails(ddh);
  },
  components:{
      breadNav,
      orderDetailRow
  }
}
</script>
<style lang="less" scoped>
    @import './details.less';
</style>
