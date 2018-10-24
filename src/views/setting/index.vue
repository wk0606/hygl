<template>
	<div class="set-container" @click="location.show=false">
		<div class="search">
			<div class="upload-div">
				<b>苏州麦尔芽</b>
				<el-button type="text" size="small" @click="openUpload">广告页</el-button>
			</div> 
			<div>
				<el-checkbox v-model="onlyNoLocation" @change="changeList">仅显示未定位</el-checkbox>
				<el-input size="small" suffix-icon="el-icon-search" placeholder="请输入门店名称" @input="searchByName" v-model="name" clearable></el-input>
			</div>
		</div>
		<div class="shop-body" ref="container">
			<el-table
				border
				stripe
				:data="List"
				height="100%"
				:highlight-current-row="true"
			>
				<el-table-column
					v-for="item in colModel"
					:key="item.prop"
					header-align="center"
					:align="item.align"
					:width="item.width"
					:min-width="item.min"
					:prop="item.prop"
					:label="item.label"
					
				>
					<template slot-scope="scope">
						<span
							class="cell-span"
							:class="{'cell-span-blue':item.cellClick}"
							@click.stop="item.cellClick?item.cellClick(scope.row):null"
						>
							{{item.format?item.format(scope.row):scope.row[item.prop]}}
						</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="lnglat"
					label="盒子状态"
					width="120"
					align="center"
				>
					<template slot-scope="scope">
						<span class="cell-span canclick" :style="{color:setColor(scope.row)}" @click="bindBox(scope.row)">{{formatHzzt(scope.row)}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="lnglat"
					label="位置服务"
					width="120"
					align="center"
					:render-header="renderLocation"
				>
					<template slot-scope="scope">
						<span class="cell-span canclick" :class="{highlight:!scope.row.lnglat}" @click="uploadLocation(scope.row)">{{formatSc(scope.row)}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="lnglat"
					label="操作"
					width="120"
					align="center"
				>
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="createQRcode(scope.row,scope.$index)" :loading="scope.$index===loadRow">门店二维码</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 地图定位 -->
			<transition name="slideRight">
				<loction v-if="location.show" :views="location" @location-success="refreshList"></loction>
			</transition>
		</div>
        <component :is="dialog.name" :views="dialog"></component>
		<bind-box :control="controlBindBox" v-if="controlBindBox.show" @bind-success="getMdList"></bind-box>
	</div>
</template>
<script>
import loction from './location'
import uploadBanner from './uploadBanner'
import qrCode from './QRcode'
import bindBox from '../box/bindBox'
import py from '../../func/pinyin'
import {Loading} from '../../func/loading'
export default {
	name:'hy_setting',
	data() {
		return {
			onlyNoLocation:false,
			name:'',
			allList:null,
			List:null,
			colModel:[
				{prop:'name',label:'门店名称',align:'left',min:200,cellClick:this.setLocation,needFilter:true},
				{prop:'qy',label:'区域',align:'left',width:200,format:this.formatQy},
				{prop:'dz',label:'详细地址',align:'left',min:300}
			],
			location:{
				show:false,
				data:null
			},
			renderHeader:this.tableHeader,
			filterColumn:{
				name:{show:false},
				ssgs:{show:false,format:this.formatGs},
				originalList: [],
				filterConditions: {},
				isPagination: false,
				tableKey:'List',
			},
			gslist:null,
			height:200,
			code:{
				show:false,
				pic:''
			},
			loadRow:'',
			dialog:{
                name:'',
                show:false,
				data:null
			},
			controlBindBox: {
				show: false,
				item: '',
			}
		}
	},
	methods: {
		getMdList(){
			Loading.open({
				target:this.$refs.container
			});
			this.$http('/api/x6/getCrmMdList.do',{}).then(res=>{
				this.allList=res.List;
				this.filterColumn.originalList=res.List;
				this.List=JSON.parse(JSON.stringify(this.allList));
				Loading.close();
			},err=>{
				Loading.close();
			});
		},
		//刷新列表
		refreshList(){
			this.getMdList();
		},
		changeList(){
			this.List=this.allList.filter(item=>{
				return this.onlyNoLocation?!item.lnglat:item;
			});
		},
		//设置定位
		setLocation(row){
			this.location.show=true;
			this.location.data=JSON.parse(JSON.stringify(row));
		},
		uploadLocation(row){
			if(!row.lnglat){
				this.setLocation(row);
			}
		},
		//检索
		searchByName(){
			var name=this.name.trim().toLowerCase();
			var temp=this.allList.filter(item=>{
				return this.onlyNoLocation?!item.location:item;
			});
			this.List=temp.filter(item=>{
				return item.name.indexOf(name)>-1||py.GetPY(item.name).indexOf(name)>-1;
			});
		},
		//生成二维码
		createQRcode(row,index){
			if(!row.bindbox){
				this.$confirm('该门店还没有绑定麦芽盒子，现在去绑定？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: "warning",
				}).then(() => {
					this.controlBindBox.item = row
					this.controlBindBox.show = true
				});
				return;
			}else{
				this.loadRow=index;
				this.$http('/api/x6/getMdGzhEwm.do',{
					id:row.id
				}).then(res=>{
					this.loadRow='';
					this.dialog.name='qrCode';
					this.dialog.data=res.getUrl;
				},err=>{
					this.loadRow='';
				});
			}
		},
		//绑定/结冰盒子
		bindBox(row){
			if(!row.bindbox){
				this.controlBindBox.item = row
				this.controlBindBox.show = true
			}else{
				this.$confirm('解绑麦芽盒子后将无法获取该门店的客流量数据以及考勤记录，确定要解绑麦芽盒子？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: "warning",
				}).then(() => {
					this.$http("/api/x6/box/unbindbox.do", {
						gsdm: this.$util.getCache('user').gsdm,
						ssgsid: row.id
					}).then((response) => {
						this.$message('解绑成功');
						this.getMdList();
					});
				})
			}
		},
		openUpload(){
            this.dialog.name='uploadBanner';
            this.dialog.show=true;
			this.dialog.data=null;
		},
		formatSc(row){
			return row.lnglat?'已上传':'未上传';
		},
		formatQy(row){
			return row.province+row.city+row.town;
		},
		formatGs(row){
			for(let obj of this.gslist){
				if(obj.bm==row.ssgs)
					return obj.name;
			}
			return '';
		},
		formatHzzt(row){
			return row.bindbox?'已绑定':'未绑定';
		},
		setColor(row){
			return row.bindbox?'#67C23A':'red';
		},
		renderLocation(h, {column, $index, store, _self}){
			return h('div',{
				style: {
					position: 'relative',
                    overflow: 'visible',
                    width:'100%',
                    lineHeight:0
				}
			},[h('span',column.label),h('i',{
				style: {
					cursor: 'pointer',
					color: '#aaa',
					fontSize: '15px',
					position: 'absolute',
					right: '-4px',
					top: '50%',
					transform: 'translateY(-48%)'
				},
				class:{
					'iconfont': true,
					'icon-bangzhu3':true
				},
				attrs:{
					title:'上传门店位置可以让客户更快的找到您的店铺哦'
				}
			})])
		},
		resize(){
			this.height=this.$refs.container.offsetHeight;
		}
	},
	mounted(){
		this.gslist=this.$util.getCache('gslist');
		this.getMdList();
	},
	components:{
		loction,
		qrCode,
		uploadBanner,
		bindBox
	}
}
</script>
<style lang="less" scoped>
	.set-container {
		width: 100%;
		padding:20px 20px 10px 20px;
		box-sizing: border-box;
		height: 100%;
		background: #fff;
		overflow-y: auto;
		.search{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding:10px 0;
			.upload-div{
				width: auto;
				height:23px;
				background: url('../../assets/gs.png') no-repeat 0 0;
				background-size: auto 100%;
				box-sizing: border-box;
				padding-left: 30px;
				line-height:23px;
				b{font-size: 14px;margin-right: 10px;}
			}
			.el-input{
				width: 300px;
				margin-left: 10px;
			}
		}
		.shop-body{
			height: ~"calc(100% - 63px)";
			margin-top: 10px;
			position: relative;
			.row-container{
				height: ~"calc(100% - 35px)";
				overflow: auto;
			}
			.shop-item{
				display: flex;
				>div{
					line-height: 35px;
					font-size: 12px;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}
			.shop-head{
				font-weight: bold;
				background: #e5e9f2;
				>div{
					text-align: center;
				}
				i{
					margin-left: 5px;
					font-size: 14px;
					color: #aaa;
				}
			}
			.headPadding{
				box-sizing: border-box;
    			padding-right: 10px;
			}
			.shop-row{
				border-bottom: 1px solid #f5f4f5;
				div{
					box-sizing: border-box;
					padding: 0 10px;

				}
			}
			.highlight{color:red;}
		}
		.canclick{cursor: pointer;}
	}
</style>