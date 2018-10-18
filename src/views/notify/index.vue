<template>
    <div class="notify-body" ref="notify" @click="openNotifyViews">
        <div :class="{'no-read':noread}">
            <i class="iconfont icon-tongzhi1" :class="{slide:newTips}"></i>
            <span>通知</span>
        </div>
        <transition enter-active-class="animated fadeIn">
            <panel v-if="dialog.show" :views="dialog" ref="panel"></panel>
        </transition>
    </div>
</template>
<script>
import panel from "./notify_panel"
import { Notification } from "element-ui"
import {txlx} from "./Txlx"
import bus from '../../func/eventBus'
import clickEvent from './clickNotify'
export default {
  mixins:[clickEvent],
  data() {
    return {
      dialog: { show: false },
      noread:false,
      newTips:false
    };
  },
  methods: {
    connect() {
      let _self=this;
      try{
        var socket = new WebSocket(`${this.$util.getCache('user').mqsserver}/mqServer.do?token=${this.$util.getTokenid()}`);
        socket.onopen = () => {
            console.log('%cWebSocket连接成功 ', 'background:#13CE66;color:#fff;');
            const TIME = 10 * 60 * 1000;//心跳时长
            setInterval(() => {
                socket.send('refresh');
            }, TIME);
        };
        socket.onmessage = data => {
            console.log(data);
            var details=JSON.parse(data.data);
            if(!/^WDTX_/.test(details.txlx)){
              //如果不是网店提醒
              return;
            }
            this.noread=true;
            bus.$emit('refresh-tips');
            this.newTips=true;
            var timeid=null;
            clearTimeout(timeid);
            timeid=setTimeout(()=>{
              _self.newTips=false;
            },3000);
            var temp=_self.getMessage(details.txlx,details);
            //打开桌面通知
            _self.openDesktopTips(details.txlx,temp.text);
            //打开右上角通知
            const h = this.$createElement;
            Notification({
              title:txlx[details.txlx].label,
              message:temp.node,
              onClick:function(){
                _self.doClickEvent(data);
              }
            });
            //打开声音
            this.$util.openSystemVoice();
        };
        socket.onclose=()=>{
            console.log('%cWebSocket已断开 ', 'background:#FF4949;color:#fff;');
            this.connect();
        }
      }catch(e){
          console.log('%cWebsocket ERROR!!!', 'background:#FF4949;color:#fff;');
      }
    },
    openDesktopTips(lx,msg){
        if(!document.hidden){
          return;
        }
        var WinNotification = window.Notification || window.mozNotification || window.webkitNotification;
        // 判断浏览器是否支持桌面通知
        if(WinNotification){
            WinNotification.requestPermission(function(result){
                //result 默认值'default'等同于拒绝 'denied' -用户选择了拒绝 'granted' -用户同意启用通知
                var winNotify = new WinNotification(
                    txlx[lx].label,
                    {
                        dir:'auto',
                        lang:'zh-CN',
                        tag:"MJPZ"+Math.random(),//实例化的notification的id
                        renotify:true,//是否覆盖之前通知
                        icon:'../../assets/mjlogo.png',//通知的缩略图,icon 支持ico、png、jpg、jpeg格式
                        body:msg //通知的具体内容
                    }
                );
                // 定义通知窗口点击函数
                winNotify.onclick=function(){
                    //如果通知消息被点击,通知窗口将被激活
                    window.focus();
                };
                // 定义通知错误事件
                winNotify.onerror = function () {
                };
                // 定义通知显示事件 可以设置多少秒之后关闭 也可以不设置关闭
                winNotify.onshow = function () {
                    // 窗口显示 播放音频
                    // var audio = new Audio("./10418.wav");
                    // audio.play();
                    // 窗口显示3S后关闭
                    setTimeout(function(){
                        winNotify.close();
                    },3000);
                };
                // 定义通知关闭事件
                winNotify.onclose = function () {

                };
            });
        }else{
            // 提示不支持系统通知
            console.log('您的浏览器不支持系统通知,建议使用Chrome浏览');
        }
    },
    doClickEvent(obj){
      this.$http('/api/tx/getWdTxDetailByMsgid.do',{
        msgid:JSON.parse(obj.data).msgid
      }).then(res=>{
        let temp={
          lx:JSON.parse(obj.data).txlx
        }
        temp.data=Object.assign({},res.List[0]);
        this.dialog.show=false;
        this.clickNotify(temp);
      });
    },
    //
    getMessage(lx,obj){
      const h = this.$createElement;
      let ctx=txlx[lx].context;
      let array=[];
      let content='';
      for(let row of ctx){
        content+=`${row.text} : ${obj[row.key]} `;
        array.push(
          h('p',{
            style:'font-size:12px;padding:2px 0;'
          },[
            h('span',{},`${row.text} : `),
            h('span',{},obj[row.key])
          ])
        )
      }
      if(lx!='WDTX_BOX_WELCOME'){
        array.push(
          h('p',{
            style:'font-size:12px;padding:2px 0;color:#409eff;'
          },'点击查看详情')
        );
      }
      return {
        node:h('div',{style:'cursor:pointer;'},array),
        text:content
      };
    },
    openNotifyViews() {
     this.dialog.show=true;
    },
    getNoReadTips(){
      this.$http('/api/tx/getTxNoReadCount.do').then(res=>{
        this.noread=res.num>0?true:false;
      });
    }
  },
  directives: {
    drag: {
      inserted(el, bind) {
        let target = el;
        let sx, sy, lx, ly;
        let canmove = false;
        el.addEventListener("mousedown", start);
        function start() {
          if (el.contains(event.target)) {
            event.preventDefault();
            sx = event.clientX;
            sy = event.clientY;
            lx = el.parentNode.getBoundingClientRect().left;
            ly = el.parentNode.getBoundingClientRect().top;
            document.body.addEventListener("mousemove", move);
            document.body.addEventListener("mouseup", end);
            canmove = true;
          }
        }
        function move() {
          event.preventDefault();
          if (canmove) {
            el.parentNode.style.left = lx + (event.clientX - sx) + "px";
            el.parentNode.style.top = ly + (event.clientY - sy) + "px";
          }
        }
        function end() {
          event.preventDefault();
          canmove = false;
          localStorage.setItem(
            "NOTIFY_LEFT",
            JSON.stringify(el.parentNode.style.left)
          );
          localStorage.setItem(
            "NOTIFY_TOP",
            JSON.stringify(el.parentNode.style.top)
          );
          document.body.removeEventListener("mousemove", move);
          document.body.removeEventListener("mouseup", end);
        }
      }
    }
  },
  mounted() {
    this.connect();
    this.getNoReadTips();
    bus.$on('open',()=>{
      this.openNotifyViews();
    });
  },
  components: {
    panel
  }
};
</script>
<style lang="less" scoped>
.notify-body {
  width: 100%;
  height: auto;
  color: #fff;
  user-select: none;
  > div:nth-child(1) {
    i {
      margin-right: 5px;
      font-size: 25px;
      transform-origin: center center;
    }
    .slide{
      animation: dong .1s ease-in-out alternate infinite;
    }
    span {
      font-size: 14px;
    }
  }
  .no-read{color: red;}
  &:hover {
    cursor: pointer;
  }
  > div:nth-child(1) {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
@keyframes dong{
  from{
    transform: rotateZ(-10deg);
  }
  to{
    transform: rotateZ(10deg);
  }
}
</style>
