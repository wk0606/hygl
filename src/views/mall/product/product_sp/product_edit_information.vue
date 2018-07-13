<template>
 <div>
     <div class="edit-block">
         <div>商品信息</div>
         <div>
             <div class="edit-items">
                 <span class="edit-items-required">商品名称</span>
                 <div>
                     <div><el-input size="mini"></el-input></div>
                     <div class="tips" v-if="rules.name.show" style="width:300px;">{{rules.name.label}}</div>
                 </div>
             </div>
             <div class="edit-items">
                 <span class="edit-items-required">网店售价</span>
                 <div>
                     <div class="edit-items-flex"><el-input size="mini" style="width:200px;"></el-input><a>原价 : ￥300.00</a></div>
                     <div class="tips" v-if="rules.name.show">{{rules.name.label}}</div>
                 </div>
             </div>
             <div class="edit-items">
                 <span class="edit-items-required">商品分组</span>
                 <div>
                     <div class="edit-items-flex">
                         <el-select
                            size="mini"
                            v-model="details.group"
                         >
                            <el-option
                                v-for="item in group"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                         </el-select>
                         <div>
                             <el-button size="mini" type="text">刷新</el-button>
                             <span style="color:#409eff;">|</span>
                             <el-button size="mini" type="text">新建分组</el-button>
                         </div>
                     </div>
                     <div class="tips" v-if="rules.name.show">{{rules.name.label}}</div>
                 </div>
             </div>
             <div class="edit-items">
                 <span class="edit-items-required">商品图片</span>
                 <div>
                     <div class="edit-items-flex edit-items-start">
                         <div style="diaplay:inline-flex;" v-if="details">
                            <draggable
                                v-model="details.pics"
                                :options="{group:'people'}"
                                @start="drag=true"
                                @end="drag=false"
                            >
                                <div
                                    v-for="pic in details.pics"
                                    :key="pic"
                                    class="edit-items-pic"
                                    :style="{backgroundImage:'url('+pic+')'}"
                                ><i class="el-icon-circle-close"></i></div>
                            </draggable>
                            
                         </div>
                         <div class="edit-items-pic edit-items-plus" @click="uploadImgs">+加图</div>
                     </div>
                     <div class="tips" v-if="rules.name.show">{{rules.name.label}}</div>
                     <div style="color:#ccc;margin-top:5px;">建议尺寸: 640*640,可以拖拽图片调整顺序</div>
                 </div>
             </div>
         </div>
     </div>
     <div class="edit-block">
         <div>库存/规格</div>
         <div>
             <div class="edit-items">
                 <span>规格设置</span>
                 <div>
                     <gg-select v-model="type_group"></gg-select>
                 </div>
             </div>
            
         </div>
     </div>
 </div> 
</template>
<script>
import draggable from 'vuedraggable'
import ggSelect from '../specs_select'
export default {
  data(){
      return{
          rules:{
                name:{
                    label:'姓名不可为空',
                    show:true
                }
          },
          group:[
              {label:'春季新品',value:1},
              {label:'夏季新品',value:2},
              {label:'秋季新品',value:3},
              {label:'冬季新品',value:4}
          ],
          type_group:[],
          details:{
              name:'',
              group:1,
              pics:[
                  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531378662716&di=67e477b20dc69efd4bb6fbdcc82c1f05&imgtype=0&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F2f738bd4b31c870147b3a6182b7f9e2f0608ffc3.jpg',
                  'http://img2.imgtn.bdimg.com/it/u=2239146502,165013516&fm=27&gp=0.jpg',
                  'http://img5.imgtn.bdimg.com/it/u=1893461451,2619342480&fm=27&gp=0.jpg',
                  'http://img0.imgtn.bdimg.com/it/u=2316242837,3672164063&fm=27&gp=0.jpg'
              ]
          }
      }
  },
  methods:{
      uploadImgs(){
          console.log(this.details.pics)
      }
  },
  components:{
      draggable,
      ggSelect
  }
}
</script>
<style lang="less" scoped>
    @import './information';
</style>
