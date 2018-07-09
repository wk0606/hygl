<template>
	<div class="hd-container" ref="rootDiv">
		<bar :bar-show="controlmenu">
			<el-button size="small" type="warning" slot="bar-x" icon="el-icon-plus" @click="addActivity">新增活动</el-button>
			<el-input
				size="small"
				placeholder="请输入活动名称"
				suffix-icon="el-icon-search"
				style="width:220px;"
				v-model="name"
				@input="searchByName"
				slot="bar-x"
			></el-input>
			<el-button size="small" type="primary" slot="bar-y" icon="el-icon-delete" @click="remove">删除活动</el-button>
		</bar>
		<div class="act-table" ref="table">
			<el-table stripe :data="datas" border height="100%"  ref="multipleTable" @selection-change="changeBar">
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column
					v-for="item in colModel"
					:key="item.prop"
					header-align="center"
					:align="item.align"
					:width="item.width"
					:min-width="item.min"
					:prop="item.prop"
					:label="item.label"
					:render-header="item.needDesc?renderHelp:null"
				>
					<template slot-scope="scope">
						<span
							class="cell-span"
							:class="{'cell-span-blue':item.cellClick,nowrap:item.prop=='yxrq'}"
							:style="{color:item.formatColor?item.formatColor(scope.row):''}"
							@click="item.cellClick?item.cellClick(scope.row):null"
						>
							{{item.format?item.format(scope.row):scope.row[item.prop]}}
							<i class="icon-back" v-if="item.prop=='title'&&scope.row.isfxfk"><i>返</i></i>
						</span>
						
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width='150'>
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="chartView(scope.row)">PV值</el-button>
						<el-button type="text" size="mini" @click="realView(scope.row)">用户画面</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<pagination :data="pagination" @current-change="changePage"></pagination>
		<component :is="dialog.name" :views="dialog"></component>
	</div>
</template>
<script>
	import chart_view from './charts_view'
	import bar from '../../components/bar/index'
	import py from '../../func/pinyin'
	import pagination from '../../components/pagination/index'
	import {Loading} from '../../func/loading'
	import fax_preview from './real_view'
	export default{
		name:'hy_activity',
		data(){
			return{
				name:'',
				controlmenu:true,
				datas:[],
				alldatas:[],
				pagination:{
					size:20,
					page:1,
					rows:0
				},
				colModel:[
					{prop:'title',label:'活动名称',align:'left',min:150,cellClick:this.openActivity,needFilter:true},
					{prop:'yxrq',label:'有效时间',align:'center',min: 150,format:this.formatRq,class:'nowrap'},
					{prop:'hdzt',label:'活动状态',align:'center',width: 120,needFilter:true,formatColor:this.formatColor},
					{prop:'xsje',label:'活动销售金额',align:'right',width: 137,currency:true,needDesc:true},
					{prop:'xssl',label:'消费人数',align:'right',width: 110,needDesc:true},
					{prop:'looksl',label:'浏览人数',align:'right',width: 110,needDesc:true}
				],
				renderHeader:this.tableHeader,
				filterColumn:{
					title:{show:false},
					hdzt:{show:false},
					isfxfk:{show:false,format:this.formatFxfx,help:'客户是否可在小程序端分享该活动获得门店红包'},
					xsje:{help:'参与该活动的销售金额'},
					xssl:{help:'参与该活动并消费的客户数'},
					looksl:{help:'通过小程序查看该活动的客户数'},
					originalList: [],
					filterConditions: {},
					isPagination: true,
					tableKey:'List'
				},
				selectRow:null,
				dialog:{
					name:'',
					data:null,
					show:true
				}
			}
		},
		methods:{
			getList(){
				Loading.open({
					target:this.$refs.table
				});
				this.$http('/api/x6/CrmActivityList.do',{}).then(res=>{
					Loading.close();
					this.alldatas=res.List;
					this.pagination.rows=res.List.length;
					this.filterColumn.originalList=res.List;
					this.changePage();
				},err=>{
					Loading.close();
				});
			},
			//新增活动
			addActivity(){
				this.$router.push('/main/activity-add/-1');
			},
			openActivity(row){
				this.$router.push(`/main/activity-add/${row.id}`);
			},
			//删除活动
			remove(){
				this.$confirm('确定要删除选择的活动吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var _temp=[];
					for(let obj of this.selectRow)
						_temp.push(obj.id);
					this.$http('/api/x6/CrmActivityDel.do',{
						ids:_temp.join(',')
					}).then(res=>{
						this.$message('删除成功');
						this.getList();
					});
				}).catch(() => {
					return;         
				});
			},
			//效果数据
			chartView(row){
				this.dialog.name='chart_view';
				this.dialog.show=true;
				this.dialog.data=row.id;
			},
			//真机预览
			realView(row){
				this.dialog.name='fax_preview';
				this.dialog.data=row.id;
			},
			changePage(page){
				this.pagination.page=page||1;
				this.datas=this.alldatas.slice((this.pagination.page-1)*this.pagination.size,this.pagination.page*this.pagination.size);
			},
			changeBar(rows){
				this.selectRow=rows.length?rows:null;
				this.controlmenu=rows.length?false:true;
			},
			//快速搜索
			searchByName(){
				var name=this.name.trim().toLowerCase();
				this.alldatas=this.filterColumn.originalList.filter(item=>{
					return item.title.indexOf(name)>-1||py.GetPY(item.title).indexOf(name)>-1;
				});
				this.changePage();
			},
			//格式化状态
			formatRq(row){
				return row.yxrqq+'至'+row.yxrqz;
			},
			//格式化字体颜色
			formatColor(row){
				return row.hdzt=='活动已结束'?'#666':row.hdzt=='活动进行中'?'red':'#409EFF';
			},
			formatFxfx(row){
				return row.isfxfk?'参与':'不参与';
			},
			renderHelp(h, {column, $index, store, _self}){
				return h('div',{
					style: {
						position: 'relative',
						overflow: 'visible',
						lineHeight:0
					}
				},[h('span',column.label),h('i',{
					style: {
						cursor: 'pointer',
						color: '#888',
						fontSize: '14px',
						marginLeft:'5px',
						position: 'absolute',
						right: '-9px',
						top: '50%',
						transform: 'translateY(-50%)'
					},
					class:{
						'iconfont': true,
						'icon-bangzhu3':true
					},
					attrs:{
						title:this.filterColumn[column.property].help
					}
				})])
			}
		},
		activated(){
			this.getList();
		},
		mounted(){
			this.$on('filterList',array=>{
				this.alldatas=array;
				this.changePage();
			});
		},
		components:{
			fax_preview,
			bar,
			pagination,
			chart_view
		}
	}
</script>
<style  lang="less" scoped>
	.hd-container{
		.act-table{
			position: relative;
			height: ~"calc(100% - 105px)";
		}
	}
	.el-button{font-family: 'microsoft yahei';}
	.nowrap{
		white-space: normal !important;
		word-wrap:break-word;
		line-height: 15px;
	}
	.icon-back{
		width: 20px;
		height: 20px;
		background-image: url('../../assets/jb.png');
		background-size: 100% 100%;
		background-position: 0 0;
		display: block;
		position: absolute;
		top:0;
		left:0;
		color:#fff;
		i{
			font-size: 12px;
			position: absolute;
			top:0;
			left: 0;
			line-height: 15px;
			transform: scale(.8,.8);
		}
	}
</style>