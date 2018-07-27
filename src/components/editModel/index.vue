<template>
    <div class="edit-container"
        :style="{width:width+'px'}"
        @click.stop=""
    >
        <div class="edit-title" v-if="title">
            <slot name="title">
                <div>
                    <img src="../../assets/paymentedit.png" width="30"/>
                    <span>{{title}}</span>
                </div>
                <i class="el-icon-close" @click="close"></i>
            </slot>
        </div>
        <div class="el-body" :style="{background:bodyColor}" ref="elBody">
            <slot name="content"></slot>
        </div> 
    </div>
</template>
<script>
export default {
  props:{
      width:{default:400},
      title:{default:'编辑'},
      views:{required:true},
      bodyColor:{default:"#fff"}
  },
  data(){
      return {
          show:false
      }
  },
  methods:{
      /**@augments position ‘top’ 'bottom' */
      scrollTo(position='top'){
          this.$refs.elBody.scrollTop=position=='top'?0:this.$refs.elBody.scrollHeight-this.$refs.elBody.offsetHeight;
      },
      close(){
          this.views.show=false;
          this.show=false;
      }
  },
  mounted(){
      this.show=true;
  }
}
</script>
<style lang="less" scoped>
    @import './index.less';
</style>
