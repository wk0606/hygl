<template>
    <pop-up
        title="区域设置"
        width="700"
        :views="views"
        :confirm="save"
    >
        <div slot="content" class="content">
            <div class="m-transfer">
                <div class="m-transfer-body">
                    <div>可选省、市、区</div>
                    <ul>
                        <p>
                             <el-input
                                prefix-icon="el-icon-search"
                                size="mini"
                                placeholder="请输入城市拼音"
                                v-model="maps.pyLeft"
                                @input="serachItem('List','pyLeft')"
                            ></el-input>
                        </p>
                        <div class="m-transfer-item">
                            <li
                                v-for="item in maps.List"
                                :key="item.label"
                                v-show="item.show"
                                :class="{select:item.checked}"
                                @click="checkedItem(item,'selLeft')"
                            >
                                <i class="el-icon-circle-plus"></i>
                                <span>{{item.label}}</span>
                            </li>
                        </div>
                    </ul>
                </div>
                <div class="m-transfer-btn">
                    <div><el-button icon="el-icon-arrow-right" circle :disabled="!maps.selLeft.length" @click="transfer('selLeft')"></el-button></div>
                    <div><el-button icon="el-icon-arrow-left" circle :disabled="!maps.selRight.length" @click="transfer('selRight')"></el-button></div>
                </div>
                <div class="m-transfer-body">
                    <div>已选省、市、区</div>
                    <ul>
                        <p>
                             <el-input
                                prefix-icon="el-icon-search"
                                size="mini"
                                placeholder="请输入城市拼音"
                                v-model="maps.pyRight"
                                @input="serachItem('selList','pyRight')"
                            ></el-input>
                        </p>
                        <div class="m-transfer-item">
                            <li
                                v-for="item in maps.selList"
                                :key="item.label"
                                v-show="item.show"
                                :class="{select:item.checked}"
                                @click="checkedItem(item,'selRight')"
                            >
                                <i class="el-icon-circle-plus"></i>
                                <span>{{item.label}}</span>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    </pop-up>
</template>
<script>
import popUp from '../../../../../components/popUp/index'
import py from '../../../../../func/pinyin'
export default {
  props:['views'],
  data(){
      const getList=()=>{
          
      }
      return {
          maps:{
              List:[],//左侧列表
              selList:[],//右侧列表
              selLeft:[],//左侧选中集合
              selRight:[],//右侧选中集合
              pyLeft:'',//左侧搜索拼音
              pyRight:''//右侧搜索拼音
          }
      }
  },
  methods:{
      serachItem(map,py){
          for(let obj of this.maps[map]){
              obj.show=obj.py.indexOf(this.maps[py])>-1?true:false;
          }
      },
      checkedItem(item,map){
          if(item.checked){
              this.maps[map]=this.maps[map].filter(_item=>{
                  return _item.label!=item.label;
              });
          }else{
              this.maps[map].push(item);
          }
          item.checked=!item.checked;
      },
      transfer(type){
          var map=this.maps[type];
          var origin=type=='selLeft'?'List':'selList';
          var target=type=='selLeft'?'selList':'List';
          var temp=[];
          //取出源数据选择的集合放置到目标集合中
          for(let obj of map){
              obj.checked=false;
              this.maps[target].push(obj);
              temp.push(obj.label);
          }
          //从目标集合中删除选择的集合
          this.maps[origin]=this.maps[origin].filter(item=>{
              return temp.indexOf(item.label)==-1;
          });
          //排序
          this.$util.sortArrayByKey(this.maps[target],'py');
          this.$util.sortArrayByKey(this.maps[origin],'py');
          this.maps[type]=[];
      },
      save(){
          if(!this.maps.selList.length){
              this.$message('请至少选择一个省市区','warning');
          }else{
              var temp=this.maps.selList.map(item=>{
                  return item.label
              });
              this.$emit('change',temp);
              this.views.show=false;
          }
      },
      createList(){
          var pmap=Object.keys(this.$util.getProvinceAndCity());
          for(let prov of pmap){
              if(this.views.data.indexOf(prov)==-1){
                this.maps.List.push({
                    label:prov,
                    py:py.GetPY(prov),
                    show:true,
                    checked:false
                });
              }
          }
          for(let prov of this.views.data){
            this.maps.selList.push({
                label:prov,
                py:py.GetPY(prov),
                show:true,
                checked:false
            });
          }
      }
  },
  mounted(){
      this.createList();
  },
  components:{
      popUp
  }
}
</script>
<style lang="less" scoped>
    .m-transfer{
        display: flex;
        align-items: center;
        justify-content: center;
        height: auto;
        .m-transfer-body{
            height: 350px;
            width: 210px;
            border: 1px solid #f0f0f0;
            >div{
                border-bottom: 1px solid #f0f0f0;
                background: #f0f0f0;
                font-size: 14px;
                color:#666;
                text-align: center;
                padding: 10px 0;
            }
        }
        .m-transfer-btn{
            margin:0 25px;
            >div{
                margin: 10px 0;
            }
        }
        ul,li{
            list-style: none;
        }
        ul{
            box-sizing: border-box;
            height: ~"calc(100% - 36px)";
            >p{
                padding: 10px;
            }
            li{
                padding: 13px 0 13px 13px;
                display: flex;
                align-items: center;
                color: #999;
                box-sizing: border-box;
                cursor: pointer;
                i{margin-right: 5px;}
                &:hover{
                    background: #f0f0f0;
                }
            }
            .select{
                color: #409eff;
            }
            .m-transfer-item{
                height: ~"calc(100% - 48px)";
                overflow: auto;
            }
        }
    }
</style>
