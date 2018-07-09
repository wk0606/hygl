<template>
  <div>
      <bread-nav :data="navs"></bread-nav>
      <div>
          <el-form
            :model="details"
            :rules="rules"
            ref="form"
            label-width="80px"
          >
            <el-form-item label="模板名称" prop="name">
                <el-input v-model="details.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="计费方式" prop="jffs">
                <el-radio-group v-model="details.jffs">
                    <el-radio
                        v-for="item in jfList"
                        :key="item.label"
                        :label="item.value"
                    >{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="配送区域" prop="qy" required>
                <el-row>
                    <div style="border:1px solid #f0f0f0;">
                        <el-table
                            :data="details.qy"
                        >
                            <el-table-column
                                v-for="item in colModels"
                                :key="item.prop"
                                :label="item.label"
                                :prop="item.prop"
                                header-align="center"
                                :align="item.align || 'center'"
                                :width="item.width"
                            >
                                <template slot-scope="scope">
                                    <span v-if="item.prop=='dq'" class="cell-span-wrap">{{item.format?item.format(scope.row):scope.row[item.prop]}}</span>
                                    <input-number
                                        v-else
                                        v-model="scope.row[item.prop]"
                                        :arrow-control="false"
                                        align="center"
                                    ></input-number>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" @click="openDialog(scope.row,scope.$index)">编辑</el-button>
                                    <el-button type="text" size="mini" @click="remove(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style="box-sizing:border-box;padding:0 10px;">
                            <el-button type="text" size="mini" @click="openDialog(null)">指定可配送区域和运费</el-button>
                        </div>
                    </div>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-row>
                    <div style="text-align:center;padding:20px 0;">
                        <el-button size="mini" type="primary" @click="save">保存</el-button>
                        <el-button size="mini">返回</el-button>
                    </div>
                </el-row>
            </el-form-item>
          </el-form>
      </div>
      <area-set v-if="dialog.show" :views="dialog" @change="addRow"></area-set>
  </div>
</template>
<script>
import breadNav from '../../../../../components/breadNav/index'
import inputNumber from '../../../../../components/inputNumber/index'
import areaSet from './area'
export default {
  data(){
      const validatePass = (rule, value, callback) => {
          if(!this.details.qy.length){
              callback(new Error('请填写配送区域'));
          }else{
              callback();
          }
      }
      return {
          navs:[
              {label:'订单设置',path:'/main/mallchildren/set_dd'},
              {label:'编辑模板'}
          ],
          jfList:[
              {label:'按件计费',value:"0"},
              {label:'按重计费',value:"1"}
          ],
          details:{
              name:'',
              jffs:"0",//0-按件 1-按重量
              qy:[]
          },
          rules:{
              name:{required:true,message:'请输入模板名称'},
              qy:{validator:validatePass}
          },
          colModels:[
              {label:'可配送区域',prop:'dq',align:'left',format:this.formatArea},
              {label:'首件（个）',prop:'first'},
              {label:'运费（元）',prop:'firstje'},
              {label:'需件（个）',prop:'second'},
              {label:'运费（元）',prop:'secondje'}
          ],
          dialog:{
              show:false,
              data:[]
          },
          currentIndex:undefined
      }
  },
  methods:{
      initKdItem(array=[],sl1=0,je1=0,sl2=0,je2=0){
          return {
              dq:array,
              first:sl1,
              firstje:je1,
              second:sl2,
              secondje:je2
          }
      },
      openDialog(row,index){
          this.currentIndex=index;
          if(row){
              this.dialog.data=row.dq;
          }
          this.dialog.show=true;
      },
      addRow(array){
          if(this.currentIndex!==undefined){
              this.details.qy[this.currentIndex].dq=array;
          }else{
              this.details.qy.push(this.initKdItem(array));
          }
      },
      formatArea(row){
          return row.dq.join(',');
      },
      remove(index){
            this.$confirm('确认删除此行吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.details.qy.splice(index,1);
                this.$message('删除成功');
            }).catch(() => {});
      },

      save(){
          this.$refs.form.validate(valid=>{
            if (valid) {
                for(let obj of this.details.qy){
                    for(let key in obj){
                        if(!obj[key]){
                            return;
                        }
                    }
                }
                console.log(212);
            }
          });
      }
  },
  mounted(){
      //console.log(this.$route)
  },
  components:{
      breadNav,
      areaSet,
      inputNumber
  }
}
</script>
<style lang="less" scoped>

</style>
