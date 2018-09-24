<template>
  <div class="specs-body">
      <div class="specs-body-select">
          <m-select
            v-for="item in hasSelected"
            :key="item.label"
            :label="item.name"
            :id="item.id"
            :value="item.value"
            :high-light="ids.indexOf(item.id)>-1?true:false"
            @change="changeGg"
            @icon-click="removeGg"
          ></m-select>
          <el-button size="small" @click="addSpgg" v-if="hasSelected.length<4">添加商品规格</el-button>
          <el-button size="small" type="primary" v-if="hasSelected.length" @click="save">确定</el-button>
      </div>
      <gg-dialog v-if="dialog.show" :views="dialog" @selection-change="ggSelected"></gg-dialog>
  </div>
</template>
<script>
import ggDialog from './select_gg'
import mSelect from './select'
export default {
  props:{
      maxLength:{
          default:3
      },
      selected:{
          dafault:function(){
              return [];
          }
      },
      list:{required:true},//表格中的数据
  },
  data(){
     return {
         ggname:'',
         ggList:[],
         hasSelected:[],//已选择的规格
         dialog:{
             show:false,
             checkedList:[]
         },
         ids:[],//保存校验不通过的id
     }
  },
  methods:{
      //获取所有规格
      getGgList(name,callback){
        this.$http('/api/x6/getSpggListByName.do',{
            name:name
        }).then(res=>{
            for(let obj of res.List){
                obj.value=JSON.parse(obj.data.value);
            }
            this.ggList=res.List;
            if(callback){
                callback();
            }
        });
      },
      //删除已选择规格
      removeGg(obj){
          if(this.checkGgHasSelected(obj.name)){
                this.$confirm('删除规格后所有商品将重新关联,是否继续','提示',{
                    type:'warning'
                }).then(res=>{
                    this.hasSelected=this.hasSelected.filter(item=>{
                        return item.name!=obj.name;
                    });
                }).catch(()=>{});
          }else{
                this.hasSelected=this.hasSelected.filter(item=>{
                    return item.name!=obj.name;
                });
          }
      },
      //选择小规格
      changeGg(obj){
          for(let gg of this.hasSelected){
              if(gg.name==obj.name)
                gg.value=obj.ggname;
          }
      },
      addSpgg(){
          this.dialog.checkedList=this.hasSelected.map(item=>{
              return item.name
          });
          this.dialog.show=true;
      },
      ggSelected(obj){
          this.hasSelected.push({
              id:obj.id,
              name:obj.name,
              value:''
          });
      },
      //确定
      save(){
          if(this.hasSelected.length){
              this.ids=[];
              for(let obj of this.hasSelected){
                  if(!obj.value&&this.ids.indexOf(obj.id)==-1)
                    this.ids.push(obj.id);
              }
              if(this.ids.length){
                  this.$message('请对所选规格选择小类','error');
              }else{
                  this.$emit('selection-change',JSON.parse(JSON.stringify(this.hasSelected)));
              }
          }
      },
      //检测此规格是否已经绑定商品
      checkGgHasSelected(name){
          if(!this.list.length)
            return false;
          else{
              let flag=false;
              for(let obj of this.list){
                  if(obj[name]){
                      flag=true;
                      break;
                  }
              }
              return flag;
          }
      }
  },
  mounted(){
      //this.getGgList('');
      if(this.selected.length){
          for(let gg of this.selected){
              this.hasSelected.push({
                  id:typeof gg=='string'?0:gg.id,
                  name:gg,
                  value:''
              });
          }
      }
  },
  components:{
      ggDialog,
      mSelect
  }
}
</script>
<style lang="less" scoped>
    .specs-body{
        box-sizing: border-box;
        padding: 10px 10px 10px 10px;
        background: #fff;
    }
    .specs-body-select{
        display: flex;
        .m-select{
            width: 200px;
            flex-shrink: 1;
            margin-right: 10px;
        }
    }
    .specs-block{
        margin-bottom: 10px;
        >div:nth-child(1){
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 10px;
            background: #f8f8f8;
            >i{
                font-size: 18px;
                cursor: pointer;
                color: #ccc;
            }
        }
    }
    .specs-block-last{margin-bottom: 0;}
    .tag-body{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        box-sizing: border-box;
        padding: 10px 10px 0 10px;
        .tag-body-item{
            padding: 3px 7px;
            font-size: 12px;
            border: 1px solid #ccc;
            color:#666;
            border-radius: 4px;
            margin-right: 10px;
            i{cursor: pointer;}
        }
        .tag-plus{
            position: relative;
            width:auuo;
            height: auto;
            background: #fff;
            .tag-select{
                width: auto;
                box-sizing: border-box;
                padding: 10px;
                box-shadow: 0 0 2px #dbdbdb;
                position: absolute;
                transform: translateX(-50%);
                //left:-50%;
                background: #fff;
                z-index: 9;
                display: flex;
                align-items: center;
                .el-select{
                    width: 200px;
                }
                .tag-select-btn{flex-shrink: 0;margin-left: 10px; }
            }
        }
    }
    .tag-btn{
        display: inline-block;
        padding: 3px 4px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 12px;
        color:#fff;
        user-select: none;
    }
    .tag-btn-primary{background: #409eff;}
    .tag-btn-text{
        border: 1px solid #ccc;
        color:#666;
        margin-left: 5px;
    }
</style>
