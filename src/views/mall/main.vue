<template>
  <div class="c-container">
      <div class="c-navs">
          <div class="c-navs-title">常用操作</div>
          <div
            class="c-nav-items"
            v-for="item in menus"
            :key="item.label"
          >
            <div>{{item.label}}</div>
            <ul>
                <!-- <li
                    v-for="nav in item.list"
                    :key="nav.label"
                >{{nav.label}}</li> -->
                <router-link 
                    v-for="nav in item.list"
                    :key="nav.label"
                    tag="li"
                    :to="nav.path"
                    active-class="active-menu"
                >
                    <span>{{nav.label}}</span>
                </router-link>
            </ul>
          </div>
      </div>
      <div class="c-body">
          <router-view></router-view>
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
                      {label:'网店商品',path:'/main/mallchildren/sp'}
                  ]
              },
              {
                  label:'订单',
                  list:[
                      {label:'网店订单',path:'/main/mallchildren/dd'}
                  ]
              },
              {
                  label:'资产',
                  list:[
                      {label:'网店资产',path:'/main/mallchildren/zc'},
                      {label:'网店交易',path:'/main/mallchildren/zc'}
                  ]
              },
              {
                  label:'设置',
                  list:[
                      {label:'订单设置',path:'/main/mallchildren/set_dd'},
                      {label:'支付/交易',path:'/main/mallchildren/set_jy'},
                      {label:'店铺设置',path:'/main/mallchildren/set_dp'}
                  ]
              }
          ]
      }
  }
}
</script>
<style lang="less" scoped>
    @import '../../styles/common.less';
    .c-container{
        background: #fff;
        display: flex;
        .c-navs{
            width: 150px;
            height: 100%;
            border-right:1px solid @border-color;
            text-align: center;
            .c-navs-title{
                font-size: 14px;
                color:#3a3a3a;
                padding:15px 0;
                border-bottom: 1px solid @border-color;
            }
        }
        .c-nav-items{
            padding: 15px 0;
            border-bottom: 1px solid @border-color;
            color: #999;
            li{
                width: 90%;
                font-size: 14px;
                color: #3A3A3A;
                margin: 10px auto;
                padding: 7px 0;
                cursor: pointer;
                // background: #eef1f6;
            }
            .active-menu{
                background: #eef1f6;
            }
        }
        .c-body{
            width: ~"calc(100% - 150px)";
            height: 100%;
            overflow-y: auto;
            box-sizing: border-box;
            padding: 10px;
            >div{
                height: 100%;
            }
        }
    }
</style>
