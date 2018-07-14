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
    <div class="set-body">
      <component :is="currentTab"></component>
    </div>
  </div>
</template>
<script>
import dpxx from './set_dpxx/index'
import ksck from './set_ksck'
import thwq from './set_thwq'
export default {
  data(){
    return {
      tabs:[
        {label:'店铺信息',component:'dpxx'},
        {label:'可售仓库',component:'ksck'},
        {label:'退货/维权设置',component:'thwq'}
      ],
      currentTab:'ksck'
    }
  },
  components:{
    dpxx,
    ksck,
    thwq
  }
}
</script>
<style lang="less" scoped>
  .set-body{
    height: ~"calc(100% - 47px)";
    overflow-y: auto;
    >div{height: 100%;}
  }
</style>
