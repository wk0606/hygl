<template>
    <div class="notify" @click.self="close">
        <transition name="notify">
            <div v-show="show" class="notify-main" ref="main">
                <div class="n-title">
                    <span>通知中心</span>
                    <i class="el-icon-close" @click="close"></i>
                </div>
                <div class="n-body" ref="body">
                    <scroll class="scroll" need-hover>
                        <ul>
                            <li
                                v-for="tip in List"
                                :key="tip.id"
                            >
                                <span :style="{color:tipsLxMap[tip.lx].color,borderColor:tipsLxMap[tip.lx].color}">
                                    {{tipsLxMap[tip.lx].label}}
                                </span>
                                <div :class="{'notify-wd':!tip.status}">
                                    <p
                                        v-for="item in tip.data"
                                        :key="item.key"
                                    >
                                        <span>{{item.key}}</span>
                                        <span>{{item.value}}</span>
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </scroll>
                </div>
                <div class="n-title n-footer">
                    <span>全部标记为已读</span>
                    <div>
                        <a @click="openHistory">
                            <i class="iconfont icon-lishi"></i>
                            历史通知
                        </a>
                        <a @click="control.show=true">
                            <i class="iconfont icon-shezhi1"></i>
                            通知设置
                        </a>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="notify">
            <div class="notify-main notify-set" v-if="control.show">
                <div class="n-title"> 
                    <div>
                        <span>通知设置</span>
                        <el-switch
                            v-model="control.all"
                            active-color="#13ce66"
                            @change="changeAll"
                        >
                        </el-switch>
                    </div>
                    <i class="el-icon-close" @click="control.show=false"></i>
                </div>
                <div
                    class="n-item"
                    v-for="item in control.list"
                    :key="item.id"
                >
                    <span>{{item.label}}</span>
                    <el-switch
                        v-model="item.value"
                        active-color="#13ce66"
                        @change="changeItem(item)"
                    >
                    </el-switch>
                </div>
            </div>
        </transition>
        <history v-if="history_dialog.show" :views="history_dialog"></history>
    </div>
</template>
<script>
import {Loading} from '../../func/loading'
import scroll from '../../components/scroll/scroll'
import history from './notify_history'
export default {
    props:['views'],
    data(){
        return {
            show:false,
            control:{
                show:false,
                all:true,
                list:[
                    {label:'商品发货通知',value:true,id:1},
                    {label:'客户评价通知',value:true,id:2},
                    {label:'库龄预警提醒',value:true,id:3},
                    {label:'商品缺货提醒',value:true,id:4},
                    {label:'会员到店提醒',value:true,id:5}
                ]
            },
            List:[
                {
                    id:1,
                    lx:'spfh',
                    status:1,
                    data:[
                        {key:'订单号',value:'0012544'},
                        {key:'下单日期',value:'2018-05-16 10:31:25'},
                        {key:'商品',value:'苹果IphoneX 128G 全网通 黑色'},
                        {key:'规格',value:'全网通'}
                    ]
                },
                {
                    id:2,
                    lx:'khpj',
                    status:0,
                    data:[
                        {key:'评分',value:'5'},
                        {key:'内容',value:'定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。'}
                    ]
                },
                {
                    id:3,
                    lx:'klyj',
                    status:1,
                    data:[
                        {key:'订单号',value:'0012544'},
                        {key:'下单日期',value:'2018-05-16 10:31:25'},
                        {key:'商品',value:'苹果IphoneX 128G 全网通 黑色'},
                        {key:'规格',value:'全网通'}
                    ]
                },
                {
                    id:4,
                    lx:'spqh',
                    status:0,
                    data:[
                        {key:'评分',value:'5'},
                        {key:'内容',value:'定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。'}
                    ]
                },
                {
                    id:5,
                    lx:'hydd',
                    status:0,
                    data:[
                        {key:'评分',value:'5'},
                        {key:'内容',value:'定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。'}
                    ]
                },
                {
                    id:6,
                    lx:'spfh',
                    status:1,
                    data:[
                        {key:'订单号',value:'0012544'},
                        {key:'下单日期',value:'2018-05-16 10:31:25'},
                        {key:'商品',value:'苹果IphoneX 128G 全网通 黑色'},
                        {key:'规格',value:'全网通'}
                    ]
                },
                {
                    id:7,
                    lx:'khpj',
                    status:0,
                    data:[
                        {key:'评分',value:'5'},
                        {key:'内容',value:'定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。'}
                    ]
                },
                {
                    id:8,
                    lx:'klyj',
                    status:1,
                    data:[
                        {key:'订单号',value:'0012544'},
                        {key:'下单日期',value:'2018-05-16 10:31:25'},
                        {key:'商品',value:'苹果IphoneX 128G 全网通 黑色'},
                        {key:'规格',value:'全网通'}
                    ]
                },
                {
                    id:9,
                    lx:'spqh',
                    status:0,
                    data:[
                        {key:'评分',value:'5'},
                        {key:'内容',value:'定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。'}
                    ]
                },
                {
                    id:10,
                    lx:'hydd',
                    status:0,
                    data:[
                        {key:'评分',value:'5'},
                        {key:'内容',value:'定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。'}
                    ]
                }
            ],
            //通知类型映射表
            tipsLxMap:{
                spfh:{label:'商品发货',color:'red'},
                khpj:{label:'客户评价',color:'blue'},
                klyj:{label:'库龄预警',color:'green'},
                spqh:{label:'商品缺货',color:'orange'},
                hydd:{label:'会员到店',color:'brown'}
            },
            history_dialog:{
                show:false,
                lx:null
            }
        }
    },
    methods:{
        changeAll(){
            for(let obj of this.control.list){
                obj.value=this.control.all;
            }
        },
        changeItem(item){
            var temp=this.control.list.filter(item=>{
                return !item.value;
            });
            //如果全部关闭了
            if(temp.length==this.control.list.length){
               this.control.all=false; 
            }  
            //如果全部开启了
            if(temp.length==0){
                this.control.all=true; 
            } 
        },
        close(){
            this.show=false;
            this.control.show=false;
            setTimeout(()=>{
                this.views.show=false;
            },300);
        },
        getList(){
            Loading.open({
                target:this.$refs.body
            });
            setTimeout(() => {
               Loading.close(); 
            }, 300);
        },
        //打开历史通知
        openHistory(){
            this.history_dialog.lx=this.tipsLxMap;
            this.history_dialog.show=true;
        }
    },
    mounted(){
        this.show=true;
        this.getList();
    },
    components:{
        scroll,
        history
    }
}
</script>
<style lang="less" scoped>
    @color:#eee;
    .notify{
        width: 100%;
        height: 100%;
        position: fixed;
        top:0;
        left: 0;
        background: rgba(0,0,0,.3);
        z-index: 5;
        font-size: 12px;
        .notify-main{
            width: 450px;
            height: 100%;
            background: #fff;
            position: absolute;
            right: 0;
            top:0;
            display: flex;
            flex-direction: column;
            .n-title,.n-footer{
                box-sizing: border-box;
                padding: 15px;
                border-bottom: 1px solid @color;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                flex-shrink: 0;
                div{
                    display: inline-flex;
                    align-items: center;
                    span{margin-right: 5px;}
                }
                i{cursor: pointer;}
            }
            .n-body{
                height: ~"calc(100% - 95px)";
                position: relative;
                .scroll{
                    height: 100%;
                }
                ul{
                    li{
                        width: 95%;
                        margin: 0 auto;
                        box-sizing: border-box;
                        padding: 5px 0 10px 0;
                        border-bottom: 1px solid @color;
                        display: flex;
                        align-items: flex-start;
                        cursor: pointer;
                        >span{
                            flex-shrink: 0;
                            margin-top: 5px;
                            padding: 2px 5px;
                            border-radius: 3px;
                            border: 1px solid #ccc;
                        }
                        div{
                            flex-grow: 1;
                            box-sizing: border-box;
                            padding-left: 10px;
                            p{
                                line-height: 18px;
                                span:nth-child(1){
                                    &:after{
                                        content: ':';
                                        margin: 0 5px;
                                    }
                                }
                            }
                            p{margin-top: 4px;}
                        }
                        .notify-wd{
                            color: #bfbdbd;
                        }
                    }
                }
            }
            .n-footer{
                background: @color;
                span{
                    color: #999;
                    cursor: pointer;
                }
                a{
                    display: inline-flex;align-items: center;
                    i{margin-right: 5px;}
                }
                a:nth-child(1){color: #fd9827;}
                a:nth-child(2){color: #409eff;margin-left: 10px;}
            }
            .n-item{
                width: 90%;
                margin: 0 auto;
                padding: 25px 0;
                border-bottom: 1px solid @color;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span{
                    font-size: 14px;
                    color: #999;
                }
            }
        }
    }
    .notify-enter-active{
        animation: slideIn .3s;
    }
    .notify-leave-active{
        animation: slideOut .3s;
    }
    @keyframes slideIn{
        from{
            transform: translateX(100%);
        }
        to{
            transform: translateX(0);
        }
    }
    @keyframes slideOut{
        from{
            transform: translateX(0);
        }
        to{
            transform: translateX(100%);
        }
    }
</style>
