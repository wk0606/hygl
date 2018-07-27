<template>
  <edit-model
    width="500"
    :title="false"
    :views="views"
    class="edit"
  >
    <div slot="content" class="content">
      <div
        v-for="(item,index) in views.data"
        :key="index"
        class="c-body"
      >
        <div class="c-title">
          <div>
            <i class="iconfont" :class="item.icon" :style="{color:item.color}"></i>
            <span>{{item.title}}</span>
          </div>
          <i class="el-icon-close" v-if="!index" @click="views.show=false"></i>
        </div>
        <div class="c-rate">
          <span>评分 : </span>
          <el-rate
              v-model="item.rate"
              disabled>
          </el-rate>
        </div>
        <div class="c-text">{{item.content}}</div>
        <div class="c-imgs">
          <div
            v-for="pic in item.pics"
            :key="pic"
            :style="{backgroundImage:'url('+pic+')'}"
          ></div>
        </div>
      </div>
    </div>
  </edit-model>
</template>
<script>
import editModel from '../../components/editModel/index'
export default {
  props:['views'],
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
      .c-body{
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 10px;
      }
      .c-title{
        display: flex;
        padding: 10px 0;
        font-size: 13px;
        justify-content: space-between;
        align-items: center;
        div{
          display: inline-flex;
          align-items: center;
          i{
            margin-right: 5px;
            font-size: 20px;
          }
          span{color:#555;}
        }
        >i{
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          color: #aaa;
        }
      }
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
