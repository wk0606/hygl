<template>
    <div class="preview-container" @click.self="close">
        <div :style="{width:width+'px'}">
            <i class="el-icon-circle-close-outline" @click="close"></i>
            <img v-if="views.type==2" src="../../../../assets/mob1.png" alt="" ref="header">
            <img v-else src="../../../../assets/previewimg1.png" alt="" ref="header">
            <scroll scroll-color="#f8f8f8" bar-color="#ccc" class="scroll" :hide-bar="true">
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
                <div v-if="views.type==2" class="p-detail p-xq">
                    <div class="banner">
                        <img :src="views.data.sptpFirst" alt="">
                        <div>{{views.data.name}}</div>
                        <div><b>￥ {{views.data.spdj}}</b></div>
                    </div>
                    <div class="kc">
                        <span>运费 ：{{views.data.yfje}}</span>
                        <span>库存 ：100</span>
                    </div>
                    <div class="kc">
                        <span>选择 ：<span style="color:#333;">选择 颜色分类</span></span>
                    </div>
                    <div class="xq">
                        <div>
                            <span><i class="el-icon-picture"></i>详情</span>
                        </div>
                    </div>
                    <div class="xqtp">
                        <img
                            v-for="(img,index) in views.data.xqtp"
                            :key="index"
                            :src="img"
                        >
                    </div>
                </div>
                <div v-if="views.type==3" class="p-detail p-group">
                    <div class="p-group-header">{{views.data}}</div>
                    <div class="g-add-main">
                        <div>
                            <img src="../../../../assets/mob3.jpg" alt="">
                            <div class="g-footer">￥ 999.00</div>
                        </div>
                        <div>
                            <img src="../../../../assets/mob3.jpg" alt="">
                            <div class="g-footer">￥ 999.00</div>
                        </div>
                        <div>
                            <img src="../../../../assets/mob3.jpg" alt="">
                            <div class="g-footer">￥ 999.00</div>
                        </div>
                        <div>
                            <img src="../../../../assets/mob3.jpg" alt="">
                            <div class="g-footer">￥ 999.00</div>
                        </div>
                    </div>
                </div>
            </scroll>
            <div class="lxfs" v-if="views.type==2"><img src="../../../../assets/mob2.png" alt="" width="100%;"></div>
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
        },
        resizeBar(){
            console.log(212)
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
            //padding-bottom: 10px;
            position: relative;
            >i{
                position: absolute;
                top:-9px;
                right: -9px;
                font-size: 20px;
                cursor: pointer;
                color:#b3a5a5;
            }
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
            height: auto;
            background: #fff;
            padding-bottom: 10px;
            img{width: 100%;min-height: 150px;}
            div{
                box-sizing: border-box;
                padding: 5px 10px;
            }
            b{font-size: 14px;color:#ff4949;}
        }
        .kc{
            box-sizing: border-box;
            margin: 10px 0;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            background: #fff;
            color: #666;
        }
        .xq{
            >div{
                margin: -10px auto 10px auto;
                width: 100px;
                border-bottom: 1px solid #d4cfcf;
                text-align: center;
                >span{
                    display: inline-flex;
                    align-items: center;
                    position: relative;
                    top:8px;
                    background: #f9f9f9;
                    color:#d4cfcf;
                    font-size: 13px;
                    padding: 0 5px;
                    i{margin-right: 5px;font-size: 15px;}
                }
            }
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
        .lxfs{
            position: absolute;
            bottom: 0;
        }
    }
    //.p-xq{padding-bottom: 40px;}
    .scroll{
        width: 100%;
        height: ~"calc(100% - 45px)";
        >div{
            height: auto;
        }
    }
    .g-add-main{
        box-sizing: border-box;
        //padding: 10px;
        padding: 0 10px 10px 0;
        height: ~"calc(100% - 86px)";
        display: flex;
        flex-wrap: wrap;
        >div{
            width:50%;
            height: 50%;
            border-top:10px solid #f8f8f8;
            border-left:10px solid #f8f8f8;
            background: #fff;
            box-sizing: border-box;
            img{
            display: block;
            width: 100%;
            height: 80%;
            }
            .g-footer{
                height: 20%;
                display: flex;
                align-items: center;
                font-size: 14px;
                color: red;
                box-sizing: border-box;
                padding: 5px 10px;
            }
        }
    }
</style>
