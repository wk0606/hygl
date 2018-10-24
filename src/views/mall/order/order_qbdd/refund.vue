<template>
    <pop-up
        :title="tkzt==1?'同意退款':tkzt>1?'退款详情':'主动退款'"
        width="600"
        :hide-cancel="true"
    >
        <div class="content" slot="content">
            <i v-if="tkzt>1" class="tk-icon iconfont" :class="tkzt==3?'icon-yitongyi success':tkzt==2?'icon-yijujue error':'icon-shibai error'"></i>
            <div class="tk-header" v-if="tkzt>1">
                <p>
                    <span>退款类型：</span>
                    <span>{{details.tklx?'同意退款':'主动退款'}}</span>
                </p>
                <p v-if="details.tklx">
                    <span>申请时间：</span>
                    <span>{{details.tksqrq}}</span>
                </p>
            </div>
            <el-table
                :data="details.spList"
                header-cell-class-name="el-table-drak-head"
                border
                :span-method="arraySpanMethod"
                max-height="300"
                @selection-change="changeRow"
             >
                <el-table-column
                    v-if="tkzt==0&&!this.gift"
                    type="selection"
                    width="45"
                    align="center">
                </el-table-column>
                <el-table-column
                    v-for="item in colModel"
                    :key="item.prop"
                    :label="item.label"
                    header-align="center"
                    :min-width="item.min"
                    :align="item.align"
                >
                    <template slot-scope="scope">
                        <span
                            v-if="item.prop=='tkje'"
                            class="cell-span-wrap"
                        >￥{{scope.row.tkje | currency}}</span>
                        <div v-if="item.prop=='spname'">
                            <p class="cell-span" :title="scope.row.spname">{{scope.row.spname}}</p>
                            <p class="cell-span" :title="'规格:'+scope.row.spggstr" style="color:#aaa;">规格:{{scope.row.spggstr}}</p>
                        </div>
                        <span
                            v-if="item.prop!='tkje'&&item.prop!='spname'"
                            class="cell-span-wrap"
                        >{{item.currency?$util.formatCash(scope.row[item.prop]):scope.row[item.prop]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <p class="tips" v-if="rules.tkje.show">{{rules.tkje.label}}</p>
            <div class="form-items" v-if="details.isyftk!==undefined">
                <span><i style="color:red;">*</i>是否退运费：</span>
                <el-checkbox v-model="details.isyftk" v-if="tkzt<2"></el-checkbox>
                <i v-else>{{details.isyftk?'已退':'未退'}}</i>
                <i style="margin-left:5px;">(￥{{details.yfje | currency}})</i>
                <i v-if="tkzt<2" class="el-icon-question" style="margin-left:5px;font-size:14px;color:#ccc;" title="只有退款商品数量和订单可退商品数量一致时，此项才可操作"></i>
            </div>
            <div class="form-items" v-if="tkzt!=2">
                <span><i style="color:red;">*</i>退款路径：</span>
                <el-select v-if="tkzt<2" v-model="details.tklj" size="mini">
                    <el-option
                        v-for="item in tklj"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <i v-else>{{details.tklj?'线上退款':'线下退款'}}</i>
            </div>
            <div class="form-items" v-if="tkzt!=2">
                <span><i style="color:red;">*</i>退款方式：</span>
                <el-select v-if="tkzt<2" v-model="details.tkfs" size="mini" @change="rules.tkfs.show=false" :disabled="ddzt==1">
                    <el-option
                        v-for="item in tkfs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <i v-else>{{details.tkfs?'退款退货':'仅退款'}}</i>
            </div>
            <p class="tips" v-if="rules.tkfs.show">{{rules.tkfs.label}}</p>
            <div class="form-items">
                <span>退款原因：</span>
                <el-select v-model="details.tkyy" size="mini" v-if="tkzt<2" :disabled="tkzt==1">
                    <el-option
                        v-for="item in tkyy"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <i v-else>{{details.tkyy||'无'}}</i>
            </div>
            <div class="form-items form-items-top">
                <span>退款说明：</span>
                <el-input
                    v-if="tkzt<2"
                    type="textarea"
                    v-model="details.tksm"
                    :rows="3"
                    style="width:300px;"
                    :max="200"
                    placeholder="选填,不超过200个字"
                    class="textarea"
                    :disabled="tkzt==1"
                ></el-input>
                <i v-else>{{details.tksm||'无'}}</i>
            </div>
            <div class="form-items" v-if="tkzt>1">
                <span>操作人员：</span>
                <i>{{$util.getYgInfo(details.tkr).name}}</i>
            </div>
            <div class="form-items" v-if="tkzt>1">
                <span>操作时间：</span>
                <i>{{details.tkrq}}</i>
            </div>
            <div class="form-items form-items-top" v-if="tkzt<2">
                <span>温馨提示：</span>
                <div>
                    <p>1.线上退款金额原路退回</p>
                    <p>2.线上退款金额三日到账</p>
                </div>
            </div>
        </div>
        <div slot="footer-text" v-if="tkzt<2">
            <span class="description">退款给买家 : <span>{{totalTkje | currency}}</span></span>
        </div>
        <el-button slot="footer" size="mini" type="primary" @click="refuseTk" :loading="load2" v-if="tkzt==1">拒绝退款</el-button>
        <el-button slot="footer" size="mini" type="danger" @click="save" v-if="tkzt<2" :loading="load1">确定退款</el-button>
        <el-button slot="footer" size="mini" v-if="tkzt>1" @click="close">关闭</el-button>
    </pop-up>
</template>
<script>
import popUp from '../../../../components/popUp/index'
export default {
    data(){
        return {
            details:{
                spList:[],
                tklj:0,
                tkfs:'',
                tkyy:'',
                tksm:'',
                ckdm:'',
                hyid:'',
                tksqrq:'',
                tkrq:''
            },
            tklj:[
                {label:'线下退款',value:0},
                {label:'线上退款',value:1},
            ],
            tkfs:[
                {label:'仅退款',value:0},
                {label:'退款退货',value:1}
            ],
            tkyy:[
                {label:'不想要了',value:'不想要了'},
                {label:'买错了',value:'买错了'},
                {label:'不满意',value:'不满意'}
            ],
            colModel:[
                {label:'商品',prop:'spname',min:120},
                {label:'商品金额',prop:'je',align:'right',currency:true},
                {label:'运费',prop:'yfje',align:'right',currency:true},
                {label:'红包',prop:'gift',align:'right',currency:true},
                {label:'可退金额',prop:'ktje',align:'right',currency:true},
                {label:'退款金额',prop:'tkje',align:'right'}
            ],
            List:[],
            rules:{
                tkje:{show:false,label:''},
                tkfs:{show:false,label:'请选择退款方式'}
            },
            load1:false,
            load2:false,
            selectedRow:[]
        }
    },
    computed:{
        totalTkje(){
            let total;
            if(this.details.spList.length){
                if(this.gift){
                    total=this.details.spList[0].tkje||0;
                }else{
                    if(this.tkzt==0){
                        total=this.selectedRow.reduce((total,item)=>{
                            return total+item.tkje||0;
                        },0);
                    }else{
                        total=this.details.spList.reduce((total,item)=>{
                            return total+item.tkje||0;
                        },0);
                    }
                }
            }
            if(this.details.isyftk){
                total+=this.details.yfje;
            }
            return total;
        }
    },
    methods:{
        arraySpanMethod({ row, column, rowIndex, columnIndex }){
            if(this.gift){
                if(columnIndex > 1){
                    if(rowIndex===0)
                        return [this.details.spList.length,1];
                    else
                        return [0,1];
                }
            }
        },
        setSpgg(spgg){
            let str='';
            for(let obj of spgg){
                str+=`${obj.name}:${obj.value} `;
            }
            return str;
        },
        changeRow(val){
            this.selectedRow=val;
            if(val.length==this.ktsl&&!this.gift&&this.details.yfje>0)
                this.$set(this.details,'isyftk',this.ddzt>1?false:true);
            else
                delete this.details.isyftk;
        },
        getTkDetails(ddh){
            this.$http('/api/x6/getTkxx.do',{
                ddh:ddh,
                lines:this.line
            }).then(res=>{
                if(!res.VO.isXstk)
                    this.tklj.splice(1,1);
                if(res.VO.yfje==0)
                    this.colModel=this.colModel.filter(item=>{
                        return item.prop!='yfje';
                    });
                for(let obj of res.VO.ddxx){
                    obj.tkje=obj.ktje;
                    obj.gift=this.gift;
                    obj.yfje=res.VO.yfje;
                }
                this.details.ckdm=res.VO.ckdm;
                this.details.hyid=res.VO.hyid;
                this.details.spList=res.VO.ddxx;
                this.details.tkfs=res.VO.tkfs||this.ddzt>1?1:0;
                this.details.tkyy=res.VO.reason;
                this.details.tksm=res.VO.tksm;
                this.details.tksqrq=res.VO.tksqrq;
                this.details.tklx=res.VO.tklx;
                this.details.tkrq=res.VO.tkrq;
                this.details.tkr=res.VO.tkr;
                this.details.tklj=this.tkzt>1?res.VO.tklj:res.VO.isXstk?1:0;
                this.details.yfje=res.VO.yfje;
                if(res.VO.yfje>0){
                    if(this.tkzt>1)
                        this.details.isyftk=res.VO.isyftk;
                    if(this.tkzt==1&&this.ktsl==res.VO.ddxx.length&&!this.gift)
                        this.$set(this.details,'isyftk',this.ddzt>1?true:false);
                }
            });
        },
        save(){
            if(this.details.tkfs===''){
                this.rules.tkfs.show=true;
            }
            if(this.tkzt==0&&!this.gift){
                if(!this.selectedRow.length){
                    this.$message('请至少选中一行','error');
                    return;
                }
            }
            this.load1=true;
            let params={
                ddh:this.ddh,
                tklx:this.tkzt,
                tklj:this.details.tklj,
                tkfs:this.details.tkfs,
                reason:this.details.tkyy,
                tksm:this.details.tksm,
                gift:this.gift,
                ckdm:this.details.ckdm,
                hyid:this.details.hyid,
                tksqrq:this.details.tksqrq,
                tkxx:[],
                isyftk:this.details.isyftk===undefined?-1:this.details.isyftk?1:0
            }
            if(this.gift){
                for(let obj of this.details.spList){
                    params.tkxx.push({
                        line:obj.line,
                        tkje:this.details.spList[0].tkje,
                        linechStrs:obj.linechStrs,
                        spdm:obj.spdm,
                        sl:obj.sl,
                        dyjg:obj.dyjg,
                        je:obj.je
                    });
                }
            }else{
                let temp=this.tkzt==0?this.selectedRow:this.details.spList;
                for(let obj of temp){
                    params.tkxx.push({
                        line:obj.line,
                        tkje:temp[0].tkje,
                        linechStrs:obj.linechStrs,
                        spdm:obj.spdm,
                        sl:obj.sl,
                        dyjg:obj.dyjg,
                        je:obj.je
                    });
                }
            }
            this.$http('/api/x6/hyWdTkth.do',params).then(res=>{
                this.$message('退款成功');
                this.load1=false;
                this.close();
                if(this.callback)
                    this.callback();
            },err=>{
                this.load1=false;
            });
        },
        refuseTk(){
            this.load2=true;
            let line=this.details.spList.map(item=>{
                return item.line;
            });
            this.$http('/api/x6/refuseRfund.do',{
                ddh:this.ddh,
                lines:line.join(',')
            }).then(res=>{
                this.load2=false;
                this.close();
                if(this.callback)
                    this.callback();
            },err=>{
                this.load2=false;
            });
        },
        close(){
            document.body.removeChild(document.getElementById(this.DomID));
        }
    },
    mounted(){
        if(!this.gift){
            this.colModel=this.colModel.filter(item=>{
                return item.prop!='gift'&&item.prop!='je'&&item.prop!='yfje';
            });
        }
        this.getTkDetails(this.ddh);
        this.details.tkfs=this.ddzt>1?'':0;
    },
    components:{
        popUp
    }
}
</script>
<style lang="less" scoped>
    .content{
        box-sizing: border-box;
        position: relative;
        //padding-left: 20px;
    }
    .tk-header{
        p{
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            color: #999;
            span:nth-child(1){
                //margin-right: 10px;
                flex-shrink: 0;
                width: 70px;
                text-align: left;
            }
        }
    }
    .form-items{
        display: flex;
        align-items: center;
        margin-top: 15px;
        color: #999;
        >span{
            //margin-right: 10px;
            flex-shrink: 0;
            width: 85px;
            text-align: left;
        }
    }
    .form-items-top{
        align-items: flex-start;
        p:nth-child(2){
            margin-top: 5px;
        }
    }
    .textarea{
        font-size: 12px;
        font-family: 'microsoft yahei';
    }
    .description{
        font-size: 14px;
        color: #999;
        span{color:red;}
    }
    .tips{
        margin-top: 5px;
        color: red;
    }
    .tk-icon{
        position: absolute;
        top:10px;
        right: 10px;
        font-size: 50px;
        z-index: 2;
    }
    .success{color: #67C23A;}
    .error{color: red;}
</style>
