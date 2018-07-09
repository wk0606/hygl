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
        <p>启用麦尔芽微信支付(代销账户),你的店铺可以通过麦佳铺子代销商品，并由你发起提现申请与麦尔芽结算相应货款</p>
        <p><b>提现时间:</b></p>
        <p>当天18点前申请提现,当天审核完成。实际到账时间以银行入账是时间为准。<a>查看收入</a></p>
        <p><b>交易手续费:</b></p>
        <p>麦尔芽不收取任何提现手续费。</p>
        <p>支付机构收取0.6%交易手续费,通过麦尔芽完成代缴。</p>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
export default {
  data(){
    return {
      openPay:true
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
    padding: 10px 10px 30px 20px;
    font-size: 14px;
    border-left:1px solid #e7e7e7;
    border-right:1px solid #e7e7e7;
    border-bottom:1px solid #e7e7e7;
    color: #666;
    p{margin-top: 10px;font-size: 12px;}
    p:nth-child(1){font-size: 14px;}
    p:nth-child(2),p:nth-child(4){margin-top: 30px;}
    p:nth-child(1),p:nth-child(3),p:nth-child(5),p:nth-child(6){color: #888;}
    a{color:#409EFF;}
  }
</style>
