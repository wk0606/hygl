<template>
    <div
        class="r-container"
        :style="{width:width,height:height}"
        ref="main"
    >
        <div class="r-main" :style="{width:c_width+'px',height:c_height+'px',top:c_top+'px',left:c_left+'px'}">
            <slot></slot>
        </div>
        <div
            v-if="needClose!==false"
            :style="{left:c_width+70+'px'}"
            class="r-close"
            @click="close"
        >
            <i>❌</i>
            <span>关闭</span>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        width:{default:'100%'},
        height:{default:'100%'},
        needClose:{default:false}
    },
    data(){
        return {
            c_width:0,
            c_height:0,
            c_top:0,
            c_left:0
        }
    },
    methods:{
        calcDomSize(){
            setTimeout(()=>{
                this.c_width=this.$refs.main.offsetWidth/1.17;
                this.c_top=this.$refs.main.offsetHeight/8.48;
                this.c_height=this.$refs.main.offsetHeight/1.31;
                this.c_left=this.$refs.main.offsetWidth/14.12;
            },10)
        },
        close(){
            this.$emit('close');
        } 
    },
    mounted(){
        this.calcDomSize();
    },
    activated(){
        this.calcDomSize();
    }
}
</script>
<style lang="less" scoped>
    @border-color:#ddd;
    @radius:30px;
    .r-container{
        background-size: 100% 100%;
        background-image: url('../../assets/phone_bg1.png');
        box-sizing: border-box;
        position: relative;
        padding: 0;
        position: relative;
        >div{
            position: absolute;
            background: #fff;
        }
        .r-main{
            overflow: hidden;
            >div{height: 100%;}
        }
        .r-close{
            position: absolute;
            width: 80px;
            height: 35px;
            background: #fff;
            top:62px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            i{margin-right: 5px;}
        }
    }
</style>
