<template>
	<pop-up title='短信购买' width="700" :views="views" :loading="Loading" :confirm="save">
		<div class="add-container" slot="content">
			<div style="width: 100%;box-sizing: border-box;">
				<div>
					<el-input v-model="count" auto-complete="off" placeholder="请输入购买条数" size="small" style="width:150px"
						@keyup.enter.native="getTotalprice" @blur="getTotalprice"
						></el-input>
					<span style="font-size:14px">×</span>
					<span style="font-size:14px">{{price}}</span>
					<span>=</span>
					<el-input v-model="total" auto-complete="off" placeholder="金额" size="small" style="width:115px" readonly></el-input>					
				</div>
				<div>
					<p class="record">购买记录</p>
					<el-table height="200" :data="recordList"  style="width:100%;margin-top:10px" border>
						<el-table-column prop="zdrq" label="日期" header-align="center" align="center" width="140">   
							<template slot-scope="scope">					           
					            <span class="cell-span">{{scope.row.zdrq.split(' ')[0]}}</span>
					        </template>
	       				</el-table-column>  
	       				<el-table-column prop="sl" label="条数" header-align="center" align="right">   
							<template slot-scope="scope">					           
					            <span class="cell-span">{{scope.row.sl}}</span>
					        </template>
	       				</el-table-column>
	       				<el-table-column prop="je" label="金额" header-align="center" align="right">   
							<template slot-scope="scope">					           
					            <span class="cell-span">{{scope.row.je}}</span>
					        </template>
	       				</el-table-column>
	       				<el-table-column prop="usedsl" label="已使用条数" header-align="center" align="right">   
							<template slot-scope="scope">					           
					            <span class="cell-span">{{scope.row.usedsl}}</span>
					        </template>
	       				</el-table-column>
	       				<el-table-column label="剩余条数" header-align="center" align="right">   
							<template slot-scope="scope">					           
					            <span class="cell-span">{{scope.row.sl-scope.row.usedsl}}</span>
					        </template>
	       				</el-table-column>
	       				<el-table-column label="支付状态" header-align="center" align="right">   
							<template slot-scope="scope">					           
					            <span class="cell-span">{{formatzfzt(scope.row)}}</span>
					        </template>
	       				</el-table-column>
					</el-table>
				</div>
			</div>
			<!-- <div class="footer">
				<el-button type="info" size="small" :loading="Loading" @click.native="save">保存</el-button>
				<el-button type="info" size="small" :plain="true" @click='close'>关闭</el-button>
			</div> -->
		</div>
	</pop-up>
</template>
<script>
	import popUp from '../../components/popUp/index'
	export default {
		props:['views'],
		data(){
			return{
				Loading:false,
				count:'',
				price:0.06,
				total:'',
				recordList:[]
			}
		},
		components:{
			popUp
		},
		methods:{
			close(){
                this.views.show=false;
                this.views.name='';
			},
			formatzfzt(row){
				return row.zfzt==1?'已支付':'未支付'
			},
			getTotalprice(){
				if(this.count==''){
					this.total='';
				}else{
					this.total=(this.count*this.price).toFixed(2);
				}				
			},
			//保存
			save(){
				if(this.count==''){
					this.$message('请输入购买条数','warning');
				}else{
					this.Loading=true;
					let para={
						sl:this.count,
						dj:this.price
					}
					this.$http('api/x6/buySms.do', para)
					.then( response => {
                        this.Loading=false;
                        this.$message('购买成功');
                        this.close();
                    },err=>{
                        this.Loading=false;
                        this.close();
                    });
				}				
			}
		},
		mounted(){
			this.$http('/api/x6/getSmsPrice.do',{})
            .then((res) => {
            	this.price=res.dj;
            })
            this.$http('/api/x6/getBuySmsList.do',{})
            .then((res) => {
            	this.recordList=res.List;
            })
		}
	}
</script>
<style lang="less" scoped>
	.add-container{
		.record{
			margin-top:20px;
			color:#479bfd;;
			font-size:14px;
		}
		.footer{
			border-top:1px solid #dfdfdf ;
			text-align: right;
			border-radius:0 0 4px 4px;
			padding:10px 10px 10px 0;
		}
	}
</style>