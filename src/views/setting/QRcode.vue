<template>
    <div>
        <div class="qr-container" @click="close">
            <div>
                <p>
                    <span style="color:#409EFF">帮助 : 如需打印,可将鼠标移到二维码上右键选择【图片另存为】保存到本地</span>
                    <i class="el-icon-close" @click="views.name=''"></i>
                </p>
                <p><span><span style="color:red;" @click="help.show=true">点我查看如何使用?</span></span></p>
                <img :src="views.data"/>
                <!-- <div class="close"><i class="el-icon-close"></i></div> -->
            </div>
        </div>
        <help v-if="help.show" :views="help"></help>
    </div>
</template>
<script>
    import help from './codeHelp'
    export default{
        props:['views'],
        data(){
            return {
                help:{
                    show:false
                }
            }
        },
        methods:{
            close(e){
                if(e.target.className=='qr-container'){
                    this.views.name='';
                }
            }
        },
        components:{
            help
        }
    }
</script>
<style lang="less" scoped>
    .qr-container{
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.8);
        position: fixed;
        top:0;
        left:0;
        z-index: 9;
        display: flex;
        align-items: center;
        justify-content: center;
        >div{
            width: 430px;
            height: auto;
            position: relative;
            cursor: pointer;
            background:#fff;
            p{
                padding:20px 20px 0 20px;
                color:#333;
                display: flex;
                justify-content: space-between;
                i{color:#666;}
            }
        }
        .close{
            width: 30px;
            height: 30px;
            background: #fff;
            position: absolute;
            top:0;
            right: -30px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>
