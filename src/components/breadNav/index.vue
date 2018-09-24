<template>
  <div class="bread-nav">
      <div>
        <div
            v-for="item in data"
            :key="item.label"
        >
            <span v-if="!item.path&&!item.click" style="margin:0 5px 0 10px;">/</span>
            <span :class="{select:item.path||item.click}" @click="openNav(item)">{{item.label}}</span>
        </div>
      </div>
      <i class="iconfont icon-fanhui1" @click="back"></i>
  </div>
</template>
<script>
export default {
  props:['data'],
  methods:{
      openNav(item){
          if(item.click){
              item.click();
          }else{
              if(!item.path)
                return;
              this.$router.push(item.path);
          }
      },
      back(){
          if(this.data[0].click){
              this.data[0].click();
          }else{
              if(!this.data[0].path)
                return;
              this.$router.push(this.data[0].path);
          }
      }
  }
}
</script>
<style lang="less" scoped>
    .bread-nav{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color:#3a3a3a;
        padding: 5px 0 25px 0;
        user-select: none;
        >div:nth-child(1){display: inline-flex;}
        span.select{
            color:#409eff;
            cursor: pointer;
        }
        i{
            font-size: 22px;
            color: #409eff;
            cursor: pointer;
        }
    }
</style>
