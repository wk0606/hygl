<template>
  <div>
    <bread-nav :data="navs"></bread-nav>
    <div class="g-add-body" ref="body">
      <div :style="{width:width+'px'}" class="g-add-left">
        <img src="../../../../assets/mobilenav.png" alt="" ref="img">
        <div class="g-add-header">
          <b>{{name}}</b>
        </div>
        <div class="g-add-main">
          <div>
            <img src="../../../../assets/help2.png" alt="">
            <div class="g-footer">￥ 999.00</div>
          </div>
          <div>
            <img src="../../../../assets/help2.png" alt="">
            <div class="g-footer">￥ 999.00</div>
          </div>
          <div>
            <img src="../../../../assets/help2.png" alt="">
            <div class="g-footer">￥ 999.00</div>
          </div>
          <div>
            <img src="../../../../assets/help2.png" alt="">
            <div class="g-footer">￥ 999.00</div>
          </div>
        </div>
      </div>
      <div :style="{width:width+'px'}" class="g-add-right">
        <div :style="{top:scrollTop+'px'}">
          <span><i style="color:red;">*</i>分组名称 ：</span>
          <el-input size="mini" v-model="name" style="width:150px;"></el-input>
        </div>
      </div>
    </div>
    <div class="g-add-bottom">
      <el-button size="mini" type="primary">保存</el-button>
      <el-button size="mini">取消</el-button>
    </div>
  </div>
</template>
<script>
import breadNav from '../../../../components/breadNav/index'
export default {
  data(){
    return {
      navs:[
          {label:'网店商品',path:'/main/mallchildren/product_sp'},
          {label:'编辑商品'}
      ],
      width:0,
      scrollTop:0,
      name:'',
      List:[
        {url:''}
      ]
    }
  },
  activated(){
    this.width=this.$refs.body.offsetHeight*9/16;
    setTimeout(()=>{
      this.scrollTop=this.$refs.img.offsetHeight;
    },0)
  },
  components:{
    breadNav
  }
}
</script>
<style lang="less" scoped>
  .g-add-body{
    height:~"calc(100% - 93px)";
    display: flex;
    justify-content: center;
    >div{
      margin: 0 20px;
      height:100%;
      box-sizing: border-box;
      img{
        width: 100%;
        height:auto;
      }
    }
    .g-add-left{
      border:1px solid #f2f2f2;
      background: #f8f8f8;
      position: relative;
      .g-add-header{
        height: 35px;
        line-height: 35px;
        background: #fff;
        text-align: center;
        font-size: 13px;
      }
      .g-add-main{
        box-sizing: border-box;
        //padding: 10px;
        padding: 0 10px 10px 0;
        height: ~"calc(100% - 86px)";
        display: flex;
        flex-wrap: wrap;
        >div{
          width:50%;
          height: 50%;
          border-top:10px solid #f8f8f8;
          border-left:10px solid #f8f8f8;
          background: #fff;
          box-sizing: border-box;
          img{
            display: block;
            width: 100%;
            height: 80%;
          }
          .g-footer{
            height: 20%;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: red;
            box-sizing: border-box;
            padding: 0 10px;
          }
        }
      }
    }
    .g-add-right{
      position: relative;
      >div{
        width: 100%;
        height: auto;
        box-sizing: border-box;
        padding: 10px;
        background: #f8f8f8;
        border: 1px solid #f2f2f2;
        border-radius: 4px;
        position: relative;
        &:before{
          content: '';
          display: block;
          width: 0;
          height: 0;
          border: 7px solid transparent;
          border-right: 7px solid #f8f8f8;
          position: absolute;
          top:50%;
          left: -14px;
          transform: translateY(-50%);
        }
      }
    }
  }
  .g-add-bottom{
    background: #f8f8f8;
    padding: 10px 0;
    text-align: center;
    margin-top:10px;
  }
</style>
