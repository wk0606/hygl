<template>
    <div class="notify-body" ref="notify" @click="openNotifyViews">
        <div>
            <i class="iconfont icon-tongzhi"></i>
            <span>通知</span>
        </div>
        <transition enter-active-class="animated fadeIn">
            <panel v-if="dialog.show" :views="dialog"></panel>
        </transition>
    </div>
</template>
<script>
import panel from './notify_panel'
let FLAG=true;
export default {
    data(){
        return {
            dialog:{show:false}
        }
    },
    methods:{
        openNotifyViews(){
            if(FLAG){
                this.dialog.show=true;
            }
        },
    },
    directives: {
      drag: {
        inserted(el, bind){
          let target = el;
          let sx,sy,lx,ly;
          let canmove = false;
          el.addEventListener('mousedown',start);
          function start () {
              if(el.contains(event.target)){
                    FLAG=true;
                    event.preventDefault();
                    sx = event.clientX;
                    sy = event.clientY;
                    lx=el.parentNode.getBoundingClientRect().left;
                    ly=el.parentNode.getBoundingClientRect().top;
                    document.body.addEventListener('mousemove', move);
                    document.body.addEventListener('mouseup', end);
                    canmove = true;
              }
          };
          function move () {
            if(event.clientX - sx!=0||event.clientY - sy!=0)
                FLAG=false;//改变此标志，执行click中的事件
            event.preventDefault();
            if (canmove) {
              el.parentNode.style.left = lx + (event.clientX - sx)+'px';
              el.parentNode.style.top = ly + (event.clientY - sy)+'px';
            }
          };
          function end () {
            event.preventDefault();
            canmove = false;
            localStorage.setItem('NOTIFY_LEFT',JSON.stringify(el.parentNode.style.left));
            localStorage.setItem('NOTIFY_TOP',JSON.stringify(el.parentNode.style.top));
            document.body.removeEventListener('mousemove', move);
            document.body.removeEventListener('mouseup', end);
          };
        }
      }
    },
    mounted(){
    //    if(this.$util.getStorage('NOTIFY_LEFT'))
    //     this.$refs.notify.style.left=this.$util.getStorage('NOTIFY_LEFT');
    //    else
    //     this.$refs.notify.style.right='10px';
    //    if(this.$util.getStorage('NOTIFY_TOP'))
    //     this.$refs.notify.style.top=this.$util.getStorage('NOTIFY_TOP');
    //    else
    //     this.$refs.notify.style.bottom='10px';
    },
    components:{
        panel
    }
}
</script>
<style lang="less" scoped>
    .notify-body{
        width: 100%;
        height: auto;
        color: #999;
        user-select: none;
        >div:nth-child(1){
            i{margin-right: 5px;font-size: 25px;}
            span{font-size: 14px;}
        }
        &:hover{
            cursor: pointer;
        }
        >div:nth-child(1){
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>
