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
    <div class="order-body">
      <component :is="currentTab"></component>
    </div>
  </div>
</template>
<script>
import qbdd from './order_qbdd/index'
import wdfh from './order_wdfh/index'
import ddzt from './order_ddzt/index'
export default {
  data(){
    return {
      tabs:[
        {label:'全部订单',component:'qbdd'},
        {label:'网店发货',component:'wdfh'},
        {label:'到店自提',component:'ddzt'}
      ],
      currentTab:'qbdd'
    }
  },
  mounted(){
    
  },
  components:{
    qbdd,
    wdfh,
    ddzt
  }
}
</script>
<style lang="less" scoped>
    .order-body{
        height: ~"calc(100% - 47px)";
        overflow-y: auto;
        >div{height: 100%;}
    }
</style>
