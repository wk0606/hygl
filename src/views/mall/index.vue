<template>
  <div class="mall-container">
      <!-- 实施概况 -->
      <div>
        <div class="mall-title">
            <b>实时概况</b>
            <span>更新时间 : 2018-09-23 09:23:56 <a>更多数据</a><i class="iconfont icon-bangzhu1"></i></span>
        </div>
        <div class="mall-charts">
            <table class="mall-datas">
                <tr
                    v-for="(row,index) in gkDetails"
                    :key="index"
                >
                    <td style="padding-left:30px;width:80px;">
                        <img :src="row.icon" alt="" width="30">
                    </td>
                    <td
                        v-for="item in row.infos"
                        :key="item.key"
                    >
                        <p><span>{{item.label}}</span></p>
                        <p><b class="m-price">{{item.value1}}</b></p>
                        <p><span>昨日 : {{item.value2}}</span></p> 
                    </td>
                </tr>
            </table>
            <div>
                <p>网店销售额(元)</p>
                <p style="margin:10px 0;"><b class="m-price">{{xsje.je | currency}}</b></p>
                <div class="m-zr">
                    <span>昨日全天 : {{xsje.zrje | currency}}</span>
                    <div>
                        <div class="m-circle m-circle-blue"></div>
                        <span>今日</span>
                        <div class="m-circle m-circle-green"></div>
                        <span>昨日</span>
                    </div>
                </div>
                <div class="m-xszs" ref="charts"></div>
            </div>
        </div>
      </div>
      <!-- 重要提醒 -->
      <div class="mall-tips">
        <div class="mall-title">
            <b>重要提醒</b>
        </div>
        <div
            class="mall-tips-items"
            v-for="(row,index) in tips"
            :key="index"
        >
           <div>{{row.label}}</div> 
           <div>
               <div
                 v-for="item in row.items"
                 :key="item.label"
               >
                <span>{{item.label}} : </span>
                <a>{{item.value}}</a>
               </div>
           </div>
        </div>
      </div>
      <!-- 常用功能 -->
      <div class="mall-menus">
        <div class="mall-title">
            <b>常用功能</b>
        </div>
        <div class="mall-menus-items">
            <div
                v-for="item in menus"
                :key="item.label"
                @click="openNav(item.path)"
            >
                <img :src="item.icon" alt="" width="30">
                <span>{{item.label}}</span>
            </div>
        </div>
      </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  data(){
      return {
          //实施概况左侧数据
          gkDetails:[
              {
                  icon:require('../../assets/je.png'),
                  infos:[
                      {label:'网店销售额(元)',key:'wdxse',value1:100,value2:21098.98},
                      {label:'网店支付订单数',key:'wdzfdd',value1:100,value2:0}
                  ]
              },
              {
                  icon:require('../../assets/person.png'),
                  infos:[
                      {label:'浏览客户数',key:'llkhs',value1:0,value2:0},
                      {label:'支付客户数',key:'zfkhs',value1:0,value2:0}
                  ]
              }
          ],
          //实施概况网点销售额
          xsje:{
              je:0,
              zrje:0,
              jrzs:[12,34,67,33],
              zrzs:[23,43,66,10],
              xdata:[0,6,12,18]
          },
          //提醒的项目
          tips:[
              {
                  label:'订单相关',
                  items:[
                      {label:'待发货订单',value:0}
                  ]
              },
              {
                  label:'商品相关',
                  items:[
                      {label:'网点在售',value:0},
                      {label:'网点缺货',value:0},
                      {label:'库存预警',value:0}
                  ]
              }
          ],
          //常用功能
          menus:[
              {icon:require('../../assets/1.png'),label:'发布网店商品',path:'/main/mallchildren/product_sp'},
              {icon:require('../../assets/2.png'),label:'消息推送',path:''},
              {icon:require('../../assets/3.png'),label:'设置中心',path:'/main/mallchildren/set_dd'},
              {icon:require('../../assets/4.png'),label:'交易',path:'/main/mallchildren/asset_jy'}
          ]
      }
  },
  methods:{
      drawCharts(xdata,ydata){
        var chart = echarts.init(this.$refs.charts);
        var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                top: '13%',
                bottom:'3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : xdata
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : ydata,
            color:['#1f8efb','#37c15f']
        };
        chart.setOption(option,true);
      },
      openNav(path){
          this.$router.push(path);
      }
  },
  mounted(){
      var temp=[];
      temp.push({
          type:'line',
          smooth:true,
          data:this.xsje.jrzs
      });
      temp.push({
          type:'line',
          data:this.xsje.zrzs
      });
      this.drawCharts(this.xsje.xdata,temp);
  }
}
</script>
<style lang="less" scoped>
    @import './index.less';
</style>
