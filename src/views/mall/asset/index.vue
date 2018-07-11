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
    <div class="asset-body">
      <component :is="currentTab"></component>
    </div>
  </div>
</template>
<script>
import wdjy from './asset_wdjy'
import jymx from './asset_jymx'
export default {
  data(){
    return {
      tabs:[
        {label:'网点交易',component:'wdjy'},
        {label:'交易明细',component:'jymx'}
      ],
      currentTab:'wdjy',
      date:[],
      datePickes:[
          {label:'今',value:0},
          {label:'昨',value:-1},
          {label:'最近7日',value:-7},
          {label:'最近30日',value:-30},
      ],
      page:{
          no:1,
          size:20,
          rows:0
      }
    }
  },
  mounted(){
      this.date.push(this.$util.getDateByDistance(-7));
      this.date.push(this.$util.getCurrentDate());
  },
  components:{
      wdjy,
      jymx
  }
}
</script>
<style lang="less" scoped>
  .asset-body{
    height: ~"calc(100% - 47px)";
    overflow-y: auto;
    >div{height: 100%;}
  }
  
</style>
