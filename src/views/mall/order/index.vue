<template>
  <div>
    <div class="set-tab">
      <div
        class="set-tab-item"
        v-for="item in tabs"
        :key="item.component"
        :class="{'set-tab-select':item.component==currentTab}"
        @click="changeTab(item.component)"
      >{{item.label}}</div>
    </div>
    <div class="order-body">
      <component :is="currentTab" :current-tab="currentTab" :page="page" class="order-body-component"></component>
      <div>
        <pagination :small="true" :data="page"></pagination>
      </div>
    </div>
  </div>
</template>
<script>
import qbdd from './order_qbdd/index'
import wdfh from './order_wdfh/index'
import ddzt from './order_ddzt/index'
import pagination from '../../../components/pagination/index'
export default {
  data(){
    return {
      tabs:[
        {label:'全部订单',component:'qbdd'},
        {label:'网店发货',component:'wdfh'},
        {label:'到店自提',component:'ddzt'}
      ],
      currentTab:'wdfh',
      page:{
          no:1,
          size:20,
          rows:0
      }
    }
  },
  methods:{
    changeTab(tab){
      this.page.no=1;
      this.page.rows=0;
      this.currentTab=tab;
    }
  },
  mounted(){
    
  },
  components:{
    qbdd,
    wdfh,
    ddzt,
    pagination
  }
}
</script>
<style lang="less" scoped>
    .order-body{
        height: ~"calc(100% - 47px)";
        overflow-y: auto;
        .order-body-component{height: auto;}
    }
</style>
