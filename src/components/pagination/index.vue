<template>
    <div class="pagination">
        <el-pagination
            :small="small"
            @current-change="changePage"
            :page-size="data.size" 
            :total="data.rows"
            :current-page="data.no"
            layout="total,prev, pager, next,jumper"
        ></el-pagination>
    </div>
</template>
<script>
    export default{
        props:{
            data:{
                required:true
            },
            small:{
                default:false
            }
        },
        methods:{
            changePage(page){
                this.$emit('current-change',page);
            }
        }
    }
</script>
<style lang="less" scoped>
    
</style>