<template>
  <div>
      <div class="wdsp-header">
          <div>
              <el-button size="mini" type="primary">发布商品</el-button>
              <el-button size="mini" type="warning">网店预览</el-button>
          </div>
          <el-input
            size="mini"
            placeholder="请输入商品名称或条码"
            prefix-icon="el-icon-search"
          ></el-input>
      </div>
      <div class="wdsp-tab">
          <div
            v-for="item in tabs"
            :key="item.value"
            :class="{selected:item.value==currentValue}"
          >{{item.label}}</div>
      </div>
      <div class="wdsp-body">  
          <!-- <el-table
            :data="List"
          >
            <el-table-column
                label=""
            ></el-table-column>
          </el-table> -->
      </div>
      <div class="wdsp-footer">
          <el-checkbox>当页全选</el-checkbox>
          <el-button size="mini">下架</el-button>
          <el-button size="mini">删除</el-button>
      </div>
  </div>
</template>
<script>
export default {
  data(){
      return {
          tabs:[
              {label:'销售中',value:'1'},
              {label:'已售罄',value:'2'}
          ],
          currentValue:'1',
          List:[]
      }
  }
}
</script>
<style lang="less" scoped>
    .wdsp-header{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0 15px 0;
        .el-input{width: 250px;}
    }
    
    .wdsp-body{
        height: ~"calc(100% - 138px)";
    }
    .wdsp-footer{
        display: flex;
        align-items: center;
        padding-top: 10px;
        .el-checkbox{margin-right: 20px;}
    }
</style>
