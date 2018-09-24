<template>
    <pop-up
        title="主动退款"
        width="600"
        :hide-cancel="true"
        :views="views"
    >
        <div class="content" slot="content">
            <el-table
                :data="List"
                header-cell-class-name="el-table-drak-head"
                border
                :span-method="arraySpanMethod"
                max-height="300"
            >
                <el-table-column
                    v-for="item in colModel"
                    :key="item.prop"
                    :label="item.label"
                    header-align="center"
                    :min-width="item.min"
                    :align="item.align"
                >
                    <template slot-scope="scope">
                        <el-input
                            v-if="item.prop=='tkje'"
                            size="mini"
                            v-model="scope.row[item.prop]"
                        ></el-input>
                        <span
                            v-else
                            class="cell-span-wrap"
                        >{{item.currency?$util.formatCash(scope.row[item.prop]):scope.row[item.prop]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="form-items">
                <span><i style="color:red;">*</i>退款方式</span>
                <el-select v-model="details.tkfs" size="mini">
                    <el-option
                        v-for="item in tkfs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div class="form-items">
                <span>退款原因</span>
                <el-select v-model="details.tkyy" size="mini">
                    <el-option
                        v-for="item in tkyy"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div class="form-items form-items-top">
                <span>退款说明</span>
                <el-input
                    type="textarea"
                    v-model="details.tksm"
                    :rows="3"
                    style="width:300px;"
                    :max="200"
                    placeholder="选填,不超过200个字"
                    class="textarea"
                ></el-input>
            </div>
            <div class="form-items form-items-top">
                <span>温馨提示</span>
                <div>
                    <p>网店订单退款金额原路退回</p>
                    <p>退款金额三日内到账</p>
                </div>
            </div>
        </div>
        <div slot="footer-text">
            <span class="description">退款给买家 : <span>10</span></span>
        </div>
        <el-button slot="footer" size="mini" type="primary">拒绝退款</el-button>
        <el-button slot="footer" size="mini" type="danger">确定退款</el-button>
    </pop-up>
</template>
<script>
import popUp from '../../../../components/popUp/index'
export default {
    props:['views'],
    data(){
        return {
            details:{
                spList:[],
                tkfs:'',
                tkyy:'',
                tksm:''
            },
            tkfs:[
                {label:'仅退款',value:0},
                {label:'退款退货',value:1}
            ],
            tkyy:[
                {label:'不想要了',value:0},
                {label:'买错了',value:1},
                {label:'不满意',value:2}
            ],
            colModel:[
                {label:'商品',prop:'spname',min:120},
                {label:'商品金额',prop:'je',align:'right',currency:true},
                {label:'红包',prop:'gift',align:'right',currency:true},
                {label:'可退金额',prop:'ktje',align:'right',currency:true},
                {label:'退款金额',prop:'tkje'}
            ],
            List:[
                {spname:'华为mate10 35g 全网通黑色',je:2000,gift:568,ktje:544,tkje:0},
                {spname:'华为mate10 35g 全网通黑色',je:2000,gift:568,ktje:544,tkje:0},
                {spname:'华为mate10 35g 全网通黑色',je:2000,gift:568,ktje:544,tkje:0},
                {spname:'华为mate10 35g 全网通黑色',je:2000,gift:568,ktje:544,tkje:0},
            ]
        }
    },
    methods:{
        arraySpanMethod({ row, column, rowIndex, columnIndex }){
            if(this.gift){
                if(columnIndex > 1){
                    if(rowIndex===0)
                        return [this.List.length,1];
                    else
                        return [0,1];
                }
            }
        }
    },
    mounted(){
        if(!this.gift){
            this.colModel=this.colModel.filter(item=>{
                return item.prop!='gift'&&item.prop!='je';
            });
        }
    },
    components:{
        popUp
    }
}
</script>
<style lang="less" scoped>
    .content{
        box-sizing: border-box;
        //padding-left: 20px;
    }
    .form-items{
        display: flex;
        align-items: center;
        margin-top: 15px;
        color: #999;
        >span{
            margin-right: 10px;
            flex-shrink: 0;
            width: 55px;
            text-align: right;
        }
    }
    .form-items-top{align-items: flex-start;}
    .textarea{
        font-size: 12px;
        font-family: 'microsoft yahei';
    }
    .description{
        font-size: 14px;
        color: #999;
        span{color:red;}
    }
</style>
