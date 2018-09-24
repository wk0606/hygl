<template>
    <pop-up
        title="卖家备注"
        width="500"
        :confirm="save"
        :views="views"
        :loading="load"
    >
        <div class="content" slot="content">
            <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model.trim="text">
            </el-input>
            <div style="padding-top:10px;color:#9c9c9c;">温馨提示：该备注仅作为商家对订单的标记，不会被买家查看到。</div>
        </div>
    </pop-up>
</template>
<script>
import popUp from '../../../components/popUp/index.vue'
export default {
    props:['views'],
    data(){
        return {
            text:'',
            load:false
        }
    },
    methods:{
        save(){
            if(this.text){
                this.load=true;
                this.$http('/api/x6/remarkEdit.do',{
                    ddh:this.views.ddh,
                    remark:this.text
                }).then(res=>{
                    this.load=false;
                    this.views.show=false;
                    this.$emit('remark-change',{
                        ddh:this.views.ddh,
                        text:this.text
                    });
                },err=>{
                    this.load=false;
                });
            }
        }
    },
    mounted(){
        this.text=this.views.data;
    },
    components:{
        popUp
    }
}
</script>
<style lang="less" scoped>

</style>
