<template>
  <div>
    <div class="set-title">支付/交易</div>
    <div class="set-jy-bar">
      <span>微信支付-代销</span>
      <!-- <el-switch
        v-model="openPay"
        active-color="#13ce66"
        inactive-color="#ccc">
      </el-switch> -->
    </div>
    <el-collapse-transition>
      <div class="set-jy-description" v-show="openPay">
        <div class="steps" ref="body">
          <div
            v-for="item in steps"
            :key="item.value"
            :class="{arrow:item.value<2,selected:currentStep==item.value,'arrow-left':currentStep-1==item.value}"
          >{{item.label}}</div>
        </div>
        <!-- step 1 -->
        <div v-if="isValidate<2||isValidate==3" class="no-submit">
          <p v-if="isValidate==0">
            您还未提交认证信息,<router-link tag="span" to="/main/mall/shop/set_dprz">点我</router-link>去认证
          </p>
          <div v-else>
            <p style="color:red;margin-bottom:10px;">审核中</p>
            <p>您提交的店铺认证信息还未通过审核,请审核完毕再来配置</p>
          </div>
        </div>

        <!-- step 2 -->
        <div v-if="isValidate==2&&isYzskzh!=2">
          <div class="step2">
            <span>请输入验证金额 :</span>
            <div>
              <p><el-input style="width:300px;" size="mini" v-model="zhje" :disabled="isYzskzh==1" clearable></el-input></p>
              <p><span style="color:#aaa;">1.账户为您店铺认证中填写银行账户</span></p>
              <p><span style="color:#aaa;">2.打款对象为微信财付通</span></p>
              <p style="color:red;" v-if="isYzskzh>0">
                {{isYzskzh==1?'正在验证中,请稍后':'验证不通过,请重新填写验证金额'}}
              </p>
            </div>
          </div>
          <div class="form-save-btn" :style="{width:footerWidth+'px'}">
            <el-button
              size="mini"
              type="primary"
              @click="save"
              :disabled="isYzskzh==1"
              :loading="load"
            >保存</el-button>
          </div>
        </div>

        <div
          v-if="isValidate==2&&isYzskzh==2"
         >
          <div
            style="padding:40px 0;display:flex;align-items:center;justify-content:center;"
          >
            <i class="el-icon-success" style="font-size:40px;color:#67C23A;margin-right:10px;"></i>
            <span>您的店铺已完成认证 , 开通<span style="color:#F56C6C">网店退款</span>请联系我们<span style="color:#67C23A">(0512-67671677)</span></span>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import datePicker from '../../../components/datePicker/index'
import {banks} from '../../../public/wx_bank'
export default {
  data(){
    return {
      openPay:true,
      steps:[
        {label:'填写商户资料',value:0},
        {label:'验证账户金额',value:1},
        {label:'认证完成',value:2},
      ],
      currentStep:0,
      isValidate:0,
      isYzskzh:0,
      zhje:'',
      load:false,
    }
  },
  methods:{
    getDetails(){
      this.$http('/api/x6/getRzjeInfo.do').then(res=>{
        this.isValidate=res.isValidate;
        this.isYzskzh=res.isYzskzh;
        if(this.isValidate==1||this.isValidate==3||this.isValidate==0){
          this.currentStep=0;
        }
        if(this.isValidate==2)
          this.currentStep=this.isYzskzh==2?2:1;
        this.zhje=res.rzje;
      });
    },
    save(){
      if(!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(this.zhje)){
        this.$message('金额格式有误','error');
      }else{
        this.load=true;
        this.$http('/api/x6/saveRzje.do',{
          rzje:parseFloat(this.zhje)
        }).then(res=>{
          this.load=false;
          this.isYzskzh=1;
        },err=>{
          this.load=false;
        });
      }
    }
  },
  activated(){
    this.footerWidth=this.$refs.body.offsetWidth;
    this.getDetails();
  },
  mounted(){
    this.footerWidth=this.$refs.body.offsetWidth;
    this.getDetails();
  },
  components:{
    datePicker
  }
}
</script>
<style lang="less" scoped>
  @import url('./set_jy');
</style>
