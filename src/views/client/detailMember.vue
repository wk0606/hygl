<template>
  <div @click.stop='' class="slideRight">
    <edit-model
        :views="views"
        width="500"
        body-color="#f4f4f9"
        v-if="views.data.head"
    >
        <div slot="title" class="detail-title">
            <div class="header" :style="{background:getBgColor}">
                {{views.data.head.name.substring(views.data.head.name.length-2)}}
            </div>
            <div
                v-for="item in headers"
                :key="item.prop"
                class="title-items"
            >
                <p>{{item.label}}</p>
                <p>{{item.format?item.format(views.data.head):views.data.head[item.prop]}}</p>
            </div>
        </div>
        <div slot="content">
            <div class="d-charts">
                <i class="el-icon-goods"></i>
                <span>累计消费次数:</span>
                <em>{{views.data.head.xfcs}}</em>
                <span>消费金额:</span>
                <em>{{$util.formatCash(views.data.head.xfje)}}</em>
                <span>综合毛利:</span>
                <em>{{$util.formatCash(views.data.head.xfml)}}</em>
            </div>
            <ul class="d-list">
                <li
                    v-for="(item,index) in views.data.list"
                    :key="index"
                >
                    <div class="d-list-item">
                        <p>{{item.zdrq}}</p>
                        <div>
                            <div
                                v-for="desc in descs"
                                :key="desc.prop"
                            >
                                {{`${desc.label}:${desc.format?desc.format(item[desc.prop]):(item[desc.prop]||'无')}`}}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </edit-model>
  </div>
</template>
<script>
import editModel from '../../components/editModel/index'
export default {
  props:['views'],
  data(){
    return {
        bgcolors:['#324057', '#20A0FF', '#58B7FF', '#A559A3', '#13CE66', '#F7BA2A', '#FF4949', '#03FA66', '#1E6223', '#1E6223'],
        headers:[
            {label:'手机号',prop:'phone'},
            {label:'微信号',prop:'wx'},
            {label:'生日',prop:'csny'},
            {label:'地址',prop:'address',format:this.formatDz}
        ],
        descs:[
            {label:'消费金额',prop:'je',format:this.formatJe},
            {label:'综合毛利',prop:'lr1',format:this.formatJe},
            {label:'商品',prop:'qspmc'},
            {label:'单据号',prop:'djh'},
            {label:'赠品',prop:'zpname'},
            {label:'营业员',prop:'ywydm',format:this.formatYwy},
            {label:'门店',prop:'ckdm',format:this.formatMd}
        ]
    }
  },
  computed:{
      getBgColor(){
          return this.views.data.head?this.bgcolors[this.views.data.head.id%10]:0;
      }
  },
  methods:{
      formatDz(row){
          return row.province+row.city+row.town+row.dz;
      },
      formatJe(je){
          return this.$util.formatCash(je);
      },
      formatYwy(id){
          return this.$util.getYgInfo(id).name;
      },
      formatMd(id){
          return this.$util.getCompanyInfo(id).name;
      }
  },
  components:{
      editModel
  }
}
</script>
<style lang="less" scoped>
    .detail-title{
        display: flex;
        align-items: flex-start;
        font-size: 12px;
        width: 100%;
        .header{
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #fff;
            flex-shrink: 0;
        }
        .title-items{
            flex-grow: 1;
            display: inline-flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            >p:nth-child(1){margin-bottom: 5px;}
        }
    }
    .d-charts{
        display: flex;
        align-items: center;
        font-size: 14px;
        padding: 20px 0;
        i,em{margin-right: 10px;}
        i{
            font-size: 18px;
            color:#E6A23C;
        }
    }
    .d-list{
        width: 100%;
        li{
            box-sizing: border-box;
            padding:7px 0 0 8px;
            background: url('../../assets/step.png') no-repeat;
            .d-list-item{
                border-left:1px solid #ccc;
                box-sizing: border-box;
                padding-left: 10px;
                >div{
                    width: 100%;
                    box-sizing: border-box;
                    padding: 7px;
                    background: #fff;
                    margin-top: 10px;
                    div{
                        display: inline-block;
                        padding: 7px;
                    }
                }
            }
        }
    }
</style>
