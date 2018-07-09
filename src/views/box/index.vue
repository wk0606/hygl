<template>
  <div class="box-container" @click="slidePageControl.show=false">
      <div class="box-header">
        <div>
            <span><i style="color:red;">*</i>日期</span>
            <el-date-picker
                v-model="date"
                size="small"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :clearable="false">
            </el-date-picker>
        </div>
        <div>
            <el-button size="small" type="primary" @click="search">查询</el-button>
            <el-button size="small" type="warning" @click="exportExcel">导出</el-button>
        </div>
      </div>
      <div class="box-body" ref="table">
          <el-table
            :data="showDatas"
            stripe
            border
            height="100%"
          >
            <el-table-column
                v-for="col in colModel"
                :key="col.prop"
                :label="col.label"
                :prop="col.prop"
                header-align="center"
                :align="col.align||'center'"
                :min="col.min||0"
                :render-header="col.render?col.render:null"
            >
                <template slot-scope="scope">
                    <span
                      class="cell-span" 
                      :class="{'cell-span-blue':col.click}"
                      @click.stop="col.click?col.click(scope.row):null"
                      :style="col.style?col.style(scope.row):null">
                        {{col.format?col.format(scope.row):scope.row[col.prop]}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="客流量走势" width="100" align='center'>
              <template slot-scope="scope">
                <i
                  class="iconfont icon-zoushi"
                  style="cursor:pointer;color:#409EFF;"
                  @click="openCharts(scope.row)"
                ></i>
              </template>
            </el-table-column>
          </el-table>
          <transition name="slideRight">
            <slide-page
              :control="slidePageControl"
              ref="slidePage"
              v-if="slidePageControl.show"
            ></slide-page>
          </transition>
      </div>
      <div class="box-footer">
          <totals :data="getTotal"></totals>
          <pagination :data="pagination" @current-change="changePage"></pagination>
      </div>
      <bind-box :control="controlBindBox" v-if="controlBindBox.show"></bind-box>
      <history v-if="charts.show" :views="charts"></history>
      <!-- <filter-panel></filter-panel> -->
    </div>
</template>
<script>
  import {Loading} from '../../func/loading'
  import bindBox from './bindBox'
  import pagination from '../../components/pagination/index'
  import totals from '../../components/totals/index'
  import slidePage from './slidePage'
  import history from './history'
  import {excel} from '../../func/excel'
  import bus from '../../func/eventBus'
  export default {
    name:'hy_myhz',
    data() {
      return {
        date: '',
        colModel:[
            {label:'日期',prop:'fsrq',width:110},
            {label:'门店名称',prop:'name',align:'left',min:200,click:this.getDetail,render:this.renderFilterHead},
            {label:'地址',prop:'dz',align:'left',min:300},
            {label:'盒子状态',prop:'havebind',width:100,format:this.formatMac,style:this.macStyle,click:this.bindMac},
            {label:'客流量',prop:'kll',width:110,render:this.renderFilterHead},
            {label:'成交量',prop:'cjl',width:110,render:this.renderFilterHead},
            {label:'新客户',prop:'newkll',width:110,render:this.renderFilterHead},
            {label:'回头客',prop:'oldkll',width:110,render:this.renderFilterHead}
        ],
        showDatas: [],
        allDatas: [],
        tableHeight: 500,
        slidePageControl: {show: false, item: ''},
        showLoad: false,
        controlBindBox: {
          show: false,
          item: '',
        },
        renderHeader: this.tableHeader, //过滤
        filterColumn: {
          datas:null
        },
        exportControl:{
          show:false
        },
        exportDatas: {
          fileName: "客流量统计",
          title: "客流量统计",
          data: [],
          columns: [],
          condition: '',
        }, 
        pagination:{
            size:20,
            page:1,
            rows:0
        },
        charts:{
          show:false,
          data:null
        }
      }
    },
    computed:{
        getTotal:{
            get() {
                var temp={
                    '客流量':0,
                    '成交量':0
                }
                if(this.allDatas.length){
                    for(let obj of this.allDatas){
                        temp['客流量']+=(obj.kll||0);
                        temp['成交量']+=(obj.cjl||0);
                    }
                }
                return temp;
            },
            set(val){
                this.allDatas=val;
            }
        }
    },
    methods: {
      changePage(page){
          this.pagination.rows=this.allDatas.length;
          this.pagination.page=page;
          this.showDatas=this.allDatas.slice((this.pagination.page-1)*this.pagination.size,this.pagination.page*this.pagination.size);
      },
      exportExcel(){
        this.exportDatas.data = [];
        this.exportDatas.columns = [];
        if (this.allDatas.length == 0) {
          this.$message('没有要导出的数据','error');
          return;
        }else{
          var cols=[
            {label:'门店名称',prop:'name'},
            {label:'地址',prop:'dz'},
            {label:'盒子状态',prop:'bdzt'},
            {label:'客流量',prop:'kll'},
            {label:'成交量',prop:'cjl'},
            {label:'新客户',prop:'newkll'},
            {label:'回头客',prop:'oldkll'}
          ];
          for(let obj of cols){
            this.exportDatas.columns.push({colName: obj.label});
          }
          for(let row of this.allDatas){
            let _temp=[];
            for(let obj of cols){
              _temp.push(row[obj.prop]||0);
            }
            this.exportDatas.data.push(_temp);
          }
          excel.open(this.exportDatas);
        }
      },
      getDetail(row) {
        if (!row.havebind || row.havebind == 0) {
          this.slidePageControl.show = false
          this.$confirm('该门店还没有绑定麦芽盒子，现在去绑定？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning",
          }).then(() => {
            this.controlBindBox.item = row
            this.controlBindBox.show = true
          })
          return
        }
        this.openDetail(row)
      },
      openDetail(val) {
        this.slidePageControl.item = val
        this.slidePageControl.show = true
      },

      checkKq(val) {//查看考勤
        // 打开页面，此处最好使用提示页面
        var newWin = window.open('');
        this.$http("/api/x6/box/getKqUrl.do", {
          ssgsid: val.id
        }).then((response) => {
          newWin.location.href = response.url;
        });
      },
      search() {//执行查询
        Loading.open({
          target:this.$refs.table
        });
        this.$http("/api/x6/box/KllzbReport.do", {
          fsrqq: this.date,
          fsrqz: this.date,
        }).then((response) => {
          response.List.forEach(item => {
            item.bdzt = item.havebind == 1 ? "已绑定" : "未绑定"
            item.dz = item.province + item.city + item.town + item.dz
          });
          this.allDatas = response.List;
          this.changePage(1);
          this.filterColumn.datas = this.allDatas;
          Loading.close();
        },err=>{
            Loading.close();
        });
      },
      bindMac(row){
        if(!row.havebind)
          this.getDetail(row);
        else{
          this.$confirm('解绑麦芽盒子后将无法获取该门店的客流量数据以及考勤记录，确定要解绑麦芽盒子？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning",
          }).then(() => {
            this.$http("/api/x6/box/unbindbox.do", {
              gsdm: this.$util.getCache('user').gsdm,
              ssgsid: row.id
            }).then((response) => {
              this.$message('解绑成功');
              row.havebind=0;
            });
          });
        }
      },
      openCharts(row){
        this.charts.show=true;
        this.charts.data=row.id;
      },
      formatMac(row){
        return row.havebind?'已绑定':'未绑定';
      },
      macStyle(row){
        return row.havebind?'color:#67C23A':'color:#F56C6C';
      },
      setShowDatas(datas) {
        this.showDatas = datas
      },
      getTotal() {//计算个数
        let mdsl = this.allDatas.length
        let kll = 0;
        let cjl = 0;
        this.allDatas.forEach((item) => {
          kll += item.kll||0
          cjl += item.cjl
        })
        return {
          '客流量': kll,
          '成交量': cjl,

        }
      }
    },
    mounted() {
      this.date=this.$util.getCurrentDate();
      this.search();
      this.$bus.$on('filter-success', (array) => {
        this.allDatas=array;
        this.changePage(1);
      });
    },
    components:{
        bindBox,
        pagination,
        totals,
        slidePage,
        history
    }
  }
</script>
<style lang="less" scoped>
  @import './index.less';

  .edit-enter-active {
    animation: editIn .3s;
  }

  .edit-leave-active {
    animation: editOut .3s;
  }

  @keyframes editIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes editOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
