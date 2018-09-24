<template>
    <div class="load-container" :style="{height:height,top:top+'px'}">
        <div>
            <div>
                <div class="rect"></div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
//   props:{
//     text:{},
//     height:{default:'100%'},
//     top:{default:0}
//   }
};
</script>

<style lang="less" scoped>
@size:70px;
@border:3px;
.load-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 200;
  p {
    text-align: center;
    color: #aaa;
    margin-top: 20px;
  }
}
.load-container > div{
    width: 20%;
    height: 20%;
    background: rgba(0,0,0,0);
    display: flex;
    justify-content: center;
    align-items: center;
    >div{
        width: @size;
        height: @size;
        border-radius: 50%;
        background: #fff;
        position: relative;
        background-image: url('../../assets/logoload.jpg');
        background-size: 50px 50px;
        background-repeat: no-repeat;
        background-position: center center;
        box-sizing: border-box;
        border: @border solid #e0dbdb;
        .rect{
            width: @size/2;
            height: @size/2;
            position: absolute;
            top:-1*@border;
            left: -1*@border;
            overflow: hidden;
            transform-origin: right bottom;
            animation: zq 1s ease-in-out infinite;
            &:before{
                content:'';
                display: block;
                width: @size;
                height: @size;
                box-sizing: border-box;
                border:@border solid #01a0e9;
                border-radius: 50%;
            }
        }
    }
}
@keyframes zq{
    from{
        transform:rotateZ(0deg); 
    }
    to{
      transform:rotateZ(360deg);   
    }
}
// .spinner {
//   width: 30px;
//   height: 30px;
//   position: relative;
// }

// .container1 > div,
// .container2 > div,
// .container3 > div {
//   width: 6px;
//   height: 6px;
//   background-color: #aaa;
//   border-radius: 100%;
//   position: absolute;
//   -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
//   animation: bouncedelay 1.2s infinite ease-in-out;
//   -webkit-animation-fill-mode: both;
//   animation-fill-mode: both;
// }

// .spinner .spinner-container {
//   position: absolute;
//   width: 100%;
//   height: 100%;
// }

// .container2 {
//   -webkit-transform: rotateZ(45deg);
//   transform: rotateZ(45deg);
// }

// .container3 {
//   -webkit-transform: rotateZ(90deg);
//   transform: rotateZ(90deg);
// }

// .circle1 {
//   top: 0;
//   left: 0;
// }
// .circle2 {
//   top: 0;
//   right: 0;
// }
// .circle3 {
//   right: 0;
//   bottom: 0;
// }
// .circle4 {
//   left: 0;
//   bottom: 0;
// }

// .container2 .circle1 {
//   -webkit-animation-delay: -1.1s;
//   animation-delay: -1.1s;
// }

// .container3 .circle1 {
//   -webkit-animation-delay: -1s;
//   animation-delay: -1s;
// }

// .container1 .circle2 {
//   -webkit-animation-delay: -0.9s;
//   animation-delay: -0.9s;
// }

// .container2 .circle2 {
//   -webkit-animation-delay: -0.8s;
//   animation-delay: -0.8s;
// }

// .container3 .circle2 {
//   -webkit-animation-delay: -0.7s;
//   animation-delay: -0.7s;
// }

// .container1 .circle3 {
//   -webkit-animation-delay: -0.6s;
//   animation-delay: -0.6s;
// }

// .container2 .circle3 {
//   -webkit-animation-delay: -0.5s;
//   animation-delay: -0.5s;
// }

// .container3 .circle3 {
//   -webkit-animation-delay: -0.4s;
//   animation-delay: -0.4s;
// }

// .container1 .circle4 {
//   -webkit-animation-delay: -0.3s;
//   animation-delay: -0.3s;
// }

// .container2 .circle4 {
//   -webkit-animation-delay: -0.2s;
//   animation-delay: -0.2s;
// }

// .container3 .circle4 {
//   -webkit-animation-delay: -0.1s;
//   animation-delay: -0.1s;
// }

// @-webkit-keyframes bouncedelay {
//   0%,
//   80%,
//   100% {
//     -webkit-transform: scale(0);
//   }
//   40% {
//     -webkit-transform: scale(1);
//   }
// }

// @keyframes bouncedelay {
//   0%,
//   80%,
//   100% {
//     transform: scale(0);
//     -webkit-transform: scale(0);
//   }
//   40% {
//     transform: scale(1);
//     -webkit-transform: scale(1);
//   }
// }
</style>
