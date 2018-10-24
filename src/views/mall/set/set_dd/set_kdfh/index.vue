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
          <el-button size="small" type="success" @click="openAdd(-1,-1)">新增运费模板</el-button>
      </div>
      <div
        class="kdfh-table"
        v-for="(data,index) in List"
        :key="data.id"
      >
          <div class="kdfh-table-top" @click="data.show=!data.show">
              <div>
                  <span>{{data.name}}</span>
                  <span v-if="data.sl" style="color:#999;">{{`(已被个${data.sl}商品使用)`}}</span>
              </div>
              <div>
                  <div>最后编辑时间 {{data.zdrq}}</div>
                  <span>-</span>
                  <el-button size="mini" type="text" @click.stop="openAdd(data.id,index)">修改</el-button>
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
                        :label="setLabel(index,item.prop)"
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
          },
          currentIndex:-1
      }
  },
  computed:{
      
  },
  methods:{
      setLabel(index,prop){
          if(prop=='dq')
            return '可配送区域';
          else if(prop=='firstje'||prop=='secondje')
            return '运费（元）';
          else{
              var temp;
              if(prop=='firstsl')
                temp=this.List[index].jffs?'首重':'首件';
              if(prop=='secondsl')
                temp=this.List[index].jffs?'续重':'续件';
              return `${temp}（${this.List[index].jjdw}）`;
          }
      },
      updateZtStatus(){
          this.$http('/api/x6/updateKdgnzt.do',{
              kdkqzt:this.openKt?1:0
          }).then(res=>{

          },err=>{
              this.openKt=!this.openKt;
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
      openAdd(id,index){
        this.$router.push(`/main/mall/shop/set_dd_addkd/${id}`);  
        this.currentIndex=index;
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
            this.$util.requestAllCache(this.$http);
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
      console.log(row)
      if(row){
          row.data=JSON.parse(row.data);
          if(this.currentIndex==-1){
              this.List.push(row);
          }else{
              row.show=this.List[this.currentIndex].show;
              this.List.splice(this.currentIndex,1,row);
          }
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
