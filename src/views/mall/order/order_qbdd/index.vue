<template>
  <div>
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
              <span>订单状态</span>
              <el-select
                v-model="params.ddzt"
                size="mini"
                class="order-search-item-select-small"
              >
                <el-option
                    v-for="item in ddType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
              <span>配送方式</span>
              <el-select
                v-model="params.psfs"
                size="mini"
                class="order-search-item-select-small"
              >
                <el-option
                    v-for="item in psType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
          </div>
          <div class="order-search-item order-search-footer">
              <el-button size="mini" type="primary" @click="search" :loading="load1">筛选</el-button>
              <el-button size="mini" @click="exportExcel" :loading="load2">导出报表</el-button>
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
      <div class="order-table-body">
          <div class="order-table-title">
              <div>
                  <span>订单号 : E97876544489099</span>
                  <span>下单时间 : 2018-09-09 12:23:34</span>
              </div>
              <div>
                  <b>查看详情</b>
                  <i>-</i>
                  <b>备注</b>
              </div>
          </div>
          <div
            class="order-table-item order-table-row"
            v-for="row in List"
            :key="row.id"
          >
              <div>
                  <img :src="row.sptpfirst" alt="">
                  <span class="cell-span cell-span-blue" @click="openDetails(row.id)">{{row.spname}}</span>
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
  mixins: [search],
  data(){
      return {
          searchType:[
              {label:'订单号',value:0,name:'订单搜索'},
              {label:'商品名称',value:1,name:'商品搜索'},
              {label:'收货人姓名',value:2,name:'收货人搜索'},
              {label:'收货人手机号',value:3,name:'收货人搜索'}
          ],
          ddType:[
            {label:'全部',value:-1},
            {label:'已下单',value:0},
            {label:'已付款',value:1},
            {label:'已发货',value:2},
            {label:'已完成',value:3}
          ],
          psType:[
              {label:'全部',value:-1},
              {label:'快递',value:0},
              {label:'自提',value:1}
          ]
      }
  },
  methods:{
      //初始化查询条件
      initSearchParams(){
          this.params={};
          this.$set(this.params,'lx',0);
          this.$set(this.params,'value','');
          this.$set(this.params,'xdsj',[]);
          this.$set(this.params,'ddzt',-1);
          this.$set(this.params,'psfs',-1);
      }
  },
  mounted(){
     this.initSearchParams(); 
  }
}
</script>
<style lang="less" scoped>
    @import '../component.less';
</style>
