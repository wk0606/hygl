<template>
	<pop-up
        :title='title'
        width="290"
        :confirm="save"
        :loading="load"
        :views="savetagShow"
    > 
		<div class="add-container" slot="content">
			<div style="width: 100%;">
				<div>
					<el-input v-model="tagname" auto-complete="off" placeholder="标签名称" clearable></el-input>												
				</div>
				<div>
					<div class="circlecolor" v-for="(color,index) in colors" :key="index" :style="{'background-color':color.color}" @click.stop="chooseColor(color,index)">
						<i class="el-icon-check" v-if="color.issel"></i>
					</div>
				</div>
			</div>
		</div>
	</pop-up>
</template>
<script>
	import popUp from '../../components/popUp/index'
	export default {
		props:{
			savetagShow: {
				required: true
			},
			colors:{
				type:Array
			},
			tagList:{
				type:Array
			},
			savetagList:{
				type:Array
			}
		},
		data(){
			return{
				load:false,
				tagname:'',
				tagcolor:'',
				title:'新建标签'
			}
		},
		components:{
			popUp
		},
		methods:{
			close(){
				this.savetagShow.show=false;
			},
			chooseColor(color,index){
				color.issel=true;
				this.tagcolor=color.color;
				for(var i=0;i<this.colors.length;i++){
					if(i!=index){
						this.colors[i].issel=false;
					}
				}
			},
			save(){
				if(this.tagname==''){
					this.$message('标签不能为空','warning');
					return;
                }
                this.load=true;
				let id=this.savetagShow.isedit==true?this.tagList[this.savetagShow.index].id:-1
				let para={
					id:id,
					name:this.tagname,
					color:this.tagcolor?this.tagcolor:'#B0B0B0'
				}
				this.$http('api/x6/saveHyxxTags.do',para)
				.then(response=> {
                    this.load=false;
					if(this.savetagShow.isedit==true){
                        this.tagList[this.savetagShow.index].color=para.color;
                        this.tagList[this.savetagShow.index].name=para.name;
                        for(var i=0;i<this.savetagList.length;i++){
                            if(this.savetagList[i].id==para.id){
                                this.savetagList[i].color=para.color;
                                this.savetagList[i].name=para.name
                                break;
                            }
                        }
                    }else{
                        let tags=response.hyTags;
                        tags.ischoose=true;
                        this.tagList.push(tags);
                        let result=false;
                        for(var i=0;i<this.savetagList.length;i++){
                            if(this.savetagList[i].id==tags.id){
                                this.savetagList[i].color=para.color;	
                                this.savetagList[i].name=para.name;
                                result=true;
                                break;
                            }
                        }
                        if(result==false){
                            let tag={
                                id:tags.id,
                                color:para.color,
                                name:this.tagname
                            }
                            this.savetagList.push(tag);
                        }							
					}
					this.tagname='';
                    this.$message('标签添加成功');
                },err=>{
                    this.load=false;
                });
			}
		},
		mounted(){
			//console.log(this.savetagShow.isedit)
			if(this.savetagShow.isedit==true){
				this.tagname=this.tagList[this.savetagShow.index].name;
				this.tagcolor=this.tagList[this.savetagShow.index].color;
				this.title="编辑标签"
			}
		}
	}
</script>
<style lang="less" scoped>
	.add-container{
		height: 90px;
		.footer{
			border-top:1px solid #dfdfdf ;
			text-align: right;
			border-radius:0 0 4px 4px;
			padding:10px 10px 10px 0;
		}
		.circlecolor{
			width:30px;
			height:30px;
			border-radius:50%;
			float:left;
			margin-right:15px;
			margin-top:20px;
			cursor:pointer;
			text-align:center;
			line-height:30px;
			>i{
				color:#fff;
				font-size:14px;
			}
		}
	}
</style>