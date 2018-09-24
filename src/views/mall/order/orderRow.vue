<template>
    <el-table
        style="width:100%;"
        border
        :data="data"
        :show-header="false"
        :span-method="arraySpanMethod"
    >
        <el-table-column
            :min-width="columns[0].width"
        >
            <template slot-scope="scope">
                <div class="order-spname">
                    <img :src="scope.row.sptpfirst" alt="">
                    <span class="cell-span">{{scope.row.spname}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[1].width"
        >
            <template slot-scope="scope">
                <div>
                    <p class="order-cell">￥{{scope.row.spdj | currency}}</p>
                    <p class="order-cell">{{scope.row.sl}}</p>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[2].width"
        >
            <template slot-scope="scope">
                <div>
                    <p class="order-cell">{{scope.row.mjname}}</p>
                    <p class="order-cell">{{scope.row.shr}} {{scope.row.shrlxfs}}</p>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[3].width"
        >
            <template slot-scope="scope">
                <p class="order-cell">{{scope.row.psfs?'快递':'自提'}}</p>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[4].width"
        >
            <template slot-scope="scope">
                <p class="order-cell">￥{{sfje ? sfje : scope.row.je | currency}}</p>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[5].width"
        >
            <template slot-scope="scope">
                <p class="order-cell">{{$parent.getDdzt(scope.row.ddzt)}}</p>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[6].width"
        >
            <template slot-scope="scope">
                <div class="order-cell">
                    <el-button size="mini" :disabled="scope.row.ddzt!==1">发货</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
export default {
    props:{
        data:{},
        columns:{},
        sfje:{},//s使用红包后的总金额
    },
    data(){
        return {

        }
    },
    methods:{
        arraySpanMethod({ row, column, rowIndex, columnIndex }){
            if(!this.sfje){
                if(columnIndex > 1 && columnIndex != 4){
                    if(rowIndex===0)
                        return [this.data.length,1];
                    else
                        return [0,1];
                }
            }else{
                if(columnIndex > 1){
                    if(rowIndex===0)
                        return [this.data.length,1];
                    else
                        return [0,1];
                }
            }
        }
    },
    mounted(){
        //this.data=this.data.concat(this.data);
    }
}
</script>
<style lang="less" scoped>
.order-spname{
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    width:100%;
    img{
        width: 60px;
        height: auto;
    }
    span{
        flex-grow: 1;
        margin-left: 10px;
        text-overflow: ellipsis;
    }
}
.order-cell{
    font-size: 12px;
    text-align: center;
}
</style>
