<template>
	<div class="container">
		<div class="nav-body">
			<div class="container-left">
				<!-- <img src="../../assets/mjlogo.png" alt="" width="60"> -->
        <div
          class="logo"
          @mouseenter="logoShow=true"
          @mouseleave="closeLogoMenu"
          :style="{backgroundImage:'url('+$store.getters.getShopImg+')'}"
        >
          <!-- v-if="logoShow" -->
          <div class="logo-menu" v-if="logoShow" @mouseenter="clearTimeout">
            <div @click="openDpSet">
              <b>店铺设置</b>
              <i class="el-icon-arrow-right"></i>
            </div>
            <div>
              <p>{{username}}</p>
              <p>{{phone}}</p>
            </div>
            <div class="arrow"></div>
          </div>
        </div>
				<div class="menu">
					<ul ref="navs">
						<router-link v-for="(nav,index) in menus" :key="index" tag="li" :to="nav.path" active-class="active-menu">
							<i class="iconfont" :class="nav.icon"></i>
							<b>{{nav.name}}</b>
						</router-link>
					</ul>
				</div>
				<div class="footer">	
					<div class='kefu'>
						<notify></notify>
					</div>
				</div>
			</div>
			<div class="container-right">
				<div class="view" ref="view">
					<router-view></router-view>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import notify from '../notify/index'
export default {
  name: "hy_index",
  data() {
    return {
      menus: [
        {
          name: "首页",
          icon: "icon-shouye1",
          path: "/main/mall"
        },
        {
          name: "活动",
          icon: "icon-huodong11",
          path: "/main/activity"
        },
        {
          name: "客户",
          icon: "icon-kehu1",
          path: "/main/client"
        },
        {
          name: "客流",
          icon: "icon-icon_keliujiance",
          path: "/main/box"
        },
        {
          name: "数据",
          icon: "icon-huodong1",
          path: "/main/statistics"
        },
        {
          name: "评价",
          icon: "icon-pingjia1",
          path: "/main/comments"
        },
        {
          name: "门店",
          icon: "icon-ditu-copy",
          path: "/main/setting"
        }
      ],
      username: "",
      phone:'',
      logoShow:false,
      timeout:null
    };
  },
  methods: {
    //打开客服
    openKefu() {
      window.open(
        "http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDA3MzcyM18xNzU0OTRfODAwMDczNzIzXzJf"
      );
    },
    closeLogoMenu(){
      this.timeout=setTimeout(()=>{
        this.logoShow=false;
      },300);
    },
    clearTimeout(){
      clearTimeout(this.timeout);
    },
    openDpSet(){
      this.logoShow=false;
      this.$router.push('/main/mall/shop/set_dp');
    }
  },
  mounted() {
    this.$refs.navs.style.maxHeight =
      this.menus.length * 51 + (this.menus.length - 1) * 15 + "px";
    this.$util.requestAllCache(this.$http,()=>{
      this.$store.commit('updateShopImg',this.$util.getCache('dptpUrl'));
    });
    this.username = this.$util.getCache("user").name;
    this.phone = this.$util.getCache("user").phone;
  },
  components:{
	  notify
  }
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>