<template>
  <div>  
      <bar :bar-show="barMenu">
        <div class="set-ksck-header" slot="bar-x">
            <el-input
                size="mini"
                placeholder="请输入仓库名称搜索"
                v-model="ckname"
                style="width:200px;"
                @input="searchList"
                clearable
            ></el-input>
            <span>公司 :</span>
            <company-select
                v-model="gsbm"
                @change="searchList"
            ></company-select>
        </div>
        <div class="set-ksck-header" slot="bar-y">
            <i>已选{{selecedRowNum}}行</i>
            <el-button size="mini" type="success" @click="saveRowsStatus(1)">可售</el-button>
            <el-button size="mini" type="danger" @click="saveRowsStatus(0)">不可售</el-button>
        </div>
      </bar>
      <div class="set-ksck-body">
        <el-table
            :data="List"
            stripe
            border
            header-cell-class-name="el-table-drak-head"
            @select-all="selectAll"
            @select="selectOne"
            ref="table"
        >
            <el-table-column
                type="selection"
                width="55"
                align="center">
            </el-table-column>
            <el-table-column
                v-for="item in colModel"
                :key="item.prop"
                :label="item.label"
                :prop="item.prop"
                header-align="center"
                :width="item.width"
                :align="item.align||'center'"
                :render-header="item.render?item.render:null"
            >
                <template slot-scope="scope">
                    <span class="cell-span">{{scope.row[item.prop]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="网店可售"
                prop="status"
                width="150"
                align="center"
                :render-header="renderFilterHead"
            >
              <template slot-scope="scope">
                <span
                    class="cell-span"
                    :class="scope.row.isb2c?'success':'error'" style="cursor:pointer;"
                    @click="changeKs(scope.row,scope.$index)"
                >
                    {{scope.row.isb2c?'可售':'不可售'}}
                </span>
              </template>  
            </el-table-column>
        </el-table>
      </div>
      <div>
          <pagination :data="page" @current-change="changePage"></pagination>
      </div>
  </div>
</template>
<script>
import companySelect from '../../../../components/companySelect/index'
import pagination from '../../../../components/pagination/index'
import bar from '../../../../components/bar/index'
export default {
  data(){
      return{
          barMenu:true,
          ckname:'',
          gsbm:'',
          List:[],
          allList:[],
          filterColumn: {
            datas:null
          },
          colModel:[
              {label:'机构名称',prop:'name',align:'left'},
              {label:'所属机构',prop:'ssgsname',align:'left',render:this.renderFilterHead},
              {label:'仓库类型',prop:'nblx',width:150,render:this.renderFilterHead}
          ],
          page:{
              no:1,
              size:20,
              rows:0
          }
      }
  },
  computed:{
      selecedRowNum(){
          var count=0;
          for(let obj of this.allList){
              if(obj.checked)
                count++;
          }
          return count;
      }
  },
  methods:{
      changePage(page){
          if(page)
            this.page.no=page;
          this.List=this.allList.slice((this.page.no-1)*this.page.size,this.page.no*this.page.size);
          setTimeout(()=>{
              for(let obj of this.List){
                  this.$refs.table.toggleRowSelection(obj,obj.checked);
              }  
          },10);
      },
      getData(){
          this.$http('/api/x6/getHyCkList.do').then(res=>{
              for(let obj of res.List){
                  obj.ssgsname=this.getGsInfo(obj.pbm).name;
                  obj.isb2c=obj.isb2c||0;
                  obj.checked=false;
                  obj.status=obj.isb2c?'可售':'不可售';
              }
              this.allList=res.List;
              this.page.rows=res.List.length;
              this.filterColumn.datas = this.allList;
              this.changePage();
          });
      },
      getGsInfo(value){
          var list=this.$util.getMyGsList();
          return this.$util.getCompanyInfo(value,'bm',list);
      },
      searchList(item){
          if(!item.hasOwnProperty('bm'))
            this.gsbm='';
          this.$http('/api/x6/getHyCkListByCondition.do',{
              name:this.ckname,
              bm:this.gsbm
          }).then(res=>{
              for(let obj of res.List){
                  obj.ssgsname=this.getGsInfo(obj.pbm).name;
                  obj.isb2c=obj.isb2c||0;
                  obj.checked=false;
              }
              this.allList=res.List;
              this.page.rows=res.List.length;
              this.changePage();
          });
      },
      changeKs(row,index){
          this.$http('/api/x6/updateCkWdkszt.do',{
              name:row.name,
              bm:row.bm,
              id:row.id,
              isb2c:row.isb2c?0:1
          }).then(res=>{
              row.isb2c=row.isb2c?0:1;
              this.$util.requestAllCache(this.$http);
          });
      },
      saveRowsStatus(status){
          var keys=[];
          for(let obj of this.allList){
              if(obj.checked)
                keys.push(obj.id);
          }
          this.$http('/api/x6/batchSetCkkszt.do',{
              ids:keys.join(','),
              isb2c:status
          }).then(res=>{
             this.$util.requestAllCache(this.$http);
             for(let obj of this.allList){
                 if(keys.indexOf(obj.id)>-1)
                    obj.isb2c=status;
                    obj.status=status?'可售':'不可售';
             }
             for(let obj of this.allList){
                obj.checked=false;
             }
             this.$refs.table.clearSelection();
             this.barMenu=true;
          });
      },
      selectOne(val,row){
          console.log(val)
          row.checked=!row.checked;
          var count=0;
          for(let obj of val){
              if(obj.checked){
                  count++;
              }
          }
          this.barMenu=count>0?false:true;
      },
      selectAll(row){
          for(let obj of this.allList)
            obj.checked=row.length?true:false;
          this.barMenu=row.length?false:true;
      },
      
  },
  mounted(){
      this.getData();
      this.$bus.$on('filter-success', (array) => {
        this.allList=array;
        this.page.rows=array.length;
        this.changePage(1);
      });
  },
  components:{
      companySelect,
      pagination,
      bar
  }
}
</script>
<style lang="less" scoped>
    .set-ksck-header{
        padding: 10px 0 15px 0;
        display: flex;
        align-items: center;
        span{margin-right: 5px;margin-left: 25px;}
        >i{margin-right: 10px;}
    }
    .success{color:#67C23A;}
    .error{color:#F56C6C;}
</style>
