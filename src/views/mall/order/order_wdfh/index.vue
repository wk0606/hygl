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
              <el-input size="mini" v-model="params.value" class="order-search-item-input" clearable></el-input>
          </div>
          <div class="order-search-item">
              <span>下单时间</span>
              <date-picker :date.sync="params.xdsj" need-option class="order-search-item-date"></date-picker>
          </div>
          <div class="order-search-item">
              <span>发货仓库</span>
              <el-select
                v-model="params.xtgsid"
                size="mini"
                class="order-search-item-select-small"
              >
                <el-option
                    v-for="item in ckList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
              <span>发货状态</span>
              <el-select
                v-model="params.fhzt"
                size="mini"
                class="order-search-item-select-small"
              >
                <el-option
                    v-for="item in fhType"
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
      <div v-if="!List.length" class="empty-tip">
          <i class="iconfont icon-zanwushuju"></i>
          <span>暂无数据</span>
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
                  <b @click="openDetails(row)">查看详情</b>
                  <i>-</i>
                  <b @click="openComments(row)">备注</b>
              </div>
          </div>
          <order-row
            :columns="colModel"
            :data="row.details"
            :gift="row.gift"
            :zje="row.zje"
            :yfje="row.yfje"
            :records="row.tkrecords"
            @send-out="openFh(row)"></order-row>
          <div class="order-comments" v-if="row.remark">
              <span>卖家备注 : </span>
              <div>{{row.remark}}</div>
          </div>
      </div>
      <!--  -->
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
              {label:'收货人手机号',value:3,name:'收货人搜索'},
              {label:'发货单号',value:4,name:'发货单搜索'}
          ],
          fhType:[
              {label:'全部',value:-1},
              {label:'未发货',value:1},
              {label:'已发货',value:2},
              {label:'无需发货',value:0}
          ],
          ckList:[],
          params:{
              lx:0,
              value:'',
              xdsj:[],
              xtgsid:-1,
              fhzt:-1
          }
      }
  },
  methods:{
      //初始化查询条件
      initSearchParams(){
          this.params={
              lx:0,
              value:'',
              xdsj:[],
              xtgsid:-1,
              fhzt:-1
          };
          this.$util.removeCache('wdfh');
      }
  },
  mounted(){
     this.ckList=this.$util.getCache('ksckList');
     this.ckList.splice(0,0,{
        id:-1,
        name:'全部'
     });
     this.initSearchParams(); 
  },
  activated(){
     this.ckList.splice(0,0,{
        id:-1,
        name:'全部'
     });
     this.initSearchParams(); 
  }
}
</script>
<style lang="less" scoped>
    @import '../order.less';
</style>
