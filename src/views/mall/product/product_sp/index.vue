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
          >{{item.label}}</div>
      </div>
      <div class="wdsp-body">  
          <el-table
            :data="List"
            height="100%"
            header-cell-class-name="el-table-drak-head"
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
                        <img :src="scope.row.picurl" alt="">
                        <div>
                            <div class="eellipsis2rows">{{scope.row.name}}</div>
                            <p>￥{{scope.row.lsj | currency}}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="访问量"
                prop="looksl"
            >
                <template slot-scope="scope">
                   <div><span class="cell-span">访客数:2</span></div> 
                   <div><span class="cell-span">浏览量:2</span></div> 
                </template>
            </el-table-column>
            <el-table-column
                label="总销量"
                prop="zxsl"
                align="center"
            >
                <template slot-scope="scope">
                   <span class="cell-span">2</span>
                </template>
            </el-table-column>
            <el-table-column
                label="可售库存"
                prop="kskc"
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
                prop="group"
                align="center"
            >
                <template slot-scope="scope">
                   <span class="cell-span"></span>
                </template>
            </el-table-column>
            <el-table-column
                label="序号"
                prop="num"
                align="center"
            >
                <template slot-scope="scope">
                   <span class="cell-span"></span>
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
            <el-checkbox>当页全选</el-checkbox>
            <el-button size="mini">下架</el-button>
            <el-button size="mini">删除</el-button>
          </div>
          <pagination :data="page" :small="true"></pagination>
      </div>
  </div>
</template>
<script>
import pagination from '../../../../components/pagination/index'
export default {
  data(){
      return {
          tabs:[
              {label:'销售中',value:'1'},
              {label:'已售罄',value:'2'}
          ],
          currentValue:'1',
          List:[
              {
                  picurl:'https://img14.360buyimg.com/n1/s450x450_jfs/t4333/208/365266204/337840/e9e7bd9a/58b3f51aN10566aa1.jpg',
                  name:'华为p20星曜黑6g 32g 2018世界杯特别版华为p20星曜黑6g 32g 2018世界杯特别版',
                  lsj:3200,
                  fks:100,
                  looksl:322,
                  zxsl:32,
                  kskc:21,
                  sjsj:'2018-09-12 09:45:21',
                  group:'春节新品',
                  num:1
              },
              {
                  picurl:'https://img14.360buyimg.com/n1/s450x450_jfs/t4333/208/365266204/337840/e9e7bd9a/58b3f51aN10566aa1.jpg',
                  name:'华为p20星曜黑6g 32g 2018世界杯特别版华为p20星曜黑6g 32g 2018世界杯特别版',
                  lsj:3200,
                  fks:100,
                  looksl:322,
                  zxsl:32,
                  kskc:21,
                  sjsj:'2018-09-12 09:45:21',
                  group:'春节新品',
                  num:1
              },
              {
                  picurl:'https://img14.360buyimg.com/n1/s450x450_jfs/t4333/208/365266204/337840/e9e7bd9a/58b3f51aN10566aa1.jpg',
                  name:'华为p20星曜黑6g 32g 2018世界杯特别版华为p20星曜黑6g 32g 2018世界杯特别版',
                  lsj:3200,
                  fks:100,
                  looksl:322,
                  zxsl:32,
                  kskc:21,
                  sjsj:'2018-09-12 09:45:21',
                  group:'春节新品',
                  num:1
              },
              {
                  picurl:'https://img14.360buyimg.com/n1/s450x450_jfs/t4333/208/365266204/337840/e9e7bd9a/58b3f51aN10566aa1.jpg',
                  name:'华为p20星曜黑6g 32g 2018世界杯特别版华为p20星曜黑6g 32g 2018世界杯特别版',
                  lsj:3200,
                  fks:100,
                  looksl:322,
                  zxsl:32,
                  kskc:21,
                  sjsj:'2018-09-12 09:45:21',
                  group:'春节新品',
                  num:1
              },
              {
                  picurl:'https://img14.360buyimg.com/n1/s450x450_jfs/t4333/208/365266204/337840/e9e7bd9a/58b3f51aN10566aa1.jpg',
                  name:'华为p20星曜黑6g 32g 2018世界杯特别版华为p20星曜黑6g 32g 2018世界杯特别版',
                  lsj:3200,
                  fks:100,
                  looksl:322,
                  zxsl:32,
                  kskc:21,
                  sjsj:'2018-09-12 09:45:21',
                  group:'春节新品',
                  num:1
              },
              {
                  picurl:'https://img14.360buyimg.com/n1/s450x450_jfs/t4333/208/365266204/337840/e9e7bd9a/58b3f51aN10566aa1.jpg',
                  name:'华为p20星曜黑6g 32g 2018世界杯特别版华为p20星曜黑6g 32g 2018世界杯特别版',
                  lsj:3200,
                  fks:100,
                  looksl:322,
                  zxsl:32,
                  kskc:21,
                  sjsj:'2018-09-12 09:45:21',
                  group:'春节新品',
                  num:1
              },
              {
                  picurl:'https://img14.360buyimg.com/n1/s450x450_jfs/t4333/208/365266204/337840/e9e7bd9a/58b3f51aN10566aa1.jpg',
                  name:'华为p20星曜黑6g 32g 2018世界杯特别版华为p20星曜黑6g 32g 2018世界杯特别版',
                  lsj:3200,
                  fks:100,
                  looksl:322,
                  zxsl:32,
                  kskc:21,
                  sjsj:'2018-09-12 09:45:21',
                  group:'春节新品',
                  num:1
              }
          ],
          page:{
              no:1,
              size:10,
              rows:9809
          }
      }
  },
  methods:{
      addProduct(){
          this.$router.push('/main/mallchildren/product_edit');
      }
  },
  components:{
      pagination
  }
}
</script>
<style lang="less" scoped>
    .wdsp-header{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0 15px 0;
        .el-input{width: 250px;}
    }
    .wdsp-body{
        height: ~"calc(100% - 148px)";
    }
    .wdsp-footer{
        display: flex;
        align-items: center;
        padding-top: 10px;
        justify-content: space-between;
        .el-checkbox{margin-right: 20px;}
    }
    .cell-product{
        width:100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        img{
            width: 50px;
            height: 50px;
            flex-shrink: 0
        }
        >div{
            height: 50px;
            flex-grow: 1;
            font-size: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            div{
                height: 30px;
                color: #66a5fd;
                line-height: 15px;
                
            }
            p{color:#febc6b;}
        }
    }
</style>
