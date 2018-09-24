<template>
    <pop-up
        title="选择商品规格"
        :views="views"
        :confirm="handleSelected"
        width="400"
    >
        <div class="content" slot="content">
            <el-input
                size="mini"
                v-model.trim="addName"
                placeholder="新增商品规格" 
                @blur="save(-1)"
                @keyup.enter.native="enterSave(-1)"
                style="margin-bottom:10px;"
                ref="addInput">
            </el-input>
            <el-table
                max-height="300"
                :data="List"
                border
                row-class-name="el-table-row"
                cell-class-name="el-table-cell"
                highlight-current-row
                @row-click="rowClick"
            >
                <el-table-column
                    label="规格名称"
                    prop="name"
                    align="center"
                >
                    <template slot-scope="scope">
                        <input
                            v-if="scope.$index===currentRow"
                            class="table-input"
                            type="text"
                            placeholder="请输入规格名称"
                            v-focus
                            v-model.trim="editName"
                            @blur="save(scope.row.id)"
                            @keyup.enter.native="save(scope.row.id)"
                        ></input>
                        <span v-else class="cell-span">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="100"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="edit(scope.row,scope.$index)">修改</el-button>
                        <el-button type="text" size="mini" @click="remove(scope.row,scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </pop-up>
</template>
<script>
import popUp from '../../../components/popUp/index'
export default {
  props:['views'],
  data(){
      return {
          addName:'',
          editName:'',
          List:[],
          currentRow:'',
          currentGg:null
      }
  },
  methods:{
      getList(){
           this.$http('/api/x6/getSpggListByName.do',{
                name:''
            }).then(res=>{
                for(let obj of res.List){
                    if(this.views.checkedList.indexOf(obj.name)==-1){
                        this.List.push({
                            id:obj.id,
                            name:obj.name
                        });
                    }
                }
            });
      },
      edit(row,index){
          this.editName=row.name;
          this.currentRow=index;
      },
      remove(row,index){
          let self=this;
          this.$confirm(`确认删除 规格-${row.name} 吗`,'提示',{
              type:'warning'
          }).then(res=>{
                self.$http('/api/x6/deleteSpggs.do',{
                    ids:row.id
                }).then(res=>{
                    self.List.splice(index,1);
                });
          }).catch(()=>{});
      },
      enterSave(id){
          this.$refs.addInput.blur();
      },
      save(id){
          let name;
          if(id!=-1){
              //当修改后的名称和之前不同
              if(this.List[this.currentRow].name!=this.editName){
                  name=this.editName;
              }else{
                  this.currentRow='';
                  return;
              }
          }else{
              if(!this.addName){
                  return;
              }
              name=this.addName;
          }
          //保存方法
          this.$http('/api/x6/hySetSpggSave.do',{
              id:id,
              name:name,
              ggname:''
          }).then(res=>{
              if(id==-1){
                  this.addName='';
                  this.List.splice(0,0,{
                      name:res.VO.name,
                      id:res.VO.id
                  });
              }else{
                  this.List[this.currentRow].name=this.editName;
                  this.currentRow='';
                  this.editName='';
              }
          });
      },
      rowClick(row){
          this.currentGg=row;
      },
      //规格选择完毕
      handleSelected(){
          if(this.currentGg)
            this.$emit('selection-change',this.currentGg);
          this.views.show=false;
      }
  },
  mounted(){
      this.getList();
  },
  components:{
      popUp
  }  
}
</script>
<style lang="less" scoped>
    .content{
        max-height: 600px;
        overflow-y: auto;
    }
    .table-input{
        width: 100%;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        padding: 0 15px;
        line-height: 28px;
        border-radius: 4px;
        &:focus{
            border-color:#409eff;
        }
    }
</style>
