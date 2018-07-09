<template>
  <el-table
    :data="data"
    stripe
    :height="height"
    header-cell-class-name="el-table-drak-head"
  >
    <el-table-column
        v-for="row in colModel"
        :key="row.prop"
        :label="row.label"
        :prop="row.prop"
        header-align="center"
        :align="row.align || 'center'"
    >
        <template slot-scope="scope">
            <span class="cell-span">{{scope.row[row.prop]}}</span>
        </template>
    </el-table-column>
    <slot name="table-column"></slot>
  </el-table>
</template>
<script>
export default {
  props:{
      data:{required:true},
      colModel:{require:true},
      height:{default:'100%'}
  }
}
</script>
<style lang="less" scoped>
    
</style>
