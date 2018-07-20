<template>
 <div>
     <div class="edit-block">
         <div>商品信息</div>
         <div>
             <div class="edit-items">
                 <span class="edit-items-required">商品名称</span>
                 <div>
                     <div><el-input size="mini" style="width:300px;"></el-input></div>
                     <div class="tips" v-if="rules.name.show" >{{rules.name.label}}</div>
                 </div>
             </div>
             <div class="edit-items">
                 <span class="edit-items-required">网店售价</span>
                 <div>
                     <div class="edit-items-flex">
                         <el-input size="mini" style="width:150px;"></el-input>
                         <div class="edit-items-price">
                             <span>原价:￥</span>
                             <input type="text" v-model="details.predj">
                         </div>
                     </div>
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
                     <gg-select :data="type_group" @select-change="handleChange"></gg-select>
                 </div>
             </div>
             <div class="edit-items">
                 <span>规格信息</span>
                 <div>
                     <!-- <el-button @click="test">click</el-button> -->
                     <el-table
                        :data="details.spList"
                        :span-method="arraySpanMethod"
                        border
                     >
                        <el-table-column
                            v-for="item in colModels"
                            :key="item.prop"
                            :label="item.label"
                            :prop="item.prop"
                            :align="item.align||'center'"
                            :width="item.width"
                        >
                            <template slot-scope="scope">
                                <span class="cell-span">{{scope.row[item.prop]}}</span>
                            </template>
                        </el-table-column>
                     </el-table>
                 </div>
             </div>
         </div>
     </div>
     <div class="edit-block">
         <div>物流/其他</div>
         <div>
             <div class="edit-items">
                 <span class="edit-items-required">配送方式</span>
                 <div>
                     <div style="line-height:28px;">
                        <el-checkbox v-model="iskdps">快递配送</el-checkbox>
                        <el-checkbox v-model="isddzt">到店自提</el-checkbox>
                     </div>
                     <div class="tips" v-if="rules.name.show" style="width:300px;">{{rules.name.label}}</div>
                 </div>
             </div>
             <div class="edit-items">
                 <span class="edit-items-required">运费设置</span>
                 <div>
                     <div>
                        <div class="edit-items-yysz" style="margin-bottom:25px;">
                            <el-radio v-model="details.yysz" label="1">统一运费</el-radio>
                            <input-number
                                v-model="details.yfje"
                                icon="iconfont icon-qian1"
                                :arrow-control="false"
                                style="margin-left:20px;width:150px;"
                            ></input-number>
                        </div>
                        <div class="edit-items-yysz">
                            <el-radio v-model="details.yysz" label="2">运费模板</el-radio>
                            <el-select
                                size="mini"
                                v-model="details.yfmb"
                                style="margin-left:20px;width:150px;"
                            >
                                <el-option
                                    v-for="item in yfmb"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                            <router-link tag="a" to="/main/mallchildren/set_dd_addkd">新建</router-link>
                        </div>
                     </div>
                     <div class="tips" v-if="rules.name.show" style="width:300px;">{{rules.name.label}}</div>
                 </div>
             </div>
             <div class="edit-items">
                 <span>每人限购</span>
                 <div>
                     <div style="line-height:28px;">
                        <input-number
                            v-model="details.mrxg"
                            :arrow-control="false"
                            style="width:150px;"
                        ></input-number>
                     </div>
                     <div style="color:#ccc;margin-top:10px;">0代表不限购</div>
                 </div>
             </div>
         </div>
     </div>
 </div> 
</template>
<script>
import draggable from 'vuedraggable'
import ggSelect from '../specs_select'
import py from '../../../../func/pinyin'
import inputNumber from '../../../../components/inputNumber/index'
export default {
  data(){
      return{
          rules:{
                name:{label:'姓名不可为空',show:true},
                name:{label:'姓名不可为空',show:true},
                name:{label:'姓名不可为空',show:true},
                name:{label:'姓名不可为空',show:true},
                name:{label:'姓名不可为空',show:true},
                name:{label:'姓名不可为空',show:true}
          },
          group:[],
          type_group:[],
          colModels:[
              {label:'商品名称',prop:'qspmc'},
              {label:'网店售价',prop:'wdsj'},
              {label:'可售库存',prop:'kskc'}
          ],
          details:{
              name:'',
              group:1,
              pics:[
                  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531378662716&di=67e477b20dc69efd4bb6fbdcc82c1f05&imgtype=0&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F2f738bd4b31c870147b3a6182b7f9e2f0608ffc3.jpg',
                  'http://img2.imgtn.bdimg.com/it/u=2239146502,165013516&fm=27&gp=0.jpg',
                  'http://img5.imgtn.bdimg.com/it/u=1893461451,2619342480&fm=27&gp=0.jpg',
                  'http://img0.imgtn.bdimg.com/it/u=2316242837,3672164063&fm=27&gp=0.jpg'
              ],
              spList:[],
              psfs:1,
              yfje:0,
              yysz:'1',
              yfmb:1,
              mrxg:0
          },
          radio:"1",
          iskdps:true,
          isddzt:false,
          yfmb:[
              {label:'华东地区',value:1},
              {label:'华南地区',value:2},
              {label:'华北地区',value:3}
          ]
      }
  },
  methods:{
      uploadImgs(){
          console.log(this.details.pics)
      },
      //规格选择完毕
      handleChange(array){
          this.type_group=array.filter(item=>{
              return item.name&&item.value.length;
          });
          this.type_group=this.type_group.reverse();
          this.colModels=this.colModels.slice(-3);
          for(let obj of this.type_group){
              this.colModels.splice(0,0,{
                  label:obj.name,
                  prop:py.GetPY(obj.name),
                  width:100
              });
          }
          console.log(this.colModels)
          var temp={};
          var index=0;
          this.details.spList=[];
          if(this.type_group.length){
              this.type_group=this.type_group.reverse();
              this.tarnsferArray(temp,this.type_group,index,null);
          }
      },
      //转发规格二维数组为列表形式的一维数组
      tarnsferArray(target,data,row,el){
        for(let i=0;i<data[row].value.length;i++){
            target[py.GetPY(data[row].name)]=data[row].value[i];
            var k=row+1;
            if(k>data.length-1){
                target[py.GetPY(data[row].name)]=data[row].value[i];
                this.details.spList.push(JSON.parse(JSON.stringify(target)));
                delete target[py.GetPY(data[row].name)];
            }else{
                this.tarnsferArray(target,data,k,data[k-1].name);
            }
            if(i>=data[row].value.length-1){
                delete target[el];
            }
        }
      },
      //合并行的方法
      arraySpanMethod({ row, column, rowIndex, columnIndex }){
          for(let i=0;i<this.type_group.length-1;i++){
              var k=this.type_group.slice(i+1).reduce(function(num,obj){
                return num*obj.value.length;
              },1);
              if(columnIndex == i){
                  if(rowIndex%k==0){
                      return [k,1];
                  }else{
                      return [0,0];
                  }
              }
          }
      }
  },
  mounted(){
      var temp=[
          {name:'颜色',value:[4,6,7]},
          {name:'内存',value:['2','4']},
          {name:'制式',value:['全网通','移动','联通']},
          {name:'大小',value:['3.2','5.0']}
      ];
      for(let i=0;i<temp.length-1;i++){
          var k=temp.slice(i+1).reduce(function(total,obj){
              return total*obj.value.length;
          },1)
          console.log(k)
      }
  },
  components:{
      draggable,
      ggSelect,
      inputNumber
  }
}
</script>
<style lang="less" scoped>
    @import './information';
</style>
