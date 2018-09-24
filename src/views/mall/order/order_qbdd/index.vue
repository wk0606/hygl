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
              <date-picker :date.sync="params.xdsj" need-option class="order-search-item-date"></date-picker>
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
                  <b @click="openDetails(row.ddh)">查看详情</b>
                  <i>-</i>
                  <b @click="openComments(row)">备注</b>
              </div>
          </div>
          <order-row :columns="colModel" :data="row.details" :sfje="row.zje"></order-row>
          <div class="order-comments" v-if="row.remark">
              <span>卖家备注 : </span>
              <div>{{row.remark}}</div>
          </div>
      </div>
  </div>
</template>
<script>
import { search } from "../serachFilter.js"
export default {
  props:['page'],
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
            {label:'待付款',value:0},
            {label:'待发货',value:1},
            {label:'待收货',value:2},
            {label:'已完成',value:3},
            {label:'已关闭',value:4}
          ],
          psType:[
              {label:'全部',value:-1},
              {label:'快递',value:1},
              {label:'自提',value:0}
          ],
          params: {
              lx:0,
              value:'',
              xdsj:[],
              ddzt:-1,
              psfs:-1
          },
      }
  },
  computed:{
      getCount(){
          return this.$store.state.count;
      }
  },
  methods:{
      add(){
          var c=this.$store.state.count;
          c+=1;
          this.$store.commit('updateCount',c);
      },
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
     //this.initSearchParams(); 
  }
}
</script>
<style lang="less" scoped>
    @import '../order.less';
</style>
