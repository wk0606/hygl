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
                    <div>
                        <p class="cell-span" :title="scope.row.name">{{scope.row.name}}</p>
                        <p style="color:#999;" :title="setSpgg(scope.row.spgg)">规格：{{setSpgg(scope.row.spgg)}}</p>
                        <!-- <p>是多少</p> -->
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
                    <p class="order-cell">￥{{zfje | currency}}</p>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[5].width"
        >
            <template slot-scope="scope">
                <p class="order-cell">￥{{gift | currency}}</p>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[3].width"
        >
            <template slot-scope="scope">
                <p class="order-cell">{{setDdzt}}</p>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[4].width"
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
                        @click="orderTk(item)"
                    >
                        {{item.label}}
                    </p>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            :min-width="columns[6].width"
        >
            <template slot-scope="scope">
                <p class="order-cell">
                    <el-button
                        v-if="setTkBtn.show"
                        size="mini"
                        @click="orderTk(0)"
                    >{{setTkBtn.label}}</el-button>
                </p>
            </template>
        </el-table-column>

        <el-table-column
            :min-width="columns[7].width"
        >
            <template slot-scope="scope">
                <p class="order-cell">
                    <el-button
                        v-if="setFhBtn.show"
                        size="mini"
                        @click="openFh"
                    >{{setFhBtn.label}}</el-button>
                </p>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import {delivery} from '../delivery'
import {refund} from '../refund'
export default {
    props:['data','columns','gift','records','ddh','zfje'],
    data(){
        return {
            hasZdtk:0,//是否有主动退款
        }
    },
    computed:{
        setTkBtn(){
            if(this.data[0].ddzt===0||this.data[0].ddzt===4){
                return {
                    show:false,
                    label:'主动退款'
                }
            }else if(this.zfje==0){
                return {
                    show:false,
                    label:'主动退款'
                }
            }else{
                let flag=false;
                for(let obj of this.data){
                    if(!obj.tkzt){
                        flag=true;
                        break;
                    }
                }
                return {
                    show:flag,
                    label:'主动退款'
                }
            }
        },
        setFhBtn(){
            return {
                show:this.data[0].ddzt==1?true:false,
                label:this.data[0].psfs?'自提':'发货'
            }
        },
        setDdzt(){
            if(this.data[0].ddzt==0)
                return '待付款';
            else if(this.data[0].ddzt==1)
                return '待发货';
            else if(this.data[0].ddzt==2)
                return this.data[0].psfs?'待自提':'待收货';
            else if(this.data[0].ddzt==3)
                return '已完成';
            else
                return '已关闭';
        }
    },
    methods:{
        arraySpanMethod({ row, column, rowIndex, columnIndex }){
            if(columnIndex > 1){
                if(rowIndex===0)
                    return [this.data.length,1];
                else
                    return [0,1]; 
            }
        },
        orderTk(item){
            let line=[];
            let count=0;
            for(let obj of this.data){
                if(obj.tkzt==2)
                    count++;
            }
            //主动退款
            if(!item){
                for(let obj of this.data){
                    if(!obj.tkzt)
                        line.push(obj.line)
                }
            }
            refund.open({
                ddh:this.data[0].ddh,
                tkzt:item?item.tkzt:0,
                line:item?item.lines:line.join(','),
                gift:this.data[0].gift,
                ddzt:this.data[0].ddzt,
                ktsl:this.data.length-count,
                callback:this.$parent.getDetails
            });
        },
        openFh(){
            delivery.open({
                psfs:this.data[0].psfs,
                ddh:this.ddh,
                callback:this.$parent.getDetails
            });
        },
        setSpgg(spgg){
            let str='';
            for(let obj of spgg){
                str+=`${obj.name}:${obj.value} `;
            }
            return str;
        }
    },
    mounted(){
        //console.log(this.data)
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
