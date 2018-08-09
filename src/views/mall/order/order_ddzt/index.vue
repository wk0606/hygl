<template>
  <div>
      <div class="order-zt">
          <span>验证提货码</span>
          <div>
              <div><input type="text" v-model="thm" placeholder="请输入提货码或使用扫描枪扫描"></div>
              <div>核销</div>
          </div>
      </div>
      <div class="order-search">
          <div class="order-search-item">
              <span>{{getSerachLabel}}</span>
              <el-select
                v-model="params.lx"
                size="mini"
                class="order-search-item-select"
              >
                <el-option
                    v-for="item in searchType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
              <el-input size="mini" v-model="params.value" class="order-search-item-input"></el-input>
          </div>
          <div class="order-search-item">
              <span>下单时间</span>
              <el-date-picker
                v-model="params.xdsj"
                size="mini"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                class="order-search-item-date">
              </el-date-picker>
              <div class="order-btn" @click="selectDate(0)">今</div>
              <div class="order-btn" @click="selectDate(1)">昨</div>
              <div class="order-btn" @click="selectDate(7)">最近7天</div>
              <div class="order-btn" @click="selectDate(30)">最近30天</div>
          </div>
          <div class="order-search-item">
              <span>自提点</span>
              <el-select
                v-model="params.thmd"
                size="mini"
                class="order-search-item-select-small"
              >
                <el-option
                    v-for="item in ztdList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
              <span>自提状态</span>
              <el-select
                v-model="params.ztzt"
                size="mini"
                class="order-search-item-select-small"
              >
                <el-option
                    v-for="item in ztType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
          </div>
          <div class="order-search-item order-search-footer">
              <el-button size="mini" type="primary" @click="search">筛选</el-button>
              <el-button size="mini" @click="exportExcel">导出报表</el-button>
              <el-button size="mini" type="text" @click="initSearchParams">清空筛选条件</el-button>
          </div>
      </div>
      <div class="order-table-item order-table-header">
          <div 
            v-for="item in colModel"
            :key="item.prop"
            :style="{width:item.width,textAlign:item.align}"
          >{{item.label}}</div>
      </div>
      <div
        class="order-table-body"
        v-for="row in List"
        :key="row.ddh"
      >
          <div class="order-table-title">
              <div>
                  <span>订单号 : {{row.ddh}}</span>
                  <span>下单时间 : {{row.zdrq}}</span>
              </div>
              <div>
                  <b @click="openDetails(row.id)">查看详情</b>
                  <i>-</i>
                  <b>备注</b>
              </div>
          </div>
          <div
            class="order-table-item order-table-row"
            v-for="row in row.details"
            :key="row.id"
          >
              <div>
                  <img :src="row.sptpfirst" alt="">
                  <span class="cell-span">{{row.spname}}</span>
              </div>
              <div class="order-table-row-border">
                  <div>￥{{row.spdj | currency}}</div>
                  <div>{{row.sl}}</div>
              </div>
              <div class="order-table-row-border">
                  <div>{{row.mjname}}</div>
                  <div>{{row.shr}} {{row.shrlxfs}}</div>
              </div>
              <div class="order-table-row-border">
                  <span>{{row.psfs?'自提':'快递'}}</span>
              </div>
              <div class="order-table-row-border">
                  <span>{{row.je}}</span>
              </div>
              <div class="order-table-row-border">
                  <span>{{row.ddzt}}</span>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import { search } from "../serachFilter.js"
export default {
  props:['page'],
  mixins: [search],
  data() {
    return {
      searchType: [
        { label: "订单号", value: 0, name: "订单搜索" },
        { label: "商品名称", value: 1, name: "商品搜索" },
        { label: "收货人姓名", value: 2, name: "收货人搜索" },
        { label: "收货人手机号", value: 3, name: "收货人搜索" }
      ],
      ddType: [
        { label: "全部", value: 0 },
        { label: "待付款", value: 1 },
        { label: "待发货", value: 2 },
        { label: "已完成", value: 3 }
      ],
      ztType: [
        { label: "全部", value: 0 },
        { label: "带自提", value: 1 },
        { label: "已自提", value: 2 }
      ],
      ztdList:[],
      thm:''
    };
  },
  methods: {
    //初始化查询条件
    initSearchParams() {
      this.params = {};
      this.$set(this.params, "lx", 0);
      this.$set(this.params, "value", "");
      this.$set(this.params, "xdsj", []);
      this.$set(this.params, "thmd", -1);
      this.$set(this.params, "ztzt", 0);
      this.ztdList=this.$util.getCache('ztdList');
      this.ztdList.splice(0,0,{
        id:-1,
        name:'全部'
      });
    }
  },
  mounted() {
    this.initSearchParams();
  },
  activated(){
    this.initSearchParams();
  }
};
</script>
<style lang="less" scoped>
@import "../order.less";
@import "./index.less";
</style>
