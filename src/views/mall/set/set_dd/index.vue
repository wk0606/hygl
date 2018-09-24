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
import smzt from './set_smzt/index'
import kdfh from './set_kdfh/index'
import jysz from './set_jysz'
export default {
  data(){
    return {
      tabs:[
        {label:'上门自提',component:'smzt'},
        {label:'快递发货',component:'kdfh'},
        {label:'交易设置',component:'jysz'}
      ],
      currentTab:'smzt'
    }
  },
  activated(){
    
  },
  beforeRouteEnter (to, from, next) {
    next(vm=>{
      if(from.name!='set_dd_addkd')
        vm.currentTab=vm.tabs[0].component;
    });
  },
  components:{
    smzt,
    kdfh,
    jysz,
  }
}
</script>
<style lang="less" scoped>
  .set-body{
    // height: ~"calc(100% - 47px)";
    // >div{height: 100%;}
  }
</style>
