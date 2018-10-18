<template>
    <div
        class="c-notify"
        :style="{top:top+'px',right:Right+'px'}"
    >
        <p class="title">
            <b>{{title}}</b>
            <i class="el-icon-close" @click="close"></i>
        </p>
    </div>
</template>
<script>
export default {
    data(){
        return {
            Top:0,
            Right:-250
        }
    },
    methods:{
        close(){
            this.Right=-250;
            setTimeout(()=>{
                document.body.removeChild(this.$el); 
            },300);
        },
    },
    mounted(){
        setTimeout(()=>{
            this.Right=10;
        },0);
        if(this.duration){
            console.log(this.$el)
            setTimeout(()=>{
                this.close();
            },this.duration);
        }
    }
}
</script>
<style lang="less" scoped>
    .c-notify{
        width: 200px;
        height: 50px;
        padding: 15px;
        background: #fff;
        box-shadow: 0 0 5px 1px #ebebeb;
        position: fixed;
        transition: right .3s;
        z-index: 5;
        border-radius: 5px;
        .title{
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            b{color: #666;}
            i{cursor: pointer;color: #999;}
        }
    }
</style>
