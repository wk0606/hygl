<template>
  <div>
    <div class="asset-body">
      <component :is="currentTab"></component>
    </div>
  </div>
</template>
<script>
import wdjy from './asset_wdjy'
//import jymx from './asset_jymx'
export default {
  data(){
    return {
      tabs:[
        {label:'网店交易',component:'wdjy'},
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
      wdjy
  }
}
</script>
<style lang="less" scoped>
  .asset-body{
    height: 100%;
    overflow-y: auto;
    >div{height: 100%;}
  }
  
</style>
