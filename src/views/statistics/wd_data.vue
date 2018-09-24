<template>
    <div>
        <div class="root-title root-title-before">
			<div>网店看板</div>
		</div>
        <div class="root-chart">
            <div
                v-for="item in wdkb"
                :key="item.prop"
            >
                <p><b>{{item.label}}</b></p>
                <p class="c-price" v-if="wdkbDatas"><b>{{wdkbDatas[item.prop]}}</b></p>
                <p class="c-price" v-if="wdkbDatas">
                    <span>较上一日</span>
                    <span>{{Math.round(wdkbDatas[item.details[0]]*100)+'%'}}</span>
                    <i class="iconfont" :style="{color:getIconColor(wdkbDatas[item.details[0]])}" :class="getIcon(wdkbDatas[item.details[0]])"></i>
                </p>
                <p class="c-price" v-if="wdkbDatas">
                    <span>较上一周</span>
                    <span>{{Math.round(wdkbDatas[item.details[1]]*100)+'%'}}</span>
                </p>
                <div :ref="item.ref"></div>
            </div>
        </div>
        <div class="root-title root-title-before">
			<div>网店交易转化</div>
		</div>
        <div class="root-cover" v-if="zhDatas">
            <div
                v-for="(value,key) in jyzh"
                :key="key"
            >
                <ul>
                    <li
                        v-for="item in value"
                    >
                        <p><span>{{item.label}}</span><i v-if="item.title" class="iconfont icon-bangzhu1" :title="item.title"></i></p>
                        <p>{{zhDatas[key][item.value]}}</p>
                        <p>较前一日</p>
                        <p>
                            <i class="iconfont" :style="{color:getIconColor(zhDatas[key][item.zzl])}" :class="getIcon(zhDatas[key][item.zzl])"></i>
                            <span>{{Math.round(zhDatas[key][item.zzl]*100)+'%'}}</span>
                        </p>
                    </li>
                </ul>
            </div>
            <div class="cover">
                <div>
                    <!-- 访客->下单 -->
                    <p>转化率</p>
                    <p>{{Math.round(zhDatas.zhl.LookToOrder*100)+'%'}}</p>
                </div>
                <div>
                    <!-- 下单->支付 -->
                    <p>转化率</p>
                    <p>{{Math.round(zhDatas.zhl.OrderToPay*100)+'%'}}</p>
                </div>
                <div>
                    <!-- 访客->支付 -->
                    <p>转化率</p>
                    <p>{{Math.round(zhDatas.zhl.LookToPay*100)+'%'}}</p>
                </div>
            </div>
        </div>
        <div class="root-zs" ref="jyzh"></div>
    </div>
</template>
<script>
import echarts from "echarts";
export default {
  props: ["date"],
  data() {
    return {
      wdkb: [
        {
          label: "支付金额",
          prop: "money",
          details: ["moneyRate1", "moneyRate2"],
          currency: true,
          ref: "money"
        },
        {
          label: "订单数",
          prop: "orderAmount",
          details: ["orderAmountRate1", "orderAmountRate2"],
          ref: "orderAmount"
        },
        {
          label: "支付客户数",
          prop: "hyAmount",
          details: ["hyAmountRate1", "hyAmountRate2"],
          ref: "hyAmount"
        },
        {
          label: "客单价",
          prop: "price",
          details: ["priceRate1", "priceRate2"],
          ref: "price"
        }
      ],
      wdkbDatas: null,
      jyzh:{
          visitor:[
              {label:'访客数',value:'totalSum',zzl:'totalSumRate'}
          ],
          order:[
              {label:'下单人数',value:'hyAmount',zzl:'hyAmountRate',title:'下单人数'},
              {label:'下单笔数',value:'orderAmount',zzl:'orderAmountRate'},
              {label:'下单金额',value:'money',zzl:'moneyRate'}
          ],
          pay:[
              {label:'付款人数',value:'hyAmount',zzl:'hyAmountRate'},
              {label:'付款订单数',value:'orderAmount',zzl:'orderAmountRate'},
              {label:'付款金额',value:'money',zzl:'moneyRate'},
              {label:'付款件数',value:'js',zzl:'jsRate'},
              {label:'客单价',value:'price',zzl:'priceRate'}
          ]
      },
      zhDatas:null,
      jyzs:{
          money:{label:'付款金额',color:'#409eff'},
          hyAmount:{label:'付款人数',color:'#00bc12'},
          js:{label:'付款件数',color:'#f47983'},
          LookToOrder:{label:'访问-下单转化率',color:'#003472'},
          OrderToPay:{label:'下单-付款转化率',color:'#801dae'},
          LookToPay:{label:'访问-付款转化率',color:'#60281e'}
      },
      jyzsDatas:null,
      chartDom: []
    };
  },
  watch: {
    date: {
      handler: function(nv) {
        if (nv) {
          this.initPage(nv)
        }
      },
      deep: true
    }
  },
  methods: {
    getIcon(value) {
      return value < 0
        ? "icon-shangsheng1"
        : value > 0 ? "icon-shangsheng" : "icon-chiping";
    },
    getIconColor(value) {
      return value < 0 ? "#67C23A" : value > 0 ? "red" : "";
    },
    //获取网店看板数据
    getDatas(params) {
      this.$http("/api/x6/getWdboard.do", params).then(res => {
        this.wdkbDatas = res.VO;
      });
    },
    //获取网店看板走势
    getHyzs(params){
        this.$http('/api/x6/getWdkbZst.do',params).then(res=>{
            this.chartDom=[];
            for(let key in res.VO){
                let [xData,yData]=[[],[]];
                for(let sj of res.VO[key]){
                    yData.push(sj.num);
                    xData.push(sj.wd);
                }
                this.drawChart(xData,yData,key);
            }
        });
    },
    //获取转化率
    getZhDatas(params){
        this.$http('/api/x6/getWdjyZh.do',params).then(res=>{
            this.zhDatas=res.VO;
        });
    },
    //获取交易走势图
    getJyzs(params){
        this.$http('/api/x6/getJyZhZst.do',params).then(res=>{
            //this.zhDatas=res.VO;
            let xData=[];
            let legend=[];
            this.jyzsDatas=[];
            for(let key in this.jyzs){
                let temp={
                    name:this.jyzs[key].label,
                    type:'line',
                    smooth:true,
                    stack: this.jyzs[key].label,
                    itemStyle: {
                        normal: {
                            color: this.jyzs[key].color,
                            lineStyle: {
                                color: this.jyzs[key].color
                            }
                        }
                    },
                    data:[]
                }
                temp.data=res.VO[key].map(item=>{
                    return item.num;
                });
                if(!xData.length){
                    xData=res.VO[key].map(item=>{
                        return item.wd;
                    });
                }
                legend.push(this.jyzs[key].label)
                this.jyzsDatas.push(temp);
            };
            this.drawJyzs(xData,this.jyzsDatas,legend);
        });
    },
    //绘制网点看板走势图
    drawChart(xData,yData,target){
        var chart = echarts.init(this.$refs[target][0]);
        this.chartDom.push(chart);
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
                right: '5%',
                bottom: '5%',
                top:'9%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : xData,
                    axisLabel:{
                        align:'center'
                    },
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [{
                type: 'line',
                smooth: true,
                data:yData
            }],
        };
        chart.setOption(option,true);
    },
    //绘制交易走势折线图
    drawJyzs(xData,yData,legend){
        var chart = echarts.init(this.$refs.jyzh);
        this.chartDom.push(chart);
        var option = {
            legend: {
                data:legend
            },
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
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLine:{
                    lineStyle:{
                        color:'#ccc'
                    }
                },
                axisTick:{show:false},
                data: xData
            },
            yAxis: {
                type: 'value',
                axisLine:{
                    show:false,
                },
                splitLine:{
                    lineStyle:{
                        type:'dotted'
                    }
                },
                axisTick:{show:false},
            },
            series: yData
        };
        chart.setOption(option,true);
    },
    initPage(params){
        this.getDatas(params);
        this.getHyzs(params);
        this.getZhDatas(params);
        this.getJyzs(params);
    },
  },
  mounted() {
    if(this.date)
        this.initPage(this.date);
    this.$util.windowResize(()=>{
        for(let obj of this.chartDom)
            obj.resize();
    },'statistics');
  }
};
</script>
<style lang="less" scoped>
@import "./style.less";
.root-cover{
    width: 100%;
    height: 245px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    >div:not(.cover){
        width: ~"calc(100% - 300px)";
        height: 80px;
        background: blue;
        position: relative;
        &::before{
            content: '';
            position: absolute;
            top:0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        ul{
            position: absolute;
            top:0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding-left: 25px;
            li{
                width: 100px;
                font-size: 12px;
                p{
                    display: flex;
                    align-items: center;
                    .icon-bangzhu1{font-size: 20px;color: #aaa;margin-left: 1px;cursor: pointer;}
                }
                p:nth-child(n+1){margin-top: 2;}
                p:nth-child(1){color: #999;}
                p:nth-child(3){color: #aaa;}
            }
        }
    }
    >div:nth-child(1){
        &:before{background: #f3f7fd;}
    }
    >div:nth-child(2){
        &:before{background: #f0f8f0;}
    }
    >div:nth-child(3){
        &:before{background: #fffbf4;}
    }
    .cover{
        width: 350px;
        height: 245px;
        position: absolute;
        top:0;
        right: 35px;
        background-image: url('../../assets/cover.png');
        background-size: cover;
        background-repeat: no-repeat;
        div{position: absolute;width: 36px;}
        div:nth-child(1){
            top:55px;
            left: 220px;
        }
        div:nth-child(2){
            top:138px;
            left: 207px;
        }
        div:nth-child(3){
            top:100px;
            left: 330px;
        }
    }
}
.root-zs{
    box-sizing: border-box;
    padding: 10px;
    height: 400px;
    margin-top: 20px;
}
</style>
