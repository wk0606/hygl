<template>
  <div class="mall-container">
      <div class="mall-header">
          <div>
              <div>
                  <b>{{ssgsname}}</b>
                  <div :class="currentStep?'error':'success'">{{currentStep?"待开业":"开业中"}}</div>
              </div>
              <img src="../../assets/hat.png" alt="" width="30" @click="config.show=!config.show;">
          </div>
          <el-collapse-transition>
            <div class="mall-header-config" v-show="config.show">
                <div>
                    <span>网店开张</span>
                    <i class="el-icon-close" @click="config.show=false;"></i>
                </div>
                <div>
                    <div class="mall-config-left">
                        <div 
                            v-for="(value,key,index) in config.data"
                            :key="key"
                        >
                            <span>{{`${index+1}.${value.label}`}}</span>
                            <span :class="{success:configDatas[key]}">
                              <i :class="configDatas[key]?'el-icon-check':'el-icon-close'"></i>{{configDatas[key]?'已完成':'未完成'}}
                            </span>
                        </div>
                    </div>
                    <div class="mall-config-right">
                        <span>开启网上商城,你必须要有开启微信支付的公众号哦</span>
                        <el-button size="mini">去配置</el-button>
                    </div>
                </div>
            </div>
          </el-collapse-transition>
      </div>
      <!-- 实施概况 -->
      <div>
        <div class="mall-title">
            <b>实时概况</b>
            <span>更新时间 : 2018-09-23 09:23:56 <a>更多数据</a><i class="iconfont icon-bangzhu1"></i></span>
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
                        <p><b class="m-price">{{gkDatas[item.value1]}}</b></p>
                        <p><span>昨日 : {{gkDatas[item.value2]}}</span></p> 
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
                  <a>{{tipsDatas[item.key]||0}}</a>
                </div>
            </div>
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
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      ssgsname: "",
      //实施概况左侧数据
      gkDetails: [
        {
          icon: require("../../assets/je.png"),
          infos: [
            {
              label: "网店销售额(元)",
              key: "wdxse",
              value1: 'wdxsjeNow',
              value2: 'wdxsjeYellow'
            },
            { label: "网店支付订单数", key: "wdzfdd", value1: 'zfddslNow', value2: 'zfddslYellow' }
          ]
        },
        {
          icon: require("../../assets/person.png"),
          infos: [
            { label: "浏览客户数", key: "llkhs", value1: 'wdkhslNow', value2: 'wdkhslYellow' },
            { label: "支付客户数", key: "zfkhs", value1: 'zfkhslNow', value2: 'zfkhslYellow' }
          ]
        }
      ],
      gkDatas:{},
      tipsDatas:{},
      //实施概况网点销售额--统计表数据
      xsje: {
        je: 0,
        zrje: 0,
        jrzs: [],
        zrzs: [],
        xdata: []
      },
      //提醒的项目
      tips: [
        {
          label: "订单相关",
          items: [{ label: "待发货订单", key: 'dfhddsl' }]
        },
        {
          label: "通知消息",
          items: [{ label: "未读客户消息", key: 'wdxxsl' }]
        },
        {
          label: "商品相关",
          items: [
            { label: "网点在售", key: 'zsspsl' },
            { label: "网点缺货", key: 'qhspsl' },
            { label: "库存预警", key: 'kcyjspsl' }
          ]
        }
      ],
      //常用功能
      menus: [
        {
          icon: require("../../assets/1.png"),
          label: "发布网店商品",
          path: "/main/mallchildren/product_sp"
        },
        { icon: require("../../assets/2.png"), label: "网店数据", path: "" },
        {
          icon: require("../../assets/4.png"),
          label: "网点资产",
          path: "/main/mallchildren/asset_jy"
        },
        {
          icon: require("../../assets/3.png"),
          label: "设置中心",
          path: "/main/mallchildren/set_dd"
        }
      ],
      //配置科目
      config: {
        show: true,
        data: {
          iswxgzhpz:{ label: "授权微信公众号支付", status: 0 },
          iswxzhpz:{ label: "配置微信收款账户", status: 0 },
          isfbspxx:{ label: "发布网店商品", status: 0 }
        }
      },
      currentStep:'iswxgzhpz',
      configDatas:{}
    };
  },
  methods: {
    //获取帮助
    getHelpDetails(){
      this.$http('/api/x6/getWdkyHelpInfo.do').then(res=>{
        this.configDatas=res.VO;
        if(!res.VO.iswxgzhpz)
          this.currentStep='iswxgzhpz';
        else if(!res.VO.iswxzhpz)
          this.currentStep='iswxzhpz';
        else if(!res.VO.isfbspxx)
          this.currentStep='isfbspxx';
        else
          this.currentStep='';
      });
    },
    //获取实施概况
    getGkDetails(){
      this.$http('/api/x6/getWdSsgk.do').then(res=>{
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
    //获取提醒数量
    getTipsNumber(){
      this.$http('/api/x6/getZyNotices.do').then(res=>{
        this.tipsDatas=res.VO;
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
    openNav(path) {
      this.$router.push(path);
    }
  },
  mounted() {
    this.ssgsname = this.$util.getCache("user").ssgsname;
    this.getHelpDetails();
    this.getGkDetails();
    this.getTipsNumber();
  }
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
