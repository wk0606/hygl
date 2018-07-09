<template>
  <edit-model
    width="500"
    :title="views.data.title"
    :views="views"
    class="edit"
  >
    <div slot="content" class="content">
      <div class="c-rate">
        <span>评分 : </span>
        <el-rate
            v-model="getComments.rate"
            disabled>
        </el-rate>
      </div>
      <div class="c-text">{{getComments.content}}</div>
      <div class="c-imgs">
        <div
          v-for="item in getComments.pics"
          :key="item"
          :style="{backgroundImage:'url('+item+')'}"
        ></div>
      </div>
    </div>
  </edit-model>
</template>
<script>
import editModel from '../../components/editModel/index'
export default {
  props:['views'],
  computed:{
    getComments(){
      var ratekey='rate'+this.views.index;
      var pickey='rate'+this.views.index+'pic';
      var ctxkey='ratecontent'+this.views.index;
      return {
        rate:this.views.data[ratekey],
        content:this.views.data[ctxkey],
        pics:this.views.data[pickey]?this.views.data[pickey].split(','):[]
      }
    }
  },
  mounted(){
   
  },
  components:{
      editModel
  }
}
</script>
<style lang="less" scoped>
    @size:50px;
    .content{
      width: 100%;
      .c-rate{
        display: flex;
        align-items: center;
        span{margin-right: 10px;}
      }
      .c-imgs{
        display: flex;
        div{
          width: 144px;
          height: 144px;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
        }
        div:nth-child(2){
          margin: 0 10px;
        }
      }
      .c-text{
        margin: 20px 0;
      }
    }
</style>
