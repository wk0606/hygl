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
      <component :is="currentTab" :current-tab="currentTab" :page="page" class="order-body-component" ref="order"></component>
      <div>
        <pagination :small="true" :data="page" @current-change="changePage"></pagination>
      </div>
    </div>
    <comments v-if="dialog.show" :views="dialog" @remark-change="updateRemark"></comments>
  </div>
</template>
<script>
import qbdd from './order_qbdd/index'
import wdfh from './order_wdfh/index'
import ddzt from './order_ddzt/index'
import pagination from '../../../components/pagination/index'
import comments from './comments'
export default {
  data(){
    return {
      tabs:[
        {label:'全部订单',component:'qbdd'},
        {label:'网店发货',component:'wdfh'},
        {label:'到店自提',component:'ddzt'}
      ],
      currentTab:'qbdd',
      page:{
          no:1,
          size:10,
          rows:0
      },
      dialog:{
        show:false,
        ddh:'',
        data:null
      }
    }
  },
  methods:{
    changeTab(tab){
      this.page.no=1;
      this.page.rows=0;
      this.currentTab=tab;
    },
    updateRemark(obj){
      this.$refs.order.updateRowRemark(obj.ddh,obj.text);
    },
    changePage(page){
        this.page.no=page;
        this.$refs.order.search();
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm=>{
      if(from.name!='order_details')
        vm.currentTab=vm.tabs[0].component;
    });
  },
  components:{
    qbdd,
    wdfh,
    ddzt,
    pagination,
    comments
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
