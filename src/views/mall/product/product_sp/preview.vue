<template>
    <div class="preview-container" @click.self="close">
        <div :style="{width:width+'px'}">
            <img src="../../../../assets/previewimg1.png" alt="" ref="header">
            <scroll scroll-color="#ccc" bar-color="#f8f8f8" class="scroll">
                <div v-if="views.type==1">
                    <div class="md-header">
                        <div>
                            <div class="avator"></div>
                            <div>
                                <p><b>{{views.data.dpName}}</b></p>
                                <p>
                                    <img src="../../../../assets/checked.png" alt="" width="15">
                                    <span>企业认证</span>
                                </p>
                            </div>
                        </div>
                        <img src="../../../../assets/mallPhone.png" alt="">
                    </div>
                    <div
                        v-for="item in views.data.spArray"
                        :key="item.spfzmc"
                        class="p-group"
                    >
                        <div class="p-group-header">{{item.spfzmc}}</div>
                        <div class="p-group-body">
                            <div
                                v-for="sp in item.spxx"
                                :key="sp.spid"
                            >
                                <img :src="sp.sptpFirst" alt="">
                                <p>{{sp.name}}</p>
                                <p>￥{{sp.spdj}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="views.type==2" class="p-detail">
                    <div class="banner" :style="{backgroundImage:'url('+views.data.sptpFirst+')',height:height2+'px'}"></div>
                    <div class="xqtp">
                        <img
                            v-for="(img,index) in views.data.xqtp"
                            :key="index"
                            :src="img"
                        >
                    </div>
                </div>
            </scroll>
        </div>
    </div>
</template>
<script>
import scroll from '../../../../components/scroll/scroll'
export default {
    props:['views'],
    data(){
        return {
            width:0,
            height:0,
            height2:0
        }
    },
    methods:{
        close(e){
            this.views.show=false;
        }
    },
    mounted(){
        this.width=530*9/16;
        this.height=530-45;
        this.height2=this.height*0.2;
    },
    components:{
        scroll
    }
}
</script>
<style lang="less" scoped>
    .preview-container{
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.5);
        position: fixed;
        top:0;
        left: 0;
        z-index: 9;
        display: flex;
        justify-content: center;
        align-items: center;
        >div{
            height: 530px;
            background: #f9f9f9;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding-bottom: 10px;
            >img{
                width: 100%;
                height: auto;
                flex-shrink: 0;
            }
            >div{
                width: 100%;
            }
        }
        .md-header{
            box-sizing: border-box;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
            >img{
                width: 30px;
                height: 30px;
            }
            >div{
                display: inline-flex;
                align-items: center;
                .avator{
                    width: 40px;
                    height: 40px;
                    margin-right: 10px;
                    border-radius: 50%;
                    background-color: #fff;
                    background-image: url('../../../../assets/1.png');
                    background-size: cover;
                    background-position: center center;
                }
                p{
                    display: flex;
                    align-items: center;
                    span{
                        margin-left: 5px;
                    }
                    b{font-size: 14px;}
                }
                p:nth-child(1){margin-bottom: 8px;}
            }
        }
        .p-group{
            .p-group-header{
                background: #fff;
                box-sizing: border-box;
                padding: 10px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                color: #333;
                margin-top: 10px;
            }
            .p-group-body{
                // display: flex;
                // flex-wrap: wrap;
                box-sizing: border-box;
                padding: 0 10px;
                >div{
                    width: ~"calc(50% - 5px)";
                    margin-top: 10px;
                    margin-bottom: 10px;
                    display: inline-flex;
                    flex-direction: column;
                    >img{
                        width: 100%;
                        height: 150px;
                    }
                    p{font-size: 13px;line-height: 15px;}
                    p:nth-child(2){margin: 6px 0;}
                    p:nth-child(3){color:red;}
                }
                >div:nth-child(even){margin-left: 10px;}
            }
        }
    }
    .p-detail{
        .banner{
            width: 100%;
            height: 20%;
            overflow: hidden;
            background-size: cover;
            background-position: center center;
        }
        .xqtp{
            box-sizing: border-box;
            padding: 0 10px;
            display: flex;
            flex-direction: column;
            margin-top: 10px;
            >img{
                width: 100%;
                height: auto;
            }
        }
    }
    .scroll{
        width: 100%;
        height: ~"calc(100% - 45px)";
        >div{
            height: auto;
        }
    }
</style>
