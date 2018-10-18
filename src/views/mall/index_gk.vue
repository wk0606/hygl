<template>
    <div class="container">
        <!-- 实施概况 -->
        <div>
            <div class="mall-title">
                <b>实时概况</b>
                <span>更新时间 : {{gkDateTime}} <router-link to="/main/statistics" tag="a">更多数据</router-link><i class="iconfont icon-bangzhu1"></i></span>
            </div>
            <div class="mall-charts">
                <table class="mall-datas">
                    <tr
                        v-for="(row,index) in gkDetails"
                        :key="index"
                    >
                        <td style="padding-left:30px;width:80px;">
                            <img :src="row.icon" alt="" width="60">
                        </td>
                        <td
                            v-for="item in row.infos"
                            :key="item.key"
                        >
                            <p><span>{{item.label}}</span></p>
                            <p><b class="m-price">{{item.currency?$util.formatCash(gkDatas[item.value1]):gkDatas[item.value1]}}</b></p>
                            <p><span>昨日 : {{item.currency?$util.formatCash(gkDatas[item.value2]):gkDatas[item.value2]}}</span></p> 
                        </td>
                    </tr>
                </table>
                <div>
                    <p>网店销售额(元)</p>
                    <p style="margin:10px 0;"><b class="m-price">{{xsje.je | currency}}</b></p>
                    <div class="m-zr">
                        <span>昨日全天 : {{xsje.zrje | currency}}</span>
                        <div>
                            <div class="m-circle m-circle-blue"></div>
                            <span>今日</span>
                            <div class="m-circle m-circle-green"></div>
                            <span>昨日</span>
                        </div>
                    </div>
                    <div class="m-xszs" ref="charts"></div>
                </div>
            </div>
        </div>
        <!-- 常用功能 -->
        <div class="mall-menus">
            <div class="mall-title">
                <b>常用功能</b>
            </div>
            <div class="mall-menus-items">
                <div
                    v-for="item in menus"
                    :key="item.label"
                    @click="openNav(item.path)"
                >
                    <img :src="item.icon" alt="" width="30">
                    <span>{{item.label}}</span>
                </div>
            </div>
        </div>
        <!-- 重要提醒 -->
        <div class="mall-tips">
            <div class="mall-title">
                <b>重要提醒</b>
            </div>
            <div class="mall-main">
                <div
                    class="mall-tips-items"
                    v-for="(row,index) in tips"
                    :key="index"
                >
                    <div>{{row.label}}</div> 
                    <div>
                        <div
                        v-for="item in row.items"
                        :key="item.label"
                        >
                        <span>{{item.label}} : </span>
                        <a @click="openTipsPage(item)">{{tipsDatas[item.value]||0}}</a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="tips-btn" @click="dialog.show=true">
                <i class="iconfont icon-lingdang"></i>
                <span>通知</span>
            </div> -->
        </div>
    </div>
</template>
<script>
import echarts from "echarts"
import bus from '../../func/eventBus'
export default {
    data(){
        return {
            //实施概况左侧数据
            gkDateTime:'',
            gkDetails: [
                {
                icon: require("../../assets/je.png"),
                infos: [
                    {
                        label: "网店销售额(元)",
                        key: "wdxse",
                        value1: 'wdxsjeNow',
                        value2: 'wdxsjeYellow',
                        currency:true
                    },
                    { label: "门店销售额(元)", key: "mdxse", value1: 'mdxsjeNow', value2: 'mdxsjeYellow',currency:true }
                ]
                },
                {
                icon: require("../../assets/person.png"),
                infos: [
                    { label: "网店客流量", key: "llkhs", value1: 'wdkhslNow', value2: 'wdkhslYellow' },
                    { label: "门店客流量", key: "zfkhs", value1: 'mdkhslNow', value2: 'mdkhslYellow' }
                ]
                }
            ],
            gkDatas:{},
            //实施概况网点销售额--统计表数据
            xsje: {
                je: 0,
                zrje: 0,
                jrzs: [],
                zrzs: [],
                xdata: []
            },
            tipsDatas:{},
            //提醒的项目
            tips: [
                {
                    label: "订单相关",
                    items: [{ label: "待发货订单", key: 'order_fh',value:'dfhddsl'},{ label: "待退款订单", key: 'order_tk',value:'dtkddsl' }]
                },
                {
                    label: "通知消息",
                    items: [{ label: "未读系统通知", key: 'notify',value:'wdkhxxsl' }]
                },
                {
                    label: "商品相关",
                    items: [
                        { label: "网店在售商品", key: 'shop_zs',value:'zsspsl' },
                        { label: "网店缺货商品", key: 'shop_qh',value:'qhspsl' },
                        { label: "库存预警商品", key: 'shop_yj',value:'kcyjspsl' }
                    ]
                }
            ],
            //常用功能
            menus: [
                {
                icon: require("../../assets/fbsp.png"),
                label: "发布商品",
                path: "/main/mall/shop/product_fb"
                },
                { icon: require("../../assets/spgl.png"), label: "管理商品", path: "/main/mall/shop/product_sp" },
                {
                icon: require("../../assets/wddd.png"),
                label: "网店订单",
                path: "/main/mall/shop/order"
                },
                {
                icon: require("../../assets/wdsz.png"),
                label: "网店设置",
                path: "/main/mall/shop/set_dp"
                }
            ],
            dialog:{
                show:false
            }
        }
    },
    methods:{
        //获取实施概况
        getGkDetails(){
            this.$http('/api/x6/getWdSsgk.do').then(res=>{
                this.gkDateTime=res.VO.dateTime;
                this.gkDatas=res.VO.data;
                this.xsje.je=res.VO.data.wdxsjeNow;
                this.xsje.zrje=res.VO.data.wdxsjeYellow;
                for(let obj of res.VO.listNow){
                    this.xsje.jrzs.push(obj.wdxsje);
                    this.xsje.xdata.push(obj.hour);
                }
                for(let obj of res.VO.listYellow){
                    this.xsje.zrzs.push(obj.wdxsje);
                }
                var temp = [];
                temp.push({
                type: "line",
                smooth: true,
                data: this.xsje.jrzs
                });
                temp.push({
                type: "line",
                data: this.xsje.zrzs
                });
                this.drawCharts(this.xsje.xdata, temp);
            });
        },
        drawCharts(xdata, ydata) {
            var chart = echarts.init(this.$refs.charts);
            var option = {
                tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    label: {
                    backgroundColor: "#6a7985"
                    }
                }
                },
                grid: {
                left: "3%",
                right: "4%",
                top: "13%",
                bottom: "3%",
                containLabel: true
                },
                xAxis: [
                {
                    type: "category",
                    boundaryGap: false,
                    data: xdata
                }
                ],
                yAxis: [
                {
                    type: "value"
                }
                ],
                series: ydata,
                color: ["#1f8efb", "#37c15f"]
            };
            chart.setOption(option, true);
        },
        //获取提醒数量
        getTipsNumber(){
            this.$http('/api/x6/getZyNotices.do').then(res=>{
                this.tipsDatas=res.VO;
            });
        },
        openNav(path) {
            this.$router.push(path);
        },
        openTipsPage(item){
            if(item.key.indexOf('order')>-1){
                if(item.key=='order_fh'){
                    this.$util.setCache('ORDER',{ddzt:1,psfs:0});
                    this.$router.push('/main/mall/shop/order');
                }
                if(item.key=='order_tk'){
                    this.$util.setCache('ORDER',{tkzt:1});
                    this.$router.push('/main/mall/shop/order');
                }
            }else if(item.key=='notify'){
                bus.$emit('open');
            }else if(item.key.indexOf('shop')>-1){
                if(item.key=='shop_qh'){
                    this.$util.setCache('GOODS-ID',{
                        name:'',
                        bzw:2
                    });
                }
                if(item.key=='shop_yj'){
                    this.$util.setCache('GOODS-ID',{
                        name:'',
                        bzw:0,
                        isxskcyj:1
                    });
                }
                this.$router.push('/main/mall/shop/product_sp');
            }else{

            }
        }
    },
    mounted(){
        this.getGkDetails();
        this.getTipsNumber();
        bus.$on('refresh-tips',()=>{
            this.getTipsNumber();
        });
    },
    components:{

    }
}
</script>
<style lang="less" scoped>
    @import '../../styles/common.less';
    .container{
        box-sizing: border-box;
        padding: 0 20px 20px 20px;
        >div:not(.notify){
            padding: 20px 0;
            //border-top:1px solid @border-color; 
            border-bottom:1px solid @border-color ;
        }
    }
    .mall-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        b{font-size: 14px;color: #3a3a3a;}
        span{
            font-size: 12px;
            color: #ccc;
            display: inline-flex;
            align-items: center;
            a{color:#409EFF;margin: 0 5px 0 10px;}
            i{color: #999;font-size: 20px;}
        }
    }
    .mall-charts{
        display: flex;
        margin-top: 10px;
        >div:nth-child(2){
            flex-shrink: 0;
            width: 40%;
        }
        .mall-datas{
            flex-grow: 1;
            color: #999;
            tr:nth-child(1){
                td{
                    padding-top: 10px;
                }
            }
            tr:nth-child(2){
                td{
                    padding-top: 40px;
                }
            }
            td p:nth-child(2){
                margin: 15px 0;
            } 
        }
        .m-price{
            font-size: 20px;
            color: #3a3a3a;
        }
        .m-zr{
            display: flex;
            color: #999;
            justify-content: space-between;
            align-items: center;
            div{
                display: inline-flex;
                align-items: center;
            }
        }
        .m-circle{
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin: 0 10px 0 20px;
        }
        .m-circle-blue{
            background: #1f8efb;
        }
        .m-circle-green{
            background: #37c15f;
        }
        .m-xszs{
            width: 100%;
            height: 150px;
            margin-top: 10px;
        }
    }
    .mall-main{
        display: flex;
        flex-wrap: wrap;
        >div{
            width: 50%;
            box-sizing: border-box;
            padding: 0 10px;
        }
    }
    .mall-charts{
        display: flex;
        margin-top: 10px;
        >div:nth-child(2){
            flex-shrink: 0;
            width: 40%;
        }
        .mall-datas{
            flex-grow: 1;
            color: #999;
            tr:nth-child(1){
                td{
                    padding-top: 10px;
                }
            }
            tr:nth-child(2){
                td{
                    padding-top: 40px;
                }
            }
            td p:nth-child(2){
                margin: 15px 0;
            } 
        }
        .m-price{
            font-size: 20px;
            color: #3a3a3a;
        }
        .m-zr{
            display: flex;
            color: #999;
            justify-content: space-between;
            align-items: center;
            div{
                display: inline-flex;
                align-items: center;
            }
        }
        .m-circle{
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin: 0 10px 0 20px;
        }
        .m-circle-blue{
            background: #1f8efb;
        }
        .m-circle-green{
            background: #37c15f;
        }
        .m-xszs{
            width: 100%;
            height: 150px;
            margin-top: 10px;
        }
    }
    .mall-tips{
        //margin: 20px 0;
        border-bottom: none !important;
        position: relative;
        user-select: none;
        .tips-btn{
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100px;
            height: 30px;
            cursor: pointer;
            border-top: 1px solid @border-color;
            border-left: 1px solid @border-color;
            border-right: 1px solid @border-color;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            padding: 5px 0;
            span{margin-left: 5px;}
        }
    }
    .mall-tips-items{
        margin-top: 30px;
        //padding-left: 30px;
        >div:nth-child(1){font-size: 14px;color:#666;}
        >div:nth-child(2){
            font-size: 12px;
            color:#999;
            display: flex;
            align-items: center;
            margin-top: 10px;
            div{width: 33.33%;}
            a{
                color:#64a4fc;
            }
        }
    }

    .mall-menus-items{
        margin-top: 30px;
        display: flex;
        align-items: center;
        >div{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #666;
            box-sizing: border-box;
            width: 25%;
            //max-width: 320px;
            background: @border-color;
            padding: 10px 0;
            border-right:10px solid #fff; 
            cursor: pointer;
            img{margin-right: 10px;}
        } 
    }
</style>
