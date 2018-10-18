<template>
    <div class="notify" @click.self="close">
        <transition name="notify">
            <div v-show="show" class="notify-main" ref="main">
                <div class="n-title">
                    <span>通知中心</span>
                    <i class="el-icon-close" @click="close"></i>
                </div>
                <div class="n-body" ref="body">
                    <div class="n-body-load" :style="{height:height+'px'}">
                        <img v-if="height==30" src="../../assets/loading.svg" alt="" height="30">
                    </div>
                    <div class="scroll" ref="div" @mousewheel="refreshList">
                        <ul>
                            <li
                                v-for="tip in List"
                                :key="tip.id"
                                @click="openTxPage(tip)"
                            >
                                <!-- :style="{color:tipsLxMap[tip.lx].color,borderColor:tipsLxMap[tip.lx].color}" -->
                                <span :style="{color:TXLX[tip.lx].color,borderColor:TXLX[tip.lx].color}">
                                    {{TXLX[tip.lx].label}}
                                </span>
                                <div :class="{'notify-wd':!tip.flag}">
                                    <p
                                        v-for="item in TXLX[tip.lx].context"
                                        :key="item.key"
                                    >
                                        <span>{{item.text}}</span>
                                        <span>{{tip.data[item.key]}}</span>
                                    </p>
                                </div>
                                <em v-if="!tip.flag"></em>
                            </li>
                        </ul>
                        <p class="list-end" v-if="page.no==page.rows"><span style="color:#999;">我是有底线的</span></p>
                    </div>
                </div>
                <div class="n-title n-footer">
                    <span @click="markAllRead">全部标记为已读</span>
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
                            active-value="Y"
                            inactive-value="N"
                            @change="changeAll"
                        >
                        </el-switch>
                    </div>
                    <i class="el-icon-close" @click="control.show=false"></i>
                </div>
                <div
                    class="n-item"
                    v-for="(item,key) in control.list"
                    :key="key"
                >
                    <span>{{item.label}}</span>
                    <el-switch
                        v-model="item.qybz"
                        active-color="#13ce66"
                        active-value="Y"
                        inactive-value="N"
                        @change="changeItem(key)"
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
import {txlx} from './Txlx'
import bus from '../../func/eventBus'
import clickEvent from './clickNotify'

export default {
    mixins:[clickEvent],
    props:['views'],
    data(){
        return {
            show:false,
            control:{
                show:false,
                all:'',
                list:{
                    WDTX_SPFH:{label:'商品发货通知',qybz:'Y'},
                    WDTX_KHPJ:{label:'客户评价通知',qybz:'Y'},
                    WDTX_KCYJ:{label:'库龄预警提醒',qybz:'Y'},
                    WDTX_SPQH:{label:'商品缺货提醒',qybz:'N'},
                    WDTX_BOX_WELCOME:{label:'会员到店提醒',qybz:'Y'},
                    WDTX_DDSH:{label:'订单收货通知',qybz:'Y'},
                    WDTX_DDTK:{label:'订单退款通知',qybz:'Y'}
                }
            },
            TXLX:'',
            page:{
                size:20,
                no:1
            },
            List:[],
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
                txlx:null
            },
            height:0,
            timeout:null
        }
    },
    methods:{
        changeAll(){
            let temp=[];
            for(let key in this.control.list){
                temp.push({
                    code:key,
                    qybz: this.control.all,
                    havechild:'',
                    childvalue:''
                });
            }
            this.$http('/api/tx/saveAllWdSetting.do',{
                settingList:temp
            }).then(res=>{
                for(let key in this.control.list){
                    this.control.list[key].qybz=this.control.all;
                }
            });
        },
        changeItem(key){
            let params={
               code:key,
               qybz: this.control.list[key].qybz,
               havechild:'',
               childvalue:''
            };
            this.$http('/api/tx/saveWdSetting.do',params).then(res=>{
                let temp=res.List[0].rows.filter(item=>{
                    return item.qybz=='Y';
                });
                if(temp.length)
                    this.control.all='Y';
                if(!temp.length)
                    this.control.all='N';
                temp=null;
            });
            
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
            this.$http('/api/tx/getWdTxNoClearList.do',{
                pageSize:this.page.size,
                pageNo:this.page.no
            }).then(res=>{
                Loading.close();
                for(let obj of res.rows){
                    obj.data=JSON.parse(obj.data.value);
                }
                this.List=this.List.concat(res.rows);
                this.page.rows=res.totalPages;
                this.height=0;
                this.timeout=null;
            },err=>{
                Loading.close();
            });
        },
        //加载g恩多
        getMore(){
            let st=this.$refs.div.scrollTop;
            let ch=this.$refs.div.clientHeight;
            let sh=this.$refs.div.scrollHeight;
            if(st+ch>=sh-1){
                if(this.page.no<this.page.rows){
                    this.page.no++;
                    this.getList();
                }          
            }
        },
        refreshList(e){
            //clearTimeout(this.timeout);
            //this.timeout=null;
            //上滚动
            if(e.wheelDelta&&e.wheelDelta>0||e.detail&&e.detail>0){
                if(!this.timeout){
                    this.timeout=setTimeout(()=>{
                        this.height=0;
                        this.timeout=null;
                    },500);
                }
                if(this.$refs.div.scrollTop==0&&this.height<30){
                    this.height++;
                    if(this.height==5){
                        clearTimeout(this.timeout);
                        this.height=30;
                        this.List=[];
                        this.page.no=1;
                        this.getList();
                    }      
                }
            }
        },
        openTxPage(obj){
            if(!obj.flag){
                bus.$emit('refresh-tips');
                this.$parent.getNoReadTips();
            }
            this.$http('/api/tx/passWdTxByMsgid.do',{
                msgid:obj.msgid
            }).then(res=>{
                obj.flag=true;
                this.$parent.getNoReadTips();
            });
            this.clickNotify(obj);
            this.close();
        },
        //打开历史通知
        openHistory(){
            this.history_dialog.txlx=this.TXLX;
            this.history_dialog.show=true;
        },
        //获取提醒设置
        getSettingList(){
            this.$http('/api/tx/getWdSetting.do').then(res=>{
                let temp=res.List[0].rows.filter(item=>{
                    return item.qybz=='Y';
                });
                if(temp.length)
                    this.control.all='Y';
                if(!temp.length)
                    this.control.all='N';
                temp=null;
                for(let obj of res.List[0].rows){
                    this.control.list[obj.code].qybz=obj.qybz;
                }
            });
        },
        markAllRead(){
            this.$http('/api/tx/passAllWdTx.do').then(res=>{
                this.page.no=1;
                this.$refs.div.scrollTop=0;
                this.List=[];
                this.getList();
                bus.$emit('refresh-tips');
                this.$parent.getNoReadTips();
            });
        },
    },
    mounted(){
        this.TXLX=txlx;
        this.show=true;
        this.getList();
        this.$refs.div.addEventListener('scroll',this.getMore,true);
        this.getSettingList();
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
        z-index: 6;
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
                color:#999;
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
                display: flex;
                flex-direction: column;
                .scroll{
                    height: 0;
                    overflow-y: auto;
                    flex-grow: 1;
                }
                .n-body-load{
                    flex-shrink: 0;
                    //height: 30px;
                    background: #ecebeb;
                    transition: all .1s;
                    text-align: center;
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
                            color: #bfbdbd;
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
                        em{
                            flex-shrink: 0;
                            align-self: center;
                            display: block;
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: red;
                        }
                        .notify-wd{
                            color: #555;
                        }
                    }
                }
                .list-end{
                    width: 60%;
                    height: 1px;
                    margin: 20px auto;
                    border-top: 1px dashed #999;
                    text-align: center;
                    span{
                        font-size: 12px;
                        display: inline-block;
                        padding: 2px 7px;
                        background: #fff;
                        position: relative;
                        top:-9px;
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
