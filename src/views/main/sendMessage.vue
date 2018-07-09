<template>
	<pop-up
		title="发送短信息"
		width="500"
		:views="views"
		:confirm="save"
		:loading="load"
	>
		<div slot="content">
			<div class="send-item">
				<span>短信内容:</span>
				<el-input type="textarea" v-model="sendForm.message"></el-input>
			</div>
			<div class="send-item send-item-mid">
				<span>短信签名:</span>
				<div v-if="!inputshow">
					<em>{{sendForm.smssign}}</em>
					<i class="el-icon-edit" @click="inputshow=true"></i>
				</div>
				<el-input size="small" v-model="sendForm.smssign" v-if="inputshow" @blur="inputshow=false"></el-input>
			</div>
		</div>
	</pop-up>
</template>
<script>
	import popUp from '../../components/popUp/index'
	export default {
		props:['views'],
		data(){
			return{
				load:false,
				sendForm:{
					message:'',
					smssign:''
				},
				inputshow:false
			}
		},
		methods:{
			save(){
				this.sendForm.message=this.sendForm.message.trim();
				this.sendForm.smssign=this.sendForm.smssign.trim();
				if(!this.sendForm.message){
					this.$message('请编辑短信内容','warning');
				}else if(!this.sendForm.smssign){
					this.$message('请填写短信签名','warning');
				}else{
					this.load=true;
					var params={
						content:this.sendForm.smssign+'--'+this.sendForm.message,
						ids:[]
					}
					for(let obj of this.views.datas)
						params.ids.push(obj.id);
					params.ids=params.ids.join(',');
					this.$http('api/x6/sentHyMsg.do',params).then(res=>{
						this.load=false;
						this.$message(`成功发送${res.scount}条信息，未发送成功${res.fcount}条信息`);
						this.views.show=false;
						this.$emit('send-success');
					},err=>{
						this.load=false;
					});
				}
			}
		},
		mounted(){
			this.sendForm.smssign='苏州麦尔芽';
		},
		components: {
			popUp,
		}
	}
</script>
<style lang="less" scoped>
	.send-item{
		display: flex;
		align-items: flex-start;
		font-size: 14px;
		>span{
			flex-shrink: 0;
			margin-right: 10px;
			&:before{
				content: '*';
				color: red;
				font-size: 12px;
			}
		}
		em{margin-right: 10px;}
		i{cursor: pointer;}
	}
	.send-item-mid{
		align-items: center;
		margin-top: 20px;
	}
</style>