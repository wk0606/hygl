<template>
  <div style="position:relative;">
    <div class="set-tab" v-show="!editShow">
      <div
        class="set-tab-item"
        v-for="item in tabs"
        :key="item.component"
        :class="{'set-tab-select':item.component==currentTab}"
        @click="currentTab=item.component"
      >{{item.label}}</div>
    </div>
    <div class="product-body" v-show="!editShow">
      <component :is="currentTab" ref="shop"></component>
    </div>
    <!-- 商品编辑组件  蛋疼的设计！！！ -->
    <product-edit class="p-edit" v-if="editShow" :id="pID" :yxbz="pYxbz" need-bread-nav></product-edit>
  </div>
</template>
<script>
import wdsp from "./product_sp/index";
import spfz from "./product_group/index";
import wdyl from './shop_view'
import productEdit from './product_sp/product_edit'
export default {
  data() {
    return {
      tabs: [
        { label: "网店商品", component: "wdsp" },
        { label: "商品分组", component: "spfz" },
        { label: "网店预览", component: "wdyl" }
      ],
      currentTab: "wdsp",
      editShow:false,//是否打开编辑页面
      pID:-1,//待编辑商品的id
      pYxbz:0,//待编辑商品的yxbz
    };
  },
  methods:{
    refreshList(){
      if(this.currentTab=='wdsp')
        this.$refs.shop.getList();
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm=>{
      if(from.name!='product_group_add')
        vm.currentTab=vm.tabs[0].component;
    });
  },
  components: {
    wdsp,
    spfz,
    wdyl,
    productEdit
  }
};
</script>
<style lang="less" scoped>
  .p-edit{
    width: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
  }
</style>
