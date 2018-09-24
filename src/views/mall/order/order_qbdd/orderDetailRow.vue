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
                    <img :src="scope.row.sppic" alt="">
                    <span class="cell-span">{{scope.row.name}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[1].width"
        >
            <template slot-scope="scope">
                <div>
                    <p class="order-cell">￥{{scope.row.dj | currency}}</p>
                    <p class="order-cell">{{scope.row.sl}}</p>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[2].width"
        >
            <template slot-scope="scope">
                <div>
                    <p class="order-cell">￥{{scope.row.dj*scope.row.sl | currency}}</p>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[3].width"
        >
            <template slot-scope="scope">
                <p class="order-cell">{{scope.row.fhzt}}</p>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[4].width"
        >
            <template slot-scope="scope">
                <p class="order-cell">
                    <span v-if="scope.row.tkzt">未退款</span>
                    <el-button
                        v-else
                        size="mini"
                        @click="$parent.dialog.show=true"
                    >主动退款</el-button>
                </p>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[5].width"
        >
            <template slot-scope="scope">
                <p class="order-cell">￥{{gift | currency}}</p>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
export default {
    props:['data','columns','gift'],
    data(){
        return {

        }
    },
    methods:{
        arraySpanMethod({ row, column, rowIndex, columnIndex }){
            if(!this.gift){
                if(columnIndex > 2 && columnIndex != 4){
                    if(rowIndex===0)
                        return [this.data.length,1];
                    else
                        return [0,1];
                }
            }else{
                if(columnIndex > 2){
                    if(rowIndex===0)
                        return [this.data.length,1];
                    else
                        return [0,1];
                }
            }
        }
    },
    mounted(){
        this.sfje=this.data.reduce((total,item)=>{
            return total+item.je;
        },0);
        //console.log(this.sfje,this.gift)
        this.sfje=this.sfje-this.gift;
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
