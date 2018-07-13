<template>
  <pop-up
    title="修改联系方式"
    width="400"
    :views="views"
  >
    <div class="content" slot="content">
        <div v-if="show">
            <p>验证码已发送至{{this.views.phone.substring(0,3)}}****{{this.views.phone.substring(7)}}</p>
        </div>
        <div v-if="show">
            <el-input size="mini" placeholder="请输入验证码" v-model="yzcode" style="width:200px;margin-right:10px;"></el-input>
            <el-button size="mini" type="primary" :disabled="yzDisabled" style="width:92px;" @click="getYzCode">{{yzText}}</el-button>
        </div>
        <div v-if="!show">
            <el-input size="mini" placeholder="请输入新手机号" v-model="newphone" style="width:292px;margin-right:10px;"></el-input>
        </div>
    </div>
    <el-button
        size="mini"
        type="primary"
        :disabled="!yzcode"
        @click="modifyPhone"
        slot="footer"
        v-if="show"
    >下一步</el-button>
    <el-button slot="footer" size="mini" type="primary" @click="save" v-if="!show">确认</el-button>
  </pop-up>
</template>
<script>
import popUp from '../../../../../components/popUp/index'
export default {
  props:['views'],
  data(){
      return {
          yzcode:'',
          yzText:'获取验证码',
          yzDisabled:false,
          newphone:'',
          show:true
      }
  },
  methods:{
      getYzCode(){
        if(!this.$util.vartifyPhone(this.views.phone)){
            this.$message('当前手机号有误,请关闭后重试','error');
        }else{
            this.yzDisabled=true;
            this.yzText=99;
            var id=setInterval(function(){
                this.yzText--;
                if(this.yzText<0){
                    this.yzText='获取验证码';
                    this.yzDisabled=false;
                    clearInterval(id);
                }
            }.bind(this),1000);
            this.$http('/api/x6/sentCrmDpYzm.do',{
                phone:this.views.phone
            }).then(res=>{

            });
        }
      },
      modifyPhone(){
        this.$http('/api/x6/checkCrmDpYzm.do',{
            phone:this.views.phone,
            code:this.yzcode
        }).then(res=>{
            this.show=false;
        });
      },
      save(){
        if(!this.$util.vartifyPhone(this.newphone)){
            this.$message('请输入正确的手机号码','error');
        }else{
            this.$emit('change',this.newphone);
            this.views.show=false;
        }
      }
  },
  mounted(){
      var start=parseInt(this.$util.getCache('START'));
      var length=parseInt(this.$util.getCache('LENGTH'));
      if(start){
          var distance=new Date().getTime()-this.$util.getCache('START');
          if(distance<length*1000){
              this.yzText=parseInt((length*1000-distance)/1000);
              this.yzDisabled=true;
              var id=setInterval(function(){
                this.yzText--;
                if(this.yzText<0){
                    this.yzText='获取验证码';
                    this.yzDisabled=false;
                    clearInterval(id);
                    this.$util.removeCache('START');
                    this.$util.removeCache('LENGTH');
                }
            }.bind(this),1000);
          }
      }else{
          this.getYzCode();
      }
  },
  destroyed(){
      if(this.yzText!='获取验证码'){
          this.$util.setCache('START',new Date().getTime());
          this.$util.setCache('LENGTH',this.yzText);
      }
  },
  components:{
      popUp
  }
}
</script>
<style lang="less" scoped>
    .content{
        padding: 20px 0;
        >div{
            padding: 10px 0 0 40px;
            box-sizing: border-box;
            //text-align: center;
        }
    }
</style>
