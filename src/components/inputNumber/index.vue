<template>
  <div class="input-number">
      <i v-if="icon" :class="icon"></i>
      <p><input type="number" v-model="val" @change="changeValue" :style="{textAlign:align}"></p>
      <div v-if="arrowControl">
          <i class="el-icon-caret-top" @click="calc('add')"></i>
          <i class="el-icon-caret-bottom" @click="calc('sub')"></i>
      </div>
  </div>
</template>
<script>
export default {
  props:{
      icon:{
          default:''
      },
      value:{required:true},
      max:{default:null},
      min:{default:0},
      align:{default:'left'},
      arrowControl:{default:true}
  },
  data(){
      return {
          val:this.value
      }
  },
  watch:{
      value(nv){
          this.val=nv;
      }
  },
  methods:{
      calc(type){
          this.val=parseInt(this.val);
          if(type=='add'){
              if(this.max!==null){
                  if(this.val>=this.max)
                    this.val=this.min;
                  else
                    this.val=this.val+1;
              }else 
                this.val=this.val+1;
          }else{
              if(this.val<=this.min){
                  if(this.max!==null)
                    this.val=this.max;
                  else
                    this.val=this.min;
              }else
                this.val=this.val-1;
          }  
          this.$emit('input',this.val);
      },
      changeValue(){
          this.val=parseFloat(this.val);
          var max=parseFloat(this.max);
          var min=parseFloat(this.min);
          if(this.max!==null&&this.val>max)
            this.val=max;
          if(this.min!==null&&this.val<min)
            this.val=min;
          this.val=this.val||0;
          this.$emit('input',parseFloat(this.val));
      }
  },
  mounted(){
      if(this.min){
          this.val=this.min;
          this.$emit('input',this.val);
      }
  }
}
</script>
<style lang="less" scoped>
    .input-number{
        display: inline-flex;
        align-items: center;
        width: 60px;
        height: 28px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 5px;
        background: #fff;
        p{flex-grow: 1;}
        >i{margin-right: 5px;}
        input{
            //width: ~"calc(100% - 14px)";
            width: 100%;
            //flex-grow: 1;
            border: none;
        }
        >div{
            display: inline-flex;
            flex-direction: column;
            flex-shrink: 0;
            i{  
                cursor: pointer;
                &:hover{
                    color:#F56C6C;
                }
            }
        }
    }
</style>
