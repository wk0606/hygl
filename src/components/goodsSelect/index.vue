<template>
  <div>
    <el-cascader
        size="mini"
        :options="options"
        :show-all-levels="false"
        placeholder="请选择商品"
        clearable
        suffix-icon="el-icon-search"
        v-model="selected"
        @active-item-change="handleItemChange"
        @change="handleChange"
        @icon-click="iconClick"
        ref="cascader"
    >
    </el-cascader>
    <dialog-list
        v-if="dialog.show"
        :views="dialog"
        type="qspmc"
        @selected="handleSelected"
    ></dialog-list>
  </div>
</template>
<script>
import dialogList from './dialog'
export default {
  props: {
      changeOnSelect:{default:true},//是否可以选择任意一级选项(如果此值为false，意味着在弹窗选择的中只包含lx为全称的项)
  },
  data() {
    return {
      options: [],//数据源
      List: [],
      selected: [],//初始的值
      dialog: {
        show: false,
        data: null
      }
    };
  },
  methods: {
    //点击最后一级
    handleChange(val){
        var temp={
            splx:val[0]||'',
            pp:val[1]||'',
            spmc:val[2]||'',
            spdm:val[3]||0,
            qspmc:this.$refs.cascader.currentLabels.pop()
        }
        this.$emit('change',temp);
    },
    //当点击不是最后一级
    handleItemChange(item) {
      for (let obj of this.options) {
        if (obj.value == item[0]) {
          this.getPpList(item, obj.children, obj.label);
        }
      }
    },
    //获取品牌
    getPpList(item, target, label) {
      if (target.length) {
          for(let obj of target){
              if(item[1]==obj.label){
                  this.getSpList(item,obj.children);
              }
          }
      } else {
        this.$http("/api/x6/getPpListBySplx.do", {
          splx: item[0]
        }).then(res => {
          if(this.changeOnSelect){
            target.push({
                label: `全部${label}`,
                value: '',
            });
          }
          for (let obj of res.ppList) {
            target.push({
              label: obj.pp,
              value: obj.pp,
              children: []
            });
          }
        });
      }
    },
    //获取商品
    getSpList(item,target){
        if(!target.length){
            this.$http('/api/x6/getSpListByPp.do',{
                splx:item[0],
                pp:item[1]
            }).then(res=>{
                if(this.changeOnSelect){
                    target.push({
                        label:`全部${item[1]}`,
                        value:''
                    });
                }
                this.createGroupBySpmc(res.spList,target);
            });
        }
    },
    //构建商品分组
    createGroupBySpmc(array,target){
        var temp={};
        for(let obj of array){
            if(!temp.hasOwnProperty(obj.spmc)){
                temp[obj.spmc]=[];
            }
            temp[obj.spmc].push({
                value:obj.id,
                label:obj.qspmc
            });
        }
        for(let key in temp){
            if(this.changeOnSelect){
                temp[key].splice(0,0,{
                    label:`全部${key}`,
                    value:''
                });
            }
            target.push({
                value:key,
                label:key,
                children:temp[key]
            });
        }
    },
    //点击图标
    iconClick(){
        this.dialog.show=true;
    },
    handleSelected(obj){
        this.$refs.cascader.inputValue=obj.qspmc;
        var temp=Object.assign({},obj);
        //delete temp.qspmc;
        this.$emit('change',temp);
    }
  },
  mounted() {
    var temp = this.$util.getCache("splxlist");
    for (let obj of temp) {
      this.options.push({
        label: obj.name,
        bm: obj.bm,
        value: obj.bm,
        children: []
      });
    }
  },
  components:{
      dialogList
  }
};
</script>
<style lang="less" scoped>
    .el-cascader{
        width: 100%;
    }
</style>
