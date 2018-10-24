<template>
    <div>
        <div class="root-title root-title-before">
			<div>会员看板</div>
		</div>
        <div class="root-chart">
            <div
                v-for="item in hykb"
                :key="item.prop"
            >
                <p><b>{{item.label}}</b></p>
                <p class="c-price" v-if="hykbDatas"><b>{{hykbDatas[item.prop]}}</b></p>
                <p class="c-price" v-if="hykbDatas">
                    <span>{{text[0]}}</span>
                    <span>{{Math.round(hykbDatas[item.details[0]]*100)+'%'}}</span>
                    <i class="iconfont" :style="{color:getIconColor(hykbDatas[item.details[0]])}" :class="getIcon(hykbDatas[item.details[0]])"></i>
                </p>
                <p class="c-price" v-if="hykbDatas">
                    <span>{{text[1]}}</span>
                    <span>{{Math.round(hykbDatas[item.details[1]]*100)+'%'}}</span>
                </p>
                <div :ref="item.ref"></div>
            </div>
        </div>
        <div class="root-title root-title-before">
			<div>活动看板</div>
		</div>
        <div class="root-chart">
            <div
                v-for="item in hdkb"
                :key="item.ref"
            >
                <p><b>{{item.label}}</b><i class="iconfont icon-bangzhu1" :title="item.title"></i></p>
                <p class="c-price">
                    <b>{{item.value}}</b>
                </p>
                <p class="c-price">
                    <span>{{text[0]}}</span>
                    <span>{{Math.round(item.jslr*100)+'%'}}</span>
                    <i class="iconfont" :style="{color:getIconColor(item.jslr)}" :class="getIcon(item.jslr)"></i>
                </p>
                <p class="c-price" v-if="hykbDatas">
                    <span>{{text[1]}}</span>
                    <span>{{Math.round(item.jslq*100)+'%'}}</span>
                </p>
                <div :ref="item.ref"></div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from "echarts";
export default {
  props: ["date","text"],
  data() {
    return {
      hykb: [
        {
          label: "会员消费金额",
          prop: "xsje",
          details: ["xszzl", "xszzl1"],
          currency: true,
          ref: "xsje"
        },
        {
          label: "新增会员数量",
          prop: "newHysl",
          details: ["newHyzzl", "newHyzzl1"],
          ref: "newHy"
        },
        {
          label: "会员总数量",
          prop: "totalHysl",
          details: ["totalHyzzl", "totalHyzzl1"],
          ref: "totalHy"
        },
        {
          label: "红包发放数量",
          prop: "hbff",
          details: ["hbffzzl", "hbffzzl1"],
          ref: "hbff"
        },
        {
          label: "红包使用数量",
          prop: "hbsy",
          details: ["hbsyzzl", "hbsyzzl1"],
          ref: "hbsy"
        }
      ],
      hykbDatas: null,
      hdkb: [
        {
          label: "活动浏览量",
          value:0,
          jslr:0,
          jslq:0,
          xData:[],
          yData:[],
          ref: "looksl",
          title: "活动被查看的次数"
        },
        {
          label: "活动转化率",
          value:0,
          jslr:0,
          jslq:0,
          xData:[],
          yData:[],
          ref: "zhsl",
          title: "收藏活动并在活动期间产生消费客户数/查看活动客户数"
        },
        {
          label: "平均停留时长（单位:秒）",
          value:0,
          jslr:0,
          jslq:0,
          xData:[],
          yData:[],
          ref: "tlsc",
          title: "活动页面停留的平均时长"
        }
      ],
      chartMenusData: {},
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
    //获取会员看板数据
    getDatas(params) {
      this.$http("/api/x6/hyCrmGetHyfxHykb.do", params).then(res => {
        this.hykbDatas = res.VO;
      });
    },
    //获取会员看板走势
    getHyzs(params){
        let temp=Object.assign({},params);
        temp.flList=this.hykb.map(item=>{
            return item.ref;
        });
        this.$http('/api/x6/hyCrmHyzzzs.do',temp).then(res=>{
            for(let obj of res.List){
                let key=Object.keys(obj)[0];
                let [xData,yData]=[[],[]];
                for(let sj of obj[key]){
                    yData.push(sj.sl);
                    xData.push(sj.wd);
                }
                this.drawChart(xData,yData,key);
            }
            this.$parent.closeLoading();
        });
    },
    //获取活动看板数据
    getActBroad(params){
        //活动浏览量
        this.$http('/api/x6/hyCrmGetHdkbLookcsfx.do',params).then(res=>{
            this.setChartDatas(this.hdkb[0],res.VO);
            this.drawChart(this.hdkb[0].xData,this.hdkb[0].yData,this.hdkb[0].ref,false);
        });
        //活动转化率
        this.$http('/api/x6/hyCrmGetHdkbZhlfx.do',params).then(res=>{
            let temp=res.VO.value*100;
            temp=temp.toFixed(2)+'%';
            res.VO.value=temp;
            this.setChartDatas(this.hdkb[1],res.VO);
            this.drawChart(this.hdkb[1].xData,this.hdkb[1].yData,this.hdkb[1].ref,false);
        });
        //活动停留时间
        this.$http('/api/x6/hyCrmGetHdkbTlsj.do',params).then(res=>{
            this.setChartDatas(this.hdkb[2],res.VO);
            this.drawChart(this.hdkb[2].xData,this.hdkb[2].yData,this.hdkb[2].ref,false);
        });
    },
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
    initPage(params){
        this.$parent.openLoading();
        this.chartDom=[];
        this.getDatas(params);
        this.getHyzs(params);
        this.getActBroad(params);
    },
    //绘制图形
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
        chart.setOption(option,true);
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
</style>
