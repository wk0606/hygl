<template>
  <div>
      <div class="set-ksck-header">
          <el-input
            size="mini"
            placeholder="请输入仓库名称搜索"
            v-model="ckname"
            style="width:200px;"
          ></el-input>
          <span>公司 :</span>
          <company-select
            v-model="gsbm"
            @change="searchList"
          ></company-select>
      </div>
      <el-table
        :data="List"
        stripe
        border
        header-cell-class-name="el-table-drak-head"
      >
        <el-table-column
            v-for="item in colModel"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            header-align="center"
        ></el-table-column>
      </el-table>
  </div>
</template>
<script>
import companySelect from '../../../../components/companySelect/index'
export default {
  data(){
      return{
          ckname:'',
          gsbm:'',
          List:[],
          colModel:[
              {label:'机构名称',prop:'name',align:'left'},
              {label:'所属机构',prop:'ssgs'},
              {label:'省份',prop:'province'},
              {label:'城市',prop:'city'},
              {label:'县区',prop:'town'},
              {label:'地址',prop:'dz'}
          ],
          currentBm:[],
          currentMdBm:''
      }
  },
  methods:{
      getData(){
          
      },
      searchList(item){
          //console.log('接收到了');
      }
  },
  mounted(){
      this.getData();
  },
  components:{
      companySelect
  }
}
</script>
<style lang="less" scoped>
    .set-ksck-header{
        padding: 10px 0 15px 0;
        display: flex;
        align-items: center;
        span{margin-right: 5px;margin-left: 25px;}
    }
    .success{color:#67C23A;}
    .error{color:#F56C6C;}
</style>
