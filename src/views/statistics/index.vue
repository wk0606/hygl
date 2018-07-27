<template>
	<div class="rootContainer">
		<div class="root-title">
			<span>运营视窗</span>
			<div>
				<el-select v-model="range" placeholder="请选择" size="small" style="width:70px;" @change="changeData">
					<el-option
					v-for="item in options"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
				<el-date-picker
					v-model="currentTime"
					size="small"
					style="margin-left:10px;"
					:type="range"
					:format="timeFormat"
					:picker-options="pickerOptions"
					placeholder="请选择日期范围"
					@change="changeData">
				</el-date-picker>
			</div>
		</div>
		<div class="root-title root-title-before">
			<div>会员看板</div>
		</div>
		<!-- :class="{selected:item.check}" -->
		<div class="chart-menu">
			<div
				v-for="(item,index) in chartMenus"
				:key="index"
				:style="{borderColor:item.check?charts[item.lx].bgcolor:'#ccc',background:item.check?charts[item.lx].bgcolor:'white'}"
				@click="resetCharts(item)"
			>
				<div>
					<b>{{item.label}}</b>
					<el-checkbox v-model="item.check"></el-checkbox>
				</div>
				<div><b>{{item.currency?$util.formatCash(chartMenusData[item.prop]):chartMenusData[item.prop]}}</b></div>
				<div>
					<span>{{setText[0]}}</span>
					<span>
						{{(chartMenusData[item.details[0]]*100).toFixed(2)+'%'}}
						<i class="iconfont" :style="{color:getIconColor(chartMenusData[item.details[0]])}" :class="getIcon(chartMenusData[item.details[0]])"></i>
					</span>
				</div>
				<div>
					<span>{{setText[1]}}</span>
					<span>{{(chartMenusData[item.details[1]]*100).toFixed(2)+'%'}}<i class="iconfont" :style="{color:getIconColor(chartMenusData[item.details[0]])}" :class="getIcon(chartMenusData[item.details[0]])"></i></span>
				</div>
			</div>
		</div>
		<div class="chart-body" ref="charts"></div>
		<div class="root-title root-title-before">
			<div>活动看板</div>
		</div>
		<el-row :gutter="20">
			<el-col
				v-for="(item,index) in activityCharts"
				:key="index"
				:span="8"
			>
				<div class="activity-chart">
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
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import echarts from 'echarts'
	export default{
		name:'hy_statistics',
		data(){
			return{
				range:'date',
				options:[
					{value:'date',label:'日',type:'D'},
					{value:'week',label:'周',type:'W'},
					{value:'month',label:'月',type:'M'}
				],
				currentTime:'',
				pickerOptions:{
					disabledDate(time) {
						return time.getTime() > Date.now();
					}
				},
				chartMenus:[
					{
						label:'会员消费金额',
						prop:'xsje',
						details:['xszzl','xszzl1'],
						currency:true,
						check:true,
						lx:'xsje'
					},
					{
						label:'新增会员',
						prop:'newHysl',
						details:['newHyzzl','newHyzzl1'],
						check:false,
						lx:'newHy'
					},
					{
						label:'会员总数量',
						prop:'totalHysl',
						details:['totalHyzzl','totalHyzzl1'],
						check:false,
						lx:'totalHy'
					},
					{
						label:'红包发放数量',
						prop:'hbff',
						details:['hbffzzl','hbffzzl1'],
						check:false,
						lx:'hbff'
					},
					{
						label:'红包使用数量',
						prop:'hbsy',
						details:['hbsyzzl','hbsyzzl1'],
						check:false,
						lx:'hbsy'
					}
				],
				charts:{
					xsje:{
						label:'会员消费金额',
						color:'#00BFFF',
						bgcolor:'rgba(0, 191, 255,.2)'
					},
					newHy:{
						label:'新增会员',
						color:'#00FF7F',
						bgcolor:'rgba(0, 255, 127,.2)'
					},
					totalHy:{
						label:'会员总数量',
						color:'#0000FF',
						bgcolor:'rgba(0, 0, 255,.2)'
					},
					hbff:{
						label:'红包发放数量',
						color:'#FF1493',
						bgcolor:'rgba(255, 20, 147,.2)'
					},
					hbsy:{
						label:'红包使用数量',
						color:'#00FFFF',
						bgcolor:'rgba(0, 255, 255,.2)'
					}
				}, 
				activityCharts:[
					{
						label:'活动浏览量',
						value:0,
						jslr:0,
						jslq:0,
						xData:null,
						yData:null,
						ref:'looksl',
						title:'活动被查看的次数'
					},
					{
						label:'活动转化率',
						value:0,
						jslr:0,
						jslq:0,
						xData:null,
						yData:null,
						ref:'zhsl',
						title:'查看活动并产生消费的客户数/查看活动的客户总数'
					},
					{
						label:'平均停留时长（单位:秒）',
						value:0,
						jslr:0,
						jslq:0,
						xData:null,
						yData:null,
						ref:'tlsc',
						title:'活动页面停留的平均时长'
					}
				],
				chartMenusData:{},
				chartDom:[],
			}
		},
		computed:{
			timeFormat(){
				if(this.range=='week'){
					return 'yyyy 年 第 WW 周';
				}else if(this.range=='month'){
					return 'yyyy 年 第 MM 月';
				}else{
					return 'yyyy 年 MM 月 dd 日';
				}
			},
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
			getIcon(value){
				return value<0?'icon-shangsheng1':value>0?'icon-shangsheng':'icon-chiping';
			},
			getIconColor(value){
				return value<0?'#67C23A':value>0?'red':'';
			},
			changeData(){
				this.chartDom=[];
				this.getDatas();
				this.getChartsDatas();
				this.getActBoard();
			},
			resetCharts(obj){
				//如果chartMenus只有一个选中的话则最后一个不可不选
				let _t=0;
				for(let m of this.chartMenus){
					if(m.check)
						_t++;
				}
				if(_t==1&&obj.check){
					return;
				}
				obj.check=!obj.check;
				this.getChartsDatas();
			},
			//取出请求参数(会员增长走势)
			getParams(type){
				var params={};
				for(let obj of this.options){
					if(obj.value==type){
						params.dtype=obj.type;
						break;
					}	
				}
				if(type=='week'){
					let d=new Date(this.currentTime).getDay();
					params.fsrqq=this.getDateByDistance(-1*d,this.currentTime);
					params.fsrqz=this.getDateByDistance(6-d,this.currentTime);
				}else if(type=='month'){
					let y=new Date(this.currentTime).getFullYear();
					let m=new Date(this.currentTime).getMonth()+1;
					params.month=y+'-'+(m<10?'0'+m:m);
				}else{
					params.fsrq=this.$util.getFormatDate(this.currentTime);
				}
				return params;	
			},
			//获取会员看板详情接口
			getDatas(){
				var params=this.getParams(this.range);
				this.$http('/api/x6/crmGetHyfxHykb.do',params).then(res=>{
					this.chartMenusData=res.VO;
				});
			},
			//获取会员看板表格数据接口
			getChartsDatas(){
				var params=this.getParams(this.range);
				params.flList=[];
				for(let obj of this.chartMenus){
					if(obj.check)
						params.flList.push(obj.lx);
				}
				this.$http('/api/x6/crmHyzzzs.do',params).then(res=>{
					let xData=[];
					let yData=[];
					for(let obj of res.List){
						for(let key in obj){
							let _temp={
								name:this.charts[key].label,
								type:'line',
								itemStyle: {
									normal: {
										color: this.charts[key].color,
										lineStyle: {
											color: this.charts[key].color
										}
									}
								},
								data:[]
							};
							for(let d of obj[key]){
								if(xData.indexOf(d.wd)==-1){
									xData.push(d.wd);
								}
								_temp.data.push(d.sl);
							}
							yData.push(_temp);
						}
					}
					xData.sort(function(a,b){
						if(a<b)
							return -1;
						else if(a>b)
							return 1;
						else
							return 0;
					})
					this.drawChart(xData,yData);
				});
			},
			//获取活动看板的数据
			getActBoard(){
				var params=this.getParams(this.range);
				//活动浏览量
				this.$http('/api/x6/crmGetHdkbLookcsfx.do',params).then(res=>{
					this.setChartDatas(this.activityCharts[0],res.VO);
					this.drawChart(this.activityCharts[0].xData,this.activityCharts[0].yData,this.activityCharts[0].ref,false);
				});
				//活动转化率
				this.$http('/api/x6/crmGetHdkbZhlfx.do',params).then(res=>{
					let temp=res.VO.value*100;
					temp=res.VO.value.toFixed(2)+'%';
					res.VO.value=temp;
					this.setChartDatas(this.activityCharts[1],res.VO);
					this.drawChart(this.activityCharts[1].xData,this.activityCharts[1].yData,this.activityCharts[1].ref,false);
				});
				//活动停留时间
				this.$http('/api/x6/crmGetHdkbTlsj.do',params).then(res=>{
					this.setChartDatas(this.activityCharts[2],res.VO);
					this.drawChart(this.activityCharts[2].xData,this.activityCharts[2].yData,this.activityCharts[2].ref,false);
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
				target.yData.push({
					data:_temp,
					type:'line'
				})
			},
			drawChart(xData,yData,target='charts',needLegend=true,bottom='5%',align='center'){
				for(let obj of yData){
					obj.smooth=true;
				}
				if(needLegend){
					var title=[];
					for(let obj of yData)
						title.push(obj.name);
				}
				var chart = echarts.init(target=='charts'?this.$refs[target]:this.$refs[target][0]);
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
						bottom: bottom,
						top:'9%',
						containLabel: true
					},
					xAxis : [
						{
							type : 'category',
							boundaryGap : false,
							data : xData,
							axisLabel:{
								align:align
							}
						}
					],
					yAxis : [
						{
							type : 'value'
						}
					],
					series : yData,
					//color: this.chartColor
				};
				if(needLegend)
					option.legend={data:title}
				chart.setOption(option,true);
			},
			getDateByDistance(distance,current){
				const M=24*60*60*1000;
				var point=new Date(current).getTime();
				var target=point+M*distance;
				return this.$util.getFormatDate(new Date(target));
			}
		},
		mounted(){
			this.currentTime=new Date();
            this.changeData();
            this.$util.windowResize(()=>{
                for(let obj of this.chartDom)
			        obj.resize();
            },'statistics');
		}
	}
</script>
<style  lang="less" scoped>
	.rootContainer{
		background: #fff;
		padding: 10px 0;
		height: auto !important;
		>div{box-sizing: border-box;}
		.root-title{
			padding: 10px;
			background: #f8f9f8;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 10px 0;
			span{font-size: 14px;}
		}
		.root-title-before{
			div{
				display: inline-flex;
				align-items: center;
				font-size: 13px;
				&:before{
					content:'';
					height: 20px;
					width: 2px;
					background: #409EFF;
					display: block;
					margin-right: 5px;
				}
			}
		}
		.chart-menu{
			display: flex;
			justify-content: center;
			padding: 10px;
			user-select: none;
			>div{
				width: 150px;
				height: 150px;
				border-radius: 4px;
				border: 1px solid #ccc;
				margin: 0 10px;
				box-sizing: border-box;
				padding: 8px;
				cursor: pointer;
				display: inline-flex;
				flex-direction: column;
				justify-content: space-between;
				>div{
					display: flex;
					align-items: center;
					justify-content: space-between;
					span{
						display: inline-flex;
						width: 70px;
						align-items: center;
						color: #666;
					}
					span::nth-child(2){
						justify-content: flex-end;
					}
				}
			}
			.selected{
				border-color:#409EFF;
				background: #e8f2ff;
			}
		}
		.chart-body{
			height: 300px;
			background: #fff;
		}
		.el-row{
			margin: 0 !important;
			.activity-chart{
				height: auto;
				background: #f8f9f8;
				box-sizing: border-box;
				padding: 10px;
				div{height: 200px;}
				p{
					margin-bottom: 10px;
					display: flex;
					align-items: center;
					b{margin-right: 5px;}
					i{transform: scale(.8,.8);cursor: pointer;}
					span{
						display: inline-flex;
						width: 70px;
						align-items: center;
						color:#666;
					}
					span::nth-child(2){
						justify-content: flex-end;
					}
				}
			}
		}
	}
</style>