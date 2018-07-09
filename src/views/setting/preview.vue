<template>
  <div class="preview-container">
    <div>
      <img src='../../assets/yl1.png'/>
      <div class="preview-body" :style="{backgroundImage:'url('+views.url+')'}">
          <b v-if="!views.url">暂未上传</b>
      </div>
      <img src='../../assets/yl2.png'/>
      <div class="close" @click="close">
				<i class="el-icon-close"></i>
			</div>
    </div>
  </div>
</template>
<script>
export default {
  props:['views'],
  methods:{
    close(){
      this.views.show=false;
    }
  }
}
</script>
<style lang="less" scoped>
  .preview-container{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    position: fixed;
    top:0;
    left:0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    >div{
      width: 300px;
      height: auto;
      background: #fff;
      display: inline-flex;
      flex-direction: column;
      position: relative;
      img{width: 100%;}
      .preview-body{
        width: 100%;
        height: 130px;
        background: #f4f9f4;
        color: #bbb;
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-size: cover;
        background-position: center center;
      }
      .close{
				position: absolute;
				right: -9px;
				top:-9px;
				width: 20px;
				height: 20px;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #ccc;
				color: red;
				cursor: pointer; 
				font-size: 12px;
				i{transform: scale(.7);}
			}
    }
  }
</style>
