<template>
  <div>
      <div class="set-gray-head">
          <div class="set-gray-head-top">
              <div>
                  <p><b>买家上门自提功能</b></p>
                  <p>启用买家上门自提功能后,买家可以选择你就近预设的自提点.下单后你需要尽快将商品配送至指定的自提点.</p>
              </div>
              <el-switch
                v-model="openZt"
                active-color="#13ce66"
                inactive-color="#ccc"
                @change="updateZtStatus">
              </el-switch>
          </div>
      </div>
      <bar :bar-show="barMenu">
        <div class="smzt-add" slot="bar-x">
            <el-button size="small" type="success" @click="openAdd">新增自提点</el-button>
        </div>
        <div class="smzt-add" slot="bar-y">
            <el-button size="small" type="primary" :loading="loadKq" @click="batchChange(1,'loadKq')">开启</el-button>
            <el-button size="small" type="danger" :loading="loadBkq" @click="batchChange(0,'loadBkq')">不开启</el-button>
            <el-button size="small" @click="removeRows">删除</el-button>
        </div>
      </bar>
      <m-table
        :data="List"
        :col-model="colModel"
        :filter-list="filterList"
        :need-selection="true"
        @selection-change="selectChange"
        ref="table"
        height
      >
        <el-table-column
            slot="table-column"
            width="150"
            label="操作"
            prop="status"
            align="center"
            :render-header="renderFilterHead"
        >
            <template slot-scope="scope">
                <span class="cell-span" :class="scope.row.yxbz?'error':'success'" @click="changeRowStatus(scope.row)">{{scope.row.yxbz?'不开启':'开启'}}</span>
                <span class="cell-span cell-span-blue" @click="edit(scope.row)">编辑</span>
            </template>
        </el-table-column>
      </m-table>
      <!-- <el-table
        :data="test"
      >
        <el-table-column prop="name" label="name"></el-table-column>
      </el-table> -->
      <add v-if="dialog.show" :views="dialog" @success="getZtdList"></add>
  </div>
</template>
<script>
import mTable from "../../../../../components/table/index";
import add from "./smzt_add";
import bar from "../../../../../components/bar/index";
export default {
  data() {
    return {
      test:[
        {name:'sdsf',age:1000},
        {name:'vdvdf',age:1000},
      ],
      testCol:[
        {prop:'name',label:'Name'},
        {prop:'age',label:'Age'},
      ],
      barMenu: true,
      openZt: true,
      loadKq: false,
      loadBkq: false,
      colModel: [
        { label: "自提点名称", prop: "name", align: "left", render: true },
        { label: "省份", prop: "province", render: true },
        { label: "城市", prop: "city", render: true },
        { label: "县区", prop: "town", render: true },
        { label: "地址", prop: "dz", align: "left" },
        { label: "联系电话", prop: "lxdhhm" }
      ],
      List: [],
      dialog: {
        show: false,
        data: null
      },
      ids: [],
      filterList: null
    };
  },
  methods: {
    getZtdList() {
      this.$http("/api/x6/getHySetZtdList.do").then(res => {
        for (let obj of res.List) {
          obj.status = obj.yxbz ? "不开启" : "开启";
          obj.lxdhhm=obj.lxdhqh?`${obj.lxdhqh}-${obj.lxdhhm}`:obj.lxdhhm;
        }
        this.List = res.List;
        this.filterList = res.List;
        this.openZt = JSON.parse(res.VO.data).ztkqzt ? true : false;
      });
    },
    updateZtStatus() {
      this.$http("/api/x6/updateZtgnzt.do", {
        ztkqzt: this.openZt ? 1 : 0
      }).then(res=>{

      },err=>{
        this.openZt=!this.openZt;
      });
    },
    selectChange(val) {
      this.barMenu = val.length ? false : true;
      this.ids = [];
      for (let obj of val) {
        this.ids.push(obj.id);
      }
    },
    changeRowStatus(row) {
      this.$http("/api/x6/batchSetZtdzt.do", {
        ids: row.id,
        yxbz: row.yxbz ? 0 : 1
      }).then(
        res => {
          row.yxbz = row.yxbz ? 0 : 1;
        },
        err => {}
      );
    },
    batchChange(status, load) {
      this[load] = true;
      this.$http("/api/x6/batchSetZtdzt.do", {
        ids: this.ids.join(","),
        yxbz: status ? 0 : 1
      }).then(
        res => {
          this.$refs.table.clearSelection();
          this.getZtdList();
          this[load] = false;
          this.$util.requestAllCache(this.$http);
        },
        err => {
          this[load] = false;
        }
      );
    },
    removeRows() {
      this.$http("/api/x6/HySetZtdDel.do", {
        ids: this.ids.join(",")
      }).then(res => {
        this.getZtdList();
        this.$message("删除成功");
        this.$util.requestAllCache(this.$http);
      });
    },
    openAdd() {
      this.dialog.show = true;
      this.dialog.data = null;
    },
    edit(row) {
      this.dialog.show = true;
      this.dialog.data = row;
    }
  },
  mounted() {
    this.getZtdList();
    this.$bus.$on("filter-success", array => {
      this.List = array;
    });
  },
  components: {
    mTable,
    add,
    bar
  }
};
</script>
<style lang="less" scoped>
.smzt-add {
  padding: 15px 0;
}
.smzt-table {
  //height: ~"calc(100% - 144px)";
  border: 1px solid #f0f0f0;
}
.success {
  color: #409eff;
}
.error {
  color: #f56c6c;
}
.cell-span {
  margin: 0 5px;
  width: 36px;
  display: inline-block;
  cursor: pointer;
}
</style>
