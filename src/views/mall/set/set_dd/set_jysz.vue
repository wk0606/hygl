<template>
  <div>
      <div class="jy-items">
          <div class="jy-items-border"><b>待付款订单取消时间设置</b></div>
          <div>
              <span>拍下订单后</span>
              <input-number v-model="details.ddqxsj" :arrow-control="false" style="margin:0 10px;" @blur="round('ddqxsj')" :min="5"></input-number>
              <span>分钟内未付款,自动取消订单.</span>
          </div>
      </div>
      <div class="jy-items">
          <div class="jy-items-border"><b>发货后自动确认时间设置</b></div>
          <div>
              <span>发货后</span>
              <input-number v-model="details.zdqrsj" :arrow-control="false" style="margin:0 10px;" @blur="round('zdqrsj')" :min="1"></input-number>
              <span>天,自动确认收货.</span>
          </div>
      </div>
      <!-- <div class="jy-items">
          <div class="jy-items-border"><b>退款路径设置</b></div>
          <div>
              <span style="margin-right:10px;">是否允许线上退款</span>
              <el-switch
                v-model="tklj"
                active-color="#13ce66"
                :active-value="1"
                :inactive-value="0"
                @change="setTk">
              </el-switch>
          </div>
      </div> -->
      <div class="jy-items">
          <el-button size="mini" type="primary" :loading="load" @click="save">保存</el-button>
      </div>
  </div>
</template>
<script>
import inputNumber from '../../../../components/inputNumber/index'
export default {
  data(){
      return {
          details:{
              ddqxsj:15,
              zdqrsj:7
          },
          tklj:0,
          load:false
      }
  },
  methods:{
      setTk(){
          this.$http('/api/x6/isAgreeXstk.do',{
              isXstk:this.tklj
          }).then(res=>{
              this.$message(this.tklj?'已开启线上退款服务':'已关闭线上退款服务');
          });
      },
      getDetails(){
          this.$http('/api/x6/getHyJySetInfo.do').then(res=>{
              this.details=res.VO;
          });
      },
      save(){
          this.load=true;
          this.$http('/api/x6/saveHyJySetInfo.do',this.details).then(res=>{
             this.load=false;
             this.$message('保存成功');
          },err=>{
              this.load=false;
          });
      },
      round(key){
          this.details[key]=Math.round(this.details[key]);
      }
  },
  mounted(){
      this.getDetails();
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
