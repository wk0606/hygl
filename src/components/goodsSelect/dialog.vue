<template>
  <pop-up
    title="商品选择"
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
                <el-table-column label="序号" width="70" align="center">
                    <template slot-scope="scope">
                        <span>{{(page.no-1)*page.size+scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="名称"
                    prop="value"
                    header-align="center"
                > 
                    <template slot-scope="scope">
                        <div class="table-row">
                            <span>{{scope.row.value}}</span>
                            <span
                                :class="scope.row.lx=='品牌'?'pp':scope.row.lx=='机型'?'jx':'qc'"
                            >{{scope.row.lx}}</span>
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
import popUp from "../popUp/index"
import pagination from "../pagination/index"
export default {
  props: {
    views: {
      required: true
    }
  },
  data() {
    return {
      name: "",
      letter: [
        ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"],
        ["N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
      ],
      currentLetter: "",
      currentRow: null,
      List: [],
      page: {
        no: 1,
        size: 20,
        rows: 0
      }
    };
  },
  methods: {
    getListByCondition() {
      var params = {
        pageSize: this.page.size,
        pageNo: this.page.no
      };
      if (this.name) params.value = this.name;
      if (this.currentLetter) params.capletter = this.currentLetter;
      this.$http("/api/x6/getLocalSpxxPage.do", params).then(res => {
        this.List = res.VO.rows;
        this.page.rows = res.VO.totalRows;
      });
    },
    changePage(page) {
      this.page.no = page;
      this.getListByCondition();
    },
    cellClick(row) {
      this.currentRow = row;
    },
    cellDbClick(row) {
      this.currentRow = row;
      this.save();
    },
    save() {
      if (!this.currentRow) {
        this.$message("请选择一行", "error");
      } else {
        var temp={
            splx:'',
            pp:this.currentRow.pp,
            spmc:this.currentRow.lx == "机型" ? this.currentRow.id : '',
            spdm:this.currentRow.lx == '全称' ? this.currentRow.id : '',
            qspmc:this.currentRow.value
        };
        this.$emit("selected", temp);
        this.views.show = false;
      }
    },
    filterByName() {},
    filterByLetter(value) {
      this.currentLetter = value;
      this.getListByCondition();
    },
    reset() {
      this.currentLetter = "";
      this.name = "";
      this.changePage(1);
    }
  },
  mounted() {
    this.getListByCondition();
  },
  components: {
    popUp,
    pagination
  }
};
</script>
<style lang="less" scoped>
.content {
  .content-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    > span {
      flex-shrink: 0;
      width: 60px;
      text-align: right;
    }
    > div {
      flex-grow: 1;
    }
    p {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      span {
        width: 40px;
        line-height: 25px;
        text-align: center;
        background: #fff;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-size: 12px;
        cursor: pointer;
        &:hover {
          background: #f8f8f8;
        }
      }
      span.selected {
        background: #409eff;
        color: #fff;
        border-color: #409eff;
      }
    }
  }
  .content-item-top {
    align-items: flex-start;
  }
  .table-row{
      display: flex;
      align-items: center;
      justify-content: space-between;
      span:nth-child(2){font-size: 12px;}
      .pp{color:#ff4949;}
      .jx{color:#13ce66;}
      .qc{color:#20a0ff;}
  }
}
</style>
