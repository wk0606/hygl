<template>
  <pop-up
    title="历史走势"
    :title-sub="'(客流量历史数据截至到'+date[1]+')'"
    width="900"
    :views="views"
  >
    <div slot="content" class="content">
        <div class="content-title">
            <div>
                <span style="margin-right:10px;">日期范围</span>
                <date-picker :date.sync="date" @change="getData"></date-picker>
            </div>
            <el-select v-model="range" placeholder="请选择" size="mini" style="width:70px;" @change="getData">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="charts-models">
            <div
                v-for="item in models"
                :key="item.type"
                :class="{selected:item.checked}"
                @click="changeModels(item)"
            >
                <div class="flex-center">
                    <span>{{item.label}}</span>
                    <div
                        class="custom-box"
                        :class="{'custom-selected':item.checked}"
                    >
                        <i class="el-icon-check"></i>
                    </div>
                    <!-- <el-checkbox v-model="item.checked"></el-checkbox> -->
                </div>
                <h3>{{chart[item.type].value}}</h3>
            </div>
        </div>
        <div class="charts-body" ref="charts"></div>
    </div>
  </pop-up>
</template>
<script>
import popUp from '../../components/popUp/index'
import datePicker from '../../components/datePicker/index'
import echarts from 'echarts'
export default {
  props:['views'],
  data(){
      return {
          date:[],
          pickerOptions: {
            disabledDate(time) {
                return time.getTime() > Date.now() - 8.64e7;
            }
          },
          range:'D',
          options:[
            {value:'D',label:'日',type:'D'},
            {value:'W',label:'周',type:'W'},
            {value:'M',label:'月',type:'M'}
          ],
          models:[
              {label:'客流量',type:'kll',checked:true,data:[343,2399,44,1212,667,87,987],color:'#00BFFF'},
              {label:'新客户',type:'newsl',checked:false,data:[343,2399,44,1212,667,87,987],color:'#FF1493'},
              {label:'回头客',type:'oldsl',checked:false,data:[343,2399,44,1212,667,87,987],color:'#801dae'}
          ],
          chart:{
              kll:{
                  value:0,
                  list:[]
              },
              newsl:{
                  value:0,
                  list:[]
              },
              oldsl:{
                  value:0,
                  list:[]
              },
              xdata:[],
              title:[]
          }                                                                                                           
      }
  },
  methods:{
      getData(){
          this.$http('/api/x6/box/kllSzReport.do',{
              ssgsid:this.views.data,
              fsrqq:this.date[0],
              fsrqz:this.date[1],
              wd:this.range
          }).then(res=>{
              var [kll,newsl,oldsl]=[0,0,0];
              this.chart.xdata=[];
              this.chart.kll.list=[];
              this.chart.newsl.list=[];
              this.chart.oldsl.list=[];
              for(let obj of res.List){
                  this.chart.xdata.push(obj.wd);
                  this.chart.kll.list.push(obj.kll||0);
                  this.chart.newsl.list.push(obj.newsl||0);
                  this.chart.oldsl.list.push(obj.oldsl||0);
                  kll+=obj.kll;
                  newsl+=obj.newsl;
                  oldsl+=obj.oldsl;
              }
              this.chart.kll.value=kll;
              this.chart.newsl.value=newsl;
              this.chart.oldsl.value=oldsl;
              this.drawChart(this.chart.xdata,this.getCheckedItem());
          });
      },
      getCheckedItem(){
        var temp=[];
        this.chart.title=[];
        for(let obj of this.models){
            if(obj.checked){
                this.chart.title.push(obj.label);
                temp.push({
                    type:'line',
                    name:obj.label,
                    data:this.chart[obj.type].list,
                    color:obj.color
                });
            }
        }
        return temp;
      },
      changeModels(item){
        var t=this.models.filter(item=>item.checked).length;
        if(t==1&&item.checked){
            return;
        }
        item.checked=!item.checked;
        this.drawChart(this.chart.xdata,this.getCheckedItem());
      },
      drawChart(xdata,ydata){
        var chart = echarts.init(this.$refs.charts);
        var option = {
            legend:{
                data:this.chart.title
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                top: '13%',
                bottom:'3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : xdata
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : ydata
        };
        chart.setOption(option,true);
      },
  },
  mounted(){
      this.date.push(this.$util.getDateByDistance(-30));
      this.date.push(this.$util.getDateByDistance(-1));
      var data={
          x:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
          y:[34343,5456,76788,2323,1212,7766,9990]
      }
      this.getData();
  },
  components:{
      popUp,
      datePicker
  }
}
</script>
<style lang="less" scoped>
    .content{
        box-sizing: border-box;
        padding: 5px 0;
    }
    .content-title{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .charts-models{
        box-sizing: border-box;
        padding: 20px 10px 20px 30px;
        display: flex;
        >div{
            width: 130px;
            box-sizing: border-box;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin-right: 20px;
            cursor: pointer;
            p{margin-bottom: 20px;}
        }
        >div.selected{
            border-color:#409EFF;
        }
    }
    .charts-body{
        width: 100%;
        height: 300px;
    }
    .custom-box{
        width: 14px;
        height: 14px;
        border-radius: 1px;
        border:1px solid #eee;
        cursor: pointer;
        i{
            font-size: 12px;
            text-align: center;
            line-height: 14px;
            color: #fff;
        }
    }
    .custom-selected{
        border-color:#409eff;
        background: #409EFF;
    }
</style>
