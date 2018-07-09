<template>
  <div>
      <div class="jy-items">
          <div class="jy-items-border"><b>待付款订单取消时间设置</b></div>
          <div>
              <span>拍下订单后</span>
              <input-number v-model="fksj" :arrow-control="false" style="margin:0 10px;"></input-number>
              <span>分钟内未付款,自动取消订单.</span>
          </div>
      </div>
      <div class="jy-items">
          <div class="jy-items-border"><b>发货后自动确认时间设置</b></div>
          <div>
              <span>发货后</span>
              <input-number v-model="fksj" :arrow-control="false" style="margin:0 10px;"></input-number>
              <span>天,自动确认收货.</span>
          </div>
      </div>
      <div class="jy-items">
          <el-button size="mini" type="primary" @click="open">保存</el-button>
      </div>
  </div>
</template>
<script>
import inputNumber from '../../../../components/inputNumber/index'
export default {
  data(){
      return {
          fksj:0,
          qrsj:6
      }
  },
  methods:{
      open(){
          this.$router.push('/main/mallchildren/set_jy/5')
      }
  },
  components:{
      inputNumber
  }
}
</script>
<style lang="less" scoped>
    .jy-items{
        margin-bottom: 30px;
        box-sizing: border-box;
        padding-left: 20px;
        >div{
            padding: 0px 7px ;
            margin: 10px 0;
            display: flex;
            align-items: center;
        }
        
    }
    .jy-items-border{
        border-left:2px solid #fd7732;
    }
</style>
