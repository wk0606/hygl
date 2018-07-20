<template>
  <div>
      <div class="wdsp-header">
          <div>
              <el-button size="mini" type="primary" @click="addProduct">发布商品</el-button>
              <el-button size="mini" type="warning">网店预览</el-button>
          </div>
          <el-input
            size="mini"
            placeholder="请输入商品名称或条码"
            prefix-icon="el-icon-search"
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
                            <p>￥{{scope.row.lsj | currency}}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="访问量"
                prop="scansl"
            >
                <template slot-scope="scope">
                   <div><span class="cell-span">访客数:2</span></div> 
                   <div><span class="cell-span">浏览量:2</span></div> 
                </template>
            </el-table-column>
            <el-table-column
                label="总销量"
                prop="zxl"
                align="center"
            >
                <template slot-scope="scope">
                   <span class="cell-span">2</span>
                </template>
            </el-table-column>
            <el-table-column
                label="可售库存"
                prop="kskcs"
                align="center"
            >
                <template slot-scope="scope">
                   <span class="cell-span">2</span>
                </template>
            </el-table-column>
            <el-table-column
                label="上架时间"
                prop="sjsj"
                align="center"
            >
                <template slot-scope="scope">
                   <span class="cell-span">2</span>
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
            >
                <template slot-scope="scope">
                   <span class="cell-span">{{scope.row.spfzxh}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
            >
                <template slot-scope="scope">
                   <el-button size="mini" type="text">编辑</el-button>
                   <el-button size="mini" type="text">预览</el-button>
                </template>
            </el-table-column>
          </el-table>
      </div>
      <div class="wdsp-footer">
          <div>
            <el-checkbox v-model="currentPageChecked" @change="handlerPageChecked">当页全选</el-checkbox>
            <el-button size="mini">下架</el-button>
            <el-button size="mini">删除</el-button>
          </div>
          <pagination :data="page" :small="true"></pagination>
      </div>
  </div>
</template>
<script>
import pagination from "../../../../components/pagination/index";
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
        size: 10,
        rows: 0
      },
      currentPageChecked:false
    };
  },
  methods: {
    addProduct() {
      this.$router.push("/main/mallchildren/product_edit");
    },
    changePage(page){
        if(page)
            this.page.no=page;
        this.List=this.allList.slice((this.page.no-1)*this.page.size,this.page.no*this.page.size);
    },
    //切换tab
    tabChange(val){
        if(this.currentValue!=val){
            this.currentValue=val;
            this.getList(val);
        }
    },
    //获取商品列表
    getList(bzw=0) {
      this.$http("/api/x6/getHySetSpxxList.do",{
          bzw:bzw
      }).then(res => {
        this.allList=res.List;
        this.page.rows=res.List.length;
        this.changePage(1);
      });
    },
    //获取商品分组列表
    getProductGroupList(callback){
        this.$http('/api/x6/getHySetSpfzList.do').then(res=>{
            this.groupList=res.List;
            if(callback)
                callback();
        });
    },
    //当前页全选
    handlerPageChecked(){
        for(let row of this.List){
            this.$refs.table.toggleRowSelection(row);
        }
        //this.$refs.table.toggleSelection(this.List)
    },
    formatGroupName(id){
        for(let obj of this.groupList){
            if(obj.id==id)
                return obj.name;
        }
        return '未知分组';
    }
  },
  mounted() {
    this.getProductGroupList(this.getList);
  },
  components: {
    pagination
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
