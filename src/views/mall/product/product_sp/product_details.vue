<template>
  <div class="details-body" :style="{height:height+'px'}">
      <div
        :style="{width:width+'px'}"
        class="d-preview"
      >
        <img src="../../../../assets/mobilenav.png" alt="">
        <div class="d-main">
            <div class="d-header">
                <p><b>基本信息区</b></p>
                <p>固定样式,显示商品主图、价格等信息</p>
            </div>
            <div class="d-img">
                
            </div>
        </div>
      </div>
      <div
        :style="{width:width+'px'}"
      >
        <div class="d-textarea">
            <div>商品简介</div>
            <div class="d-textarea-body">
                <textarea rows="5" maxlength="100" v-model="details.spjj"></textarea>
                <p>
                    <span>{{details.spjj.length}}/100</span>
                </p>
            </div>
            <p>选填,微信分享给好友时会显示这里的文案。</p>
        </div>
        <div class="d-textarea d-textarea-edit">
            <div>商品卖点</div>
            <div class="d-textarea-body">
                <textarea rows="5" maxlength="50" v-model="details.spmd"></textarea>
                <p>
                    <span>{{details.spmd.length}}/50</span>
                </p>
            </div>
            <p>在商品详情页下面展示卖点,建议50字以内。</p>
        </div>
        <div>
            <el-button
                size="mini"
                icon="el-icon-upload"
            >上传商品详情图片</el-button>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  props:['height'],
  data(){
      return {
          width:0,
          details:{
              spjj:'',
              spmd:'',
              sppic:[]
          }
      }
  },
  mounted(){
      this.width=9*this.height/16;
      console.log(this.width)
  }
}
</script>
<style lang="less" scoped>
    @bgcolor:#ddd;
    .details-body{
        display: flex;
        justify-content: center;
        height: 100%;
        box-sizing: border-box;
        padding-top: 10px;
        min-height: 480px;
        overflow-y: auto;
        >div{
            height: 100%;
            margin: 0 10px;
            box-sizing: border-box;
        }
        //border: 1px solid @bgcolor;
        .d-preview{
            border: 1px solid @bgcolor;
            >img{
                width: 100%;
                height: auto;
            }
            .d-main{
                height: ~"calc(100% - 44px)";
                margin-top: -5px;
                overflow-y: auto;
                .d-header{
                    background: #e5e5e5;
                    height: 30%;
                    color: #aaa;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    b{
                        font-size: 14px;
                        color: #6e6e6e;
                    }
                    p:nth-child(1){margin-bottom: 10px;}
                }
                .d-img{
                    box-sizing: border-box;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    img{
                        width: 100%;
                        height: auto;
                        font-size: 0;
                    }
                }
            }
        }
        .d-textarea{
            box-sizing: border-box;
            padding: 10px;
            background: #f8f8f8;
            border: 1px solid #dbdbdb;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            p{
                color: #aaa;
            }
            .d-textarea-body{
                border: 1px solid #dbdbdb;
                margin:10px 0;
                width:100%;
                display: flex;
                flex-direction: column;
                textarea{
                    width:100%;
                    padding: 5px;
                    font-size: 12px;
                    font-family: 'microsoft yahei';
                    box-sizing: border-box;
                    border:none;
                }
                >p{
                    text-align: right;
                    background: #fff;
                    padding: 5px;
                    box-sizing: border-box;

                }
            }
            
        }
        .d-textarea-edit{
            overflow-y: auto;
        }
    }
</style>
