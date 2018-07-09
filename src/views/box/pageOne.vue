<template>
  <div>
    <div class="topDetail">
      <div class="detail-wrapper" ref="detailWrapper">
         <span class="title">客流量
        <i class="sl">{{control.allKh}}</i>
      </span>
        <span class="title">新客户
        <i class="sl">{{control.newList.length}}</i>
      </span>
        <span class="title">回头客
        <i class="sl">{{control.oldList.length}}</i>
      </span>
        <span class="title">近一小时新增
        <i class="sl">{{getLeastOneHourAdd()}}</i>
      </span>
      </div>
    </div>
    <div ref="charts" style="width: 100%;height:150px;"></div>
    <div class="table">
      <p>
        <span>时间段</span>
        <span>客流量</span>
      </p>
      <p v-for="(obj,i) in showDatas" :key="i">
        <span>{{obj.sjd}}</span>
        <span>
         {{obj.sl}}
          <img src="../../assets/shang.png" v-if="obj.qs=='up'">
          <img src="../../assets/xia.png" v-if="obj.qs=='down'">
         </span>
      </p>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    props: {
      control: {}
    },
    data() {
      return {
        showDatas: [],
        reserveDatas: [],
        list: (function () {
          let temp = [];
          for (let i = 20170380; i < 20170401; i++) {
            let obj = {};
            obj.date = i.toString().substring(0, 4) + '-' + i.toString().substring(4, 6) + '-' + i.toString().substring(6);
            obj.jg = (function () {
              return Math.ceil(Math.random() * 10000);
            })();
            temp.push(obj);
          }
          return temp;
        })()
      }
    },

    components: {},

    methods: {
      getHtk() {
        let sl = 0
        this.control.oldList.forEach((item) => {
          if (item.xfcs > 1) {
            sl++
          }
        })
        return sl
      },


      total() {
        let sl = 0
        this.showDatas.forEach((item) => {
          sl += item.sl;
        })
        return sl;
      },
      getLeastOneHourAdd() {
        let sl = 0
        if (this.showDatas.length > 6) {
          for (let i = 0; i < 6; i++) {
            sl += this.showDatas[i].sl
          }
        } else {
          this.showDatas.forEach((item) => {
            sl += item.sl;
          })
        }
        return sl;
      },

      getDatas() {
        this.showDatas = this.$util.deepCopy(this.control.zxtlList);
        this.reserveDatas = []
        for (let i = this.showDatas.length - 1; i >= 0; i--) {
          this.reserveDatas.push(this.showDatas[i]);
        }
//        console.log(this.showDatas, this.reserveDatas)
        this.setEcharts();
        if (this.showDatas.length == 0) {
          return
        }
        this.$set(this.showDatas[this.showDatas.length - 1], 'qs', '')
        for (let i = 0; i < this.showDatas.length - 1; i++) {
          if (this.showDatas[i].sl > this.showDatas[i + 1].sl) {
            this.$set(this.showDatas[i], 'qs', 'up')
          } else if (this.showDatas[i].sl == this.showDatas[i + 1].sl) {
            this.$set(this.showDatas[i], 'qs', '')
          } else {
            this.$set(this.showDatas[i], 'qs', 'down')
          }
        }
      },
      setEcharts() {
        let xdata = [];
        let ydata = [];
        for (let obj of this.reserveDatas) {
          xdata.push((obj.sjd));
          ydata.push(obj.sl);
        }
        //echarts
        var myChart = echarts.init(this.$refs.charts);
        // 指定图表的配置项和数据
        var option = {
          grid: {
            top:10,
            right:40,
            bottom: 30,
            left: 50,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'category',
            data: xdata,
            boundaryGap: false,
            splitLine: {
              show: true,
              interval: 'auto',
              lineStyle: {
                color: ['#D4DFF5']
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#609ee9'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                color: ['#D4DFF5']
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#609ee9'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            }
          },
          series: [{
            name: '客流量',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 6,
            data: ydata,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(216, 244, 247,1)'
                }, {
                  offset: 1,
                  color: 'rgba(216, 244, 247,1)'
                }], false)
              }
            },
            itemStyle: {
              normal: {
                color: '#58c8da'
              }
            },
            lineStyle: {
              normal: {
                width: 3
              }
            }
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    },

    computed: {},

    mounted() {
      this.getDatas()
    },
    watch: {
      "control.zxtlList"(val) {
        this.getDatas()
      }
    }
  }

</script>

<style lang="less" scoped>
  @commonFontSize: 14px;
  .topDetail {
    font-size: @commonFontSize;
    .all-wrapper {
      box-sizing: border-box;
      .allSl {
        margin-left: 20px;
        font-size: @commonFontSize;
        font-weight: bold;
      }
    }
    .detail-wrapper {
      box-sizing: border-box;
      .title {
        width: 20%;
        max-width: 150px;
        display: inline-block;
        text-align: center;
        line-height: 20px;
        .sl {
          display: block;
          font-size: @commonFontSize;
          line-height: 30px;
          font-weight: bold;
          color: #333;
        }
      }
    }
  }

  .table {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #d2d2d2;
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    p {
      width: 100%;
      height: 35px;
      border-top: 1px solid #d2d2d2;
      overflow: hidden;
      span {
        display: block;
        float: left;
        width: 50%;
        height: 100%;
        box-sizing: border-box;
        text-align: center;
        line-height: 35px;
        position: relative;
        img {
          position: absolute;
          width: 15px;
          height: 15px;
          top: 12.5px;
          right: 100px;
        }
      }
      span:nth-child(1) {
        border-right: 1px solid #d2d2d2;
      }
    }
    > p:first-child {
      border-top: 0;
      background: #fafdff;
      font-size: 12px;
    }
  }
</style>
