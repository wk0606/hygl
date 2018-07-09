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
      <!-- <component :is="currentTab"></component> -->
    </div>
  </div>
</template>
<script>

export default {
  data(){
    return {
      tabs:[
        {label:'店铺信息',component:'smzt'},
        {label:'可售仓库',component:'kdfh'},
        {label:'退货/维权设置',component:'jysz'}
      ],
      currentTab:'smzt'
    }
  },
  components:{
    
  }
}
</script>
<style lang="less" scoped>
  .set-body{
    height: ~"calc(100% - 47px)";
    >div{height: 100%;}
  }
</style>
