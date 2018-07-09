<template>
	<div class="charts-container">
		<div class="charts-top">
			<el-row :gutter="20">
				<el-col
					v-for="(item,index) in wrappers"
					:key="index"	
					:sm="8"
					:xs="24"
				>
					<div class="wrapper-item" :style="{background:item.bgColor}">
						<div class="wrapper-item-left">
							<div><i class='iconfont' :class="item.icon"></i></div>
							<div>{{item.title}}</div>
						</div>
						<div class="wrapper-item-right">
							<table>
								<tr
									v-for="(item,key) in item.infos"
									:key="key"
								>
									<td style="text-align:right;">{{item.label}}</td>
									<td style="text-align:right;">{{item.currency?$util.formatCash(item.value):item.value}}</td>
								</tr>
							</table>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="charts-middle-top">
			<span>会员增长走势</span>
			<div>
				<el-select v-model="range" placeholder="请选择" size="small" style="width:70px;" @change="getChartsDatas">
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
          			@change="getChartsDatas"
				>  
				</el-date-picker>
			</div>
		</div>
		<div class="charts-middle" ref="middle">
			<div ref="charts"></div>
		</div>
		<div class="charts-bottom">
			<div>
				<span>生日提醒</span>
				<div @click="sendMessage">发短信</div>
			</div>
			<el-table
				border
				style="width:100%;"
				stripe=""
				:data="lists"
				ref="multipleTable"
				@selection-change="handleChange"
			>
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column
					v-for="item in colModel"
					:key="item.prop"
					:prop="item.prop"
					:label="item.label"
					header-align="center"
					:align="item.align"
					:width="item.width"
					:min-width="item.min"
				>
					<template slot-scope="scope">
						<span v-if="item.prop!='tags'" class="cell-span" :class="{blueClickText:item.click}" @click="item.click?item.click(scope.row):null">{{scope.row[item.prop]}}</span>
						<ul v-else class="t-body">
							<li
								v-for="(tag,index) in formatTags(scope.row.tags)"
								:key="index"
								:style="{background:tag.color}"
							>{{tag.name}}</li>
						</ul>
					</template>	
				</el-table-column>
			</el-table>
			<div style="padding:10px 0;text-align:center;">
				<el-pagination
					@current-change="changePage"
					:page-size="pagination.size"
					layout="total, prev, pager, next, jumper"
					:total="pagination.total"
					:current-page="pagination.page"
				></el-pagination>
			</div>
		</div>
		<!--发送短信息-->
		<send_message v-if="views.show" :views="views"></send_message>
	</div>
</template>
<script>
	import echarts from 'echarts'
	import send_message from './sendMessage'
	export default{
		name:'hy_charts',
		data(){
			return{
				activeName:'first',
				datas:[],
				wrappers:[
					{title:'今日销售',bgColor:'#58c9c7',icon:'icon-zhuanrenmingbi1',infos:{je:{label:'金额',value:0,currency:true},lr:{label:'利润',value:0,currency:true}}},
					{title:'今日红包',bgColor:'#f2ab40',icon:'icon-hongbao',infos:{jrff:{label:'今日发放',value:0},jrsy:{label:'今日使用',value:0},ysy:{label:'已使用',value:0},zsy:{label:'总数量',value:0}}},
					{title:'今日会员',bgColor:'#5cb85c',icon:'icon-huiyuan',infos:{jrxz:{label:'今日新增',value:0},hyzs:{label:'会员总数',value:0}}}
				],
				colModel:[
					{prop:'name',label:'会员姓名',width:150,align:'left'},
					{prop:'sex',label:'性别',width:80,align:'center'},
					{prop:'phone',label:'电话',width:120,align:'center'},
					{prop:'tags',label:'会员画像',width:100,align:'center'},
					{prop:'csny',label:'生日',width:120,align:'center'},
					{prop:'gsname',label:'所属店铺',min:150,align:'left'},
					{prop:'xfje',label:'消费总额',width:100,align:'right',currency:true},
				],
				lists:[],
				range:'date',
				options:[
					{value:'date',label:'日',type:'D'},
					{value:'week',label:'周',type:'W'},
					{value:'month',label:'月',type:'M'}
				],
				currentTime:'',
				pickerOptions:{
					disabledDate(time) {
						return time > Date.now();
					}
				},
				pagination:{
					size:20,
					page:1,
					total:0
				},
				views:{
					show:false,
					datas:null
				},
				chart:null
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
			}
		},
		methods:{
			getCardData(){
				this.$http('/api/x6/crmGetTotalSell.do',{}).then(res=>{
					this.wrappers[0].infos.je.value=res.VO.je;
					this.wrappers[0].infos.lr.value=res.VO.lr;
				});
				this.$http('/api/x6/crmGetTotalGift.do',{}).then(res=>{
					this.wrappers[1].infos.jrff.value=res.VO.jrff;
					this.wrappers[1].infos.jrsy.value=res.VO.jrsy;
					this.wrappers[1].infos.ysy.value=res.VO.totalsyje;
					this.wrappers[1].infos.zsy.value=res.VO.totalwsy+res.VO.totalsyje;
				});
				this.$http('/api/x6/crmGetTotalHyxx.do',{}).then(res=>{
					this.wrappers[2].infos.hyzs.value=res.VO.total;
					this.wrappers[2].infos.jrxz.value=res.VO.jrzz;
				});
			},
			//取出请求参数(会员增长走势)
			getParams(type){
				var params={
					flList:['newHy']
				};
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
			//
			getChartsDatas(){
				var params=this.getParams(this.range);
				this.$http('/api/x6/crmHyzzzs.do',params).then(res=>{
					let xData=[];
					let yData=[];
					for(let obj of res.List[0].newHy){
						xData.push(obj.wd);
						yData.push(obj.sl);
					}
					this.drawChart(xData,yData);
				})
			},
			drawChart(xdata,ydata){
				this.chart = echarts.init(this.$refs.charts);
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
						top: '3%',
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
					series : [
						{
							name:'数量',
							type:'line',
							stack: '总量',
							data:ydata
						}
					]
				};
				this.chart.setOption(option,true);
			},
			getList(){
				this.$http('/api/x6/xfzxxReport.do',{
					pageSize: this.pagination.size,
					pageNo: this.pagination.page,
					isbirthday:1
				}).then(res=>{
					this.lists=res.rows;
					this.pagination.total=res.totalRows;
				});
			},
			changePage(page){
				this.pagination.page=page;
				this.getList();
			},
			//选择表格行
			handleChange(val){
				this.views.datas=val;
			},
			//发短信
			sendMessage(){
				if(!this.views.datas||!this.views.datas.length){
					this.$alert('请选择要发送的会员');
				}else{
					this.views.show = true;
				}
			},
			//获取今日万年历
			getTodayCalendar(date){
					
			},
			formatTags(tags){
				return JSON.parse(tags.value);
			},
			/**取出相差distance天是那一天
			 * @augments distance : 天 
			 * current 日期
			 */
			getDateByDistance(distance,current){
				const M=24*60*60*1000;
				var point=new Date(current).getTime();
        		var target=point+M*distance;
				return this.$util.getFormatDate(target);
			}
		},
		mounted(){
			this.$refs.charts.style.height=this.$refs.middle.offsetHeight-40+'px';
			this.currentTime=new Date();
			this.getCardData();
			this.getChartsDatas();
			this.getList();
			this.$util.windowResize(()=>{
				if(this.chart)
					this.chart.resize();
			},'charts');
		},
		components:{
			send_message
		}
	}
</script>
<style  lang="less" scoped>
	.charts-container{
		width:100%;
		height:100%;
		box-sizing:border-box;
		display: flex;
		flex-direction: column;
		//overflow:auto;
		.charts-top{
			width:100%;
			flex-shrink: 0;
			.el-row{
				width: 100%;
				margin: 0 !important;
				box-sizing: border-box;
				.el-col{margin: 10px 0;}
				.wrapper-item{
					height:114px;
					box-sizing: border-box;
					padding: 10px;
					border-radius: 5px;  
					display: flex;
					justify-content: space-between;
					align-items: center;
					color:#fff;
					>div{display: inline-flex;flex-direction: column;align-items: center;}
					.wrapper-item-left{
						text-align: center;
						div:nth-child(1){
							width: 30px;
							height: 30px;
							border-radius: 50%;
							text-align: center;
							line-height: 30px;
							margin-bottom: 10px;
							text-align: center;
							background: rgba(255,255,255,.5);
							i{font-size:15px;}
						}
					}
					.wrapper-item-right{
						td{
							padding: 5px;
						}
					}
				}
			}
		}
		.charts-middle-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 0;
			flex-shrink: 0;
			>span{
				font-size: 14px;
			}
			>div{
				display: inline-flex;
				align-items: center;
			}
		}
		.charts-middle{
			background:#fff;
			box-sizing: border-box;
			padding:10px 20px 20px 20px; 
			font-size:14px;
			flex-grow: 1;
			
			>div{
				margin-top: 20px;
				height: 100%;
			}
		}
		.charts-bottom{
			flex-shrink: 0;
			box-sizing: border-box;
			background:#fff;
			//padding:20px;
			margin-top: 20px;
			>div:nth-child(1){
				display: flex;
				align-items: center;
				>span{
					width:80px;
					height:38px;
					line-height:38px;
					text-align:center;
					display:block;
					background:#eef1f6;
					color:#ff8800;
					border-bottom:2px solid #ff8800;
				}
				>div{
					height: 28px;
					line-height: 28px;
					margin-left:30px;
					cursor:pointer;
					padding:0 20px;
					background:#ff9900;
					color:#fff;
					border-radius:3px;
				}
			}
		}
		.t-body{
			display: flex;
			flex-wrap: wrap;
			flex-direction: column;
			li{
				width: 100%;
				height: 16px;
				line-height: 16px;
				border-radius: 10px;
				font-size: 12px;
				color:#fff;
				text-align: center;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				margin:5px 0;
			}
		}
	}	
</style>