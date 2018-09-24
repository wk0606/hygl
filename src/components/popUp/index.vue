<template>
  <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
        <div class="p-container" v-if="views.show">
            <div
                :style="{width:width+'px'}"
                ref="content"
                v-drag
            >
                <div class="p-title" :class="type">
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
                    <div>
                        <slot name="footer-text"></slot>
                    </div>
                    <div>
                        <slot name="footer"></slot>
                        <el-button type="primary" size="mini" v-if="confirm" @click="confirm" :loading="loading" :disabled="disabled">{{confirmText}}</el-button>
                        <el-button size="mini" v-if="!hideCancel" @click="close">{{cancelText}}</el-button>
                    </div>
                </div>
            </div>
        </div>
  </transition>
</template>
<script>
export default {
  props:{
      title:{default:'提示'},
      titleSub:{default:''},//副标题
      type:{default:'dark'},//标题栏样式 dark/light
      width:{default:500},
      confirm:{default:null},//确认回调
      cancel:{default:null},//关闭回调
      hideCancel:{
          default:false//是否隐藏关闭按钮
      },
      loading:{default:false},
      disabled:{default:false},
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
          let target = el.children[0];
          let sx, sy,lx,ly;
          let canmove = false;
          target.addEventListener('mousedown', start);
          function start () {
            sx = event.clientX;
            sy = event.clientY;
            lx=el.getBoundingClientRect().left;
            ly=el.getBoundingClientRect().top;
            document.body.addEventListener('mousemove', move);
            document.body.addEventListener('mouseup', end);
            //target.addEventListener('mouseout', outside);
            target.addEventListener('blur', blur);
            el.style.cursor = 'move';
            canmove = true;
          };
          function move () {
            if (canmove) {
              el.style.left = lx + (event.clientX - sx)+'px';
              el.style.top = ly + (event.clientY - sy)+'px';
            }
          };
        //   function outside(){
        //     target.removeEventListener('mousemove', move);
        //     target.removeEventListener('mouseup', end);
        //   }
          function end () {
            canmove = false;
            el.style.cursor = 'default';
            document.body.removeEventListener('mousemove', move);
            document.body.removeEventListener('mouseup', end);
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
