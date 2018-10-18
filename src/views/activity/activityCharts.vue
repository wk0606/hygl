<template>
    <pop-up
        title="活动效果"
        width="800"
        :views="views"
    >
        <div class="content" slot="content">
            <div class="c-date">
                <date-range :range.sync="range" @change="getData"></date-range>
            </div>
            <div class="c-body">
                <div
                    v-for="(item,index) in charts"
                    :key="index"
                    :span="8"
                >
                    <p><b>{{item.label}}</b><i class="iconfont icon-bangzhu1" :title="item.title"></i></p>
					<p><b>{{item.value}}</b></p>
					<p>
						<span>{{setText[0]}}</span>
						<span>{{(item.jslr*100).toFixed(2)+'%'}}<i class="iconfont" :style="{color:getIconColor(item.jslr)}" :class="getIcon(item.jslr)"></i></span>
					</p>
					<p>
						<span>{{setText[1]}}</span>
						<span>{{(item.jslq*100).toFixed(2)+'%'}}<i class="iconfont" :style="{color:getIconColor(item.jslq)}" :class="getIcon(item.jslq)"></i></span>
					</p>
                    <div :ref="item.ref"></div>
                </div>
            </div>
        </div>
    </pop-up>
</template>
<script>
import popUp from '../../components/popUp/index'
import dateRange from '../../components/dateRange/index'
import echarts from 'echarts'
export default {
  props:['views'],
  data(){
      return {
          range:'date',
          charts:[
            {
                label:'活动浏览量',
                value:0,
                jslr:0,
                jslq:0,
                xData:[],
                yData:[],
                ref:'looksl',
                title:'活动被查看的次数',
                ref:'act1'
            },
            {
                label:'活动转化率',
                value:0,
                jslr:0,
                jslq:0,
                xData:[],
                yData:[],
                ref:'zhsl',
                title:'查看活动并产生消费的客户数/查看活动的客户总数',
                ref:'act2'
            },
            {
                label:'平均停留时长（单位:秒）',
                value:0,
                jslr:0,
                jslq:0,
                xData:[],
                yData:[],
                ref:'tlsc',
                title:'活动页面停留的平均时长',
                ref:'act3'
            }
          ]
      }
  },
  computed:{
      setText(){
        if(this.range=='date')
            return ['较上一日','较上周同期'];
        else if(this.range=='week')
            return ['较上一周','较去年同期'];
        else
            return ['较上一月','较去年同期'];
            
      }
  },
  methods:{
        getData(params){
            params.actid=this.views.data;
            //活动浏览量
            this.$http('/api/x6/hyCrmGetHdkbLookcsfx.do',params).then(res=>{
                this.setChartDatas(this.charts[0],res.VO);
                this.drawChart(this.charts[0].xData,this.charts[0].yData,this.charts[0].ref,false);
            });
            //活动转化率
            this.$http('/api/x6/hyCrmGetHdkbZhlfx.do',params).then(res=>{
                let temp=res.VO.value*100;
                temp=res.VO.value.toFixed(2)+'%';
                res.VO.value=temp;
                this.setChartDatas(this.charts[1],res.VO);
                this.drawChart(this.charts[1].xData,this.charts[1].yData,this.charts[1].ref,false);
            });
            //活动停留时间
            this.$http('/api/x6/hyCrmGetHdkbTlsj.do',params).then(res=>{
                this.setChartDatas(this.charts[2],res.VO);
                this.drawChart(this.charts[2].xData,this.charts[2].yData,this.charts[2].ref,false);
            });
        },
        //设置数据
        setChartDatas(target,data){
            var _temp=[];
            target.value=data.value;
            target.jslr=data.zzl;
            target.jslq=data.zzl1;
            target.xData=[];
            target.yData=[];
            for(let obj of data.zsList){
                target.xData.push(obj.wd);
                _temp.push(obj.sl);
            }
            target.yData=_temp;
        },
        getIcon(value){
            return value<0?'icon-shangsheng1':value>0?'icon-shangsheng':'icon-chiping';
        },
        getIconColor(value){
            return value<0?'#67C23A':value>0?'red':'';
        },
        drawChart(xData,yData,target){
            var chart = echarts.init(this.$refs[target][0]);
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
                    top:'5%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : xData,
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            show:false,
                            align:'center'
                        }
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
            chart.setOption(option);
        },
  },
  mounted(){
      //this.getData()
  },
  components:{
      popUp,
      dateRange
  }  
}
</script>
<style lang="less" scoped>
    @size:250px;
    .c-body{
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        >div{
            width: @size;
            height: @size;
            background: #f2f2f2;
            box-sizing: border-box;
            padding: 10px;
            p:nth-child(n+1){margin-top: 5px;}
            p:nth-child(n+3){color:#777;}
            div{
                width: 100%;
                height: ~"calc(100% - 95px)";
                margin-top: 10px;
            }
        }
    }
</style>
