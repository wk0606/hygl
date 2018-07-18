<template>
  <div>
      <div class="set-th">
          <span>售后/维权客服电话 : </span>
          <div>
              <div>
                  <el-input size="mini" placeholder="请填写手机号" style="width:300px;" v-model="details.wqsjh"></el-input>
                  <span>手机号将用于接受卖家维权咨询、维权通知提醒</span>
              </div>
              <div>
                  <el-input size="mini" placeholder="区号" style="width:80px;" v-model="details.wqzjqh"></el-input>
                  <em>-</em>
                  <el-input size="mini" placeholder="座机号码(可不填)" style="width:194px;" v-model="details.wqzjhm"></el-input>
                  <span>优先展示座机号码</span>
              </div>
          </div>
      </div>
      <div>
          <el-button size="mini" type="primary" :disabled="disabled" @click="save">保存</el-button>
      </div>
  </div>
</template>
<script>
export default {
  data(){
      return {
          details:{
              wqsjh:'',
              wqzjhm:'',
              wqzjqh:''
          },
          disabled:true
      }
  },
  watch:{
      details:{
          handler:function(nv){
              if(nv){
                  if(nv.wqsjh||nv.wqzjhm&&nv.wqzjqh)
                    this.disabled=false;
                  else
                    this.disabled=true;
              }
          },
          deep:true
      }
  },
  methods:{
      getPhoneDatas(){
          this.$http('/api/x6/getHyWqSetInfo.do').then(res=>{
              for(let key in this.details){
                  this.details[key]=res.VO[key]||'';
              }
          })
      },
      save(){
          if(this.details.wqsjh!==''&&!this.$util.vartifyPhone(this.details.wqsjh)){
              this.$message('请输入正确的手机号码','error');
              return;
          }
          if(this.details.wqzjhm!==''&&this.details.wqzjqh==''||this.details.wqzjhm==''&&this.details.wqzjqh!==''){
              this.$message('请填写完整区号和座机号','error');
              return;
          }
          this.$http('/api/x6/saveHyWqSetInfo.do',this.details).then(res=>{
            this.$message('保存成功');
          });
      }
  },
  mounted(){
      this.getPhoneDatas();
  }
}
</script>
<style lang="less" scoped>
    .set-th{
        margin-bottom: 20px;
        >span{line-height: 28px;font-size: 14px;margin-right: 10px;}
        display: flex;
        >div{
            flex-grow: 1;
            >div{
                display: flex;
                align-items: center;
                span{
                    margin-left: 10px;
                    color: #999;
                }
                em{margin: 0 10px;}
            }
            >div:first-child{margin-bottom: 20px;}
        }
    }
</style>
