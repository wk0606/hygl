<template>
  <div class="bread-nav">
      <div
        v-for="item in data"
        :key="item.label"
      >
        <span v-if="!item.path" style="margin:0 5px 0 10px;">/</span>
        <span :class="{select:item.path}" @click="openNav(item)">{{item.label}}</span>
      </div>
  </div>
</template>
<script>
export default {
  props:['data'],
  methods:{
      openNav(item){
          if(!item.path)
            return;
          this.$router.push(item.path);
      }
  }
}
</script>
<style lang="less" scoped>
    .bread-nav{
        display: flex;
        align-items: center;
        font-size: 14px;
        color:#3a3a3a;
        padding: 5px 0 15px 0;
        span.select{
            color:#409eff;
            cursor: pointer;
        }
    }
</style>
