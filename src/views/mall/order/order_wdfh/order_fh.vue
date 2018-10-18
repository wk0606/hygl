<template>
    <pop-up
        :title="psfs?'到店自提':'快递发货'"
        width="600"
        :confirm="save"
        :loading="load"
    >
        <div slot="content" class="content">
            <div class="content-header">
                <p><b>订单号 ：{{ddh}}</b></p>
                <p v-if="!psfs"><b>收货人姓名 ：{{details.shr}}</b><b>收货人联系方式 ：{{details.shrlxfs}}</b></p>
                <p v-if="psfs"><b>买家姓名 ：{{details.mjname}}</b></p>
                <p v-if="details.shdz"><b>收货地址 ：{{details.shdz}}</b></p>
            </div>
            <div v-if="!psfs">
                <el-row>
                    <span>快递单号</span>
                    <el-input size="mini" v-model.trim="details.fhdh" placeholder="请输入发货单号" clearable></el-input>
                </el-row>
            </div>
            <div>
                <el-row>
                    <span>{{psfs?'自提仓库':'发货仓库'}}</span>
                    <input-search
                        style="width:280px;"
                        :data="ckList"
                        placeholder="请选择发货仓库"
                        @change="handleCk"
                    ></input-search>
                    <i class="el-icon-question" style="margin-left:10px;font-size:14px;color:#ccc;" title="发货仓库仅为满足本订单商品数量的仓库，当没有仓库可选时，请及时采购调拨"></i>
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
                        <p class="cell-span" :title="scope.row.spname"><span @click="currentRow=scope.$index">{{scope.row.spname}}</span></p>
                        <p class="cell-span" :title="scope.row.spggs"><span style="color:#999;">规格：{{scope.row.spggs}}</span></p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="spname"
                    label="库存商品名"
                    header-align="center"
                >
                    <template slot-scope="scope">
                        <p class="cell-span" :title="scope.row.qspmc"><span>{{scope.row.qspmc}}</span></p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="spname"
                    label="串号/仓库"
                    header-align="center"
                >
                    <template slot-scope="scope">
                        <div @click="currentRow=scope.$index">
                            <input-imei
                                v-if="!scope.row.isch"
                                :spdm="scope.row.spdm"
                                :ckdm="details.ckdm"
                                :text.sync="scope.row.ch"
                                :disabled="!details.ckdm"
                                :placeholder="!details.ckdm?'请先选择仓库':'请输入串号'"
                            ></input-imei>
                            <!-- <span  class="cell-span" :class="{gray:!details.ckdm}"></span> -->
                            <div
                                v-else
                                class="no-imei"
                            >
                                <span :class="{gray:!details.ckdm}">{{getCkName}}</span>
                                <span
                                    v-if="scope.row.kskc||scope.row.kskc===0"
                                    :class="{error:scope.row.kskc<=0}"
                                >库存 : {{scope.row.kskc<0?0:scope.row.kskc}}</span>
                            </div>
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
import inputSearch from '../../../../components/inputSearch/index'
export default {
    data(){
        return {
            currentRow:'',
            details:{
                fhdh:'',
                ckdm:'',
                spList:[]
            },
            goods:[],
            ckList:[],
            load:false
        }
    },
    computed:{
        selectedArray(){
            var temp=[];
            for(let obj of this.details.spList){
                if(!obj.ch)
                    temp.push(obj.ch);
            }
            return temp;
        },
        getCkName(){
            for(let obj of this.ckList){
                if(obj.id==this.details.ckdm)
                    return obj.name;
            }
            return '请先选择仓库';
        }
    },
    methods:{
        handleCk(item){
            this.details.ckdm=item.id;
            for(let obj of this.details.spList){
                if(obj.isch&&item.id){
                    //obj.ckdm=item.id;
                    this.getKskc(item.id,obj.spdm,obj);
                }
            }
        },
        getKskc(ckdm,spdm,obj){
            this.$http('/api/x6/getSjkcBySpdmCkdm.do',{
                spdm:spdm,
                ckdm:ckdm
            }).then(res=>{
                this.$set(obj,'kskc',res.sjkc);
            });
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
        vartifyForm(){
            var flag=true;
            if(!this.details.fhdh&&!this.psfs){
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
                    ddh:this.ddh,
                    kddh:this.details.fhdh,
                    header:{
                        ckdm:this.details.ckdm,
                        hyid:this.details.hyid,
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
                    index++;
                    zje+=obj.je;
                }
                temp.syxxrows[0].je=zje;
                this.$http('/api/x6/hyWdfh.do',temp).then(res=>{
                    this.load=false;
                    this.$message(this.psfs?'自提成功':'发货成功');
                    if(this.callback)
                        this.callback();
                    this.close();
                },err=>{
                    this.load=false;
                });
            }
        },
        async getCkList(sparray){
            let res=await this.$http('/api/x6/queryKsckListBySpdms.do',{
                spdmarray:sparray
            });
            for(let obj of res.List)
                obj.id=obj.ckdm;
            this.ckList=res.List;
        },
        close(){
            document.body.removeChild(document.getElementById(this.DomID));
        }
    },
    mounted(){
        this.$http('/api/x6/getFhxxByDdh.do',{
            ddh:this.ddh
        }).then(res=>{
            let temp=[];
            for(let obj of res.stockrows){
                temp.push({
                    spdm:obj.spdm,
                    sl:obj.sl
                });
            }
            this.getCkList(temp);
            this.details.hyid=res.header.hyid;
            this.details.shr=res.header.shr;
            this.details.shrlxfs=res.header.shrlxfs;
            this.details.mjname=res.header.mjname;
            this.details.shdz=res.header.shdz;
            for(let obj of res.stockrows){
                if(!obj.isch){
                    for(let i=0;i<obj.sl;i++){
                        this.details.spList.push({
                            ch:'',
                            ch1:'',
                            isch:obj.isch,
                            spdm:obj.spdm,
                            sl:obj.sl,
                            dj:obj.dyjg,
                            je:obj.je,
                            comments2:'',
                            ckdm:'',
                            spname:obj.spname,
                            qspmc:obj.qspmc,
                            spggs:obj.spggs
                        });
                    }
                }else{
                    this.details.spList.push({
                        ch:'',
                        ch1:'',
                        isch:obj.isch,
                        spdm:obj.spdm,
                        sl:obj.sl,
                        dj:obj.dyjg,
                        je:obj.je,
                        comments2:'',
                        ckdm:'',
                        spname:obj.spname,
                        qspmc:obj.qspmc,
                        spggs:obj.spggs
                    });
                }
            }
        });
    },
    components:{
        popUp,
        inputImei,
        inputSearch
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
    .gray{
        color: #999;
    }
    .no-imei{
        display: flex;
        align-items: top;
        justify-content: space-between;
        font-size: 12px;
        span:nth-child(2){
            flex-shrink: 0;
            color: #999;
        }
        span:nth-child(1){
            flex-grow: 1;
        }
    }
    .error{color:red !important;}
</style>

