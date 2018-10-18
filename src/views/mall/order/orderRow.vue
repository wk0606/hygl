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
                    <div>
                        <p class="cell-span" :title="scope.row.spname">{{scope.row.spname}}</p>
                        <p style="color:#999;">规格：{{setSpgg(scope.row.spgg)}}</p>
                    </div>
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
                <p class="order-cell">{{scope.row.psfs?'自提':'快递'}}</p>
                <p class="order-cell" v-if="!scope.row.psfs">￥{{yfje | currency}}</p>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[4].width"
        >
            <template slot-scope="scope">
                <p class="order-cell">￥{{zje | currency}}</p>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[5].width"
        >
            <template slot-scope="scope">
                <p class="order-cell">{{$parent.getDdzt(scope.row.ddzt,scope.row.psfs)}}</p>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[6].width"
        >
            <template slot-scope="scope">
                <div
                    v-if="!!records&&!!records.length"
                >
                    <p
                        v-for="item in records"
                        :key="item.lines"
                        class="order-cell order-cell-btn"
                        :class="item.tkzt==1?'error':'blue'"
                        @click="sendBack(item)"
                    >
                        {{item.label}}
                    </p>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[7].width"
        >
            <template slot-scope="scope">
                <div class="order-cell">
                    <el-button size="mini" v-if="scope.row.ddzt==1" @click="openFh">{{scope.row.psfs?'自提':'发货'}}</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import { refund } from './refund'
import { delivery } from './delivery'
export default {
    props:{
        data:{},
        columns:{},
        gift:{},//使用红包金额
        zje:{},//使用红包后的总金额
        yfje:{},
        records:{}
    },
    data(){
        return {
        }
    },
    methods:{
        arraySpanMethod({ row, column, rowIndex, columnIndex }){
            if(columnIndex > 1 ){
                if(rowIndex===0)
                    return [this.data.length,1];
                else
                    return [0,1];
            }
        },
        openFh(){
            delivery.open({
                psfs:this.data[0].psfs,
                ddh:this.data[0].ddh,
                callback:this.$parent.thm?this.$parent.getOrderDetails:this.$parent.search
            });
        },
        sendBack(item){
            let count=0;
            for(let obj of this.data){
                if(obj.tkzt==2)
                    count++;
            }
            refund.open({
                ddh:this.data[0].ddh,
                tkzt:item.tkzt,
                line:item.lines,
                gift:this.gift,
                ddzt:this.data[0].ddzt,
                callback:this.$parent.search,
                ktsl:this.data.length-count
            });
        },
        setSpgg(spgg){
            let temp=JSON.parse(spgg.value);
            let str='';
            for(let obj of temp){
                str+=`${obj.name}:${obj.value} `;
            }
            return str;
        }
    },
    mounted(){
       
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
    >div{
        flex-grow: 1;
        margin-left: 10px;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 12px;
        display: inline-flex;
        flex-direction: column;
        p{
            flex-grow: 1;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
}
.order-cell{
    font-size: 12px;
    text-align: center;
}
.order-cell-btn{
    cursor: pointer;
    &:hover{
        text-decoration: underline;
    }
}
.error{
    color: red;
}
.blue{
    color: #409eff;
}
</style>
