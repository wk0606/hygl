<template>
    <pop-up
        title="通知中心"
        width="700"
        :views="views"
    >
        <div class="content" slot="content">
            <div
                class="h-title"
            >
                <div
                    class="h-title-item"
                    :class="{selected:currentLx==key}"
                    v-for="(value,key) in views.lx"
                    :key="key"
                >{{value.label}}</div>
                <el-select v-model="lx" size="mini">
                    <el-option label="全部" :value="0"></el-option>
                    <el-option label="已读" :value="1"></el-option>
                    <el-option label="未读" :value="2"></el-option>
                </el-select>
            </div>
            <div class="h-body">
                <span>暂时没有消息哦~</span>
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
            lx:0,
            page:{
                no:1,
                size:20,
                rows:100
            }
        }
    },
    methods:{
        changePage(){}
    },
    mounted(){
        this.currentLx=Object.keys(this.views.lx)[0];
        console.log(this.currentLx)
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
                padding: 5px 7px;
                cursor: pointer;
                background: #fff;
                margin-bottom: -1px;
                border:1px solid @color;
                background: #f3f3f3;
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
            min-height: 110px;
            max-height: 400px;
            border:1px solid @color;
            box-sizing: border-box;
            margin-top: 5px; 
            position: relative;
            >span{
                font-size: 12px;
                position: absolute;
                top:50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
                color: #999;
            }
        }
        .pagination{
            text-align: right;
            padding: 5px 0;
        }
    }
</style>
