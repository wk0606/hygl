<template>
  <pop-up
    title="选择标签"
    width="500"
    :views="views"
    :confirm="save"
  >
    <div slot="content" class="content">
        <div style="box-sizing:border-box;padding:10px;">
            <span>标签：</span>
            <el-input size="small" v-model="name" style="width:200px;"></el-input>
            <el-button size="small" @click="add" :disabled="canAdd" type="info" style="margin-left:10px;">新增</el-button>
        </div>
        <el-table
            border
            :data="List"
            max-height="300"
            ref="tagTable"
            @selection-change="tagSelect"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="名称" prop="name" align="center">
                <template slot-scope="scope">
                    <span class="cell-span">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="remove(scope.row,scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- <div slot="footer" class="footer">
        <el-button size="small" type="primary" @click="save">
          确定
        </el-button>
        <el-button size="small"
                   @click="close">关闭
        </el-button>
      </div> -->
  </pop-up>
</template>
<script>
import popUp from '../../components/popUp/index'
export default {
  props:['views'],
  data(){
      return {
          List:null,
          name:'',
          selectList:null//选中的行
      }
  },
  computed:{
      canAdd(){
          if(this.name.trim())
            return false;
          else
            return true;
      }
  },
  methods:{
      getList(){
          this.$http('/api/x6/getMdTagList.do',{}).then(res=>{
              this.List=res.List;
              setTimeout(()=>{
                  this.setRowSelected(this.views.data);
              },0);
          });
      },
      //设置选中行
      setRowSelected(rows){
        if (rows.length) {
            var _tags=[];
            for(let obj of this.views.data)
                _tags.push(obj.name);
            for(var i=0;i<this.List.length;i++){
                if(_tags.indexOf(this.List[i].name)>-1){
                    this.$refs.tagTable.toggleRowSelection(this.List[i]);
                }
            }
        }
      },
      tagSelect(val){
          this.selectList=val;
      },
      add(){
          this.$http('/api/x6/addMdTag.do',{
              name:this.name
          }).then(res=>{
              this.$message('新增成功');
              this.List.unshift({
                  name:this.name
              });
              this.name='';
          });
      },
      remove(row,index){
        this.$confirm('确定要删除此标签吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$http('/api/x6/delMdTag.do',{
                name:row.name
            }).then(res=>{
                this.$message('删除成功');
                this.List.splice(index,1);
            });
        }).catch(() => {
            return;         
        });
      },
      save(){
          this.$emit('tag-select',this.selectList);
          this.close();
      },
      close(){
          this.views.show=false;
      }
  },
  mounted(){
      this.selectList=this.views.data;
      this.getList();
  },
  components:{
      popUp
  }
}
</script>
<style lang="less" scoped>
    .footer {
        background: #fff;
        padding: 10px;
        text-align: right;
        border-top: 1px solid #ccd0d7;
    }
</style>
