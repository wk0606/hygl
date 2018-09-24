<template>
  <pop-up
    title="公司选择"
    width="700"
    :views="views"
    :confirm="save"
  >
    <div slot="content" class="content">
        <div class="content-item">
            <span>搜索 ：</span>
            <el-input size="mini" placeholder="请输入搜索关键字" v-model="name" @input="filterByName"></el-input>
            <el-button size="mini" type="primary" style="margin-left:20px;" @click="reset">重置</el-button>
        </div>
        <div class="content-item content-item-top">
            <span>首字母 ：</span>
            <div>
                <p
                    v-for="(row,index) in letter"
                    :key="index"
                >
                    <span
                        v-for="value in row"
                        :key="value"
                        :class="{selected:currentLetter==value}"
                        @click="filterByLetter(value)"
                    >{{value}}</span>
                </p>
            </div>
        </div>
        <div class="content-tab">
            <div
                v-for="item in tabs"
                :key="item.value"
                :class="{'select-tab':item.value==currentTab}"
                @click="handleTab(item)"
            >
                <i class="iconfont" :class="item.icon"></i>
                <span>{{item.label}}</span>
            </div>
        </div>
        <div style="height:350px;">
            <el-table
                :data="List"
                stripe
                border
                height="100%"
                :highlight-current-row="true"
                @cell-click="cellClick"
                @cell-dbclick="cellDbClick"
            >
                <el-table-column label="序号" width="80" align="center">
                    <template slot-scope="scope">
                        <span>{{(page.no-1)*page.size+scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="名称"
                    prop="name"
                    header-align="center"
                >  
                    <template slot-scope="scope">
                        <span v-if="!scope.row.text||!scope.row.text.length">{{scope.row.name}}</span>
                        <div v-else>
                            <span
                                v-for="item in scope.row.text"
                                :class="{red:item.isred}"
                            >{{item.value}}</span>
                        </div>
                    </template> 
                </el-table-column>
            </el-table>
        </div>
        <div>
            <pagination :data="page" @current-change="changePage"></pagination>
        </div>
    </div>  
  </pop-up>
</template>
<script>
import popUp from '../popUp/index'
import pagination from '../pagination/index'
import py from '../../func/pinyin'
import keyWords from '../../mixins/keywordHighLight'
export default { 
  mixins:[keyWords],
  props:['views'],
  data(){
      return {
          name:'',
          letter:[
              ['A','B','C','D','E','F','G','H','I','J','K','L','M'],
              ['N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
          ],
          tabs:[
              {label:'总公司',icon:'icon-gongsi',value:0},
              {label:'分公司',icon:'icon-fengongsi',value:2},
              {label:'门店',icon:'icon-mendian',value:3},
              {label:'仓库',icon:'icon-cangku',value:4}
          ],
          currentLetter:'',
          currentTab:0,
          currentRow:null,
          allList:[],
          List:[],
          page:{
              no:1,
              size:20,
              rows:0
          }
      }
  },
  methods:{
      getList(lx){
          var temp=this.views.data.filter(item=>{
              return item.lx==lx;
          });
          this.page.rows=temp.length;
          return temp;
      },
      changePage(page){
          if(page)
            this.page.no=page;
          this.List=this.allList.slice((this.page.no-1)*this.page.size,this.page.no*this.page.size);
      },
      handleTab(item){
          this.currentLetter='';
          this.name='';
          this.currentTab=item.value;
          this.allList=this.getList(this.currentTab);
          this.changePage(1);
      },
      cellClick(row){
          this.currentRow=row;
      },
      cellDbClick(row){
          this.currentRow=row;
          this.save();
      },
      save(){
          if(!this.currentRow){
              this.$message('请选择一行','error');
          }else{
              this.$emit('selected',this.currentRow);
              this.views.show=false;
          }
      },
      filterByName(){
          let tabs=JSON.parse(JSON.stringify(this.tabs));
          this.allList=[];
          if(this.currentTab>0){
            let temp=tabs[this.currentTab-1];
            tabs.splice(this.currentTab-1,1);
            tabs.splice(0,0,temp);
          }
          for(let lx of tabs){
              let list=this.getList(lx.value);
              for(let obj of list){
                let matchInfo=this.matchCharForIndex(obj.name,this.name);
                if(matchInfo.flag){
                    this.currentTab=lx.value;
                    obj.text=this.splitStrByArray(matchInfo.index,obj.name);
                    this.allList.push(obj);
                }
              }
              if(this.allList.length)
                break;
          }
          this.page.rows=this.allList.length;
          this.changePage(1);
      },
      filterByLetter(value){
          this.currentLetter=this.currentLetter==value?'':value;
          let tabs=JSON.parse(JSON.stringify(this.tabs));
          this.allList=[];
          if(this.currentTab>0){
            let temp=tabs[this.currentTab-1];
            tabs.splice(this.currentTab-1,1);
            tabs.splice(0,0,temp);
          }
          for(let lx of tabs){
              let list=this.getList(lx.value);
              this.allList=this.filterOfFirstLetter(list,this.currentLetter,'name');
              if(this.allList.length){
                  this.currentTab=lx.value;
                  break;
              }
          }
          this.page.rows=this.allList.length;
          this.changePage(1);
      },
      reset(){
          this.currentLetter='';
          this.name='';
          this.changePage();
      }
  },
  mounted(){
    //   for(let obj of this.views.data){
    //       obj.show=true;
    //   }
      this.allList=this.getList(this.currentTab);
      this.changePage(1);
  },
  components:{
      popUp,
      pagination
  }
}
</script>
<style lang="less" scoped>
    .content{
        .content-item{
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            >span{flex-shrink: 0;width: 60px;text-align: right;}
            >div{flex-grow: 1;}
            p{
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                span{
                    width: 40px;
                    line-height: 25px;
                    text-align: center;
                    background: #fff; 
                    border-radius: 4px;
                    border: 1px solid #ccc;
                    font-size: 12px;
                    cursor: pointer;
                    &:hover{
                        background: #f8f8f8;
                    }
                }
                span.selected{
                    background: #409eff;
                    color: #fff;
                    border-color:#409eff;
                }
            }
        }
        .content-item-top{
            align-items: flex-start;
        }
        .content-tab{
            display: flex;
            //border-top:1px solid #ccc; 
            background: #f8f8f8;
            >div{
                display: inline-flex;
                align-items: center;
                height: 40px;
                padding: 0 20px;
                cursor: pointer;
                font-size: 14px;
                color: #666;
                border-bottom: 2px solid transparent;
                i{margin-right: 5px;}
            }
            .select-tab{
                border-color:#409eff;
                color:#409eff;
            }
        }
    }
    .red{color:red;}
</style>
