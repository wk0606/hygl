<template>
    <div style="display:flex;justify-content:center;">
        <real-view
            width="300px"
            height="600px"
        >
            <div style="background:#fff;">
                <img src="../../../assets/dpxq.png" alt="" width="100%">
                <scroll
                    class="scroll"
                    need-hover
                    bar-color="#ccc"
                    :speed="10"
                 >
                    <div class="yl-body">
                        <div class="yl-title">
                            <div>
                                <img :src="details.dptpUrl||defaultImg" alt="">
                                <div>
                                    <p><b>{{details.dpName}}</b></p>
                                    <p v-if="details.isValidate==2"><i class="el-icon-circle-check-outline"></i><span>企业认证</span></p>
                                </div>
                            </div>
                            <img src="../../../assets/mallPhone.png" alt="">
                        </div>
                        <div
                            class="yl-group"
                            v-for="(item,index) in details.spArray"
                            :key="index"
                        >
                            <div class="yl-name"><div>{{item.spfzName}}</div></div>
                            <div>
                                <div
                                    class="yl-item"
                                    v-for="sp in item.spxxList"
                                >
                                    <div class="yl-item-img" v-resizeImg>
                                        <img :src="sp.sptpfirst" alt="">
                                    </div>
                                    <div class="yl-text">
                                        <span class="ellipsis2rows pname">{{sp.name}}</span>
                                    </div>
                                    <div class="yl-text yl-price">
                                        <span class="ellipsis2rows">{{'￥'+sp.spdj}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div>
                        <div class="md-header">
                            <div>
                                <div class="avator"></div>
                                <div>
                                    <p><b>{{details.dpName}}</b></p>
                                    <p>
                                        <img src="../../../assets/checked.png" alt="" width="15">
                                        <span>企业认证</span>
                                    </p>
                                </div>
                            </div>
                            <img src="../../../assets/mallPhone.png" alt="">
                        </div>
                        <div
                            v-for="item in details.spArray"
                            :key="item.spfzmc"
                            class="p-group"
                        >
                            <div class="p-group-header">{{item.spfzmc}}</div>
                            <div class="p-group-body">
                                <div
                                    v-for="sp in item.spxx"
                                    :key="sp.spid"
                                >
                                    <img :src="sp.sptpFirst" alt="">
                                    <p>{{sp.name}}</p>
                                    <p>￥{{sp.spdj}}</p>
                                </div>
                            </div>
                        </div>
                    </div> -->
                </scroll>
            </div>
        </real-view>
    </div>
</template>
<script>
import realView from '../.././../components/realView/index'
import scroll from '../../../components/scroll/scroll'
export default {
  data(){
      return {
        details:{
            dpName:'',
            spArray:[]
        },
        defaultImg:require('../../../assets/store.png')
      }
  },
  methods:{
      //预览操作
    preview(){
        this.$http('/api/x6/getWdylInfo.do').then(res=>{
            this.details=res.VO;
            this.details.spArray=this.details.spArray.filter(item=>{
                return !!item.spxxList.length;
            })
        });
    },
  },
  mounted(){
      this.preview();
  },
  activated(){
      this.preview();
  },
  components:{
      realView,
      scroll
  }  
}
</script>
<style lang="less" scoped>
    .md-header{
        box-sizing: border-box;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        >img{
            width: 30px;
            height: 30px;
        }
        >div{
            display: inline-flex;
            align-items: center;
            .avator{
                width: 40px;
                height: 40px;
                margin-right: 10px;
                border-radius: 50%;
                background-color: #fff;
                background-image: url('../../../assets/1.png');
                background-size: cover;
                background-position: center center;
            }
            p{
                display: flex;
                align-items: center;
                span{
                    margin-left: 5px;
                }
                b{font-size: 14px;}
            }
            p:nth-child(1){margin-bottom: 8px;}
        }
    }
    .scroll{
        width: 100%;
        height: 420px;
        margin-top: -3px;
        >div{
            height: auto;
        }
        .yl-body{
            min-height: 100%;
            background: #f2f2f2;
            box-sizing: border-box;
            padding: 0 10px 10px 10px;
            .yl-title{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 0;
                >div{
                    display: inline-flex;
                    align-items: center;
                    flex-grow: 1;
                    //text-overflow: ellipsis;
                    overflow: hidden;
                    img{
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        margin-right: 5px;
                        flex-shrink: 0;
                    }
                    b{
                        font-size: 14px;
                        flex-grow: 1;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                    p{
                        display: flex;
                        align-items: center;
                        span{
                            transform: scale(0.8,0.8);
                        }
                        i{color: #67C23A;font-size: 14px;}
                    }
                    p:nth-child(2){margin-top:2px;}
                }
                >img{
                    width: 30px;
                    height: 30px;
                    flex-shrink: 0;
                    margin-left: 10px;
                }
            }
            .yl-group{
                margin-top: 15px;
                .yl-name{
                    width: 100%;
                    height: 1px;
                    background: #d3d3d3;
                    text-align: center;
                    margin-bottom: 10px;
                    >div{
                        background: #f2f2f2;
                        padding: 0 10px;
                        display: inline-block;
                        position: relative;
                        top:-7px;
                        font-size: 13px;
                    }
                }
                >div:nth-child(2){
                    display: flex;
                    flex-wrap: wrap;
                    .yl-item{
                        box-sizing: border-box;
                        width: ~"calc(50% - 5px)";
                        background: #fff;
                        border-radius: 4px;
                        margin-top: 10px;
                        overflow: hidden;
                        .yl-item-img{
                            height: 120px;
                            width:100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .yl-text{
                            box-sizing: border-box;
                            padding: 5px 10px;
                            font-size: 10px;
                            .pname{
                                min-height: 22px;
                            }
                        }
                        .yl-price{
                            font-size: 12px;
                            color: red;
                        }
                    }
                    .yl-item:nth-child(odd){
                        margin-right: 5px;
                    }
                    .yl-item:nth-child(even){
                        margin-left: 5px;
                    }
                }
            }
        }
    }
</style>
