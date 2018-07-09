<template>
	<div class="add-container">
		<div class="add-title">
			<span>{{$route.params.id!=-1?'编辑活动':'新增活动'}}</span>
			<i class="el-icon-close" @click="backToActivity"></i>
		</div>
		<div class="add-body">
			<div class="f-add">
				<el-form :model='addForm' label-width='80px' :rules='addFormRules' ref='addForm'>
					<el-form-item label='活动名称' prop="title">
						<el-input
							v-model="addForm.title"
							type="text"
							placeholder="请输入标题"
							size="small"
							style="width:100%"
							auto-complete='off'
						></el-input>                                                                  
					</el-form-item>
					<el-form-item label='活动图片' prop="shortcontent">
						<div class="act-img" @click="openActImg" :style="{backgroundImage:'url('+addForm.shortcontent+')'}">
							<i v-if="!addForm.shortcontent" class="el-icon-plus"></i>
						</div>
					</el-form-item>
					<el-form-item label='活动时间' required>
						<el-col :span="11">
							<el-form-item prop="yxrqq">
								<el-date-picker
									size="small"
									type="datetime"
									placeholder="请选择开始时间"
									v-model="addForm.yxrqq"
									style="width: 100%;"
									value-format="yyyy-MM-dd HH:mm:ss"
								></el-date-picker>
							</el-form-item>
						</el-col>
						<el-col class="line" :span="2"><div style="text-align:center;">-</div></el-col>
						<el-col :span="11">
							<el-form-item prop="yxrqz">
								<el-date-picker
									size="small"
									type="datetime"
									placeholder="请选择结束时间"
									v-model="addForm.yxrqz"
									style="width: 100%;"
									value-format="yyyy-MM-dd HH:mm:ss"
								></el-date-picker>
							</el-form-item>
						</el-col>
					</el-form-item>
					<el-form-item label='活动详情' prop="content">
						<div class="content">
							<simditor
								uploadUrl="/api/x6/saveOtherPic.do"
								:toolbar="toolbar"
								v-model="addForm.content"
								ref="simditor"
							></simditor>
						</div>
					</el-form-item>
					<el-form-item label='' prop="hdfw">
						<div class="form-items" style="margin-left:-80px;">
							<span class="ismust">活动范围</span>
							<div class="s-shop">
								<el-tag
									size="small"
									v-for="tag in tags"
									:key="tag.id"
									:closable="true"
									@close="tagClose(tag)"
								>{{tag.name}}</el-tag>
								<div class="add-tag" @click="selectMd"><i class="el-icon-plus"></i></div>
							</div> 
						</div>               
					</el-form-item>
					<div  class="form-items" style="align-items:center;">
						<span>
							该活动是否参与分享返现
							<i class="iconfont icon-bangzhu1" style="color:#ccc;" title="1.活动期间每名用户(同一手机号)只能领取一次.2.该红包最终解释权归商家所有"></i>
						</span>
						<el-switch
							v-model="addForm.isfxfk"
							active-text=""
							inactive-text="">
						</el-switch>
						<span style="margin-left:15px;" v-if="addForm.isfxfk">返现金额</span>
						<!-- <input-money :fromMoney="addForm.fxjl" v-model="addForm.fxjl" style="width:150px;" :needUnFocusCenter="false" :disabled="!addForm.isfxfk"></input-money> -->
						<input v-if="addForm.isfxfk" type="number" class="money" v-model="addForm.fxjl"/>
						
					</div>
					<div class="form-items" style="box-sizing:border-box;padding:10px;justify-content: flex-end;">
						<el-button type="primary" size="small" @click="save('addForm')" :loading="load">确定</el-button>
						<el-button size="small" @click="backToActivity">取消</el-button>
					</div>
				</el-form>

			</div>
			<div class="f-view" ref="mobile">
				<preview :data="addForm"></preview>
			</div>
		</div>
		<select-md v-if="dialog.show" :views="dialog" @selection-change="changeSelect"/></select-md>
		<upload-img v-if="upload.show" :views="upload" @change="setActImg"></upload-img>
	</div>
</template>
<script>
	import simditor from '@/components/simditor'
	import selectMd from './select_md'
	import preview from './preview'
	import uploadImg from './uploadImg'
	export default{
		name:'hy_activity_add',
		props:['views'],
		data(){
			var validate = (rule, value, callback) => {
				if (!value.length) {
					callback(new Error('请选择活动范围'));
				} else {
					callback();
				}
			};
			return{
				Loading:false,
				title:'',
				message:{},
				toolbar:['title', 'bold', 'italic', 'underline',  'fontScale', 'color', 'link', 'image', 'hr', 'indent', 'outdent', 'alignment'],
				addForm:{
					title:'',
					picurl:'',
					shortcontent:'',
					yxrqq:'',
					yxrqz:'',
					hdfw:[],
					content:'',
					isfxfk:false,
					fxjl:0
				},
				addFormRules:{
					title:[{required:true,message:'请输入活动名称'}],
					shortcontent:[{required:true,message:'请选择活动图片'}],
					yxrqq:[{required:true,message:'请选择开始时间'}],
					yxrqz:[{required:true,message:'请选择结束时间'}],
					content:[{required:true,message:'请输入活动详情'}],
					hdfw:[{validator:validate}]
				},
				tags:[],
				dialog:{show:false,data:null},
				gslists:null,
				load:false,
				copyForm:null,
				upload:{
					show:false
				}
			}
		},
		watch:{
			'addForm.content':function(nv){
				this.addForm.content=nv;
			}
		},	
		methods:{
			//获取活动详情
			getActDetails(id){
				this.$http('/api/x6/CrmActivityGetDetail.do',{
					id:id
				}).then(res=>{
					res.VO.isfxfk=res.VO.isfxfk?true:false;
					for(let key in res.VO)
						this.addForm[key]=res.VO[key];
					this.copyForm=JSON.parse(JSON.stringify(this.addForm));
					this.parseNameById(this.addForm.hdfw);
					this.$refs.simditor.setEditContent(res.VO.content);
				},err=>{

				});
			},
			save(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.load=true;
						var params={
							id:this.$route.params.id?this.$route.params.id:-1,
							title:this.addForm.title,
							shortcontent:this.addForm.shortcontent,
							yxrqq:this.addForm.yxrqq,
							yxrqz:this.addForm.yxrqz,
							hdfw:this.addForm.hdfw,
							content:this.addForm.content,
							isfxfk:this.addForm.isfxfk?1:0,
							fxjl:this.addForm.isfxfk?parseFloat(this.addForm.fxjl):0
						}
						this.$http('/api/x6/CrmActivitySave.do',params).then(res=>{
							this.load=false;
							var msg=this.$route.params.id!=-1?'活动编辑成功':'活动新增成功';
							this.$message(msg);
							this.$router.push('/main/activity');
						},err=>{
							this.load=false;
						});
					} else {
						this.$message('请完善活动信息','error');
						return false;
					}
				});
			},
			//上传活动图片
			openActImg(){
				this.upload.show=true;
				this.upload.data=this.addForm.shortcontent;
			},
			setActImg(path){
				this.addForm.shortcontent=path;
			},
			//打开选择门店
			selectMd(){
				this.dialog.show=true;
				this.dialog.data=JSON.parse(JSON.stringify(this.addForm.hdfw));
			},
			//选择完毕
			changeSelect(ids){
				this.addForm.hdfw=ids;
				this.parseNameById(ids);
			},
			//根据ids匹配出门店信息(ids--id的拼接字符串)
			parseNameById(ids){
				//var _temp=ids.split(',');
				this.tags=[];
				for(let id of ids){
					for(let obj of this.gslists){
						if(obj.id==id){
							this.tags.push({
								name:obj.name,
								id:obj.id
							});
							break;
						}
					}
				}
			},
			//关闭标签
			tagClose(tag){
				var _temp=[];
				this.tags=this.tags.filter(item=>{
					if(item.id!=tag.id)
						_temp.push(item.id);
					return item.id!=tag.id;
				});
				this.addForm.hdfw=_temp;
			},
			//返回列表页
			backToActivity(){
				this.addForm.yxrqq=this.addForm.yxrqq||'';
				this.addForm.yxrqz=this.addForm.yxrqz||'';
				if(this.$util.compareEqualWidthObjects(this.addForm,this.copyForm)){
					this.$router.push('/main/activity');
				}else{
					this.$confirm('确定要放弃保存吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.$router.push('/main/activity');
					}).catch(() => {
						return;         
					});
				}
			},
			resetPage(){
				this.addForm={
					title:'',
					shortcontent:'',
					yxrqq:'',
					yxrqz:'',
					hdfw:[],
					content:'',
					isfxfk:false,
					fxjl:0
				};
				this.tags=[];
				this.$refs.simditor.setEditContent('');
			},
			getFormatTime(d){
				var _D=new Date(d);
				var m=(_D.getMonth()+1)<10?'0'+(_D.getMonth()+1):_D.getMonth()+1;
				var d=_D.getDate()<10?'0'+_D.getDate():_D.getDate();
				var h=_D.getHours()<10?'0'+_D.getHours():_D.getHours();
				var min=_D.getMinutes()<10?'0'+_D.getMinutes():_D.getMinutes();
				var s=_D.getSeconds()<10?'0'+_D.getSeconds():_D.getSeconds();
				return `${_D.getFullYear()}-${m}-${d} ${h}:${min}:${s}`;
			},
		},
		activated(){
			this.gslists=this.$util.getMyGsList();
			//移出表单验证
			this.$refs.addForm.resetFields();
			if(this.$route.params.id!=-1){
				this.getActDetails(this.$route.params.id);
			}else{
				this.resetPage();
				this.copyForm=JSON.parse(JSON.stringify(this.addForm));
			}
		},
		mounted(){
			this.$refs.mobile.style.width=parseInt(this.$refs.mobile.offsetHeight*9/16)+'px';
		},
		components:{
			simditor,
			selectMd,
			preview,
			uploadImg
		}
	}
</script>
<style  lang="less" scoped>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
	input[type="number"] {
		-moz-appearance: textfield;
	}
	.add-container{
		background: #fff;
		height: 100%;
		box-sizing: border-box;
		padding: 10px 20px;
		>div{box-sizing: border-box;}
		.act-img{
			width: 100px;
			height: 100px;
			border-radius: 5px;
			border: 1px solid #dcdfe6;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30px;
			color:#999;
			position: relative;
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center center;
			&:before{
				content: '上传活动图片';
				font-size: 12px;
				color: #fff;
				position: absolute;
				top:0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(0,0,0,.8);
				border-radius: 5px;
				display: flex;
				align-items: center;
				justify-content: center;
				visibility: hidden;
			}
			&:hover:before{
				visibility: visible;
			}
		}
		// .act-img{
		// 	margin-bottom: 20px;
		// 	display: flex;
		// 	align-items: center;
		// 	>span{
		// 		width: 80px;
		// 		font-size: 14px;
		// 		box-sizing: border-box;
		// 		padding-left: 12px;
		// 	}
		// 	div{
		// 		width: 100px;
		// 		height: 100px;
		// 		border-radius: 5px;
		// 		border: 1px solid #dcdfe6;
		// 		cursor: pointer;
		// 		display: flex;
		// 		align-items: center;
		// 		justify-content: center;
		// 		font-size: 30px;
		// 		color:#999;
		// 	}
		// }
		.add-title{
			box-sizing: border-box;
			padding: 10px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 2px solid #ccc;
			span{
				font-size: 14px;
			}
			i{
				cursor: pointer;
				color: #888;
				font-size: 15px;
				font-weight: bold;
			}
		}
		.add-body{
			height: ~"calc(100% - 38px)";
			display: flex;
			.f-add{
				flex-grow: 1;
				overflow-y: auto;
				box-sizing: border-box;
				padding:15px 15px 0 0;
				.el-form-item{margin-bottom: 20px;}
				.content{	    	
					border: 1px solid #bfcbd9;
					box-sizing: border-box;
					min-height:400px;
					/*border:1px solid #c9d8db; */
				}
				.form-items{
					display: flex;
					>span{
						flex-shrink: 0;
						padding-right: 12px;
						font-size: 14px;
					}
					.ismust{
						&:before{
							content:'*';
							color:red;
							margin-right: 5px;
						}
					}
					.s-shop{
						flex-grow: 1;
						display: inline-flex;
						align-items: center;
						flex-wrap:wrap;
						.el-tag{margin-right: 10px;margin-top: 5px;}
						.add-tag{
							width: 24px;
							height:24px;
							text-align: center;
							line-height: 24px;
							background: #20A0FF;
							color: #fff;
							border-radius: 50%;
							cursor: pointer;
							margin-top: 5px;
						}
					}
				}
				
				
			}
			.f-view{
				width: auto;
				margin-left: 15px;
				flex-shrink: 0;
				height: 100%;
				box-sizing: border-box;
				padding: 20px;
			}
		}
		.money{
			width:150px;
			line-height: 20px;
		}
	}
</style>