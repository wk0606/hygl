<template>
  <div class="sms-code" :class="{disabled:disabled}" @click="getCode">
      {{yzText}}
  </div>
</template>
<script>
export default {
  props:['phone'],
  data(){
      return {
          yzText:'获取验证码',
          disabled:false
      }
  },
  methods:{
      getCode(){
        if(!this.$util.vartifyPhone(this.phone)){
            this.$message('手机号获取出错,请完善手机号!');
        }else{
            this.yzText=99;
            this.disabled=true;
            var id=setInterval(function(){
                this.yzText--;
                if(this.yzText<0){
                    this.yzText='获取验证码';
                    this.disabled=false;
                    clearInterval(id);
                }
            }.bind(this),1000);
            this.$http('/api/x6/sentCrmDpYzm.do',{
                phone:this.phone
            }).then(res=>{});
        }
      }
  }
}
</script>
<style lang="less" scoped>
    .sms-code{
        width: 80px;
        height: 100%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        //padding: 0 10px;
        color: #fff;
        background: #398bfc;
        cursor: pointer;
    }
    .disabled{
        background: #ccc;
        cursor: not-allowed;
    }
</style>
