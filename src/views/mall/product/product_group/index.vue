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
                width="80"
                label="操作"
                align="center"
            >
                <template slot-scope="scope">
                    <el-button size="small" type="text" style="padding:0;">预览</el-button>
                </template>
            </el-table-column>
          </m-table>
      </div>
  </div>
</template>
<script>
import mTable from "../../../../components/table/index";
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
          click: this.openAdd
        },
        { label: "商品数", prop: "spsl" },
        { label: "创建时间", prop: "zdrq" }
      ]
    };
  },
  methods: {
    openView() {
      console.log(row);
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
    mTable
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

