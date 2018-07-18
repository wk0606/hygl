<template>
  <div>
    <div class="set-tab">
      <div
        class="set-tab-item"
        v-for="item in tabs"
        :key="item.component"
        :class="{'set-tab-select':item.component==currentTab}"
        @click="currentTab=item.component"
      >{{item.label}}</div>
    </div>
    <div class="product-body">
      <component :is="currentTab"></component>
    </div>
  </div>
</template>
<script>
import wdsp from './product_sp/index'
import spfz from './product_group/index'
export default {
  data(){
    return {
      tabs:[
        {label:'网店商品',component:'wdsp'},
        {label:'商品分组',component:'spfz'}
      ],
      currentTab:'wdsp'
    }
  },
  components:{
    wdsp,
    spfz
  }
}
</script>
<style lang="less" scoped>
  .product-body{
    height: ~"calc(100% - 47px)";
    >div{height: 100%;}
  }
</style>
