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
                inactive-color="#ccc">
              </el-switch>
          </div>
      </div>
      <div class="kdfh-add">
          <el-button size="small" type="success" @click="openAdd">新增运费模板</el-button>
      </div>
      <div
        class="kdfh-table"
        v-for="(data,index) in List"
        :key="data.id"
      >
          <div class="kdfh-table-top" @click="data.show=!data.show">
              <span>{{data.name}}</span>
              <div>
                  <div>最后编辑时间 {{data.time}}</div>
                  <span>-</span>
                  <el-button size="mini" type="text" @click.stop="edit(data,index)">修改</el-button>
                  <span>-</span>
                  <el-button size="mini" type="text" @click.stop="remove(data,index)">删除</el-button>
                  <i class="el-icon-caret-top"></i>
              </div>
          </div>
          <el-collapse-transition>
                <el-table
                    v-show="data.show"
                    :data="data.list"
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
                            <span class="cell-span-wrap">{{scope.row[item.prop]}}</span>
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
              {label:'可配送区域',prop:'dq',align:'left'},
              {label:'首件（个）',prop:'first',width:120},
              {label:'运费（元）',prop:'firstje',width:120},
              {label:'需件（个）',prop:'second',width:120},
              {label:'运费（元）',prop:'secondje',width:120}
          ],
          List:[
              {
                  name:'顺丰',
                  time:'2016-09-12 21:32:45',
                  show:true,
                  id:1,
                  list:[
                      {
                        dq:'北京市,天机市,北京市,天机市,北京市,天机市,北京市,天机市,北京市,天机市,北京市,天机市,北京市,天机市,北京市,天机市,北京市,天机市,北京市,天机市',
                        first:1,
                        firstje:10,
                        second:1,
                        secondje:10,
                      },
                      {
                        dq:'北京市,',
                        first:1,
                        firstje:10,
                        second:1,
                        secondje:10,
                      }
                  ]
              },
              {
                  name:'中通',
                  time:'2016-09-12 21:32:45',
                  id:2,
                  show:true,
                  list:[
                      {
                        dq:'北京市,天机市',
                        first:1,
                        firstje:10,
                        second:1,
                        secondje:10,
                      }
                  ]
              }
          ],
          dialog:{
              show:false
          }
      }
  },
  methods:{
      openAdd(){
        this.$router.push('/main/mallchildren/set_dd_addkd')  
      },
      edit(){

      },
      remove(row,index){
          console.log(index)
        this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.List.splice(index,1);
          this.$message('删除成功');
        }).catch(() => {
                  
        });
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
