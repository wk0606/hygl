<template>
  <div>
      <div class="set-gray-head">
          <div class="set-gray-head-top">
              <div>
                  <p><b>买家上门自提功能</b></p>
                  <p>启用买家上门自提功能后,买家可以选择你就近预设的自提点.下单后你需要尽快将商品配送至指定的自提点.</p>
              </div>
              <el-switch
                v-model="openZt"
                active-color="#13ce66"
                inactive-color="#ccc">
              </el-switch>
          </div>
          <!-- <p><a>查看 [上门自提] 功能使用教程</a></p> -->
      </div>
      <div class="smzt-add">
          <el-button size="small" type="success" @click="dialog.show=true">新增自提点</el-button>
      </div>
      <div class="smzt-table">
          <m-table
            :data="List"
            :col-model="colModel"
          >
            <el-table-column
                slot="table-column"
                width="80"
                label="操作"
                prop="cz"
                align="center"
            >
                <template slot-scope="scope">
                    <span class="cell-span cell-span-blue" @click="open">开启</span>
                </template>
            </el-table-column>
          </m-table>
      </div>
      <add v-if="dialog.show" :views="dialog"></add>
  </div>
</template>
<script>
import mTable from '../../../../../components/table/index'
import add from './smzt_add'
export default {
  data(){
      return {
          openZt:true,
          colModel:[
              {label:'自提点名称',prop:'name',align:'left'},
              {label:'省份',prop:'province'},
              {label:'城市',prop:'city'},
              {label:'县区',prop:'town'},
              {label:'地址',prop:'dz',align:'left'},
              {label:'联系电话',prop:'phone'}
          ],
          List:[
              {name:'郝大通若水路自提点',province:'江苏省',city:'苏州市',town:'工业园区',dz:'若水路388号纳米大学科技园',phone:'13584833734'}
          ],
          dialog:{
              show:false
          }
      }
  },
  methods:{
      getGsList(){
          this.$http('/api/x6/getXtGsList.do').then(res=>{
              console.log(res);
          });
      },
      open(){
          window.location.reload()
          //this.$router.push('/main/mallchildren/set_dd/5');
      }
  },
  mounted(){
      this.getGsList();
  },
  components:{
      mTable,
      add
  }
}
</script>
<style lang="less" scoped>
    .smzt-add{
        padding: 15px 0;
    }
    .smzt-table{
        height: ~"calc(100% - 174px)";
        border: 1px solid #f0f0f0;
    }
</style>
