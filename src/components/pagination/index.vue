<template>
    <div class="pagination">
        <el-pagination
            @current-change="changePage"
            :page-size="data.size" 
            :total="data.rows"
            :current-page="data.page"
            layout="total,prev, pager, next,jumper"
        ></el-pagination>
    </div>
</template>
<script>
    export default{
        props:['data'],
        methods:{
            changePage(page){
                this.$emit('current-change',page);
            }
        }
    }
</script>
<style lang="less" scoped>
    
</style>