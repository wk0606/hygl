<template>
    <pop-up
        title="通知中心"
        width="800"
        :views="views"
    >
        <div class="content" slot="content">
            <div
                class="h-title"
            >
                <div
                    class="h-title-item"
                    :class="{selected:currentLx==key}"
                    v-for="(item,key) in views.txlx"
                    :key="key"
                    @click="changeTxlx(key)"
                >{{item.label}}</div>
                <el-select v-model="zt" size="mini" @change="changeTxzt">
                    <el-option label="全部" :value="2"></el-option>
                    <el-option label="已读" :value="1"></el-option>
                    <el-option label="未读" :value="0"></el-option>
                </el-select>
            </div>
            <div class="h-body">
                <span v-if="!List.length">暂时没有消息哦~</span>
                <ul>
                    <li
                        v-for="row in List"
                        :key="row.id"
                        class="table-row"
                        :class="{'no-read':!row.flag}"
                        @click="changeReadFlag(row)"
                    >
                        <div>
                            <div
                                class="table-row-item"
                                v-for="item in views.txlx[row.lx].context"
                                :key="item.key"
                            >
                                <span>{{item.text}} : </span>
                                <span>{{row.data[item.key]}}</span>
                            </div>
                        </div>
                        <i
                            v-if="row.lx!='WDTX_BOX_WELCOME'"
                            @click="openTx(row)"
                        >了解详情</i>
                    </li>
                </ul>
            </div>
            <div class="pagination">
                <el-pagination
                    small
                    layout="prev, pager, next"
                    :total="page.rows"
                    :current-page="page.no"
                    :page-size="page.size"
                    @current-change="changePage">
                </el-pagination>
            </div>
        </div>
    </pop-up>
</template>
<script>
import popUp from '../../components/popUp/index'
import pagination from '../../components/pagination/index'
export default {
    props:['views'],
    data(){
        return {
            currentLx:'',
            zt:2,//0未读 1已读 2全部
            page:{
                no:1,
                size:20,
                rows:100
            },
            List:[]
        }
    },
    methods:{
        changeReadFlag(row){
            this.$http('/api/tx/passWdTxByMsgid.do',{
                msgid:row.msgid
            }).then(res=>{
                row.flag=1;
            });
        },
        changePage(page){
            this.page.no=page;
            this.getList();
        },
        changeTxlx(lx){
            this.page.no=1;
            this.currentLx=lx;
            this.getList();
        },
        changeTxzt(){
            this.page.no=1;
            this.getList();
        },
        openTx(row){
            this.views.show=false;
            this.$parent.openTxPage(row);
        },
        getList(){
            this.$http('/api/tx/getWdTzListByCondition.do',{
                pageSize:this.page.size,
                pageNo:this.page.no,
                lx:this.currentLx,
                xxzt:this.zt
            }).then(res=>{
                for(let obj of res.rows){
                    obj.data=JSON.parse(obj.data.value);
                }
                this.List=res.rows;
                this.page.rows=res.totalRows;
            });
        }
    },
    mounted(){
        this.currentLx=Object.keys(this.views.txlx)[0];
        this.getList();
    },
    components:{
        popUp,
        pagination
    }
}
</script>

<style lang="less" scoped>
    @color:#ccc;
    .content{
        .h-title{
            display: flex;
            // align-items: center;
            border-bottom:1px solid @color;
            position: relative;
            .h-title-item{
                padding: 7px 10px;
                background: #fff;
                margin-bottom: -1px;
                border:1px solid @color;
                background: #f3f3f3;
                color: #999;
            }
            .selected{background: #fff;border-bottom: none;}
            .h-title-item:nth-child(n+1){
                margin-left: -1px;
            }
            .el-select{
                width: 80px;
                position: absolute;
                right: 0;
                top:-5px;
            }
        }
        .h-body{
            width:100%;
            height: 300px;
            border:1px solid @color;
            box-sizing: border-box;
            margin-top: 5px; 
            position: relative;
            overflow-y: auto;
            >span{
                font-size: 12px;
                position: absolute;
                top:50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
                color: #999;
            }
            ul{
                .table-row{
                    box-sizing: border-box;
                    padding: 5px 0;
                    border-bottom: 1px dashed #ccc;
                    padding: 5px 10px;
                    display: flex;
                    align-items: center;
                    color: #999;
                    >div{
                        flex-grow: 1;
                        .table-row-item{
                            flex-grow: 1;
                            display: flex;
                            align-items: flex-start;
                            justify-content: space-between;
                            margin: 5px 0;
                            >span:nth-child(1){
                                flex-shrink: 0;
                            }
                            >span:nth-child(2){
                                flex-grow: 1;
                                margin-left: 5px;
                            }
                        }
                        
                    }
                    >i{
                        flex-shrink: 0;
                        cursor: pointer;
                        color: #409eff;
                        margin-left: 10px;
                        &:hover{
                            text-decoration: underline;
                        }
                    }
                    &:hover{
                        background: #fafafa;
                    }
                }
                .table-row:nth-child(1){
                    border-top: none;
                }
            }
        }
        .pagination{
            text-align: right;
            padding: 5px 0;
        }
        .no-read{color:#333 !important;}
    }
</style>
