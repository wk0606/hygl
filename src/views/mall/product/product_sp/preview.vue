<template>
    <div class="preview-container">
        <real-view
            width="313px"
            height="570px"
            :need-close="true"
            @close="close"
        >
            <div style="background:#fff;" @mouseenter="stop">
                <img src="../../../../assets/spxq.png" alt="" width="100%">
                <scroll
                    class="scroll"
                    need-hover
                    :speed="10"
                    :style="{height:views.type==3?'399px':'355px'}"
                >
                    <div v-if="views.type!=3">
                        <div class="banner" v-resizeImg>
                            <img :src="views.data.sptpFirst" alt="">
                        </div>
                        <div class="context" style="padding:10px 10px 5px 10px;">
                            <span class="ellipsis2rows">{{views.data.name}}</span>
                        </div>
                        <div class="context">
                            <span class="price">{{'￥'+views.data.spdj}}</span>
                            <s class="small-je">{{'￥'+views.data.predj}}</s>
                        </div>
                        <div class="context other">
                            <span>运费 : {{setYf(views.data.yfje)}}</span>
                            <span>库存 : {{views.data.kskcs}}</span>
                        </div>
                        <div class="context other">
                            <span>选择 : {{setText}}</span>
                            <span>></span>
                        </div>
                        <div class="context other line">
                            <div><div>商品详情</div></div>
                        </div>
                        <img
                            v-for="img in views.data.xqtp"
                            :src="img" alt=""
                            width="100%"
                        >
                    </div>
                    <div
                        v-if="views.type==3"
                        class="yl-group"
                        >
                        <div class="yl-name"><div>{{views.data}}</div></div>
                        <div>
                            <div
                                class="yl-item"
                            >
                                <div class="yl-item-img"></div>
                                <div class="yl-text">
                                    <span class="ellipsis2rows">商品名称</span>
                                </div>
                                <div class="yl-text yl-price">
                                    <span class="ellipsis2rows">{{'￥'+999}}</span>
                                </div>
                            </div>
                            <div
                                class="yl-item"
                            >
                                <div class="yl-item-img"></div>
                                <div class="yl-text">
                                    <span class="ellipsis2rows">商品名称</span>
                                </div>
                                <div class="yl-text yl-price">
                                    <span class="ellipsis2rows">{{'￥'+999}}</span>
                                </div>
                            </div>
                            <div
                                class="yl-item"
                            >
                                <div class="yl-item-img"></div>
                                <div class="yl-text">
                                    <span class="ellipsis2rows">商品名称</span>
                                </div>
                                <div class="yl-text yl-price">
                                    <span class="ellipsis2rows">{{'￥'+999}}</span>
                                </div>
                            </div>
                            <div
                                class="yl-item"
                            >
                                <div class="yl-item-img"></div>
                                <div class="yl-text">
                                    <span class="ellipsis2rows">商品名称</span>
                                </div>
                                <div class="yl-text yl-price">
                                    <span class="ellipsis2rows">{{'￥'+999}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </scroll>
                <div class="lxfs" v-if="views.type!=3"><img src="../../../../assets/mob2.png" alt="" width="100%;"></div>
            </div>
        </real-view>
    </div>
</template>
<script>
import scroll from '../../../../components/scroll/scroll'
import realView from '../../../../components/realView/index'
export default {
    props:['views'],
    data(){
        return {
            width:0,
            height:0,
            height2:0,
            // group:[
            //     {}
            // ]
        }
    },
    computed:{
        setText(){
            var temp=this.views.data.ggspgx[0].spgg.map(item=>{
                return `"${item.name}"`;
            });
            return temp.join(' ');
        },
        setKskc(){
            return this.views.data.ggspgx.reduce(function(total,item){
                return total+item.kskc;
            },0);
        }
    },
    methods:{
        close(e){
            this.views.show=false;
        },
        stop(e){
            e.preventDefault();
            
        },
        setYf(je){
            let temp=je.split(',');
            if(!parseFloat(temp[0])&&temp.length==1){
                return '免运费';
            }
            return `￥${temp[0]}-￥${temp[1]}`;
        }
    },
    mounted(){
        this.width=530*9/16;
        this.height=530-45;
        this.height2=this.height*0.2;
    },
    components:{
        scroll,
        realView
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
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: center;
        background-attachment:fixed;
		-webkit-overflow-scroll:touch;
		-webkit-overflow-scrolling:touch;
        overflow: hidden;
    }
    .scroll{
        width: 100%;
        background: #f2f2f2;
        margin-top: -4px;
        .banner{
            width: 100%;
            height: 266px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .context{
            box-sizing: border-box;
            padding: 5px 10px;
            background: #fff;
            .price{
                font-size: 13px;
                color: red;
                font-weight: bold;
            }
            .small-je{
                font-size: 10px;
                color: #aaa;
                margin-left: 5px;
                text-decoration: line-through;
            }
        }
        .other{
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color: #ccc;
            padding: 10px;
            margin-top: 10px;
        }
        .line {
            padding: 20px 10px;
            >div{
                width: 90%;
                height: 1px;
                background: #d3d3d3;
                margin: 0 auto;
                text-align: center;
                >div{
                    position: relative;
                    top:-7px;
                    display: inline-block;
                    padding: 0 10px;
                    background: #fff;
                }
            }
        }
        .yl-group{
            //margin-top: 15px;
            width: 90%;
            margin: 15px auto 0 auto;
            .yl-name{
                width: 100%;
                height: 1px;
                background: #d3d3d3;
                text-align: center;
                margin-bottom: 10px;
                color: #999;
                >div{
                    background: #f2f2f2;
                    padding: 0 10px;
                    display: inline-block;
                    position: relative;
                    top:-7px;
                    font-size: 13px;
                }
            }
            >div:nth-child(2){
                display: flex;
                flex-wrap: wrap;
                .yl-item{
                    box-sizing: border-box;
                    width: ~"calc(50% - 5px)";
                    background: #fff;
                    border-radius: 4px;
                    margin-top: 10px;
                    overflow: hidden;
                    .yl-item-img{
                        height: 120px;
                        background-size: cover;
                        background-repeat: no-repeat;
                        background-position: center center;
                        background-image: url('../../../../assets/mrfz.jpeg');
                    }
                    .yl-text{
                        box-sizing: border-box;
                        padding: 5px 10px;
                        font-size: 10px;
                    }
                    .yl-price{
                        font-size: 12px;
                        color: red;
                    }
                }
                .yl-item:nth-child(odd){
                    margin-right: 5px;
                }
                .yl-item:nth-child(even){
                    margin-left: 5px;
                }
            }
        }
    }
</style>
