<template>
	<div class="container">
		<div class="nav-header">
			<div class='nav-header-logo'>
				<img src="../../assets/miyalogo.png" width="55"/>
				<span class="title">麦芽盒子</span>
			</div>		
			<div class="nav-header-right">
				<div class="nav-header-touxiang">
					<img :src="$util.getUserInfo().userpic" width="40" alt="tx" v-if="$util.getUserInfo().userpic">
					<span v-if="!$util.getUserInfo().userpic && $util.getUserInfo().name">
						{{$util.getUserInfo().name.substring($util.getUserInfo().name.length - 2)}}
					</span>
				</div>
			</div>
		</div>
		<div class="nav-body">
			<div class="container-left">
				<div class="menu">
					<ul ref="navs">
						<router-link v-for="(nav,index) in menus" :key="index" tag="li" :to="nav.path" active-class="active-menu">
							<i class="iconfont" :class="nav.icon"></i>
							<span>{{nav.name}}</span>
						</router-link>
					</ul>
				</div>
				<div class="footer">	
					<div class='kefu' @click="openKefu" style="cursor:pointer;">
						<i class="iconfont icon-kefu"></i>专属客服
					</div>
				</div>
			</div>
			<div class="container-right">
				<div class="view">
					<keep-alive>
                        <router-view></router-view>
                    </keep-alive>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		name:'hy_index',
		data(){
			return{
				menus:[
					{
						name: '主页',
						icon: 'icon-zhuye',
						path: '/main/charts'
					},
					{
						name: '我的客户',
						icon: 'icon-kehu',
						path: '/main/client'
					},
					{
						name: '客流量统计',
						icon: 'icon-tongji',
						path: '/main/box'
					},
					{
						name: '活动/政策',
						icon: 'icon-huodong',
						path: '/main/activity'
					},
					{
						name: '统计报表',
						icon: 'icon-baobiao',
						path: '/main/statistics'
					},
					{
						name: '评价',
						icon: 'icon-icon_me_evaluate_s',
						path: '/main/comments'
					},
					{
						name: '门店地图',
						icon: 'icon-ditu-copy',
						path: '/main/setting'
					},
					{
						name: '微商城',
						icon: 'icon-weixin',
						path: '/main/mall'
					}
				]
			}
		},
		methods:{
			//打开客服
			openKefu() {
				window.open("http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDA3MzcyM18xNzU0OTRfODAwMDczNzIzXzJf");
				// if (isQtclient) {
				// 	new QWebChannel(qt.webChannelTransport, function (channel) {
				// 		var content = channel.objects.content;
				// 		content.openQq();
				// 	});
				// } else {
				// 	window.open("http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDA3MzcyM18xNzU0OTRfODAwMDczNzIzXzJf");
				// }
			}
		},
		mounted(){
			this.$refs.navs.style.maxHeight=this.menus.length*51+(this.menus.length-1)*15+'px';
		}
	}
</script>
<style lang="less" scoped>
	@import './index.less';
</style>