<template>
    <div class="question" @mouseenter="moveIn" ref="question">
        <!-- <i :class="icon"></i> -->
        <em v-if="text">{{text}}</em>
        <i v-else :class="icon"></i>
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="q-fixed" :style="{width:fixedWidth+'px'}" v-if="activated">
                <div class="q-fixed-arrow"></div>
                <slot></slot>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    props:{
        icon:{
            type:String,
            default:'el-icon-question'
        },
        text:{
            type:String,
            default:''
        },
        fixedWidth:{
            type:Number,
            default:150
        }
    },
    data(){
        return {
            activated:false,
            timeout:null
        }
    },
    methods:{
        moveIn(e){
            this.activated=true;
            document.body.addEventListener('mousemove', this.testOutSlide);
        },
        testOutSlide(e){
            if(!this.$refs.question.contains(e.target)){
                if(!this.timeout){
                    this.timeout=setTimeout(()=>{
                        this.activated=false;
                        document.body.removeEventListener('mousemove', this.testOutSlide);
                        this.timeout=null;
                    },100);
                }
            }else{
                clearTimeout(this.timeout);
                this.timeout=null;
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .question{
        display: inline-block;
        position: relative;
        >i{
            font-size: 14px;
            color: #aaa;
        }
        >em{
            font-weight: 100;
            cursor: pointer;
        }
        .q-fixed{
            height: auto;
            position: absolute;
            top:20px;
            left: 0;
            background: #fff;
            box-sizing: border-box;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #f2f2f2;
            z-index: 9;
            .q-fixed-arrow{
                position: absolute;
                top:-12px;
                left: 2px;
                width: 0;
                height: 0;
                border-color: transparent;
                border-style: solid;
                border-width: 6px;
                border-bottom-color: #f2f2f2;
                &:after{
                    content: '';
                    position: absolute;
                    display: block;
                    width: 0;
                    height: 0;
                    top:-5px;
                    left: -6px;
                    border-color: transparent;
                    border-style: solid;
                    border-width: 6px;
                    border-bottom-color: #fff;
                }
            }
            >img{
                width: 100%;
            }
            >div:not(.q-fixed-arrow){width: 100%;}
        }
    }
</style>
