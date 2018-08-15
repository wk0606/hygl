<template>
	<div ref="rootDiv" class="rootContainer" @click="closeDialog">
		<div class="top-container" ref="topDiv">
			<div class="topdiv-left">
				<el-button type="warning" @click="dialog.name='addMember',dialog.show=true">新增会员</el-button>
				<el-button type="warning" @click="dialog.name='importMenber',dialog.show=true">批量导入</el-button>
			</div>
			<div class="topdiv-right" @click.stop="purchase" >
				<i class="iconfont icon-xinxiduanxinxiaoxitixingyoujiansixinyouxiang"></i>
				<p>短信充值</p>
			</div>
		</div>
		<div class="cnt-top" ref="top">
			<div class="top-left">
				<span>关键字：</span>
				<el-input v-model="searchkey" auto-complete="off" placeholder="请输入姓名 / 号码关键字进行检索" style="width:260px;" @input="searchHy" size="small">
				</el-input>
				<div class="top-filter" @click.stop="showFilter = true">
					<img src="../../assets/icon_sort.png" width="22" height="22" @click.stop="showFilter = true" /><i class="text" @click.stop="showFilter = true">排序</i>
					<div class="filter-items-wrapper" v-show="showFilter" @mouseenter="filterEnter" @mouseleave="filterLeave">
							<span class="top-title">请选择列的排序方式</span>
							<span v-for="(item,index) in filterDataList" :key="index" class="item-wrapper">
	                			<i class="item-name" :class="{'selectName':item.orderType != -1}">{{item.name}}</i>
	                			<i class="item-radio iconfont icon-shengxu"
	                   				:class="{isSelected:item.orderType == 1}"
	                   				@click="selectFilterTypes(item,true)">升序</i>
	                			<i class="item-radio iconfont icon-jiangxu"
	                   				:class="{isSelected:item.orderType == 0}"
	                   				@click="selectFilterTypes(item,false)"
	                			>降序 </i>
              				</span>
							<div class="sure-wrapper">
								<el-button type="warning" size="small" @click.stop="resetFilters">重置
								</el-button>
								<el-button type="info" size="small" @click.stop="getList">确认
								</el-button>
							</div>
						</div>
				</div>
				<el-button type="primary" size="small" style="margin-left:20px" @click.stop="openHighSearch">高级检索</el-button>
				<el-button type="warning" size="small" style="margin-left:20px" @click.stop="sendMessage">发短信</el-button>
			</div>
			<div class="top-right">
				<img src="../../assets/cake.png" style="display:inline-block;vertical-align:bottom" v-if="!showBirthday"/>
				<b style="color:#dbdd85;font-size:14px;line-height:24px;" @click="showBirthday=!showBirthday,handleCurrentChange(1)">{{showBirthday?'显示全部':'今天生日'}}</b>
			</div>
		</div>
		<div class="c-main">
			<!--列表-->
			<el-table
				:data='List'
				border stripe
				height='100%'
				style="width:100%"
				ref="multipleTable"
				@selection-change="selectdg"
			>
				<el-table-column type="selection" width="55" align="center"></el-table-column>
				<el-table-column
                    v-for="item in columns"
                    :key="item.prop"
                    header-align="center"
                    :align="item.align||'center'"
                    :label="item.label"
                    :prop="item.prop"
                    :fixed="item.fixed"
                    :width="item.width"
                    :min-width="item.min"
					:render-header="item.render"
                >
                    <template slot-scope="scope">
                        <span
                            class="cell-span"
                            :class="{'cell-span-blue':item.click}"
                            v-if="item.prop!='tags'"
                            @click.stop="item.click?item.click(scope.row,scope.$index):null"
                        >
                            {{item.format?item.format(scope.row):scope.row[item.prop]}}
                            <img src="../../assets/cake.png" v-if="item.prop=='name'&&scope.row.isbirthday" style="vertical-align:bottom;"/>
                        </span>
						<img
							v-else
							:src="scope.row.sex?sex1:sex0" alt=""
							style="cursor:pointer"
							width="20"
							@click.stop="item.click(scope.row,scope.$index)"/>
                    </template>
                </el-table-column>
				<el-table-column label="硬件信息" align="center" width='120' prop='mac' :render-header="renderMac">
					<template slot-scope="scope">
						<span class="cell-span" :style="formatMacStyle(scope.row)">{{scope.row.mac?'已获取':'未获取'}}</span>
					</template>
				</el-table-column>
			</el-table>
			<transition name="slideRigh">
				<edit-member v-if="editForm.show" ref="editMember" :views="editForm" @edit-success="editSuccess"></edit-member>
				<detail-member v-if="detailForm.show" :views="detailForm"></detail-member>
				<redbag v-if="bag.show" :views="bag"></redbag>
			</transition>
		</div>
		<!--分页-->
		<div class="pagination" ref="pagination">
			<el-pagination
				@current-change="handleCurrentChange"
				:page-size="pagination.size" 
				:total="pagination.rows"
				:current-page="pagination.page"
				layout="total, prev, pager, next, jumper"
			></el-pagination>
		</div>
		<component :is="dialog.name" v-if="dialog.show" :views="dialog" @callback="getList" @send-success="clearRow"></component>
		<high-search v-if="paramsDialog.show" :views="paramsDialog" @selected="searchByParams"></high-search>
	</div>
</template>
<script>
	import addMember from './addMember'
	import importMenber from './importMember'
	import paySms from './paySms'
	import redbag from './redbag'
	import sendSms from '../main/sendMessage'
	import editMember from './editMember'
	import detailMember from './detailMember'
	import highSearch from './highSearch'
	export default {
		name:'hy_client',
		data() {
				return {
                    columns:[
                        {label:'姓名',prop:'name',click:this.showEdit,fixed:'left',width:140,align:'left'},
                        {label:'消费次数',prop:'xfcs',click:this.showDetail,fixed:'left',width:100,align:'right'},
                        {label:'红包数量',prop:'redpacket',click:this.showBag,fixed:'left',width:100,align:'right'},
                        {label:'手机号',prop:'phone',min:120},
                        {label:'画像',prop:'tags',width:80,click:this.openTags},
                        {label:'微信号',prop:'wx',min:120},
                        {label:'生日',prop:'csny',width:120},
                        {label:'注册日期',prop:'zzrq',width:140},
                        {label:'消费金额',prop:'xfje',width:120,align:'right',format:this.formatJe},
                        //{label:'硬件信息',prop:'mac',width:100,format:this.formatMac,render:this.renderMac}
                    ],
					showMember:{
						show:false
					},
					showFilter: false,
					timeout_id: '',
					sortStr: '',
					filterDataList: [{
						name: '消费次数',
						label: 'xfcs',
						orderType: -1
					}, {
						name: '消费金额',
						label: 'xfje',
						orderType: -1
					}, {
						name: '综合毛利',
						label: 'xfml',
						orderType: -1
					}, {
						name: '注册日期',
						label: 'zzrq',
						orderType: -1
					}, {
						name: '生日',
						label: 'csny',
						orderType: -1
					}],
					detailVisible: {
						show: false
					},
					sign: {
						flag: false
					},
					sendShow: {
						show: false,
						isall: false
					},
					purchaseShow: {
						show: false
					},
					sels: [], //列表选中列
					isshow: true,
					pagination:{
						size:21,
						page:1,
						rows:0
					},
					List:[],
					options: {
						top: '',
						height: ''
					},
					recordSender: [],
					members: [],
					searchkey: '',
					showBirthday:false,
					editForm:{
						show:false,
						data:null,
						slideBottom:false
					},
					detailForm:{
						show:false,
						data:{}
					},
					bag:{
						show:false,
						data:{}
					},
					dialog:{
						name:'',
						show:false,
						 needConfirm:false,
						 sl:0
					},
					paramsDialog:{show:false},
					currentRow:'',//记录当前操作的行
					hasSelectAll:false,//是否选择全部
					noSelectedMaps:[],//不选择行的id集合
					sex0:require('../../assets/sex0.png'),
					sex1:require('../../assets/sex1.png'),
				}
			},
			methods: {
				clearRow(){
					this.$refs.multipleTable.clearSelection();
				},
				closeDialog(){
					this.showFilter=false;
					this.editForm.show=false;
					this.bag.show=false;
					this.detailForm.show = false;
				},
				getTableSort() {
					this.showFilter = false
					this.sortStr = ''
					this.filterDataList.forEach((item) => {
						if(item.orderType != -1) {
							let str = item.label + (item.orderType == 0 ? ' desc' : ' asc')
							this.sortStr += this.sortStr == '' ? str : (',' + str)
						}
					})
				},
				resetFilters() {
					this.filterDataList.forEach((item) => {
						item.orderType = -1
					})
					this.sortStr = ''
				},
				filterEnter() {
					if(this.timeout_id) {
						clearTimeout(this.timeout_id)
						this.timeout_id = ''
					}
				},
				filterLeave() {
					if(this.timeout_id) {
						clearTimeout(this.timeout_id)
						this.timeout_id = ''
					}
					this.timeout_id = setTimeout(() => {
						this.showFilter = false
					}, 600)
				},
				selectFilterTypes(item, isUp) {
					if(isUp) { //如果是升序
						item.orderType = item.orderType == 0 || item.orderType == -1 ? 1 : -1
					} else {
						item.orderType = item.orderType == 1 || item.orderType == -1 ? 0 : -1
					}
				},
				openHighSearch(){
					this.paramsDialog.show=true;
				},
				searchByParams(params){
					console.log(params)
					this.getList(params);
				},
				searchHy(){
					this.pagination.page=1;
					this.getList();
				},
				getList(params) {
					this.getTableSort()
					this.isshow = true;
					this.sendShow.isall = false;//??
					this.recordSender = [];
					let para = {
						pageSize: this.pagination.size,
						pageNo: this.pagination.page,
						isbirthday:this.showBirthday?1:0,
						value:this.searchkey,
						sortStr:this.sortStr
					}
					if(params)
						para=Object.assign({},para,params);
					this.$http('/api/x6/xfzxxReport.do', para).then((res) => {
						this.pagination.rows = res.totalRows;
						this.List = res.rows;
					});
				},
				handleCurrentChange(page) {
					this.pagination.page=page;
					this.getList();
				},
				formatTags(tags){
					return JSON.parse(tags.value);
                },
                formatJe(row){
                    return this.$util.formatCash(row.xfje);
                },
                formatMac(row){
                    return row.mac?'已获取':'未获取';
				},
				formatMacStyle(row){
					return row.mac?'color:#67C23A':'color:#F56C6C';
				},
				showEdit(row,index) {
					this.bag.show=false;
					this.detailForm.show = false;
					this.currentRow=index;
					this.$http('/api/x6/getHyHyxxDetail.do',{
						id:row.id
					}).then((res) => {
						res.hyxx.tags=res.hyxx.tags?JSON.parse(res.hyxx.tags):[];
						this.editForm.data=res.hyxx;
						this.editForm.slideBottom=false;
						this.editForm.show=true;
					});
				},
				//打开用户画像
				openTags(row,index){
					this.bag.show=false;
					this.detailForm.show = false;
					this.currentRow=index;
					this.$http('/api/x6/getHyHyxxDetail.do',{
						id:row.id
					}).then((res) => {
						res.hyxx.tags=res.hyxx.tags?JSON.parse(res.hyxx.tags):[];
						this.editForm.data=res.hyxx;
						this.editForm.slideBottom=true;
						this.editForm.show=true;
					});
				},
				editSuccess(row){
					this.getList();
				},
				showDetail(row) {
					this.bag.show=false;
					this.editForm.show=false;
					let url='/api/x6/xfzxxMxReport.do';
					this.$http(url, {
						hyid: row.id
					}).then((res) => {
						this.$set(this.detailForm.data,'head',row);
						this.$set(this.detailForm.data,'list',res.List);
						this.detailForm.show = true;
					});
				},
				showBag(row) {
					this.detailForm.show = false;
					this.editForm.show=false;
					let url='/api/x6/getHyGiftList.do';
					this.$http(url, {
						hyid: row.id
					}).then((res) => {
						for(let obj of res.List)
							obj.zt=obj.syje<obj.je?'未使用':'已使用';
						this.$set(this.bag.data,'id',row.id);
						this.$set(this.bag.data,'name',row.name.substring(row.name.length-2));
						this.$set(this.bag.data,'phone',row.phone);
						this.$set(this.bag.data,'wx',row.wx);
						this.$set(this.bag.data,'csny',row.csny);
						this.$set(this.bag.data,'address',row.province+row.city+row.town+row.dz);
						this.$set(this.bag.data,'list',row.List);
						this.bag.data.list=res.List;
						this.bag.show=true;
					});
				},
				//判断今天是生日
				isbirthToday(row) {
					var today = new Date();
					var year = today.getFullYear();
					var dvalue = '';
					let time = row.csny;
					let arr = time.split('-');
					if(arr[0]) {
						arr[0] = year;
						time = arr[0] + '-' + arr[1] + '-' + arr[2];
						dvalue = parseInt((today.getTime() - new Date(Date.parse(time.replace(/-/g, '/'))).getTime()) / (1000 * 60 * 60 * 24));
						row.dvalue = dvalue + 365
					} else {
						row.dvalue = -1
					}
				},
				selectdg(row) {
					console.log(row)
					this.recordSender=row;
				},
				//短信购买
				purchase() {
					// this.dialog.show=true;
					// this.dialog.name='paySms';
					window.open("http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDA3MzcyM18xNzU0OTRfODAwMDczNzIzXzJf");
				},
				//群发短信
				sendMessage() {
					if(this.recordSender.length==0){
						this.$message('请先选择客户','warning');
						return;
					}
					this.dialog.name='sendSms';
					this.dialog.show=true;
					this.dialog.datas=this.recordSender;
					this.dialog.sl=this.pagination.rows;
				},
				addSuccess(){
					this.xfzxxReport();
				},
				renderMac(h, {column, $index, store, _self}){
					return h('div',{
						style: {
							position: 'relative',
							overflow: 'visible',
							textAlign:'center',
							lineHeight:0
						}
					},[h('span',column.label),h('i',{
						style: {
							cursor: 'pointer',
							color: '#888',
							fontSize: '14px',
							marginLeft:'5px',
							position: 'absolute',
							right: '-8px',
							top: '50%',
							transform: 'translateY(-50%)'
						},
						class:{
							'iconfont': true,
							'icon-bangzhu3':true
						},
						attrs:{
							title:'获取客户硬件信息后，当客户在门店盒子的辐射将获取到门店活动信息'
						}
					})])
				},
			},
			components: {
				addMember,
				importMenber,
				paySms,
				redbag,
				sendSms,
				editMember,
				detailMember,
				highSearch
			},
			activated() {
                this.getList();
			}
	}
</script>
<style lang="less" scoped>
	@import '../../assets/common.less';
	.rootContainer{
        height: 100%;
		.top-container{
            width:100%;
            height:70px;
            background:#fff;
            margin-bottom:10px;
            .topdiv-left{
                float:left;
                margin-top:18px;
                margin-left:20px;
            }
            .topdiv-right{
                float:right;
                text-align:center;
                margin-right:20px;
                color:red;
                margin-top:14px;
                cursor:pointer;
                p{
                    margin-top:8px;
                }
            }
	    }
        .highlight{color:red !important;}
        .highlight2{color:green !important;}
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
	.cnt-top {
		/*padding:10px 10px;*/
		height: 50px;
		background: #fff;
		position: relative;
	}
	
	.top-left {
		display: flex;
		position: absolute;
		top: 0;
		left: 20px;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
	
	.top-right {
		display: flex;
		position: absolute;
		top: 0;
		right: 20px;
		justify-content: center;
		align-items: center;
		height: 100%;
		cursor: pointer;
	}
	.c-main{
        height: ~'calc(100% - 182px)';
		position: relative;
		overflow-x: hidden;
    }
    .pagination{
        padding: 10px 0;
		background: #fff;
		text-align: center;
    }
	.top-filter {
		width: 80px;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		&:hover {
			cursor: pointer;
		}
		.text {
			margin-left: 2px;
			vertical-align: middle;
		}
		@bgColor: #fff;
		@shadowColor: #969696;
		.filter-items-wrapper:after {
			position: relative;
			display: inline-block;
			top: -222px;
			left: 19px;
			width: 0;
			height: 0px;
			content: '';
			border-style: solid;
			border-width: 7px;
			border-color: @bgColor @bgColor transparent transparent;
			transform: rotate(315deg);
			box-shadow: 2px -2px 2px #ccc;
		}
		.filter-items-wrapper {
			-moz-box-shadow: 0px 0px 5px @shadowColor;
			-webkit-box-shadow: 0px 0px 5px @shadowColor;
			box-shadow: 0px 0px 5px @shadowColor;
			position: absolute;
			top: calc(~'100% + 12px');
			left: 0;
			width: 465px;
			height: 220px;
			background: @bgColor;
			z-index: 9;
			border-radius: 5px;
			box-sizing: border-box;
			padding: 10px;
			display: block;
			text-align: left;
			.sure-wrapper {
				margin-top: 18px;
				text-align: right;
				box-sizing: border-box;
				padding-right: 20px;
			}
			.top-title {
				font-size: 17px;
				font-weight: bold;
				display: flex;
				padding-bottom: 10px;
				box-sizing: border-box;
			}
			.item-wrapper {
				margin-top: 10px;
				width: 50%;
				display: inline-flex;
				height: 30px;
				align-items: center;
				font-size: 14px;
				.item-name {
					display: inline-block;
					width: 80px;
					box-sizing: border-box;
					padding-left: 10px;
					text-align: left;
					&.selectName {
						color: @element-blue;
						font-weight: bold;
					}
				}
				.item-radio {
					font-size: 13px;
					margin-left: 8px;
					display: inline-block;
					border-radius: 3px;
					padding: 3px 6px;
					border: 1px solid @border-deep-color;
					&.isSelected {
						border: 1px solid @element-blue;
						color: @element-blue;
					}
				}
			}
		}
	}
	.slideRigh-enter-active{
		animation:slideRight .3s;
	}
	.slideRigh-leave-active{
		animation:slideRightclose .3s;
	}
	@-webkit-keyframes slideRight{
		from{right: -100%;}
		to{right:0;}
	}
	@keyframes slideRight{
		from{right: -100%;}
		to{right:0;}
	}
	@-webkit-keyframes slideRightclose{
		from{right: 0;}
		to{right: -100%;}
	}
	@keyframes slideRightclose{
		from{right: 0;}
		to{right: -100%;}
	}
</style>