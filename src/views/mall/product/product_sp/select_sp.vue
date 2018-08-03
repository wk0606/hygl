<template>
    <pop-up
        title="商品选择"
        width="350"
        :views="views"
        :disabled="goods?false:true"
        :confirm="save"
    >
        <div class="content" slot="content">
            <selector style="width:330px;" :change-on-select="false" @change="selectSuccess"></selector>
        </div>
    </pop-up>
</template>
<script>
import popUp from '../../../../components/popUp/index'
import selector from '../../../../components/goodsSelect/index'
export default {
    props:['views'],
    data(){
        return {
            goods:null
        }
    },
    methods:{
        selectSuccess(item){
            this.goods=item.spdm?item:null;
        },
        save(){
            this.$emit('select',this.goods);
            this.views.show=false;
        }
    },
    components:{
        popUp,
        selector
    }
}
</script>
<style lang="less" scoped>
    .content{
        width: 100%;
    }
</style>
