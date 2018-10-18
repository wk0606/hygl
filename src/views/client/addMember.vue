<template>
	<div>
		<pop-up
			title='新增会员信息'
			width="460"
			:views="views"
			:confirm="addSubmit"
			:loading="addLoading"
		>
			<div slot="content">
				<div style="width: 100%;height: auto;overflow-y:auto;">
					<el-form :model='userform' label-width='100px' ref='userform' :inline='true' :rules="userformRules">
						<el-form-item label='姓名' prop='name'>
							<el-input v-model='userform.name' auto-complete='off' placeholder='请输入姓名' size='small' style='width: 295px;' clearable></el-input>
						</el-form-item>
						<el-form-item label="微信号" prop="wx">
							<el-input v-model="userform.wx" placeholder="请输入微信号" size="small" style="width: 295px" clearable></el-input>
						</el-form-item>
						<el-form-item label='手机号' prop='phone'>
							<el-input v-model="userform.phone" placeholder="请输入手机号" size="small" style="width: 295px" clearable></el-input>
						</el-form-item>
						<!-- <el-form-item label='初始积分' prop='initjf'>
							<el-input v-model.number="userform.initjf" placeholder="请输入初始积分" size="small" style="width: 295px"></el-input>
						</el-form-item> -->
						<el-form-item label="性别" prop="sex">
							<el-radio-group v-model="userform.sex" size="small" style="width:295px;text-align:left;">
								<el-radio class="radio" :label="0">男</el-radio>
								<el-radio class="radio" :label="1">女</el-radio>
							</el-radio-group>
						</el-form-item>

						<el-form-item label="生日">
							<el-date-picker
								type="date"
								:editable="false"
								placeholder="选择日期"
								v-model="userform.csny"
								size="small"
								style="width:295px"
								value-format="yyyy-MM-dd"
							></el-date-picker>
						</el-form-item>

						<el-form-item label='地址'>
							<div style="width: 300px;height: 30px; display:flex; justify-content: space-between;">
								<el-form-item prop='province'>
									<el-select v-model='userform.province' placeholder='省' size='small' style='width: 91px;' @change="clearCity()">
										<el-option v-for="(k,v) in provincelist" :key="v" :value="v" size="small" style="width: 91px">{{v}}</el-option>
									</el-select>
								</el-form-item>
								<el-form-item prop='city'>
									<el-select v-model='userform.city' placeholder='市' size='small' style='width: 91px;' @change="getTown(userform.province,userform.city)">
										<el-option v-for="item in provincelist[userform.province]" :key="item" :value="item" size="small" style="width: 91px"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item prop='town'>
									<el-select v-model='userform.town' placeholder='县/区' size='small' style='width: 91px;' @change="cleardz">
										<el-option v-for="item in town_list" :key="item.town" :value="item.town" size="small" style="width: 91px"></el-option>
									</el-select>
								</el-form-item>
							</div>
						</el-form-item>
						<el-form-item prop='dz' size='small' style='margin-left:100px'>
							<el-input v-model='userform.dz' auto-complete='off' placeholder='详细地址' size='small' style='width: 295px;height: 30px;'></el-input>
						</el-form-item>
						<el-form-item label="添加画像" prop="" style="height:auto">
							<div style="width:293px">
								<div>
									<img src="../../assets/addtag.png" style="cursor:pointer;width:26px;vertical-align:middle"  @click.stop="manageTag" />
								</div>
								<div v-for="(tag,index) in  userform.tags" :key="tag.id" style="cursor:pointer;display:inline-block;margin-right:20px">
									<div style="display:inline-block;" class="dgbq tagbg" :style="{'border-color':tag.color}">
										<div class="tagcircle" :style="{'background-color':tag.color}"></div>
										<span>{{tag.name}}</span>
										<i class="el-icon-close" :style="{'color':tag.color}" @click.stop="delformTag(tag,index)"></i>
									</div>
								</div>
							</div>
						</el-form-item>
					</el-form>
				</div>			
			</div>
		</pop-up>
		<tag v-if='managetagShow.show' :managetagShow='managetagShow' :savetagList='savetagList' @changeTags='changeTags'></tag>
	</div>
</template>
<script>
	import popUp from '../../components/popUp/index'
	import tag from './tag'
	export default {
		props:['views'],
		data(){
			return{
				managetagShow:{
					show:false,
				},				
				addLoading:false,
				defaultProps: {
		          	children: 'children',
		          	label: 'label'
		       	},
		       	provincelist: {},
				town_list: [],
		       	userformRules:{
		       		name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					phone:[
						{required: true, message: '请输入手机号', trigger: 'blur' },
						{type: "string", pattern: /^1\d{10}$/,message: '请输入正确的手机号格式', trigger: 'blur'}
					]
		       	},
				userform:{
					id:-1,
					ssgsid:this.$util.getUserInfo().ssgsid,
					phone:'',
					name:'',
					userpic:'',
					sex:0,
					csny:'',
					cardno:'',
					sfzh:'',
					work:'',
					xl:'',
					country:'',
					province:'',
					city:'',
					town:'',
					dz:'',
					email:'',
					jf:0,
					initjf:0,
					pwd:'',
					lx:1,
					wx:'',
					smstime:'',
					tags:[]
				},
				savetagList:[],
				nowtagList:[],
			}
		},
		methods:{
			manageTag(){
				this.managetagShow.show=true;
				this.savetagList = [];
				this.savetagList = this.$util.deepCopy(this.userform.tags);
			},
			delformTag(tag, index){
				this.userform.tags.splice(index, 1);
			},
			changeTags(){
				this.userform.tags=this.savetagList;
			},
			close(){
				this.views.show = false;
				this.views.name='';
			},
			handleNodeClick(data){
				this.userform.ssgsid=data.value;
			},
			//获取县区
			getTown(p, c) {
				this.userform.town = '';
				this.userform.dz = '';
				this.$http("/api/x6/getTownList.do", {
					province: p,
					city: c
				}).then((res) => {
					this.town_list = res.list;
				})
			},
			//改变省--清空市及县区
			clearCity(index) {
				this.userform.city = '';
				this.userform.town = '';
				this.userform.dz = '';
				this.town_list = [];
				this.dz = '';
			},
			//改变市/区--清除地址
			cleardz() {
				this.userform.dz = '';
				this.dz = '';
			},
			addSubmit(){
				this.$refs.userform.validate((valid) => {
					if (valid) {
						this.addLoading = true;
						let para = Object.assign({}, this.userform);
						para.jf=para.initjf;
						this.$http('api/x6/saveHyHyxx.do', para)
						.then(response=> {
							this.addLoading = false;
							this.$message('会员添加成功');
							this.$emit('callback');
							this.close();
						},err=>{
							this.addLoading = false;
						});
					}
				})
			}

		},
		components: {
			popUp,
			tag
		},
		mounted(){
			this.provincelist = this.$util.getProvinceAndCity();
		}
	}
</script>
<style lang="less" scoped>
	.tagcircle {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		display: inline-block;
	}
	
	.dgbq {
		/*position:relative;*/
		padding: 0 10px;
		line-height: 24px;
		margin-bottom: 5px;
		> span {}
		> i {
			font-size: 12px;
			margin-left: 10px;
			/*position:absolute;*/
			/*right:-19px;
            top:6px;*/
		}
	}
	
	.tagbg {
		border: 1px solid;
		border-radius: 5px;
	}
</style>

