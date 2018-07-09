<template>
  <div class="edit-dialog" ref="rootDiv" @click.stop="">
    <div class="edittitle">
      <div>
        <img src="../../assets/trace.png" width="40"/>
        <span>客流量详情 （ <i style="color: #20a0ff">{{control.item.name}}</i><i
          style="margin-left: 8px">{{control.item.fsrq}}</i> ）</span>
      </div>
      <i class="el-icon-close i-close" @click="editClose"></i>
    </div>

    <div class="content-wrapper">
      <span class="unbind" @click="unbindBox">
          解除绑定
      </span>
      <el-tabs v-model="selectIndex">
        <el-tab-pane
          v-for="(item,index) in tabNavs"
          :key="index"
          :name="item.name"
        >
          <span slot="label">
            {{item.name}}
            <i v-if="item.help" class="iconfont icon-bangzhu" :title="item.help"></i>
          </span>
        </el-tab-pane>
      </el-tabs>
      <div class="tab-body">
        <page-one v-if="selectIndex == tabNavs[0].name" :control="controlDatas"></page-one>
        <page-two v-if="selectIndex == tabNavs[2].name" :control="controlDatas"></page-two>
        <page-three v-if="selectIndex == tabNavs[1].name" :control="controlDatas"></page-three>
      </div>
    </div> 
  </div>
</template>
<script>
  import pageOne from './pageOne'
  import pageTwo from './pageTwo'
  import pageThree from './pageThree'

  export default {
    components: {pageOne, pageTwo, pageThree},
    props: {
      control: {
        required: true
      },
    },
    data() {
      return {
        tabNavs: [{name: '预览'}, {name: '新客户',help:'当天注册的客户数'} ,{name: '回头客',help:'非当天注册的客户数'}],
        selectIndex: "预览",
        controlDatas: {
          tableHeight: 500,
          showLoading: false,
          zxtlList: [],
          newList: [],
          oldList: [],
          timeRangeList: [],
          allKh:0
        }
      }
    },
    methods: {
      unbindBox() {
        this.$confirm('解绑麦芽盒子后将无法获取该门店的客流量数据以及考勤记录，确定要解绑麦芽盒子？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: "warning",
        }).then(() => {
          this.$http("/api/x6/box/unbindbox.do", {
            gsdm: this.$util.getCache('user').gsdm,
            ssgsid: this.control.item.id
          }).then((response) => {
            this.control.item.havebind = 0
            this.$message('解绑成功');
            this.control.show = false;
          })
        });
      },
      getDatas() {
        this.getTimeRangeList()
        this.controlDatas.showLoading = true
        this.$http("/api/x6/box/getKlldetail.do", {
          ssgsid: this.control.item.id,
          fsrq: this.control.item.fsrq,
        }).then((response) => {
          this.getFormatTime(response.VO.macList)
          this.controlDatas.oldList = response.VO.oldClientList
          this.controlDatas.newList = response.VO.newClientList
          this.controlDatas.allKh=response.VO.macList.length;
          this.timeRangeList.reverse()

          this.controlDatas.zxtlList = this.timeRangeList
          this.controlDatas.showLoading = false
        }).catch(() => {

          this.controlDatas.showLoading = false
        })
      },

      getTimeRangeList() {
        let isToday = this.control.item.fsrq == this.$util.getCurrentDate();
        let endHour = 23
        let endMin = 59
        this.timeRangeList = []
        if (isToday) {//如果是今天
          let current = new Date()
          endHour = current.getHours()
          endMin = current.getMinutes()
        }

        for (let i = 7; i <= endHour; i++) {
          for (let j = 0; j < 60; j += 10) {
            if (i == endHour && j > endMin) {
              break
            }
            this.timeRangeList.push({
              hour: i,
              minq: j,
              minz: j + 10,
              start: 60 * i + j,
              sl: 0,
              end: 60 * i + j + 10,
              sjd: (i > 9 ? i : ('0' + i)) + ":" + (j == 0 ? "00" : j) + " ~ " + (i > 9 ? i : ('0' + i)) + ":" + ((j + 10) == 60 ? 59 : (j + 10))
            })
          }
        }
      },
      getFormatTime(originList) {
        originList.forEach(item => {
          let timeStart = item.time[0]
          let timeEnd = item.time[1]
          let hour1 = Number(timeStart.substr(0, 2));//取出小时
          let min1 = Number(timeStart.substr(3, 2));//取出分
          let hour2 = Number(timeEnd.substr(0, 2));//取出小时
          let min2 = Number(timeEnd.substr(3, 2));//取出分
          let startIsFind = false
          let endIsFind = false
          let inIndex = -1
          item.fsrq = timeStart + "~" + timeEnd
          for (let i = 0; i < this.timeRangeList.length; i++) {
            if (!startIsFind && this.timeRangeList[i].start < (hour1 * 60 + min1) && this.timeRangeList[i].end > (hour1 * 60 + min1)) {
              if (inIndex != -i) {
                inIndex = i
                this.timeRangeList[i].sl++
              }
              startIsFind = true
            }
            if (!endIsFind && this.timeRangeList[i].start < (hour2 * 60 + min2) && this.timeRangeList[i].end > (hour2 * 60 + min2)) {
              if (inIndex != -i) {
                inIndex = i
                this.timeRangeList[i].sl++
              }
              endIsFind = true
            }
            if (endIsFind == true && startIsFind == true) {
              break
            }
          }
        })
      },
      editClose() {//关闭
        this.control.show = false;
      },
    },
    watch: {
      "control.item"(val) {
        this.selectIndex = this.tabNavs[0].name
        this.getDatas()
      }
    },
    mounted() {
      let height = this.$refs.rootDiv.offsetHeight
      this.controlDatas.tableHeight = height - 33 - 77 - 20
      this.getDatas()
    }
  }
</script>
<style lang="less" scoped>
  .edit-dialog {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 600px;
    background: #fff;
    z-index: 8;
    padding: 15px 15px 0 15px;
    border: 1px solid #e2e3e5;
    box-sizing:border-box;
    height:100%;
    .unbind {
      position: absolute;
      right: 0;
      top: 12px;
      font-size: 14px;
      cursor: pointer;
      color: #409EFF;
      z-index:8;
    }
    .edittitle {
      display:flex;
      align-items:center;
      justify-content:space-between;
      font-size:14px;
      >div{
        display:inline-flex;
        align-items:center;
      }
    }
    .content-wrapper {
      width: 100%;
      height: ~"calc(100% - 40px)";
      box-sizing: border-box;
      font-size: 12px;
      position:relative;
      .tab-body{
        height:~"calc(100% - 40px)";
        margin-top:-14px;
        box-sizing:border-box;
        padding:10px 0;
        overflow-y:auto;
      }
    }
  }

</style>
