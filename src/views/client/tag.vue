<template>
	<div>
		<pop-up  ref="pop" title='用户标签管理'  width="500" :views="managetagShow" :confirm="confirm">
			<div class="add-container" slot="content">
				<div style="width: 100%;">
					<div class="add-tag" @click.stop="addoreditTag()">
						<img src="../../assets/tag.png" />
						<span>新标签</span>
					</div>
					<div>
						<el-table :data="tagList" border height="260">
							<el-table-column  label="选择" align="center" width='100'>
	        					<template slot-scope="scope">
	        						<el-checkbox v-model="scope.row.ischoose" @change="chooseTag(scope.row,scope.$index)"></el-checkbox>
	        					</template>
	        				</el-table-column>
							<el-table-column label="标签" header-align="center" align="left" min-width='100' prop='name' >
								<template slot-scope="scope">
									<div class="tagcircle" :style="{'background-color':scope.row.color}"></div>
									<span>{{scope.row.name}}</span>
								</template>
	        				</el-table-column>
	        				        				
	        				<el-table-column width="100" label="删除" align="center">
								<template slot-scope="scope">
									<i class="el-icon-delete" style="color:#479bfd;cursor: pointer;" @click.stop="deleteTag(scope.row,scope.$index)"></i>
								</template>
							</el-table-column>
							<el-table-column width="100" label="编辑" align="center">
								<template slot-scope="scope">
									<i class="el-icon-edit" @click.stop="addoreditTag(scope.row,scope.$index)" style="color:#479bfd;cursor: pointer;"></i>
								</template>
							</el-table-column>
						</el-table>               
					</div>
				</div>
			</div>
            <!-- <el-button type="info" size="small" :loading="Loading" @click="confirm">保存</el-button> -->
		</pop-up>
		<add-tag v-if="savetagShow.show" :savetagShow="savetagShow" :colors="colors" :tagList="tagList" :savetagList="savetagList"></add-tag>
	</div>
</template>	
<script>
	import popUp from '../../components/popUp/index';
    import addTag from './addTag'
	export default {
		props:{			
			managetagShow:{
				required:true
			},
			savetagList:{
				type:Array
			},
			nowtagList:{
				type:Array
			}
		},		
		data(){
			return{
				Loading:false,
				colors:[],//所有颜色列表
				color:'',
				tagList:[],//所有标签列表,
				savetagShow:{
					show:false,
					isedit:false,
					index:-1
				}
			}
		},
		components: {
			popUp,
			addTag
		},
		methods:{
			close(){
				this.managetagShow.show=false;	
			},
			addoreditTag(row,index){
				for(var i=0;i<this.colors.length;i++){
					this.colors[i].issel=false;
				}
				//console.log(row,index)
				if(row){
					let flag=false;
					for(var i=0;i<this.colors.length;i++){
						if(row.color==this.colors[i].color){
							flag=true;
							this.colors[i].issel=true;
							break;
						}
					}
					if(flag==false){
						for(var i=0;i<this.colors.length;i++){
							this.colors[i].issel=false;
						}
					}
					this.savetagShow.isedit=true;
					this.savetagShow.index=index;					
				}else{
					for(var i=0;i<this.colors.length;i++){
						this.colors[i].issel=false;
					}
					this.savetagShow.isedit=false;
					this.savetagShow.index=-1;					
				}
				this.savetagShow.show=true;
			},

			deleteTag(row,index){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http('api/x6/deleteHyxxTags.do', {
						id:row.id
					}).then(response => {
						for(var i=0;i<this.savetagList.length;i++){
							if(this.savetagList[i].name==row.name){
								this.savetagList.splice(i,1);
								break;
							}
						}
						this.tagList.splice(index,1);
						this.$message('标签删除成功');
					});
				});
			},
			chooseTag(row,index){
				if(row.ischoose==true){
					let flag=false;
					for(var i=0;i<this.savetagList.length;i++){
						if(this.savetagList[i].id==row.id){
							flag==true;
							break;
						}
					}
					if(flag==false){
						let para={
							id:row.id,
							color:row.color,
							name:row.name
						}
						this.savetagList.push(para)
					}
				}else{
					for(var i=0;i<this.savetagList.length;i++){
						if(this.savetagList[i].id==row.id){
							this.savetagList.splice(i,1);
							break;
						}
					}
				}
			},
			confirm(){
				this.$emit('changeTags');
				this.close();
			},
			//获取标签
			getHyxxTagsList(){
				this.$http('api/x6/getHyxxTagsList.do', {})
				.then(response=>{
					let tagList=response.tagsList;
					for(var i=0;i<tagList.length;i++){
						let para={};
						para=Object.assign({},tagList[i]);
						let flag=false;
						for(var j=0;j<this.savetagList.length;j++){							
							if(this.savetagList[j].name==para.name){
								flag=true;
								break;
							}
						}
						if(flag==true){
							para.ischoose=true;
						}else{
							para.ischoose=false;
						}						
						this.tagList.push(para)
					}
				})
			},
		},
		mounted(){			
			this.$http('api/x6/getTagColors.do',{}).then(response=>{
                let colors=JSON.parse(response.colors);
				for(var i=0;i<colors.length;i++){
					let para={
						issel:false,
						color:colors[i]
					}
					this.colors.push(para)
				}
			})
			this.getHyxxTagsList()
		}
	}
</script>
<style lang="less" scoped>
   .add-container{
		.footer{
			border-top:1px solid #dfdfdf ;
			text-align: right;
			border-radius:0 0 4px 4px;
			padding:10px 10px 10px 0;
		}
		.add-tag{
			cursor:pointer;
			height:26px;
			line-height:26px;
			color:#20a0ff;
            font-size:14px;
            margin-bottom: 10px;
			>img{
				width:24px;
				display:inline-block;
				vertical-align:middle;
			}
		}
		.tagcircle{
			width:10px;
			height:10px;
			border-radius:50%;
			display:inline-block;
		}
	}
</style>