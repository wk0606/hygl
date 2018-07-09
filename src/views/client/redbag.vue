<template>
  <div class="r-container" @click.stop=''>
      <div class="r-head">
          <div class="r-head-name" :style="{background:getBackColor}">{{views.data.name}}</div>
          <div
            class="r-head-text"
            v-for="item in heads"
            :key="item.prop"
          >
            <div>{{item.label}}</div>
            <div>{{views.data[item.prop]||''}}</div>
          </div>
      </div>
      <div class="r-main">
          <div
            class="r-item"
            v-for="(row,index) in views.data.list"
            :key="index"
          >
            <div
                class="r-item-text"
                v-for="item in bags"
                :key="item.prop"
            >
                <div>{{item.label}}</div>
                <div>{{item.currency?$util.formatCash(row[item.prop]):row[item.prop]}}</div>
            </div>
            <div class="r-item-mask" v-if="row.zt=='已使用'"></div>
          </div>
      </div>
  </div>
</template>
<script>
export default {
  props:['views'],
  data(){
      return{
          heads:[
              {label:'手机',prop:'phone'},
              {label:'微信',prop:'wx'},
              {label:'生日',prop:'csny'},
              {label:'地址',prop:'address'}
          ],
          bags:[
              {label:'红包金额',prop:'je',currency:true},
              {label:'发放时间',prop:'zdrq'},
              {label:'使用时间',prop:'syrq'},
              {label:'红包状态',prop:'zt'}
          ]
      }
  },
  computed:{
    getBackColor(){
        let colors = ['#324057', '#20A0FF', '#58B7FF', '#A559A3', '#13CE66', '#F7BA2A', '#FF4949', '#03FA66', '#1E6223', '#1E6223'];
        return colors[parseInt(this.views.data.id) % 10];
    }
  }
}
</script>
<style lang="less" scoped>
    .r-container{
        width: 500px;
        height: 100%;
        position: absolute;
        top:1px;
        right: 0;
        background: #f9f9f9;
        z-index: 99;
        box-shadow: -3px 0px 5px #E3E3E3;
        .r-head{
            display: flex;
            box-sizing: border-box;
            padding: 15px 10px;
            align-items: flex-start;
            background: #fff;
            >div{
                display: inline-flex;
                align-items: center;
                justify-content: flex-start;
                flex-direction: column;
            }
            .r-head-name{
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 14px;
                color:#fff;
            }
            .r-head-text{
                flex-grow: 1;
                div{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                div:nth-child(1){margin-bottom: 10px;}
            }
        }
        .r-main{
            height: ~"calc(100% - 70px)";
            box-sizing: border-box;
            padding: 0 20px 10px 20px;
            overflow-y: auto;
            .r-item{
                width:100%;
                height: auto;
                box-sizing: border-box;
                padding: 15px;
                position: relative;
                background: #e44694;
                display: flex;
                overflow: hidden;
                border-radius: 4px;
                margin-top: 20px;
                .r-item-text{
                    width: 25%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: flex-start;
                    flex-direction: column;
                    color: #fff;
                    div:nth-child(1){margin-bottom: 10px;}
                    div{text-align: center;}
                }
               .r-item-mask{
                    width: 100%;
                    height: 100%;
                    //background: rgba(0,0,0,.2);
                    background: rgba(255,255,255,.7);
                    position: absolute;
                    top:0;
                    left:0;
                }
                &:before,&:after{
                    content: '';
                    display: block;
                    width: 20px;
                    height: 20px;
                    background: #f9f9f9;
                    border-radius: 50%;
                    position: absolute;
                    top:50%;
                }
                &:before{
                    left: 0;
                    transform: translateX(-60%) translateY(-50%);
                }
                &:after{
                    right:0;
                    transform: translateX(60%) translateY(-50%);
                }
            }
        }
    }
</style>
