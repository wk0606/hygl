<template>
  <div class="bar">
      <transition name="controlBar">
        <div v-show="barShow">
            <slot name="bar-x"></slot>
        </div>
      </transition>
      <transition name="controlBar">
        <div v-show="!barShow">
            <slot name="bar-y"></slot>
        </div>
      </transition>
  </div>
</template>
<script>
export default {
  props:{
      barShow:{
          default:true
      }
  }
}
</script>
<style lang="less" scoped>
    .bar{
        width: 100%;
        height: 40px;
        background: #fff;
        overflow: hidden;
        padding: 10px 0;
        position: relative;
        >div{
            width:100%;
            box-sizing: border-box;
            padding: 0 10px;
            height: 100%;
            position: absolute;
            top:0;
            left: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
    .controlBar-enter-active{
       animation: barIn .3s; 
    }
    .controlBar-leave-active{
        animation: barOut .3s;
    }
    @keyframes barIn{
        from{
            width:100%;
            transform: translateX(0);
        }
        25%{
            width:110%;
            transform: translateX(-5%);
        }
        50%{
            width:120%;
            transform: translateX(-10%);
        }
        75%{
            width:130%;
            transform: translateX(-15%);
        }
        100%{
            width:140%;
            transform: translateX(-20%);
        }
    }
    @keyframes barOut{
        from{
            width:140%;
            transform: translateX(-20%);
        }
        25%{
            width:130%;
            transform: translateX(-15%);
        }
        50%{
            width:120%;
            transform: translateX(-10%);
        }
        75%{
            width:110%;
            transform: translateX(-5%);
        }
        100%{
            width:100%;
            transform: translateX(0);
        }
    }
</style>
