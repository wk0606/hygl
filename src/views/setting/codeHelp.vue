<template>
  <pop-up
    title="帮助"
    width="500"
    :views="views"
  >
    <div slot="content" class="content">
        <h3 style="text-align:center;">如何获取客户硬件信息</h3>
        <p>一.客户手机连接本地WiFi，扫描门店二维码，关注小麦铺子公众号后，消费者将收到成为会员的消息</p>
        <div>
            <img src="../../assets/help1.png"/>
            <img src="../../assets/help2.png"/>
        </div>
        <p>二.点开消息后，后台将会获取到消费者硬件信息，并在服务号中推送小程序的入口消息，消费者点开小程序完成登录，以上即为绑定消费者硬件信息全部步骤</p>
        <div>
            <img src="../../assets/help3.png"/>
            <img src="../../assets/help4.png"/>
        </div>
    </div>
    <!-- <div slot="footer" class="footer">
        <el-button size="small"
                   @click="close">关闭
        </el-button>
      </div> -->
  </pop-up>
</template>
<script>
import popUp from '../../components/popUp/index'
export default {
  props:['views'],
  data(){
      return {
          
      }
  },
  methods:{

  },
  components:{
      popUp
  }
}
</script>
<style lang="less" scoped>
    .footer {
        background: #fff;
        padding: 10px;
        text-align: right;
        border-top: 1px solid #ccd0d7;
    }
    .content{
        box-sizing: border-box;
        padding: 10px;
        max-height: 500px;
        overflow-y: auto;
        //h3{padding-bottom: 15px;}
        p{margin: 15px 0;}
        >div{
            display: flex;
            justify-content: space-between;
            img{
                width: 187px;
                height: 300px;
            }
        }
    }
</style>
