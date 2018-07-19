<template>
  <div>
      <bread-nav :data="navs"></bread-nav>
      <div class="details-body">
          <div class="details-body-top">
              <span>订单号 ：{{details.ddh}}</span>
              <span>下单时间 ：{{details.xdsj}}</span>
          </div>
          <div class="order-body-jy">
            <div>
                <div class="order-body-jy-left">
                    <b>{{details.ddzt[details.ddzt.length-1].label}}</b>
                </div>
                <div class="order-body-jy-right">
                    <el-steps :active="details.ddzt.length" align-center>
                        <el-step
                            v-for="(item,index) in step"
                            :key="index"
                            :title="item"
                            :description="details.ddzt[index]?details.ddzt[index].sj:''"
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
              <div
                v-for="row in details.spList"
                :key="row.id"
                class="order-body-table-row"
              >
                <div class="order-body-table-item order-body-table-body">
                    <div>
                        <img :src="row.sppic" alt="">
                        <span class="ellipsis2rows">{{row.name}}</span>
                    </div>
                    <div>
                        <span>￥ {{row.dj | currency}}</span>
                        <span>{{row.sl}}</span>
                    </div>
                    <div>
                        <span>￥ {{row.sl*row.dj | currency}}</span>
                    </div>
                    <div>
                        <span>{{row.fhzt}}</span>
                    </div>
                    <div class="order-body-table-border">
                        <div class="order-body-table-btn" :class="{'order-body-table-disabled':row.tkzt}">{{row.tkzt?'已退款':'主动退款'}}</div>
                    </div>
                    <div>
                        <span>￥ {{row.yhje | currency}}</span>
                    </div>
                </div>
                <div class="order-body-table-footer">
                    <span>商品留言 ：</span>
                    <div>{{row.sply}}</div>
                </div>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import breadNav from '../../../../components/breadNav/index'
export default {
  data(){
      return {
        navs:[
          {label:'全部订单',path:'/main/mallchildren/order'},
          {label:'订单详情'}
        ],  
        step:['买家下单','买家付款','商家发货','交易完成'],
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
                    {label:'实付金额',prop:'sfje'},
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
            ddh:'E8766677989328930',
            xdsj:'2018-09-09 12:23:34',
            ddzt:[
                {label:'买家下单',sj:'2018-09-09 12:23:34'},
                {label:'买家付款',sj:'2018-09-09 12:23:34'},
                // {label:'商家发货',sj:'2018-09-09 12:23:34'},
                // {label:'交易完成',sj:'2018-09-09 12:23:34'}
            ],
            sjbz:'首次出场',
            lxrname:'赵普',
            lxrphone:'13546765433',
            zfje:3444,
            zffs:'微信支付',
            fksj:'2018-09-09 12:23:34',
            mjname:'13456786544',
            mjly:'买家留言你好买家留言你好买家留言你好',
            spList:[
                {
                    sppic:'http://img0.imgtn.bdimg.com/it/u=2382110381,2382599939&fm=27&gp=0.jpg',
                    name:'iphne X 64g 红 全网通-2018 世界杯特别版',
                    dj:3200,
                    sl:1,
                    fhzt:'已发货',
                    tkzt:1,
                    yhje:108.76,
                    sply:'买家留言你好买家留言你好买家留言你好',
                    id:1
                }
            ]
        },
        colModel:[
            {label:'商品',prop:'name',width:'30%'},
            {label:'单价(元)/数量',prop:'dj',width:'20%'},
            {label:'小计(元)',prop:'xj',width:'13%'},
            {label:'发货状态',prop:'ffzt',width:'10%'},
            {label:'退款状态',prop:'tkzt',width:'15%'},
            {label:'优惠(元)',prop:'yhje',width:'12%'}
        ]
      }
  },
  computed:{
      getOrderStatus(){

      }
  },
  components:{
      breadNav
  }
}
</script>
<style lang="less" scoped>
    @import './details.less';
</style>
