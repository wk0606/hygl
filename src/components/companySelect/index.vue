<template>
  <div>
    <el-cascader
        size="mini"
        :options="options"
        :show-all-levels="false"
        placeholder="请选择公司"
        suffix-icon="el-icon-search"
        @icon-click="iconClick"
        clearable
        :change-on-select="true"
        v-model="selected"
        @change="handleChange"
    >
      <i slot="suffix" class="el-input__icon el-icon-date"></i>
    </el-cascader>
    <panel v-if="dialog.show" :views="dialog" @selected="selectSuccess"></panel>
  </div>
</template>
<script>
import panel from './dialog'
export default {
  props:{
    needCk:{default:false},
    value:{default:''}
  },
  data(){
      return {
          //公司架构树形结构
          options:[],
          //公司架构列表结构
          List:[],
          selected:[],
          dialog:{
            show:false,
            data:null
          }
      }
  },
  methods:{
    iconClick(){
      this.dialog.show=true;
      this.dialog.data=this.List;
    },
    selectSuccess(row){
      var data=this.$util.getCompanyInfo(row.bm,'bm');
      this.initSelected(data.bm);
      this.$emit('input',data.bm);
      this.$emit('change',this.$util.getCompanyInfo(row.bm,'bm'));
    },
    handleChange(item){
      this.$emit('input',this.$util.getCompanyInfo(item[item.length-1],'bm').bm);
      this.$emit('change',this.$util.getCompanyInfo(item[item.length-1],'bm'));
    },
    //初始化默认项
    initSelected(value){
      var temp=[];
      this.findParents(value,this.List,temp);
      this.selected=temp.reverse().slice(1);
      this.selected.push(value);
    },
    createOptions(){
      this.List=this.$util.getMyGsList();
      var _zgsbm;
      if(this.List.length){
        for(let i=0,len=this.List.length;i<len;i++){
          //找到总公司
          if(this.List[i].lx===0){
            _zgsbm=this.List[i].bm;
            this.options.push({
              bm:this.List[i].bm,
              id:this.List[i].id,
              value:this.List[i].bm,
              label:this.List[i].name,
              children:[]
            });
            break;
          }
        }
        //寻找下一级
        this.findChildren(_zgsbm,this.List,this.options[0].children);
      } 
    },
    //寻找子级
    findChildren(bm,array,target){
      for(let obj of array){
        if(obj.pbm==bm){
          var temp={
            bm:obj.bm,
            id:obj.id,
            value:obj.bm,
            label:obj.name
          };
          if(obj.lx<4){
            temp.children=[];
          }
          target.push(temp);
          this.findChildren(obj.bm,array,temp.children);
        }
      }
    },
    //寻找父级
    findParents(bm,array,target){
      for(let obj of array){
        if(obj.bm==bm){
          target.push(obj.pbm);
          this.findParents(obj.pbm,this.List,target);
        }
      }
    }
  },
  mounted(){
    this.createOptions();
    this.initSelected(this.value);
  },
  components:{
    panel
  }
}
</script>
<style lang="less" scoped>

</style>
