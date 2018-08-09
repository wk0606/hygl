<template>
  <div class="specs-body">
      <div class="specs-block"
        v-for="(item,index) in hasSelected"
        :key="index"
      >
          <div>
              <el-select
                size="mini"
                v-model="item.name"
                @change="handleChangeSpec"
                @focus="resetAllSpecs"
              >
                <el-input
                    size="mini"
                    prefix-icon="el-icon-search"
                    style="width:90%;margin-left:5%;margin-bottom:5px;"
                    v-model="name"
                    @input="searchAndCreate"
                ></el-input>
                <el-option
                    v-if="gglx.show"
                    v-for="gglx in allSpecs"
                    :key="gglx.name"
                    :label="gglx.name"
                    :value="gglx.name"
                    :disabled="currentSelectGg.indexOf(gglx.name)>-1"
                ></el-option>
              </el-select>
              <i class="el-icon-circle-close" @click="removeSpecs(index)"></i>
          </div>
          <!-- v-if="item.label" -->
          <div class="tag-body" v-if="item.name">
              <div
                class="tag-body-item"
                v-for="tag in item.value"
                :key="tag"
              >
                  <span>{{tag}}</span>
                  <i class="el-icon-close" @click="removeTag(item,tag)"></i>
              </div>
              <div class="tag-plus">
                  <el-button icon="el-icon-plus" type="text" size="mini" @click="openTagSelect(item)">添加</el-button>
                  <div class="tag-select" v-if="item.show">
                    <el-select
                        v-model="currentSelectTags"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请选择"
                        size="mini"
                        @change="handleChangeTag"
                    >
                        <el-option
                            v-for="gg in getTagList(item.name)"
                            :key="gg.ggname"
                            :label="gg.ggname"
                            :value="gg.ggname">
                        </el-option>
                    </el-select>
                    <div class="tag-select-btn">
                        <div class="tag-btn tag-btn-primary" v-if="currentSelectTags.length" @click="saveCurrentTag(item)">确定</div>
                        <div class="tag-btn tag-btn-text" @click="item.show=false;">取消</div>
                    </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="specs-block specs-block-last">
          <div>
              <el-button size="small" :disabled="hasSelected.length>=4" @click="addSpecs">添加商品规格</el-button>
          </div>
      </div>
  </div>
</template>
<script>
export default {
  props:{
      maxLength:{
          default:3
      },
      data:{
          dafault:function(){
              return [];
          }
      }
  },
  data(){
     return {
         //所有的规格列表
         allSpecs:[],
         //实际显示的规格
         List:[],
         //已选择的规格
         hasSelected:[],
         name:'',
         tagName:'',
         //当前选择的大类
         currentSelectGg:[],
         //当前大类下的小类
         currentSelectTags:[],
         currentLabel:'',
         flag:true
     }
  },
  watch:{
      data:{
          handler:function(nv){
              this.hasSelected=JSON.parse(JSON.stringify(nv));
              for(let obj of this.hasSelected)
                this.currentSelectGg.push(obj.name);
          },
          deep:true
      }
  },
  methods:{
      //添加选择的规格大类
     addSpecs(){
         this.hasSelected.push({
             name:'',
             value:[],
             show:false
         });
     },
     //删除选择的规格大类
     removeSpecs(index){
         if(this.flag){
            if(this.hasSelected[index].name&&this.hasSelected[index].value.length){
                this.$confirm('删除将导致已与该规格关联的商品失效,是否继续?','提示',{
                    type:'warning'
                }).then(()=>{
                    this.hasSelected.splice(index,1);
                    this.currentSelectGg=[];
                    for(let obj of this.hasSelected){
                        if(obj.name)
                            this.currentSelectGg.push(obj.name);
                    }
                    this.flag=false;
                    this.$emit('select-change',JSON.parse(JSON.stringify(this.hasSelected)));
                }).catch(()=>{});
            }else{
                this.hasSelected.splice(index,1);
                this.currentSelectGg=[];
                    for(let obj of this.hasSelected){
                        if(obj.name)
                            this.currentSelectGg.push(obj.name);
                    }
            }
         }else{
             if(this.hasSelected[index].name){
                this.hasSelected.splice(index,1);
                this.currentSelectGg=[];
                for(let obj of this.hasSelected){
                    if(obj.name)
                        this.currentSelectGg.push(obj.name);
                }
                this.$emit('select-change',JSON.parse(JSON.stringify(this.hasSelected)));
            }else{
                this.hasSelected.splice(index,1);
                this.currentSelectGg=[];
                    for(let obj of this.hasSelected){
                        if(obj.name)
                            this.currentSelectGg.push(obj.name);
                    }
            }
         }
     },
     //删除规格小类
     removeTag(item,tag){
        if(this.flag){
            this.$confirm('删除将导致已与该规格关联的商品失效,是否继续?','提示',{
                type:'warning'
            }).then(()=>{
                item.value=item.value.filter(_t=>{
                    return _t!=tag;
                });
                this.$emit('select-change',this.hasSelected);
                this.flag=false;
            }).catch(()=>{});
        }else{
            item.value=item.value.filter(_t=>{
                return _t!=tag;
            });
            this.$emit('select-change',this.hasSelected);
        } 
     },
     //将allspecs中没id的数据给删除掉
     resetAllSpecs(){
         //console.log(8877)
         this.name='';
         this.allSpecs=this.allSpecs.filter(item=>{
            return item.id;
         });
         for(let obj of this.allSpecs)
            obj.show=true;
     },
     //规格大类输入框输入事件
     searchAndCreate(){
         var needAdd=true;
         this.allSpecs=this.allSpecs.filter(item=>{
            return item.id;
         });
         for(let obj of this.allSpecs){
             obj.show=obj.name.indexOf(this.name)>-1?true:false;
             if(obj.name==this.name)
                needAdd=false;
         }
         if(needAdd&&this.name.trim()!==''){
            this.allSpecs.splice(0,0,{
                name:this.name,
                value:[],
                show:true
            });
         }
     },
     //选择规格大类事件
     handleChangeSpec(item){
         this.currentSelectGg=[];
         for(let obj of this.hasSelected){
             if(obj.name)
                this.currentSelectGg.push(obj.name);
         }
         for(let obj of this.allSpecs){
             //当选择的规格大类被匹配到同时有id时候
             if(item==obj.name&&obj.id){
                 return;
             }
         }
         //当选择的规格大类无法被匹配到时候新增此规格大类
         this.$http('/api/x6/hySetSpggSave.do',{
             id:-1,
             name:this.name.trim(),
             ggname:''
         }).then(res=>{
             this.allSpecs=this.allSpecs.slice(1);
             this.allSpecs.push({
                 id:res.VO.id,
                 name:res.VO.name,
                 value:[],
                 show:true
             });
         },err=>{
             this.hasSelected=this.hasSelected.filter(item=>{
                 return item.name!=this.name.trim();
             });
             this.allSpecs=this.allSpecs.slice(1);
         });
     },
     //选择规格小类事件
     handleChangeTag(item){
         var tag=item[item.length-1];
         var temp;
         var index=-1;
         for(let obj of this.allSpecs){
             index++;
             if(obj.name==this.currentLabel){
                 temp=obj;
                 break;
             }
         }
         for(let obj of temp.value){
             if(obj.ggname==tag){
                 return;
             }
         }
         this.$http('/api/x6/hySetSpggSave.do',{
             id:temp.id,
             name:temp.name,
             ggname:tag
         }).then(res=>{
             this.allSpecs[index].value=JSON.parse(res.VO.data);
         },err=>{
             this.currentSelectTags=this.currentSelectTags.slice(0,this.currentSelectTags.length-1);
         });
     },
     //获取规格
     getSpecs(name=''){
       this.$http('/api/x6/getSpggListByName.do',{
           name:name
       }).then(res=>{
           for(let obj of res.List){
               obj.value=JSON.parse(obj.data.value);
               obj.show=true;
           }
           this.allSpecs=res.List;
           this.List=JSON.parse(JSON.stringify(this.allSpecs));
           this.hasSelected=JSON.parse(JSON.stringify(this.data));
       });
     },
     //获取当前选择大类下的小类
     getTagList(label){
         for(let obj of this.allSpecs){
             if(obj.name==label){
                 return obj.value;
             }
         }
     },
     //点击添加小类
     openTagSelect(item){
        this.currentLabel=item.name;
        if(!item.hasOwnProperty('show'))
            this.$set(item,'show',false);
        item.show=true;
        this.currentSelectTags=JSON.parse(JSON.stringify(item.value));
     },
     //点击确定按钮
     saveCurrentTag(item){
         item.value=JSON.parse(JSON.stringify(this.currentSelectTags));
         this.currentSelectTags=[];
         item.show=false;
         this.$emit('select-change',this.hasSelected);
     }
  },
  mounted(){
      this.getSpecs();
  }
}
</script>
<style lang="less" scoped>
    .specs-body{
        box-sizing: border-box;
        padding: 10px 10px 10px 10px;
        background: #fff;
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
