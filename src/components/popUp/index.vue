<template>
  <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
        <div class="p-container" v-if="views.show">
            <div
                :style="{width:width+'px'}"
                ref="content"
                v-drag
            >
                <div class="p-title">
                    <div>
                        <span>{{title}}</span>
                        <span v-if="titleSub" class="title-sub">{{titleSub}}</span>
                    </div>
                    <i class="el-icon-close" @click="close"></i>
                </div>
                <div class="p-content">
                    <slot name="content"></slot>
                </div>
                <div class="p-footer">
                    <slot name="footer"></slot>
                    <el-button type="primary" size="mini" v-if="confirm" @click="confirm" :loading="loading">{{confirmText}}</el-button>
                    <el-button size="mini" @click="close">{{cancelText}}</el-button>
                </div>
            </div>
        </div>
  </transition>
</template>
<script>
export default {
  props:{
      title:{default:'提示'},
      titleSub:{default:''},
      width:{default:500},
      confirm:{default:null},
      cancel:{default:null},
      loading:{default:false},
      cancelText:{
          default:'关闭'
      },
      confirmText:{
          default:'确认'
      },
      views:{
          default:function(){
              return {
                  show:true,
                  name:''
              }
          }
      }
  },
  methods:{
      close(){
          if(!this.cancel){
              this.views.show=false;
              this.views.name='';
          }else{
              this.cancel();
          }
      }
  },
  directives: {
      drag: {
        inserted(el, bind){
          el.style.left = (document.body.offsetWidth - el.offsetWidth) / 2 + 'px';
          el.style.top = (document.body.offsetHeight - el.offsetHeight) / 2 + 'px';
          let target = el.children[0];
          let sx, sy;
          let canmove = false;
          target.addEventListener('mousedown', start);
          function start () {
            sx = event.clientX;
            sy = event.clientY;
            target.addEventListener('mousemove', move);
            target.addEventListener('mouseup', end);
            target.addEventListener('mouseout', outside);
            target.addEventListener('blur', blur);
            el.style.cursor = 'move';
            canmove = true;

          };
          function move () {
            if (canmove) {
              el.style.left = parseInt(el.style.left) + (event.clientX - sx)+'px';
              el.style.top = parseInt(el.style.top) + (event.clientY - sy)+'px';
              sx = event.clientX;
              sy = event.clientY;
            }
          };
          function outside(){
            target.removeEventListener('mousemove', move);
            target.removeEventListener('mouseup', end);
          }
          function end () {
            canmove = false;
            el.style.cursor = 'default';
            el.style.left = parseInt(el.style.left) + (event.clientX - sx) + 'px';
            el.style.top = parseInt(el.style.top) + (event.clientY - sy) + 'px';
            sx = event.clientX;
            sy = event.clientY;
            target.removeEventListener('mousemove', move);
            target.removeEventListener('mouseup', end);
          };
          function blur () {
            canmove = false;
            el.style.cursor = 'default';
          };

        }
      }
    }
}
</script>
<style lang="less" scoped>
    @import './index.less';
</style>
