<template>
    <real-view :width="width" :height="height" :needClose="needClose" @close="close">
        <div class="preview">
            <img src="../../assets/hdxq.png" width="100%"/>
            <div class="preview-body">
                <div class="preview-title"><b>{{data.title}}</b></div>
                <div class="preview-info" v-if="data.hdfw.length">
                    <span>活动门店：</span>
                    <span style="color:#20A0FF;">{{data.hdfw.length>1?getMdName(data.hdfw[0])+'等门店':getMdName(data.hdfw[0])}}</span>
                </div>
                <div class="preview-info" v-if="data.yxrqq&&data.yxrqz">
                    <span>活动时间：</span>
                    <span>{{getFormatTime(data.yxrqq)+'至'+getFormatTime(data.yxrqz)}}</span>
                </div>
                <div class="simditor">
                    <div class="simditor-body" v-html="data.content"></div>
                </div>
            </div>
            <div class="preview-footer" v-if="data.isfxfk">
                <div>转发有奖</div>
            </div>
        </div>
    </real-view>
</template>
<script>
import realView from '../../components/realView/index'
export default {
  props:['data','width','height','needClose'],
  methods:{
      getMdName(id){
          return this.$util.getCompanyInfo(id).name;
      },
      getFormatTime(d){
            var _D=new Date(d);
            var m=(_D.getMonth()+1)<10?'0'+(_D.getMonth()+1):_D.getMonth()+1;
            var d=_D.getDate()<10?'0'+_D.getDate():_D.getDate();
            var h=_D.getHours()<10?'0'+_D.getHours():_D.getHours();
            var min=_D.getMinutes()<10?'0'+_D.getMinutes():_D.getMinutes();
            var s=_D.getSeconds()<10?'0'+_D.getSeconds():_D.getSeconds();
            return `${_D.getFullYear()}-${m}-${d} ${h}:${min}:${s}`;
      },
      close(){
          this.$emit('close');
      }
  },
  components:{
      realView
  }
}
</script>
<style lang="less" scoped>
    @import './simditor.css';
    .preview{
        width:100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #fff;
        >img{width: 100%;flex-shrink: 0;}
        .preview-body{
            box-sizing: border-box;
            flex-grow: 1;
            box-sizing: border-box;
            overflow-y: auto;
            padding: 0 10px;
            .preview-title{
                flex-shrink: 0;
                font-size: 14px;
                text-align: center;
                margin: 10px 0;
                padding: 0 10px;
            }
            .preview-info{
                flex-shrink: 0;
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                span:nth-child(1){flex-shrink: 0;}
            }
        }
        .preview-footer{
            flex-shrink: 0;
            box-sizing: border-box;
            padding: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            background: #f2f4f9;
            div{
                width: 100%;
                line-height: 30px;
                border-radius: 4px;
                background: #40ba0a;
                text-align: center;
                color: #fff;
            }
        }
    }
</style>
