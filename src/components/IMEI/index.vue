<template>
    <pop-up
        title="串号选择"
        width="500"
        :confirm="save"
        :id="id"
        :cancel="close"
    >
        <div slot="content" class="content">
            <el-table
                :data="data"
                border
                max-height="300"
                :highlight-current-row="true"
                cell-class-name="disabled"
                @row-dblclick="handlerDbRow"
                @row-click="handlerRow"
            >
                <el-table-column align="center" type="index"></el-table-column>
                <el-table-column align="center" prop="ch" label="串号"></el-table-column>
            </el-table>
        </div>
    </pop-up>
</template>
<script>
import popUp from '../../components/popUp/index'
import bus from '../../func/eventBus'
export default {
    data(){
        return {
            row:null,
            id:''
        }
    },
    methods:{
       handlerRow(row){
           this.row=row;
       } ,
       handlerDbRow(row){
           bus.$emit('imei-selected',row);
           this.close();
       },
       save(row){
           if(!this.row){
               this.$message('请先选择一行','error');
           }else{
               bus.$emit('imei-selected',this.row);
               this.close();
           }
       },
       close(){
           document.body.removeChild(document.getElementById(this.id));
       }
    },
    mounted(){
         this.id=`imei-${Math.floor(Math.random()*1000000)}`;
    },
    components:{
        popUp
    }
}
</script>
<style lang="less" scoped>
    .disabled{
        background: red !important;
    }
</style>
