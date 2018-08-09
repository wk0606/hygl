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
              <span>仓库门店</span>
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
                  <b @click="openFh(row.id)">已发货</b>
                  <i>-</i>
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
      <order-fh v-if="dialog.show" :views="dialog"></order-fh>
  </div>
</template>
<script>
import { search } from "../serachFilter.js"
import orderFh from './order_fh'
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
          dialog:{
              show:false,
              lx:0,//0 无串号 1 有串号
          }
      }
  },
  methods:{
      //初始化查询条件
      initSearchParams(){
          this.params={};
          this.$set(this.params,'lx',0);
          this.$set(this.params,'value','');
          this.$set(this.params,'xdsj',[]);
          this.$set(this.params,'xtgsid',-1);
          this.$set(this.params,'fhzt',-1);
          this.ckList=this.$util.getCache('ksckList');
          this.ckList.splice(0,0,{
              id:-1,
              name:'全部'
          });
      },
      openFh(id){
          this.dialog.show=true;
          this.dialog.lx=1;
      }
  },
  mounted(){
     this.initSearchParams(); 
  },
  activated(){
     this.initSearchParams(); 
  },
  components:{
      orderFh
  }
}
</script>
<style lang="less" scoped>
    @import '../order.less';
</style>
