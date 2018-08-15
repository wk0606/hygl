<template>
    <pop-up
        title="网店发货"
        width="500"
        :views="views"
        :confirm="save"
        :loading="load"
    >
        <div slot="content" class="content">
            <div class="content-header">
                <p><b>订单号 ：{{views.data.ddh}}</b></p>
                <p><b>收货人姓名 ：{{views.data.details[0].shr}}</b><b>收货人联系方式 ：{{views.data.details[0].shrlxfs}}</b></p>
            </div>
            <div v-if="!views.lx">
                <el-row>
                    <span>快递单号</span>
                    <el-input size="mini" v-model.trim="details.fhdh" placeholder="请输入发货单号"></el-input>
                </el-row>
            </div>
            <div>
                <el-row>
                    <span>仓库</span>
                    <el-select
                        v-model="details.ckdm"
                        filterable
                        placeholder="请选择仓库"
                        size="mini"
                        @change="handleCk"
                        style="width:280px"
                    >
                        <el-option
                            v-for="item in ckList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-row>
            </div>
            <el-table
                :data="details.spList"
                max-height="300"
            >
                <el-table-column width="35">
                    <template slot-scope="scope">
                        <span class="cell-span">{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="spname"
                    label="商品名称"
                >
                    <template slot-scope="scope">
                        <span class="cell-span" @click="currentRow=scope.$index">{{scope.row.spname}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="spname"
                    label="选择串号/仓库"
                >
                    <template slot-scope="scope">
                        <div @click="currentRow=scope.$index">
                            <input-imei
                                v-if="!scope.row.isch"
                                :spdm="scope.row.spdm"
                                :ckdm="details.ckdm"
                                :text="scope.row.ch"
                                :selected-array="selectedArray"
                                :disabled="!details.ckdm"
                                @selected="handlerImei"
                            ></input-imei>
                            <span v-else class="cell-span">{{getCkName}}</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </pop-up>
</template>
<script>
import popUp from '../../../../components/popUp/index'
import inputImei from '../../../../components/inputIMEI/index'
export default {
    props:['views'],
    data(){
        return {
            currentRow:'',
            details:{
                fhdh:'',
                ckdm:'',
                spList:[]
            },
            ckList:[],
            load:false
        }
    },
    computed:{
        selectedArray(){
            var temp=[];
            for(let obj of this.details.spList){
                if(obj.ch)
                    temp.push(obj.ch);
            }
            return temp;
        },
        getCkName(){
            for(let obj of this.ckList){
                if(obj.id==this.details.ckdm)
                    return obj.name;
            }
            return '暂未选择仓库';
        }
    },
    methods:{
        handleCk(bm){
            this.details.ckdm=bm;
            for(let obj of this.details.spList){
                if(obj.isch){
                    obj.ckdm=bm;
                }
            }
        },
        //串号是否已经选择
        vartifyHasSelected(ch){
            var flag=false;
            for(let obj of this.details.spList){
                if(obj.ch==ch){
                    flag=true;
                    this.$message('该串号已被选择,请输入新串号','error');
                    break;
                }
            }
            return flag;
        },
        handlerImei(ch){
            this.details.spList[this.currentRow].ch=ch;
        },
        vartifyForm(){
            var flag=true;
            if(!this.details.fhdh){
                this.$message('请输入快递单号','error');
                flag=false;
                return flag;
            }
            if(!this.details.ckdm){
                this.$message('请选择仓库','error');
                flag=false;
                return flag;
            }
            for(let i=0,n=this.details.spList.length;i<n;i++){
                if(!this.details.spList[i].isch&&!this.details.spList[i].ch){
                    this.$message(`第${i+1}行未输入串号`,'error');
                    flag=false;
                    return flag;
                }
            }
            return flag;
        },
        save(){
            if(this.vartifyForm()){
                this.load=true;
                var temp={
                    ddh:this.views.data.ddh,
                    kddh:this.details.fhdh,
                    header:{
                        ckdm:this.details.ckdm,
                        hyid:this.views.data.details[0].hyid,
                        fph:''
                    },
                    stockrows:[],
                    syxxrows:[
                        {je:0}
                    ]
                }
                var index=1;
                var zje=0;
                for(let obj of this.details.spList){
                    temp.stockrows.push({
                        line:index,
                        ch:obj.ch,
                        ch1:obj.ch1,
                        spdm:obj.spdm,
                        sl:obj.sl,
                        dj:obj.dj,
                        je:obj.je,
                        comments2:''
                    });
                    zje+=obj.je;
                    index++;
                }
                temp.syxxrows[0].je=zje;
                this.$http('/api/x6/hyWdfh.do',temp).then(res=>{
                    this.load=false;
                },err=>{
                    this.load=false;
                });
            }
        },
    },
    mounted(){
        this.ckList=this.$util.getCache('ksckList');
        for(let obj of this.views.data.details){
            this.details.spList.push({
               ch:'',
               ch1:'',
               isch:obj.isch,
               spdm:obj.spdm,
               sl:obj.sl,
               dj:obj.spdj,
               je:obj.je,
               comments2:'',
               ckdm:'',
               spname:obj.spname
            });
        }
    },
    components:{
        popUp,
        inputImei
    }
}
</script>
<style lang="less" scoped>
    .el-input{
        width: 280px;
    }
    .el-row{
        padding: 5px 0;
        display: flex;
        align-items: center;
        >span{
            width: 80px;
            text-align: right;
            margin-right: 10px;
            &::before{
                content: '*';
                margin-right: 5px;
                color: red;
            }
            &::after{
                content: ':';
                margin-left: 5px;
            }
        }
    }
    .tips{
        box-sizing: border-box;
        padding-left: 90px;
        color: red;
    }
    .content-header{
        box-sizing: border-box;
        border: 1px solid #ccc;
        padding: 0 10px 10px 10px;
        margin-bottom: 15px;
        p{
            margin-top: 10px;
            b{margin-right: 20px;color: #666;}
        }
    }
</style>

