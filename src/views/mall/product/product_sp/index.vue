<template>
  <div>
      <div class="wdsp-header">
          <div>
              <el-button
                size="mini"
                :type="currentValue?'primary':'warning'"
                :icon="currentValue?'el-icon-upload2':'el-icon-download'"
                @click="productDown"
                v-if="currentValue<2"
              >
                <!-- <i class="iconfont" :class="currentValue?'icon-shangjia-copy':'icon-xiajia'"></i> -->
                {{currentValue?'商品上架':'商品下架'}}
              </el-button>
          </div>
          <el-input
            size="mini"
            placeholder="请输入商品名称"
            prefix-icon="el-icon-search"
            v-model="name"
            @input="searchListByName"
            clearable
          ></el-input>
      </div>
      <!-- @input="searchListByName" -->
      <div class="wdsp-tab">
          <div
            v-for="item in tabs"
            :key="item.value"
            :class="{selected:item.value==currentValue}"
            @click="tabChange(item.value)"
          >{{item.label}}</div>
          <el-tag
            v-if="kcyjShow"
            closable
            type="danger"
            @close="kcyjShow=false;getList('')">
            库存预警商品
          </el-tag>

      </div>
      <div class="wdsp-body">  
          <el-table
            :data="List"
            header-cell-class-name="el-table-drak-head"
            ref="table"
            @select-all="selectAll"
            @select="selectOne"
          >
            <div slot="empty" class="empty-tip">
                <i class="iconfont icon-zanwushuju"></i>
                <span>暂无数据</span>
            </div>
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
                            <div style="display:flex;align-items:center;">
                                <div 
                                    style="flex-grow:1;"
                                    class="ellipsis2rows"
                                    :title="scope.row.name"
                                >{{scope.row.name}}</div>
                                <i 
                                    v-if="scope.row.yxbz==2"
                                    title="部分规格已下架"
                                    style="flex-shrink:0;margin-left:5px;font-size:12px;color:red;cursor:pointer;"
                                    class="iconfont icon-xiajia1"
                                ></i>
                            </div>
                            <p style="line-height:15px;">￥{{scope.row.spdj | currency}}</p>
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
                width="110"
                :render-header="renderFilterHead"
            >
                <template slot-scope="scope">
                   <span class="cell-span">{{scope.row.zxl}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="可售库存"
                prop="kskcs"
                align="center"
                width="120"
                :render-header="renderFilterHead"
            >
                <template slot-scope="scope">
                   <span class="cell-span" :class="{error:scope.row.kskcs<=scope.row.kcyjsl}">{{scope.row.kskcs}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="库存预警"
                prop="kcyjsl"
                align="center"
                width="120"
                :render-header="renderFilterHead"
            >
                <template slot-scope="scope">
                  <input
                    v-if="currentRow===scope.$index&&currentCol=='kcyjsl'"
                    type="number"
                    v-model.number="kcyjsl"
                    v-focus
                    @blur="setKcyj(scope.row,scope.$index,$event)"
                   ></input>
                   <span
                    v-else
                    class="cell-span cell-span-blue"
                    @click="currentRow=scope.$index;currentCol='kcyjsl';kcyjsl=scope.row.kcyjsl"
                   >{{scope.row.kcyjsl}}</span>
                   
                </template>
            </el-table-column>
            <el-table-column
                label="上架时间"
                prop="sjsj"
                align="center"
                
                :render-header="renderFilterHead"
            >
                <template slot-scope="scope">
                   <span class="cell-span">{{scope.row.sjrq}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="分组"
                prop="spfz"
                align="center"
                width="110"
                :formatter="formatGroupName"
                :render-header="renderFilterHead"
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
                    v-if="currentRow===scope.$index&&currentCol=='spfzxh'"
                    @blur="editIndex(scope.row)"
                    clearable
                   ></el-input>
                   <span class="cell-span cell-span-blue" @click="currentRow=scope.$index;currentCol='spfzxh';currentIndex=scope.row.spfzxh" v-else>{{scope.row.spfzxh}}</span>
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
            <el-button size="mini" :disabled="!selectRows.length" @click="batchDelele">删除</el-button>
            <el-button size="mini" v-if="currentValue===0" :disabled="!selectRows.length" @click="batchUpDown(1)">下架</el-button>
            <el-button size="mini" v-if="currentValue===1" :disabled="!selectRows.length" @click="batchUpDown(0)">上架</el-button>
          </div>
          <pagination :data="page" :small="true" @current-change="changePage" hide-border></pagination>
      </div>
      <preview v-if="dialog.show" :views="dialog"></preview>
      <product-down v-if="down.show" :views="down" :yxbz="currentValue"></product-down>
  </div>
</template>
<script>
import pagination from "../../../../components/pagination/index";
import preview from './preview'
import productDown from './product_down'
import bus from '../../../../func/eventBus'
export default {
  data() {
    return {
      kcyjShow:false,
      tabs: [{ label: "销售中", value: 0 },{ label: "已下架", value: 1 }, { label: "已售罄", value: 2 }],
      currentValue: 0,
      allList:[],
      List: [],
      groupList:[],
      page: {
        no: 1,
        size: 10,
        rows: 0
      },
      currentPageChecked:false,
      selectRows:[],
      noSelectedRows:[],
      hasSelectAll:false,
      name:'',
      isxskcyj:0,
      dialog:{
          show:false,
          data:null,
          type:1
      },
      currentTime:0,
      currentRow:'',//当期行
      currentCol:'',
      currentIndex:'',//当前行序号
      down:{
          show:false,
          yxbz:0,
          title:''
      },
      currentRow:'',
      kcyjsl:0,
      filterColumn: {
        datas:null
      },
    }
  },
  methods: {
    //下架
    productDown() {
      this.down.title=this.currentValue?'商品上架':'商品下架';
      this.down.yxbz=this.currentValue?0:1;
      this.down.show=true;
    },
    //批量上下架
    batchUpDown(yxbz){
        this.$confirm(`确认进行${yxbz?'下架':'上架'}操作吗`,'提示',{
            type:'warning'
        }).then(()=>{
            let ids=this.selectRows.map(item=>{
                return item.id
            });
            this.$http('/api/x6/batchSetSpxx.do',{
                ids:ids.join(','),
                spdms:'',
                yxbz:yxbz
            }).then(res=>{
                this.$message(yxbz?'下架成功':'上架成功');
                this.getList();
            });
        }).catch(()=>{});
    },
    //编辑
    edit(row){
        this.$parent.editShow=true;
        this.$parent.pID=row.id;
        this.$parent.pYxbz=this.currentValue==2?0:this.currentValue;
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
                this.getList();
            });
        }
        
    },
    //设置库存预警
    setKcyj(row,index,ev){
        if(this.kcyjsl>row.kskcs){
            this.$message('库存预警数量不得大于当前的可售库存','error');
            this.kcyjsl=row.kskcs;
            ev.target.focus();
        }else{
            this.$http('/api/x6/updataSpxxKcyjsl.do',{
                id:row.id,
                kcyjsl:this.kcyjsl
            }).then(res=>{
                this.currentRow='';
                row.kcyjsl=this.kcyjsl;
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
            this.getList();
        }
    },
    //
    searchListByName(){
        const T=150;//单位-毫秒
        var _t=new Date().getTime();
        if(_t-this.currentTime>T){
            this.currentTime=_t;
            this.getList();
        }
    },
    //获取商品列表
    getList(name,isxskcyj=0) {
      if(name) this.name=name;
      this.$http("/api/x6/getSpxxListByCondition.do",{
          bzw:this.currentValue,
          name:this.name,
          isxskcyj:isxskcyj
      }).then(res => {
        for(let obj of res.List)
            obj.sjsj=this.formatSjrq(obj.sjrq);
        this.allList=res.List;
        this.page.rows=res.List.length;
        this.filterColumn.datas=res.List;
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
                this.getList();
            });
        }).catch(()=>{});
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
    formatSjrq(rq){
        return rq.split(' ')[0];
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
    this.$bus.$on('filter-success', (array) => {
        this.allList=array;
        this.page.rows=array.length;
        this.changePage(1);
    });
  },
  activated(){
    this.groupList=this.$util.getCache('spfzList');
    this.getList();
  },
  components: {
    pagination,
    preview,
    productDown
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
  //height: ~"calc(100% - 148px)";
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
    height: auto;
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
input[type=number]{
    width: 100%;
    box-sizing: border-box;
    padding: 0 7px;
    line-height: 28px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    &:focus{
       border-color: #409eff; 
    }
}
.error{color:red;}
.wdsp-tab{
    .el-tag{
        margin-left: 10px;
        height: 25px;
        line-height: 23px;
    }
}
</style>
