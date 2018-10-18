<template>
  <div class="mall-container" ref="mall">
      <div class="mall-header">
          <div>
              <div>
                  <b>{{ssgsname}}</b>
                  <div :class="config.isResolveAll?'success':'error'">{{config.isResolveAll?"网店营业中":"网店待开业"}}</div>
              </div>
              <img src="../../assets/book.png" alt="" width="20" :class="{selected:config.show}" @click="config.show=!config.show;">
          </div>
          <el-collapse-transition>
            <div class="mall-header-config" v-show="config.show">
                <div>
                    <span>网店开张</span>
                    <i class="el-icon-close" @click="config.show=false;"></i>
                </div>
                <div>
                    <div class="mall-config-left">
                        <div 
                            v-for="(value,key,index) in config.data"
                            :key="key"
                        >
                            <span>{{`${index+1}.${value.label}`}}</span>
                            <span :class="{success:value.status}">
                              <i :class="value.status?'el-icon-check':'el-icon-close'"></i>{{value.status?'已完成':'未完成'}}
                            </span>
                        </div>
                    </div>
                    <div class="mall-config-right">
                        <div>
                          <p
                            v-for="(text,index) in config.data[currentStep].sub1"
                            :key="index"
                          >{{text}}</p>
                          <p>{{config.data[currentStep].sub2}}</p>
                        </div>
                        <el-button size="mini" @click="openRzcz">{{setBtnText.label}}</el-button>
                    </div>
                </div>
            </div>
          </el-collapse-transition>
      </div>
      <div class="tab" ref="tabs">
        <router-link 
            v-for="nav in tabs"
            :key="nav.value"
            tag="div"
            :to="nav.path"
            active-class="selected"
        >
            <span>{{nav.label}}</span>
        </router-link>
      </div>
      <router-view></router-view>
  </div>
</template>
<script>
import bus from '../../func/eventBus'
export default {
  data() {
    return {
      ssgsname: "",
      //配置科目
      config: {
        show: false,
        isResolveAll:false,//是否全部完成了必选项
        data: {
          isDprz:{ 
            label: "店铺认证", 
            status: 0 ,
            sub1:['开启线上店铺，从店铺认证开始'],
            sub2:''
          },
          isYzskzh:{ 
            label: "验证收款账户", 
            status: 0 ,
            sub1:[],
            sub2:''
          },
          isFbspxx:{ 
            label: "发布网店商品", 
            status: 0 ,
            sub1:['网店开张，将商品发布到线上'],
            sub2:'请至少发布一个商品'
          },
          isSetact:{ 
            label: "设置开业活动", 
            status: 0 ,
            sub1:['网店开张，发布一条活动，可有效地促进成交'],
            sub2:'请至少发布一个活动'
          },
          isDdcj:{ 
            label: "成交第一笔订单", 
            status: 0 ,
            sub1:['恭喜您，完成了基础设置，现在可以开始您的线上零售之旅','为了促成线上订单，我们有如下建议:发布热门商品，发布优惠活动'],
            sub2:'至少完成一笔线上订单'
          },
        }
      },
      currentStep:'isDprz',
      tabs:[
        {label:'概况',value:'ssgk',path:'/main/mall/index'},
        {label:'网店',value:'shop',path:'/main/mall/shop'}
      ],
      currentTab:'ssgk'
    }
  },
  computed:{
    setBtnText(){
      if(!this.config.data.isDprz.status){
        return {label:'去认证',path:'/main/mall/shop/set_dprz'};
      }else if(!this.config.data.isYzskzh.status){
        return {label:'去验证',path:'/main/mall/shop/set_jy'};
      }else if(!this.config.data.isFbspxx.status){
        return {label:'去发布',path:'/main/mall/shop/product_fb'};
      }else if(!this.config.data.isSetact.status){
        return {label:'去设置',path:'/main/activity-add/-1'};
      }else{
        return {label:'去看看',path:'/main/mall/shop/order'};
      }
    }
  },
  methods: {
    //获取帮助
    getHelpDetails(){
      this.$http('/api/x6/getWdkyHelpInfo.do').then(res=>{
        let requirePass=['isDprz','isYzskzh','isFbspxx'];
        let count=0;
        for(let key in res.VO){
          this.config.data[key].status=res.VO[key];
          if(requirePass.indexOf(key)>-1)
            count+=res.VO[key];
        }
        this.config.show=count==requirePass.length?false:true;
        this.config.isResolveAll=count==requirePass.length?true:false;
      });
    },
    openPath(item){
      this.currentTab=item.value;
      this.$router.push(item.path);
    },
    openRzcz(){
      this.$router.push(this.setBtnText.path);
    },
    busListener(){
      bus.$on('scroll-to-bottom',()=>{
        if(this.$refs.mall.scrollHeight>this.$refs.mall.offsetHeight){
          this.$refs.mall.scrollTop=this.$refs.mall.scrollHeight-this.$refs.mall.offsetHeight;
        }
      });
    }
  },
  mounted(){
    this.ssgsname = this.$util.getCache("user").ssgsname;
    this.getHelpDetails();
    this.busListener();
  },
  activated(){
    this.ssgsname = this.$util.getCache("user").ssgsname;
    this.getHelpDetails();
    this.busListener();
  }
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
