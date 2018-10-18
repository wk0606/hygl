<template>
  <div>
      <div >
        <div class="g-header">
            <el-button size="mini" type="primary" @click="openAdd('',-1)">新建分组</el-button>
        </div>
        <div class="g-body">
            <el-table
              :data="List"
            >
              <div slot="empty" class="empty-tip">
                  <i class="iconfont icon-zanwushuju"></i>
                  <span>暂无数据</span>
              </div>
              <el-table-column
                  v-for="row in colModel"
                  :key="row.prop"
                  :label="row.label"
                  :prop="row.prop"
                  header-align="center"
                  :align="row.align || 'center'"
                  :render-header="row.render?renderFilterHead:null"
              >
                  <template slot-scope="scope">
                      <span
                        class="cell-span"
                        :class="row.class?row.class(scope.row):row.click?'cell-span-blue':''"
                        @click="row.click?row.click(scope.row,scope.row[row.prop]):null"
                      >{{scope.row[row.prop]}}</span>
                  </template>
              </el-table-column>
              <el-table-column
                  width="120"
                  label="操作"
                  align="center"
                  :render-header="renderCz"
              >
                  <template slot-scope="scope">
                      <el-button size="mini" style="padding:3px 5px;" type="primary" @click="openView(scope.row)">预览</el-button>
                      <el-button v-if="!scope.row.yxbz" size="mini" style="padding:3px 5px;" type="danger" @click="deleteGroup(scope.row,scope.$index)">删除</el-button>
                  </template>
              </el-table-column>
            </el-table>
        </div>
      </div>
      <preview v-if="dialog.show" :views="dialog"></preview>
  </div>
</template>
<script>
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
          class: this.getClass
        },
        { label: "商品数", prop: "spsl", render: true },
        { label: "创建时间", prop: "zdrq" }
      ],
      dialog: {
        show: false,
        data: null,
        type: 3
      },
      filterColumn: {
        datas: null
      }
    };
  },
  methods: {
    getClass(row) {
      if (row.yxbz) return "cell-span-gray";
      else return "cell-span-blue";
    },
    openView(row) {
      this.dialog.show = true;
      this.dialog.data = row.name;
    },
    openAdd(row, id) {
      if(row.yxbz) return;
      var id = row ? row.id : -1;
      this.$router.push(`/main/mall/shop/product_group_add/${id}`);
    },
    getList() {
      this.$http("/api/x6/getHySetSpfzList.do").then(res => {
        this.List = res.List;
        this.filterColumn.datas = res.List;
        //将分组保存到strrage方便在商品新增中调用
        //this.$util.addCache('')
      });
    },
    deleteGroup(row, index) {
      const h = this.$createElement;
      let array = row.spsl
        ? [
            h("p", null, "确认删除此分组吗 "),
            h(
              "p",
              {
                style: "color: #999;font-size:12px;"
              },
              "分组删除后，分组内的商品将全部移动到系统默认分组中"
            )
          ]
        : [h("p", null, "确认删除此分组吗 ")];
      this.$msgbox({
        title: "提示",
        type: "warning",
        message: h("div", null, array),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(action => {
          this.$http('/api/x6/delSpfzByIds.do',{
            ids:row.id
          }).then(res=>{
            this.$message('删除成功');
            this.$util.requestAllCache(this.$http);
            this.List.splice(index,1);
          });
        })
        .catch(() => {});
    },
    renderCz(h, { column, $index, store, _self }) {
      return h(
        "div",
        {
          style: {
            position: "relative",
            overflow: "visible",
            textAlign: "center",
            lineHeight: 0
          }
        },
        [
          h("span", column.label),
          h("i", {
            style: {
              cursor: "pointer",
              color: "#888",
              fontSize: "14px",
              marginLeft: "5px",
              position: "absolute",
              right: "-8px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#ccc"
            },
            class: {
              iconfont: true,
              "icon-bangzhu3": true
            },
            attrs: {
              title: "*默认分组为系统默认分组不可操作"
            }
          })
        ]
      );
    }
  },
  mounted() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  components: {
    preview
  }
};
</script>
<style lang="less" scoped>
.g-header {
  padding-bottom: 10px;
}
.g-body {
  height: auto;
}
</style>

