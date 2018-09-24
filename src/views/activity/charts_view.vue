<template>
    <pop-up
        title="PV值"
        width="800"
        :views="views"
    >
        <div class="content" slot="content">
            <div class="chart-item">
                <div class="chart-title">PV值</div>
                <div class="chart-table">
                    <div
                        v-for="item in column"
                        :key="item.prop"
                    >
                        <div>{{item.label}}<i v-if="item.help" class="iconfont icon-bangzhu1":title="item.help"></i></div>
                        <div :class="{'cell-span-blue':item.click?true:false}" @click="item.click?item.click():null">
                            {{item.currency?'￥'+data[item.prop]:data[item.prop]}}
                            <i v-if="item.prop=='tbzz'||item.prop=='hbzz'" class="iconfont" :class="getIcon(data[item.prop])" :style="{color:getIconColor(data[item.prop])}"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="chart-item" v-if="tbshow">
                <div class="chart-title">销售金额同比增长<i class="el-icon-close" @click="tbshow=false"></i></div>
                <div class="chart-table">
                    <div
                        v-for="item in column2"
                        :key="item.prop"
                    >
                        <div>{{item.label}}<i v-if="item.help" class="iconfont icon-bangzhu1"></i></div>
                        <div>{{item.currency?'￥'+data[item.prop]:data[item.prop]}}<i v-if="item.prop=='tbzz'||item.prop=='hbzz'" class="iconfont" :class="getIcon(data[item.prop])" :style="{color:getIconColor(data[item.prop])}"></i></div>
                    </div>
                </div>
            </div>
            <div class="chart-item" v-if="hbshow">
                <div class="chart-title">销售金额环比增长<i class="el-icon-close" @click="hbshow=false"></i></div>
                <div class="chart-table">
                    <div
                        v-for="item in column3"
                        :key="item.prop"
                    >
                        <div>{{item.label}}<i v-if="item.help" class="iconfont icon-bangzhu1"></i></div>
                        <div>{{item.currency?'￥'+data[item.prop]:data[item.prop]}}<i v-if="item.prop=='tbzz'||item.prop=='hbzz'" class="iconfont" :class="getIcon(data[item.prop])" :style="{color:getIconColor(data[item.prop])}"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="footer" slot="footer">
            <el-button size="small" @click="close">关闭</el-button>
        </div> -->
    </pop-up>
</template>
<script>
import popUp from '../../components/popUp/index'
export default {
  props:['views'],
  data(){
      return{
          column:[
              {label:'销售金额',prop:'sumje',currency:true},
              {label:'销售商品数量',prop:'sumls'},
              {label:'单笔销售价',prop:'xsjj',help:'活动期间订单均价',currency:true},
              {label:'新客户数/成交数',prop:'xkhs',help:'参与活动并首次成交的客户/该类型客户参与活动订单数'},
              {label:'回头客数/成交数',prop:'lkhs',help:'在门店有消费记录并参与活动的客户/该类型客户参与活动订单数'},
              {label:'同比增长',prop:'tbzz',help:'销售金额较去年同期增长',click:this.showTb},
              {label:'环比增长',prop:'hbzz',help:'销售金额较相邻时间段增长',click:this.showHb},
          ],
          column2:[
              {label:'',prop:'tbje',currency:true},
              {label:'',prop:'sumje',currency:true},
              {label:'增长',prop:'tbzz'}
          ],
          column3:[
              {label:'',prop:'hbje',currency:true},
              {label:'',prop:'sumje',currency:true},
              {label:'增长',prop:'hbzz'}
          ],
          data:{},
          tbshow:false,
          hbshow:false
      }
  },
  methods:{
      getIcon(value){
          if(parseInt(value))
            return parseInt(value)<0?'icon-shangsheng1':parseInt(value)>0?'icon-shangsheng':'';
      },
      getIconColor(value){
          if(parseInt(value))
            return parseInt(value)<0?'#67C23A':parseInt(value)>0?'red':'';
      },
      getData(){
        this.$http('/api/x6/crmActivityResult.do',{
            id:parseInt(this.views.data)
        }).then(res=>{
            this.data=res.VO;
            this.data.xkhs=this.data.newhysl+'/'+this.data.newcjbs;
            this.data.lkhs=this.data.oldhysl+'/'+this.data.oldcjbs;
            this.data.xsjj=this.data.xsjj.toFixed(2);
            this.data.tbzz=this.data.tbzzl.toFixed(2)*100+'%';
            this.data.hbzz=this.data.tbzzl.toFixed(2)*100+'%';
            this.column2[1].label=this.data.fsrqq+'至'+this.data.fsrqz;
            this.column3[1].label=this.data.fsrqq+'至'+this.data.fsrqz;
            this.column2[0].label=this.data.tbfsrqq+'至'+this.data.tbfsrqz;
            this.column3[0].label=this.data.hbfsrqq+'至'+this.data.hbfsrqz;
        });
    },
    showTb(){
        console.log(123)
        this.tbshow=true;
    },
    showHb(){
        this.hbshow=true;
    },
    close(){
         this.$refs.pop.hide(this,function(){
             this.views.name='';
         });
     } 
  },
  mounted(){
      this.getData();
  },
  components:{
      popUp
  }
}
</script>
<style lang="less" scoped>
    .content{
        width: 100%;
        height: auto;
        box-sizing: border-box;
        padding: 0 10px 10px 10px; 
        .chart-item{
            border-radius: 4px;
            box-sizing: border-box;
            padding: 10px;
            border: 1px solid #ccc;
            .chart-title{
                padding-bottom: 10px;
                border-bottom: 1px solid #ccc;
                font-size: 14px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                i{
                    font-size: 12px;
                    cursor: pointer;
                    color: #ccc;
                }
            }
        }
        .chart-item:nth-child(n+1){margin-top: 15px;}
        .chart-table{
            border-radius: 4px;
            background: #f4f9f4;
            box-sizing: border-box;
            padding: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div{
                flex-shrink: 0;
                text-align: center;
                padding: 5px 7px;
                display: inline-flex;
                align-items: center;
                flex-direction: column;
                i{margin-left: 5px;}
                >div{
                    display: flex;
                    align-items: center;
                    height: 20px;
                }
                >div:nth-child(2){margin-top: 10px;}       
            }
        }

    }
    .footer{
        box-sizing: border-box;
        padding: 10px;
        text-align: right;
    }
</style>
