<template>
  <div>
      <div class="g-header">
          <el-button size="mini" type="primary" @click="openAdd">新建分组</el-button>
      </div>
      <div class="g-body">
          <m-table
            :data="List"
            :col-model="colModel"
          >
            <el-table-column
                slot="table-column"
                width="80"
                label="操作"
                align="center"
            >
                <template slot-scope="scope">
                    <el-button size="small" type="text" style="padding:0;">预览</el-button>
                </template>
            </el-table-column>
          </m-table>
      </div>
  </div>
</template>
<script>
import mTable from '../../../../components/table/index'
export default {
  data(){
      return {
          List:[
              {name:'春季新品',sl:3,zdrq:'2018-09-09 12:23:45',id:3}
          ],
          colModel:[
              {label:'分组名称',prop:'name',align:'left',render:true,click:this.openView},
              {label:'商品数',prop:'sl'},
              {label:'创建时间',prop:'zdrq'}
          ],
      }
  },
  methods:{
      openView(){
          console.log(2322)
      },
      openAdd(){
          this.$router.push('/main/mallchildren/product_group_add/-1');
      }
  },
  components:{
      mTable
  }
}
</script>
<style lang="less" scoped>
    .g-header{
        padding-bottom: 10px;
    }
    .g-body{
        height: ~"calc(100% - 38px)";
    }
</style>

