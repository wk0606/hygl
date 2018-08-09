<template>
  <div>
      <div class="wdsp-header">
          <div>
              <el-button size="mini" type="primary" @click="addProduct">发布商品</el-button>
              <el-button size="mini" type="warning" @click="preview">网店预览</el-button>
          </div>
          <el-input
            size="mini"
            placeholder="请输入商品名称"
            prefix-icon="el-icon-search"
            v-model="name"
            @input="searchListByName"
          ></el-input>
      </div>
      <div class="wdsp-tab">
          <div
            v-for="item in tabs"
            :key="item.value"
            :class="{selected:item.value==currentValue}"
            @click="tabChange(item.value)"
          >{{item.label}}</div>
      </div>
      <div class="wdsp-body">  
          <el-table
            :data="List"
            height="100%"
            header-cell-class-name="el-table-drak-head"
            ref="table"
            @select-all="selectAll"
            @select="selectOne"
          >
            <el-table-column
                type="selection"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column
                label="商品名称/零售价"
                prop="name"
                width="200"
            >
                <template slot-scope="scope">
                    <div class="cell-product">
                        <img :src="scope.row.sptp" alt="">
                        <div>
                            <div class="ellipsis2rows">{{scope.row.name}}</div>
                            <p>￥{{scope.row.spdj | currency}}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="访问量"
                prop="scansl"
            >
                <template slot-scope="scope">
                   <div><span class="cell-span">访客数:{{scope.row.fks}}</span></div> 
                   <div><span class="cell-span">浏览量:{{scope.row.scansl}}</span></div> 
                </template>
            </el-table-column>
            <el-table-column
                label="总销量"
                prop="zxl"
                align="center"
            >
                <template slot-scope="scope">
                   <span class="cell-span">{{scope.row.zxl}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="可售库存"
                prop="kskcs"
                align="center"
            >
                <template slot-scope="scope">
                   <span class="cell-span">{{scope.row.kskcs}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="上架时间"
                prop="sjsj"
                align="center"
            >
                <template slot-scope="scope">
                   <span class="cell-span">{{scope.row.fks}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="分组"
                prop="spfz"
                align="center"
            >
                <template slot-scope="scope">
                   <span class="cell-span">{{formatGroupName(scope.row.spfz)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="序号"
                prop="spfzxh"
                align="center"
                width="80"
                :render-header="renderCell"
            >
                <template slot-scope="scope">
                   <el-input
                    size="mini"
                    v-model="currentIndex"
                    v-if="currentRow===scope.$index"
                    @blur="editIndex(scope.row)"
                   ></el-input>
                   <span class="cell-span cell-span-blue" @click="currentRow=scope.$index;currentIndex=scope.row.spfzxh" v-else>{{scope.row.spfzxh}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
            >
                <template slot-scope="scope">
                   <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
                   <el-button size="mini" type="text" @click="previewRow(scope.row)">预览</el-button>
                </template>
            </el-table-column>
          </el-table>
      </div>
      <div class="wdsp-footer">
          <div>
            <el-button size="mini" v-if="currentValue!=2" :disabled="!selectRows.length" @click="batchUpOrDown">{{currentValue?'上架':'下架'}}</el-button>
            <el-button size="mini" :disabled="!selectRows.length" @click="batchDelele">删除</el-button>
          </div>
          <pagination :data="page" :small="true" @current-change="changePage"></pagination>
      </div>
      <preview v-if="dialog.show" :views="dialog"></preview>
  </div>
</template>
<script>
import pagination from "../../../../components/pagination/index";
import preview from './preview'
export default {
  data() {
    return {
      tabs: [{ label: "销售中", value: 0 },{ label: "已下架", value: 1 }, { label: "已售罄", value: 2 }],
      currentValue: 0,
      allList:[],
      List: [],
      groupList:[],
      page: {
        no: 1,
        size: 20,
        rows: 0
      },
      currentPageChecked:false,
      selectRows:[],
      noSelectedRows:[],
      hasSelectAll:false,
      name:'',
      dialog:{
          show:false,
          data:null,
          type:1
      },
      currentTime:0,
      currentRow:'',//当期行
      currentIndex:''//当前行序号
    };
  },
  methods: {
    //新增
    addProduct() {
      this.$router.push("/main/mallchildren/product_edit/-1/0");
    },
    //编辑
    edit(row){
        this.$util.removeCache('MYHZ_SPXX_EDIT');
        this.$router.push(`/main/mallchildren/product_edit/${row.id}/${this.currentValue===0?1:this.currentValue===1?0:2}`);
    },
    //修改序号
    editIndex(row){
        var index=parseInt(this.currentIndex);
        if(!index){
            this.$message('序号只能大于0','error');
        }else{
            this.$http('/api/x6/updataSpfzxh.do',{
                id:row.id,
                spfz:row.spfz,
                spfzxh:index
            }).then(res=>{
                this.$message('修改成功');
                this.currentRow=this.currentIndex='';
                this.getList(this.currentValue);
            });
        }
        
    },
    changePage(page){
        if(page)
            this.page.no=page;
        this.List=this.allList.slice((this.page.no-1)*this.page.size,this.page.no*this.page.size);
        setTimeout(()=>{
            if(this.hasSelectAll){
                for(let row of this.List){
                    if(this.noSelectedRows.indexOf(row.id)==-1){
                        this.$refs.table.toggleRowSelection(row);
                    }
                }
            }
        },10);
    },
    //切换tab
    tabChange(val){
        if(this.currentValue!=val){
            this.currentValue=val;
            this.getList(val);
        }
    },
    //
    searchListByName(){
        const T=150;//单位-毫秒
        var _t=new Date().getTime();
        if(_t-this.currentTime>T){
            this.currentTime=_t;
            this.getList(this.currentValue);
        }
    },
    //获取商品列表
    getList(bzw=0) {
      this.$http("/api/x6/getSpxxListByCondition.do",{
          bzw:bzw,
          name:this.name
      }).then(res => {
        this.allList=res.List;
        this.page.rows=res.List.length;
        this.changePage(1);
      });
    },
    //当前页全选
    handlerPageChecked(){
        for(let row of this.List){
            this.$refs.table.toggleRowSelection(row,this.currentPageChecked);
            if(!this.currentPageChecked&&this.noSelectedRows.indexOf(row.id)==-1){
                this.noSelectedRows.push(row.id)
            }
            if(this.currentPageChecked){
               this.noSelectedRows=this.noSelectedRows.filter(id=>{
                   return id!=row.id
               }); 
            }
        }
    },
    // handleSelect(val){
    //     console.log(val)
    //     this.selectRows=val;
    // },
    selectAll(val){
        this.hasSelectAll=val.length?true:false;
        this.selectRows=val.length?this.allList:[];
    },
    selectOne(val,row){
        if(this.hasSelectAll){
            var flag=false;
            for(let obj of val){
                if(obj.id==row.id){
                    flag=true;
                    break;
                }
            }
            if(flag){
                this.noSelectedRows=this.noSelectedRows.filter(id=>{
                    return id!=row.id;
                })
            }else{
                this.noSelectedRows.push(row.id);
            }
            this.selectRows=this.allList.filter(item=>{
                return this.noSelectedRows.indexOf(item.id)==-1;
            });
        }else{
            this.selectRows=val;
        }
    },
    //批量上下架
    batchUpOrDown(){
        var ids=[];
        for(let obj of this.selectRows)
            ids.push(obj.id);
        this.$http('/api/x6/batchSetSpxx.do',{
            ids:ids.join(','),
            yxbz:this.currentValue?0:1
        }).then(res=>{
            this.$message(`${this.currentValue?'上架':'下架'}成功`);
            this.getList(this.currentValue);
        });
    },
    //批量删除
    batchDelele(){
        this.$confirm('删除商品后不可恢复,确认删除吗','提示',{
            type:'warning'
        }).then(()=>{
            var ids=[];
            for(let obj of this.selectRows)
                ids.push(obj.id);
            this.$http('/api/x6/hySetSpxxDel.do',{
                ids:ids.join(',')
            }).then(res=>{
                this.$message('删除成功');
                this.getList(this.currentValue);
            });
        }).catch(()=>{});
    },
    //预览操作
    preview(){
        this.$http('/api/x6/getWdylInfo.do').then(res=>{
            this.dialog.show=true;
            this.dialog.data=res.VO;
            this.dialog.type=1;
        });
    },
    //
    previewRow(row){
        this.$http('/api/x6/getSpxxDetailById.do',{
            id:row.id
        }).then(res=>{
            this.dialog.show=true;
            this.dialog.data=res.VO;
            this.dialog.type=2;
        });
    },
    formatGroupName(id){
        for(let obj of this.groupList){
            if(obj.id==id)
                return obj.name;
        }
        return '未知分组';
    },
    renderCell(h, {column, $index, store, _self}){
        return h('div',{
            style: {
                position: 'relative',
                overflow: 'visible',
                width:'100%',
                lineHeight:0
            }
        },[h('span',column.label),h('i',{
            style: {
                cursor: 'pointer',
                color: '#aaa',
                fontSize: '15px',
                position: 'absolute',
                right: '-4px',
                top: '50%',
                transform: 'translateY(-48%)'
            },
            class:{
                'iconfont': true,
                'icon-bangzhu3':true
            },
            attrs:{
                title:'点击商品对应的序号数值可以直接进行修改，序号越小的商品在该商品分组排名越前'
            }
        })])
    },
  },
  mounted() {
    this.groupList=this.$util.getCache('spfzList');
    this.getList();
  },
  activated(){
    this.groupList=this.$util.getCache('spfzList');
    this.getList();
  },
  components: {
    pagination,
    preview
  }
};
</script>
<style lang="less" scoped>
.wdsp-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 15px 0;
  .el-input {
    width: 250px;
  }
}
.wdsp-body {
  height: ~"calc(100% - 148px)";
}
.wdsp-footer {
  display: flex;
  align-items: center;
  padding-top: 10px;
  justify-content: space-between;
  .el-checkbox {
    margin-right: 20px;
  }
}
.cell-product {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    margin-right: 5px;
  }
  > div {
    height: 50px;
    flex-grow: 1;
    font-size: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    div {
      height: 30px;
      color: #66a5fd;
      line-height: 15px;
    }
    p {
      color: #febc6b;
    }
  }
}
</style>
