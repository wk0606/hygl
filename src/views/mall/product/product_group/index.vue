<template>
  <div>
      <div class="g-header">
          <el-button size="mini" type="primary" @click="openAdd('',-1)">新建分组</el-button>
      </div>
      <div class="g-body">
          <m-table
            :data="List"
            :col-model="colModel"
            :filter-list="List"
          >
            <el-table-column
                slot="table-column"
                width="120"
                label="操作"
                align="center"
            >
                <template slot-scope="scope">
                    <el-button size="mini" style="padding:3px 5px;" type="primary" @click="openView(scope.row)">预览</el-button>
                    <el-button v-if="scope.row.id!=1" size="mini" style="padding:3px 5px;" type="danger" @click="openView(scope.row)">删除</el-button>
                </template>
            </el-table-column>
          </m-table>
      </div>
      <preview v-if="dialog.show" :views="dialog"></preview>
  </div>
</template>
<script>
import mTable from "../../../../components/table/index";
import preview from "../product_sp/preview";
export default {
  data() {
    return {
      List: [],
      colModel: [
        {
          label: "分组名称",
          prop: "name",
          align: "left",
          render: true,
          click: this.openAdd,
          class:this.getClass
        },
        { label: "商品数", prop: "spsl", render: true },
        { label: "创建时间", prop: "zdrq" }
      ],
      dialog: {
        show: false,
        data: null,
        type: 3
      }
    };
  },
  methods: {
    getClass(row){
      if(row.id==1)
        return 'cell-span-gray';
      else
        return 'cell-span-blue';
    },
    openView(row) {
      this.dialog.show = true;
      this.dialog.data = row.name;
    },
    openAdd(row, id) {
      var id = row ? row.id : -1;
      this.$router.push(`/main/mallchildren/product_group_add/${id}`);
    },
    getList() {
      this.$http("/api/x6/getHySetSpfzList.do").then(res => {
        this.List = res.List;
        //将分组保存到strrage方便在商品新增中调用
        //this.$util.addCache('')
      });
    }
  },
  mounted() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  components: {
    mTable,
    preview
  }
};
</script>
<style lang="less" scoped>
.g-header {
  padding-bottom: 10px;
}
.g-body {
  height: ~"calc(100% - 38px)";
}
</style>

