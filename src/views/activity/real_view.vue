<template>
	<div class="content">
		<preview
			v-if="data"
			:data="data"
			width="320px"
			height="570px"
			:need-close="true"
			@close="close"
		></preview>
	</div>
</template>
<script>
	import preview from './preview'
	import {Loading} from '../../func/loading'
	export default{
		props:['views'],
		data(){
			return{
				data:null
			}
		},
		methods:{
			getDetails(){
				Loading.open({
					target:this.$refs.body
				});
				this.$http('/api/x6/CrmActivityGetDetail.do',{
					id:this.views.data
				}).then(res=>{
					Loading.close();
					this.data=res.VO;
				},err=>{
					Loading.close();
				});
			},
			close(){
				this.views.name='';
			}
		},
		mounted(){
			this.getDetails();	
		},
		components:{
			preview
		}
	}
</script>
<style lang='less' scoped>
	.content{
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.7);
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		top:0;
		left: 0;
		z-index: 99;
		background-attachment:fixed;
		-webkit-overflow-scroll:touch;
		-webkit-overflow-scrolling:touch;
		overflow: hidden;
		.p-body{
			width:400px;
			height: 600px;
			position: relative;
			.close{
				position: absolute;
				right: -9px;
				top:-9px;
				width: 20px;
				height: 20px;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #ccc;
				color: red;
				cursor: pointer; 
				font-size: 12px;
				i{transform: scale(.7);}
			}
		}
	}
</style>