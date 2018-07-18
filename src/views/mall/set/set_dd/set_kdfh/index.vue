<template>
  <div>
      <div class="set-gray-head">
          <div class="set-gray-head-top">
              <div>
                  <p><b>快递发货功能</b></p>
                  <p>启用后,买家下单可以选择快递发货,由你安排快递送货上门.</p>
              </div>
              <el-switch
                v-model="openKt"
                active-color="#13ce66"
                inactive-color="#ccc"
                @change="updateZtStatus">
              </el-switch>
          </div>
      </div>
      <div class="kdfh-add">
          <el-button size="small" type="success" @click="openAdd(-1)">新增运费模板</el-button>
      </div>
      <div
        class="kdfh-table"
        v-for="(data,index) in List"
        :key="data.id"
      >
          <div class="kdfh-table-top" @click="data.show=!data.show">
              <span>{{data.name}}</span>
              <div>
                  <div>最后编辑时间 {{data.zdrq}}</div>
                  <span>-</span>
                  <el-button size="mini" type="text" @click.stop="openAdd(data.id)">修改</el-button>
                  <span>-</span>
                  <el-button size="mini" type="text" @click.stop="remove(data,index)">删除</el-button>
                  <i class="el-icon-caret-top"></i>
              </div>
          </div>
          <el-collapse-transition>
                <el-table
                    :data="data.data"
                    v-if="data.show"
                >
                    <el-table-column
                        v-for="item in colModel"
                        :key="item.prop"
                        :label="item.label"
                        :prop="item.prop"
                        header-align="center"
                        :align="item.align || 'center'"
                        :width="item.width"
                    >
                        <template slot-scope="scope">
                            <span class="cell-span-wrap">{{item.format?item.format(scope.row[item.prop]):scope.row[item.prop]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
          </el-collapse-transition>
      </div>
  </div>
</template>
<script>
import mTable from '../../../../../components/table/index'
export default {
  data(){
      return {
          openKt:true,
          colModel:[
              {label:'可配送区域',prop:'dq',align:'left',format:this.formatDp},
              {label:'首件（个）',prop:'firstsl',width:120},
              {label:'运费（元）',prop:'firstje',width:120},
              {label:'需件（个）',prop:'secondsl',width:120},
              {label:'运费（元）',prop:'secondje',width:120}
          ],
          List:[],
          dialog:{
              show:false
          }
      }
  },
  methods:{
      updateZtStatus(){
          this.$http('/api/x6/updateKdgnzt.do',{
              kdkqzt:this.openKt?1:0
          });
      },
      getList(){
          this.$http('/api/x6/getHySetKdmbList.do').then(res=>{
              this.openKt=JSON.parse(res.VO.data).kdkqzt?true:false;
              for(let obj of res.List){
                  obj.data=JSON.parse(obj.data);
                  obj.show=true;
              }
              this.List=res.List;
          });
      },
      formatDp(val){
          return val.join(',');
      },
      openAdd(id){
        this.$router.push(`/main/mallchildren/set_dd_addkd/${id}`);  
      },
      remove(row,index){
        this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http('/api/x6/HySetKdmbDel.do',{
              ids:row.id
          }).then(res=>{
            this.List.splice(index,1);
            this.$message('删除成功');
          });
        }).catch(() => {
                  
        });
      },
  },
  mounted(){
      this.getList();
  },
  activated(){
      var row=this.$util.getCache('KDMB');
      if(row){
          row.data=JSON.parse(row.data);
          this.List.push(row);
          this.$util.removeCache('KDMB');
      }
  },
  components:{
      mTable
  }
}
</script>
<style lang="less" scoped>
    .kdfh-add{
        padding: 15px 0;
    }
    .kdfh-table{
        border: 1px solid #f0f0f0;
        margin-bottom: 15px;
        .kdfh-table-top{
            box-sizing: border-box;
            padding: 10px;
            background: #f0f0f0;
            font-size: 12px;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: space-between;
            >div{
                display:inline-flex;
                align-items: center;
                div{color: #ccc;}
                span{margin: 0 5px;}
                i{
                    font-size: 15px;
                    color: #409eff;
                }
            }
        }
    }
</style>
