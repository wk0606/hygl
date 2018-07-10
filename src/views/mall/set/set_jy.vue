<template>
  <div>
    <div class="set-title">支付/交易</div>
    <div class="set-jy-bar">
      <span>微信支付-代销<i class="el-icon-caret-top"></i></span>
      <el-switch
        v-model="openPay"
        active-color="#13ce66"
        inactive-color="#ccc">
      </el-switch>
    </div>
    <el-collapse-transition>
      <div class="set-jy-description" v-show="openPay">
        <el-form
          :model="details" :rules="rules" ref="form" label-width="100px"
        >
          <el-form-item label="商户号" prop="shh">
            <el-input v-model="details.shh" size="mini" style="width:300px;"></el-input>
            <span style="font-size:12px;color:#ccc;">请填写微信发给你邮件中的微信号,不是财付通账号</span>
          </el-form-item>
          <el-form-item label="秘钥" prop="secret">
            <el-input v-model="details.secret" size="mini" style="width:300px;"></el-input>
          </el-form-item>
        </el-form>
        <div style="padding-left:100px;margin-top:50px;">
          <el-button size="mini" type="primary" @click="save">保存</el-button>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
export default {
  data(){
    return {
      openPay:true,
      details:{
        shh:'',
        secret:''
      },
      rules:{
        shh:{required:true,message:'商户号不可为空'},
        secret:{required:true,message:'秘钥不可为空'}
      }
    }
  },
  methods:{
    save(){

    }
  }
}
</script>
<style lang="less" scoped>
  .set-title{font-size: 16px;color: #666;margin-bottom: 10px;}
  .set-jy-bar{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    font-size: 14px;
    background: #f8f8f8;
    border:1px solid #e7e7e7;
    color:#666;
    >span{
      cursor: pointer;
      i{margin-left: 5px;}
    }
  }
  .set-jy-description{
    box-sizing: border-box;
    padding: 50px 10px 30px 20px;
    font-size: 14px;
    border-left:1px solid #e7e7e7;
    border-right:1px solid #e7e7e7;
    border-bottom:1px solid #e7e7e7;
    color: #666;    
  }
  .el-row{
    line-height: 0;
  }
</style>
