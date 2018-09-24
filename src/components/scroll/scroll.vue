<template>
  <!-- 
    调用的时候形如<scroll><div>...</div></scroll> 
    scroll里面只能由一个子元素！！！！
    要在调用的地方自行定义scroll的宽和搞-->
  <div class="scroll" ref="scroll" @mouseenter="hoverShow=true" @mouseleave="hoverShow=false"> 
      <slot class="scroll-main"></slot>
      <div class="scroll-bar" v-show="needHover!==false?show&&hoverShow:show" :style="{background:scrollColor}">
          <div
            ref="bar"
            :style="{height:height+'px',background:barColor}"
            @mousedown="down"
          ></div>
      </div>
  </div>
</template>
<script>
export default {
  props: {
    barColor:{
      default:'#999'
    },
    scrollColor:{
      default:'#f2f2f2'
    },
    speed:{default:50},//滚动的速度
    needHover:{default:false}
  },
  data() {
    return {
      show: false,
      hoverShow:false,
      height: 0,
      sy: 0,
      initTop: 0, //slot的初始top
      maxTop: 0, //可滚动的最大距离
      ratio: 1, //倍率--滚动条滚动一个像素*倍率=div滚动的像素
      target: null,
      interval:null
    };
  },
  //computed
  methods: {
    down(e) {
      this.sy = e.pageY;
      this.initTop = parseInt(this.$refs.bar.style.top) || 0;
      document.body.addEventListener("mousemove", this.move);
      document.body.addEventListener("mouseup", this.up);
    },
    move(e) {
      var temp = e.pageY - this.sy + this.initTop;
      if (temp < 0) temp = 0;
      if (temp > this.maxTop) temp = this.maxTop;
      this.$refs.bar.style.top = temp + "px";
      this.target.style.transform =
        "translateY(" + -1 * temp * this.ratio + "px)";
    },
    up(e) {
      document.body.removeEventListener("mousemove", this.move);
      document.body.removeEventListener("mouseup", this.up);
    },
    wheel(e) {
      e.preventDefault();
      var _self = 0;
      var _top = parseInt(this.$refs.bar.style.top) || 0;
      //上滚
      if (e.wheelDelta > 0) {
        _self -= this.speed;
      } else {
        _self += this.speed;
      }
      var temp = _self + _top;
      if (temp < 0) temp = 0;
      if (temp > this.maxTop) temp = this.maxTop;
      this.$refs.bar.style.top = temp + "px";
      this.target.style.transform =
        "translateY(" + -1 * temp * this.ratio + "px)";
    },
    resize() {
      var H = this.$refs.scroll.offsetHeight;
      var h = this.$refs.scroll.children[0].offsetHeight;
      if (h - H > 0) {
        this.show = true;
        this.height = 2 * H - h < 20 ? 20 : 2 * H - h;
        this.maxTop = H - this.height;
        this.ratio = 2 * H - h < 20 ? (h - H) / this.maxTop : 1;
        //注册鼠标滚动事件
        this.target.addEventListener("mousewheel", this.wheel);
      } else {
        this.show = false;
        this.target.style.transform = "translateY(0)";
        this.target.removeEventListener("mousewheel", this.wheel);
      }
    },
    //监测div宽高变化
    watchDomResize(dom){
      const TIME=500;
      var init_w=0;
      var init_h=0;
      this.interval=setInterval(()=>{
        var w = dom.offsetWidth;
        var h = dom.offsetHeight;
        if(w!=init_w||h!=init_h){
          init_w=w;
          init_h=h;
          var H = this.$refs.scroll.offsetHeight;
          var h = this.$refs.scroll.children[0].offsetHeight;
          if (h - H > 0) {
            this.show = true;
            this.height = 2 * H - h < 20 ? 20 : 2 * H - h;
            this.maxTop = H - this.height;
            this.ratio = 2 * H - h < 20 ? (h - H) / this.maxTop : 1;
            //注册鼠标滚动事件
            this.target.addEventListener("mousewheel", this.wheel);
          } else {
            this.show = false;
            this.target.style.transform = "translateY(0)";
            this.target.removeEventListener("mousewheel", this.wheel);
          }
        }
      },TIME);
    },
    //初始化操作
    initSrollBar() {
      this.target = this.$refs.scroll.children[0];
      var H = this.$refs.scroll.offsetHeight;
      var h = this.$refs.scroll.children[0].offsetHeight;
      if (h - H > 0) {
        this.show = true;
        this.height = 2 * H - h < 20 ? 20 : 2 * H - h;
        this.maxTop = H - this.height;
        this.ratio = 2 * H - h < 20 ? (h - H) / this.maxTop : 1;
        //注册鼠标滚动事件
        this.target.addEventListener("mousewheel", this.wheel);
      } else {
        this.show = false;
        this.target.style.transform = "translateY(0)";
        this.target.removeEventListener("mousewheel", this.wheel);
      }
      this.watchDomResize(this.target);
    }
  },
  mounted() {
    setTimeout(()=>{
      this.initSrollBar();
    },0);
    window.addEventListener("resize", this.resize);
  },
  destroyed() {
    window.removeEventListener("resize", this.resize);
    clearInterval(this.interval);
  }
};
</script>

<style lang="less" scoped>
.scroll {
  position: relative;
  overflow: hidden;
  user-select: none;
  .scroll-main {
    position: absolute;
    top: 0;
    left: 0;
  }
  .scroll-bar {
    width: 4px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    div {
      width: 100%;
      height: 0;
      position: absolute;
      top: 0;
      left: 0;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
      cursor: pointer;
    }
  }
}
</style>
