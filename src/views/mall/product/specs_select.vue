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
              <i class="el-icon-circle-close"></i>
          </div>
          <!-- v-if="item.label" -->
          <div  class="tag-body">
              <div class="tag-plus">
                  <el-button icon="el-icon-plus" type="text" size="mini">添加</el-button>
                  <div class="tag-select">

                  </div>
              </div>
          </div>
      </div>
      <div class="specs-block">
          <div>
              <el-button size="small">添加商品规格</el-button>
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
      value:{
          dafault:function(){
              return [];
          }
      }
  },
  data(){
     return {
         allSpecs:[
             {label:'尺寸',value:[]},
             {label:'颜色',value:[]},
             {label:'制式',value:[]},
             {label:'配置',value:[]},
             {label:'内存',value:[]},
             {label:'版本',value:[]},
             {label:'cc',value:[]},
             {label:'ccc',value:[]}
         ],
         List:[],
         hasSelected:[
             {
                 label:'',
                 value:[]
             },
             {
                 label:'',
                 value:[]
             }
         ],
         name:''
     }
  },
  methods:{
     searchAndCreate(){
        //console.log(this.name.indexOf(item.label))
         this.List=this.allSpecs.filter(item=>{
             return item.label.indexOf(this.name)>-1;
         });
         if(!this.List.length){
            this.List.splice(0,0,{
                label:this.name,
                value:[]  
            });
         }
        
     },
     handleChangeSpec(item){
         console.log(item)
     },
     getSpecs(){
        //  this.value=[
        //      {
        //          label:'颜色',
        //          value:['红色','黑色','白色']
        //      },
        //      {
        //          label:'配置',
        //          value:['16g','32g']
        //      },
        //      {
        //          label:'制式',
        //          value:['全网通','移动','联通']
        //      }
        //  ]
     } 
  },
  mounted(){
      this.List=JSON.parse(JSON.stringify(this.allSpecs));
  }
}
</script>
<style lang="less" scoped>
    .specs-body{
        box-sizing: border-box;
        padding: 10px;
        background: #fff;
    }
    .specs-block{
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
    .tag-body{
        display: flex;
        box-sizing: border-box;
        padding: 10px;
        .tag-plus{
            position: relative;
            width:150px;
            height: auto;
            background: #fff;
            >div:nth-child(2){
                box-sizing: border-box;
                padding: 10px;
                box-shadow: 0 0 2px rgb(0,0,0);
                position: relative;
                left:-35%;
                background: #fff;
                //transform: translateX(-50%);
            }
        }
    }
</style>
