<template>
	<div class="rootContainer" ref="root">
		<div class="root-title">
			<span>运营视窗</span>
			<div>
				<date-range :range.sync="range" @change="getData"></date-range>
			</div>
		</div>
		<div class="tab">
			<div
				v-for="item in tabs"
				:key="item.value"
				:class="{selected:item.value==currentTab}"
				@click="currentTab=item.value"
			>{{item.label}}</div>
		</div>
		<component :is="currentTab" :date="times" :text="setText"></component>
	</div>
</template>
<script>
import dateRange from "../../components/dateRange/index";
import mdsj from "./md_data";
import wdsj from "./wd_data";
import {Loading} from '../../func/loading'
export default {
  name: "hy_statistics",
  data() {
    return {
      range: "date",
      tabs: [
        { label: "门店", value: "mdsj" },
        { label: "网店", value: "wdsj" }
      ],
      currentTab: "mdsj",
      times: null
    };
  },
  computed: {
    setText() {
      if (this.range == "date") return ["较上一日", "较上周同期"];
      else if (this.range == "week") return ["较上一周", "较去年同期"];
      else return ["较上一月", "较去年同期"];
    }
  },
  methods: {
    getData(date) {
      this.times = date;
	},
	openLoading(){
		Loading.open({
			target:this.$refs.root,
			height:document.body.offsetHeight
		});
	},
	closeLoading(){
		Loading.close();
	}
  },
  mounted() {

  },
  components: {
    dateRange,
    mdsj,
    wdsj
  }
};
</script>
<style  lang="less" scoped>
@border-color: #f2f2f2;
.rootContainer {
  height: 100%;
  background: #fff;
  padding: 10px 0;
  height: auto !important;
  position: relative;
  > div {
    box-sizing: border-box;
  }
  .root-title {
    padding: 10px;
    background: #f8f9f8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
    span {
      font-size: 14px;
    }
  }
  .tab {
    padding: 0;
    border: none;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid @border-color;
    > div {
      width: 100px;
      padding: 7px 10px;
      border: 1px solid @border-color;
      border-bottom: none;
      cursor: pointer;
      border-radius: 4px;
      font-size: 14px;
      text-align: center;
      margin-bottom: -1px;
    }
    > div:nth-child(2) {
      margin-left: -1px;
    }
    .selected {
      background: #b1e7fc;
    }
  }
  .chart-menu {
    display: flex;
    justify-content: center;
    padding: 10px;
    user-select: none;
    > div {
      width: 150px;
      height: 150px;
      border-radius: 4px;
      border: 1px solid #ccc;
      margin: 0 10px;
      box-sizing: border-box;
      padding: 8px;
      cursor: pointer;
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          display: inline-flex;
          width: 70px;
          align-items: center;
          color: #666;
        }
        span::nth-child(2) {
          justify-content: flex-end;
        }
      }
    }
    .selected {
      border-color: #409eff;
      background: #e8f2ff;
    }
  }
  .chart-body {
    height: 300px;
    background: #fff;
  }
  .el-row {
    margin: 0 !important;
    .activity-chart {
      height: auto;
      background: #f8f9f8;
      box-sizing: border-box;
      padding: 10px;
      div {
        height: 200px;
      }
      p {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        b {
          margin-right: 5px;
        }
        i {
          transform: scale(0.8, 0.8);
          cursor: pointer;
        }
        span {
          display: inline-flex;
          width: 70px;
          align-items: center;
          color: #666;
        }
        span::nth-child(2) {
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>