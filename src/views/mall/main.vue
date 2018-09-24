<template>
  <div class="c-container">
      <div
        class="c-navs"
        :class="{affix:fixed}"
        ref="navs"
        :style="{left:left+'px'}"
       >
          <div
            class="c-nav-items"
            v-for="item in menus"
            :key="item.label"
          >
            <div><span>{{item.label}}</span></div>
            <ul>
                <router-link 
                    v-for="nav in item.list"
                    :key="nav.label"
                    tag="li"
                    :to="nav.path"
                    active-class="active-menu"
                    :class="{active:setRouterActive(nav)}"
                    @click.native="savePath(nav)"
                >
                    <span>{{nav.label}}</span>
                </router-link>
            </ul>
          </div>
      </div>
      <div class="c-body">
          <keep-alive>
              <router-view ref="view"></router-view>
          </keep-alive>
      </div>
  </div>
</template>
<script>
export default {
  data(){
      return{
          menus:[
              {
                  label:'商品',
                  list:[
                      {label:'网店商品',path:'/main/mall/shop/product_sp'},
                      {label:'新品发布',path:'/main/mall/shop/product_fb'}
                  ]
              },
              {
                  label:'订单',
                  list:[
                      {label:'网店订单',path:'/main/mall/shop/order'}
                  ]
              },
              {
                  label:'资产',
                  list:[
                      {label:'网店交易',path:'/main/mall/shop/asset_jy'}
                  ]
              },
              {
                  label:'设置',
                  list:[
                      {label:'订单设置',path:'/main/mall/shop/set_dd'},
                      {label:'支付/交易',path:'/main/mall/shop/set_jy'},
                      {label:'店铺设置',path:'/main/mall/shop/set_dp'}
                  ]
              }
          ],
          left:0,
          initLeft:0,
          fixed:false
      }
  },
  methods:{
      doScroll(){
          var target=this.$parent.$refs.tabs;
          var rect=target.getBoundingClientRect();
          if(rect.bottom<=0){
             this.left=this.initLeft;
             this.fixed=true;
          }else{
             this.left=0;
             this.fixed=false;
          }
      },
      savePath(obj){
          this.$util.setCache('MALL-PATH',obj.path);
      },
      //一些特殊的规则
      setRouterActive(nav){
          if(this.$route.name=='product_group_add'&&nav.label=='网店商品')
            return true;
          if(this.$route.name=='order_details'&&nav.label=='网店订单')
            return true;
          if(this.$route.name=='set_dd_addkd'&&nav.label=='订单设置')
            return true;
          if(this.$route.name=='set_dprz'&&nav.label=='店铺设置')
            return true;
      }
  },
  mounted(){
    //   let path=this.$util.getCache('MALL-PATH')||'/main/mall/shop/product_sp';
    //   this.$router.push(path);
      this.initLeft=this.$refs.navs.getBoundingClientRect().left;
      window.addEventListener('scroll',this.doScroll,true);
  },
  activated(){
    //   let path=this.$util.getCache('MALL-PATH')||'/main/mall/shop/product_sp';
    //   this.$router.push(path);
      this.initLeft=this.$refs.navs.getBoundingClientRect().left;
      window.addEventListener('scroll',this.doScroll,true);
  },
  deactivated(){
      window.removeEventListener('scroll',this.doScroll,true);
  },
}
</script>
<style lang="less" scoped>
    @import '../../styles/common.less';
    @width:120px;
    .c-container{
        background: #fff;
        display: flex;
        position:relative;
        .c-navs{
            width: @width;
            min-height: 100%;
            box-sizing: border-box;
            border-right: 1px solid @border-color;
            text-align: center;
            background: #fff;
            position: absolute;
            left:0;
            //padding-top: 15px;
            .c-navs-title{
                font-size: 14px;
                color:#3a3a3a;
                padding:15px 0;
                border-bottom: 1px solid @border-color;
            }
        }
        .affix{
            position: fixed;
            top:0;
            z-index: 2;
        }
        .c-nav-items{
            padding: 15px 0;
            color: #999;
            position: relative;
            li{
                width: 90%;
                font-size: 14px;
                color: #3A3A3A;
                margin: 10px auto;
                padding: 7px 0;
                cursor: pointer;
            }
            .active-menu{
                background: #eef1f6;
            }
            .active{
                background: #eef1f6;
            }
            >div:nth-child(1){
                width: 80%;
                height: 7px;
                position: relative;
                margin: 0 auto;
                border-bottom: 1px solid @border-color;
                span{
                    padding: 0 7px;
                    background: #fff;
                    position: relative;
                    z-index: 1;
                }
            }
        }
        .c-body{
            width: 100%;
            height: auto;
            //overflow-y: auto;
            box-sizing: border-box;
            //padding: 10px 10px 10px @width+10;
            padding-left: @width;
            margin-left: -1px;
            >div{
                border-left:1px solid @border-color;
                //border-bottom:1px solid @border-color;
                box-sizing: border-box;
                padding: 10px;
            }
        }
    }
    
    .relative{
        position: relative;
    }
</style>
