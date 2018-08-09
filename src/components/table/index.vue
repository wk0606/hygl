<template>
  <el-table
    :data="data"
    stripe
    :height="height"
    header-cell-class-name="el-table-drak-head"
    @select="selectRow"
    @select-all="selectAll"
    @selection-change="selectChange"
    ref="mTable"
  >
    <el-table-column
      type="selection"
      width="55"
      align="center"
      v-if="needSelection"
    ></el-table-column>
    <el-table-column
        v-for="row in colModel"
        :key="row.prop"
        :label="row.label"
        :prop="row.prop"
        header-align="center"
        :align="row.align || 'center'"
        :render-header="row.render?renderFilterHead:null"
    >
        <template slot-scope="scope">
            <span
              class="cell-span"
              :class="row.class?row.class(scope.row):row.click?'cell-span-blue':''"
              @click="row.click?row.click(scope.row,scope.row[row.prop]):null"
            >{{scope.row[row.prop]}}</span>
        </template>
    </el-table-column>
    <slot name="table-column"></slot>
  </el-table>
</template>
<script>
import bus from '../../func/eventBus'
export default {
  props:{
      data:{required:true},
      filterList:{},
      colModel:{require:true},
      height:{default:'100%'},
      needSelection:{default:false}
  },
  data(){
    return {
      filterColumn: {
          datas:null
      }
    }
  },
  methods:{
    selectRow(val,row){
      this.$emit('select',val);
    },
    selectAll(val,row){
      this.$emit('select-all',val);
    },
    selectChange(val){
      this.$emit('selection-change',val);
    },
    clearSelection(){
      this.$refs.mTable.clearSelection();
    }
  },
  updated(){
    this.filterColumn.datas=this.filterList;
  }
}
</script>
<style lang="less" scoped>
    
</style>
