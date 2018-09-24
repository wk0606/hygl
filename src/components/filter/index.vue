<template>
  <div
    class="f-panel"
    v-if="show"
    :style="{top:top+15+'px',left:left-34+'px'}"
    ref="panel"
    id="FILTER_PANEL"
    v-checkOutBounding
  >
      <div class="f-trig"></div>
      <div class="f-body">
          <div class="f-sort">
              <div @click="sort(1)" :class="{'f-selected':sortIndex==1}">
                  <i class="iconfont icon-shengxu"></i>
                  <span>升序</span>
              </div>
              <div @click="sort(-1)" :class="{'f-selected':sortIndex==-1}">
                  <i class="iconfont icon-jiangxu"></i>
                  <span>降序</span>
              </div>
          </div>
          <div class="f-search">
              <el-input
                size="mini"
                placeholder="快速检索"
                suffix-icon="el-icon-search"
                v-model="name"
                @input="matchItems"
              ></el-input>
          </div>
          <ul class="f-checkbox">
              <li
                v-for="(item,index) in List"
                :key="index"
                v-show="item.show"
                @click="handleChange(item)"
              >
                <el-checkbox
                    v-model="item.checked"
                    @change="filterDatas(item)"
                ></el-checkbox>
                <label>{{item.format?item.format:item.label}}</label>
              </li>
          </ul>
          <div class="f-footer">
            <el-button size="mini" type="danger" @click="reset">重置</el-button>
          </div>
      </div>
  </div>
</template>
<script>
import py from '../../func/pinyin'
var that;
function close(ev){
    if(!that.$refs.panel.contains(ev.target)&&ev.target.className.indexOf('icon-loudou')==-1){
        if(that.hasFilter){
            that.$store.commit('updateFilterTable',{
                key:that.getCurrentRouter(),
                data:that.resultMaps
            });
        }
        that.show=false;
    }
        
};
export default {
  data(){
      return{
          message:'hello',
          List:[],
          checkedList:[],
          resultMaps:null,
          hasFilter:false,
          sortIndex:0,
          name:'',//快速检索的字符串
      }
  },
  watch:{
      show(nv){
          if(!nv){
            document.body.removeEventListener('click',close);
          }
      },
      left(){
          this.createList();
      }
  },
  methods:{
    matchItems(){
        for(let obj of this.List){
            obj.show=true;
            var t=obj.label||'';
            t=t.toString();
            if(py.GetPY(t).indexOf(py.GetPY(this.name))==-1)
                obj.show=false;
        }
    },
    //重置选项
    reset(){
        //回复初始数据
        this.$bus.$emit('filter-success',this.filterColumn.datas);
        //清除vuex结果集
        that.$store.commit('updateFilterTable',{
            key:that.getCurrentRouter(),
            data:null
        });
        //清空checkedlist
        for(let key in this.filterColumn){
            if(key!='datas')
                delete this.filterColumn[key];
        }
        this.createList();
    },
    //排序
    sort(num){
        this.sortIndex=num;
        var tempMap=this.$store.state.filterTable[this.getCurrentRouter()]||this.datas;
        tempMap.sort((a,b) => {
            if(py.GetPY(a[this.column]||0)<py.GetPY(b[this.column]||0)){
                return 0-num;
            }else if(py.GetPY(a[this.column]||0)>py.GetPY(b[this.column]||0)){
                return num;
            }else{
                return 0;
            }
        });
        this.List.sort((a,b) => {
            if(py.GetPY(a.label||0)<py.GetPY(b.label||0)){
                return 0-num;
            }else if(py.GetPY(a.label||0)>py.GetPY(b.label||0)){
                return num;
            }else{
                return 0;
            }
        });
        this.$bus.$emit('filter-success',tempMap);
        
    },
    //从原数据中找出选中项
    matchConditions(){
        var target=this.$store.state.filterTable[this.getCurrentRouter()]||this.datas;
        //var target=this.datas;
        var temp=[];
        for(let obj of target){
            if(this.checkedList.indexOf(obj[this.column])>-1)
                temp.push(obj);
        }
        return temp;
    },
    handleChange(item){
        item.checked=!item.checked;
        this.filterDatas(item);
    },
    //筛选源数据
    filterDatas(item){
        this.hasFilter=true;
        if(item.checked){
            //选中添加到筛选项中
            if(!this.filterColumn.hasOwnProperty(this.column))
                this.filterColumn[this.column]=[];
            this.filterColumn[this.column].push(item.label);
            if(this.checkedList.indexOf(item.label)==-1)
                this.checkedList.push(item.label);
        }else{
            //未选从筛选项中删除
            this.checkedList=this.checkedList.filter(row=>{
                return row!=item.label;
            });
            for(let i=0;i<this.filterColumn[this.column].length;i++){
                if(this.filterColumn[this.column][i]==item.label){
                    this.filterColumn[this.column].splice(i,1);
                    break;
                }
            }
            if(!this.filterColumn[this.column].length)
                delete this.filterColumn[this.column];
        }
        //当filterColumn仅剩下datas属性时候返回全部
        if(Object.keys(this.filterColumn).length==1){
            this.$bus.$emit('filter-success',this.filterColumn.datas);
        }else{
            this.resultMaps=this.matchConditions();
            this.$bus.$emit('filter-success',this.resultMaps);
        }
    },
    //
    getCurrentRouter(){
        var location=window.location.hash;
        return location.substring(location.lastIndexOf('/')+1);
    },
    //生成checkbox列表
    createList(){
        var temp=[];
        this.List=[];
        var tempMap=this.$store.state.filterTable[this.getCurrentRouter()]||this.datas;
        for(let obj of tempMap){
            if(temp.indexOf(obj[this.column])==-1){
                //let label=this.formatter?this.formatter(obj[this.column]):obj[this.column];
                temp.push(obj[this.column]);
            }
        }
        for(let label of temp){
            let obj={
                label:label,
                show:true,
                checked:this.filterColumn[this.column]?this.filterColumn[this.column].indexOf(label)>-1?true:false:false
            };
            if(this.formatter)
                obj.format=this.formatter(label);
            this.List.push(obj);
        }
        temp=null;
    } 
  },
  mounted(){
      that=this;
      this.hasFilter=false;
      this.createList();
      //鼠标点击外面的时候隐藏过滤面板
      document.body.addEventListener('click',close);
  }
}
</script>
<style lang="less" scoped>
    @import './index.less';
</style>