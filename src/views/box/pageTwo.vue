<template>
  <div style="height:100%;">
    <el-table 
      :data="allDatas"
      stripe
      border
      height="calc(100% - 30px)"
    >
     <el-table-column
          v-for="col in colModel"
          :key="col.prop"
          :label="col.label"
          :prop="col.prop"
          header-align="center"
          :align="col.align||'center'"
          :width="col.width"
          :min="col.min"
      >
          <template slot-scope="scope">
              <span class="cell-span">
                  {{col.currency?$util.formatCash(scope.row[col.prop]):scope.row[col.prop]}}
              </span>
          </template>
      </el-table-column>
    </el-table>
    <div class="slide-total">
      <b>合计</b>
      <span>数量</span>
      <b>{{allDatas.length}}</b>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      control: {}
    },
    data() {
      return {
        showDatas: [],
        allDatas: [],
        colModel:[
          {label:'姓名',prop:'name',align:'center',width:110},
          {label:'手机',prop:'phone',width:110},
          {label:'消费次数',prop:'xfcs'},
          {label:'消费金额',prop:'zje',align:'right',currency:true},
          {label:'综合毛利',prop:'zlr',align:'right',currency:true},
          {label:'本次消费金额',prop:'bcxfje',align:'right',currency:true}
        ]
      }
    },
    mounted() {
      this.allDatas = this.control.oldList;
    }
  }
</script>
<style lang="less" scoped>
  .slide-total{
    box-sizing:border-box;
    padding:10px;
    font-size:14px;
    b{margin-right:15px;}
  }
</style>