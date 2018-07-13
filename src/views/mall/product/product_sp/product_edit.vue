<template>
  <!-- 既是编辑也是新增 😶 -->
  <div>
    <bread-nav :data="navs"></bread-nav>
    <div class="p-edit-tab">
        <div
            v-for="item in tabs"
            :key="item.value"
            :class="{selected:item.value==currentTab}"
        >{{item.label}}</div>
    </div>
    <component :is="currentTab"></component>
  </div>
</template>
<script>
import breadNav from '../../../../components/breadNav/index'
import information from './product_edit_information'
export default {
  data(){
      return {
          navs:[
              {label:'网店商品',path:'/main/mallchildren/product_sp'},
              {label:'编辑商品'}
          ],
          tabs:[
              {
                label:'1. 编辑基本信息',
                value:'information'
              },
              {
                label:'2. 编辑商品详情',
                value:'details'
              }
          ],
          currentTab:'information',
          
      }
  },
  mounted(){
      
  },
  components:{
      breadNav,
      information
  }
}
</script>
<style lang="less" scoped>
    @gray:#f8f8f8;
    .p-edit-tab{
        width: 100%;
        display: flex;
        >div{
            flex-grow: 1;
            padding: 10px 0;
            text-align: center;
            font-size: 14px;
            border-top:1px solid @gray;
            border-bottom:1px solid @gray;
            border-right:1px solid @gray;
            color: #666;
            font-size: 13px;
            cursor: pointer;
            background: #f0f0f0;
        }
        >div:nth-child(1){border-left:1px solid @gray}
        .selected{
            background: #fff;
            border-bottom: none;
        }
    }
</style>

