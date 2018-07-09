<template>
  <div>
      <div class="set-th">
          <span>售后/维权客服电话 : </span>
          <div>
              <div>
                  <el-input size="mini" placeholder="请填写手机号" style="width:300px;"></el-input>
                  <span>手机号将用于接受卖家维权咨询、维权通知提醒</span>
              </div>
              <div>
                  <el-input size="mini" placeholder="区号" style="width:80px;"></el-input>
                  <em>-</em>
                  <el-input size="mini" placeholder="座机号码(可不填)" style="width:194px;"></el-input>
                  <span>优先展示座机号码</span>
              </div>
          </div>
      </div>
      <div>
          <el-button size="mini" type="primary">保存</el-button>
      </div>
  </div>
</template>
<script>
export default {
  
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
