<template>
  <div class="specs-body">
      <div class="specs-block"
        v-for="(item,index) in hasSelected"
        :key="index"
      >
          <div>
              <el-select
                size="mini"
                v-model="item.label"
                @change="handleChangeSpec"
              >
                <el-input
                    size="mini"
                    prefix-icon="el-icon-search"
                    style="width:90%;margin-left:5%;"
                    v-model="name"
                    @input="searchAndCreate"
                ></el-input>
                <el-option
                    v-for="item in List"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                ></el-option>
              </el-select>
              <i class="el-icon-circle-close" @click="removeSpecs(index)"></i>
          </div>
          <!-- v-if="item.label" -->
          <div class="tag-body" v-if="item.label">
              <div
                class="tag-body-item"
                v-for="tag in item.value"
                :key="tag"
              >
                  <span>{{tag}}</span>
                  <i class="el-icon-close"></i>
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
                            v-for="gg in getTagList(item.label)"
                            :key="gg"
                            :label="gg"
                            :value="gg">
                        </el-option>
                    </el-select>
                    <div style="text-align:right;padding-top:10px;">
                        <div class="tag-btn tag-btn-primary" v-if="currentSelectTags.length" @click="saveCurrentTag(item)">确定</div>
                        <div class="tag-btn tag-btn-text" @click="item.show=false;">取消</div>
                    </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="specs-block specs-block-last">
          <div>
              <el-button size="small" @click="addSpecs">添加商品规格</el-button>
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
         allSpecs:[
             {label:'尺寸',value:['3.2','6.4'],show:false},
             {label:'颜色',value:['红','黑','白'],show:true},
             {label:'制式',value:[],show:false},
             {label:'配置',value:[],show:false},
             {label:'内存',value:[],show:false},
             {label:'版本',value:[],show:false},
             {label:'cc',value:[],show:false},
             {label:'ccc',value:[],show:false}
         ],
         List:[],
         hasSelected:[],
         name:'',
         tagName:'',
         currentSelectTags:[]
     }
  },
  methods:{
     addSpecs(){
         this.hasSelected.push({
             label:'',
             value:[],
             show:false
         });
     },
     removeSpecs(index){
         this.hasSelected.splice(index,1);
     },
     searchAndCreate(){
         var needAdd=true;
         this.List=[];
         for(let obj of this.allSpecs){
             if(obj.label.indexOf(this.name)>-1){
                 this.List.push(obj);
             }
             if(obj.label==this.name)
                needAdd=false;
         }
         if(needAdd){
            this.List.splice(0,0,{
                label:this.name,
                value:[]
            });
         }
     },
     handleChangeSpec(item){
         //console.log(item)
     },
     handleChangeTag(item){
         //console.log(item)
     },
     getSpecs(){
        
     },
     getTagList(label){
         for(let obj of this.allSpecs){
             if(obj.label==label)
                return obj.value;
         }
     },
     openTagSelect(item){
         if(!item.hasOwnProperty('show'))
            this.$set(item,'show',false);
        item.show=true;
        this.currentSelectTags=JSON.parse(JSON.stringify(item.value));
     },
     saveCurrentTag(item){
         item.value=JSON.parse(JSON.stringify(this.currentSelectTags));
         this.currentSelectTags=[];
         item.show=false;
         //console.log(this.hasSelected);
         this.$emit('select-change',this.hasSelected);
     }
  },
  mounted(){
      this.List=JSON.parse(JSON.stringify(this.allSpecs));
      this.hasSelected=JSON.parse(JSON.stringify(this.data));
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
            >div:nth-child(2){
                width: 150px;
                box-sizing: border-box;
                padding: 10px;
                box-shadow: 0 0 2px #dbdbdb;
                position: relative;
                left:-35%;
                background: #fff;
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
