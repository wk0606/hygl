<template>
  <div>
    <bread-nav :data="navs"></bread-nav>
  </div>
</template>
<script>
import breadNav from '../../../../../components/breadNav/index'
export default {
  data(){
    return {
      navs:[
          {label:'网点商品',path:'/main/mallchildren/product_sp'},
          {label:'编辑商品'}
      ],
    }
  },
  components:{
    breadNav
  }
}
</script>
<style lang="less" scoped>

</style>
