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
                <el-input v-model="details.name" size="mini" style="width:250px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="计费方式" prop="jffs">
                <el-radio-group v-model="details.jffs" @change="changeLabel">
                    <el-radio
                        v-for="item in jfList"
                        :key="item.label"
                        :label="item.value"
                        :disabled="disabled"
                    >{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="配送区域" prop="data" required>
                <el-row>
                    <div style="border:1px solid #f0f0f0;">
                        <el-table
                            :data="details.data"
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
                        <el-button size="mini" type="primary" :loading="load" @click="save">保存</el-button>
                        <el-button size="mini" @click="back">返回</el-button>
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
          if(!this.details.data.length){
              callback(new Error('请填写配送区域'));
          }else{
              callback();
          }
      }
      return {
          load:false,
          navs:[
              {label:'快递发货',path:'/main/mall/shop/set_dd'},
              {label:'编辑模板'}
          ],
          jfList:[
              {label:'按件计费',value:0},
              {label:'按重计费',value:1}
          ],
          details:{
              id:-1,
              name:'',
              jffs:0,//0-个-按件 1-千克-按重量
              data:[]
          },
          _details:null,
          rules:{
              name:{required:true,message:'请输入模板名称'},
              data:{validator:validatePass}
          },
          colModels:[
              {label:'可配送区域',prop:'dq',align:'left',format:this.formatArea},
              {label:'首件（个）',prop:'firstsl'},
              {label:'运费（元）',prop:'firstje'},
              {label:'续件（个）',prop:'secondsl'},
              {label:'运费（元）',prop:'secondje'}
          ],
          dialog:{
              show:false,
              data:[],
              selected:[]
          },
          currentIndex:undefined
      }
  },
  computed:{
      disabled(){
          return this.details.id=='-1'?false:true;
      }
  },
  methods:{
      changeLabel(val){
          this.colModels[1].label=val?'首重（千克）':'首件（个）';
          this.colModels[3].label=val?'续重（千克）':'续件（个）';
      },
      initKdItem(array=[],sl1=1,je1=0,sl2=1,je2=0){
          return {
              dq:array,
              firstsl:sl1,
              firstje:je1,
              secondsl:sl2,
              secondje:je2
          }
      },
      getDetails(id){
          this.$http('/api/x6/getHySetKdmbByid.do',{
              id:id
          }).then(res=>{
              for(let key in this.details){
                  if(key=='data')
                    this.details.data=JSON.parse(res.VO.data);
                  else
                    this.details[key]=res.VO[key];
              }
              this._details=JSON.parse(JSON.stringify(this.details));
          });
      },
      openDialog(row,index){
          this.currentIndex=index;
          this.dialog.selected=[];
          if(this.details.data.length){
            for(let obj of this.details.data){
                this.dialog.selected=this.dialog.selected.concat(obj.dq);
            }
          }
          if(row){
              this.dialog.data=row.dq;
          }else{
              this.dialog.data=[];
          }
          this.dialog.show=true;
      },
      addRow(array){
          if(this.currentIndex!==undefined){
              this.details.data[this.currentIndex].dq=array;
          }else{
              this.details.data.push(this.initKdItem(array));
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
                this.details.data.splice(index,1);
                this.$message('删除成功');
            }).catch(() => {});
      },
      save(){
          this.$refs.form.validate(valid=>{
            if (valid) {
                var flag=false;
                for(let obj of this.details.data){
                    if(obj.firstje)
                        flag=true;
                }
                if(!flag){
                    this.$message('至少填写一个首件金额','error');
                    return;
                }
                this.load=true;
                this.details.jjdw=this.details.jffs?'千克':'个';
                this.$http('/api/x6/HySetKdmbSave.do',this.details).then(res=>{
                    this.load=false;
                    this.$message(this.$route.params.id!=='-1'?'编辑成功':'新增成功');
                    //this.$router.push('/main/mallchildren/set_dd');
                    res.VO.show=true;
                    this.$util.requestAllCache(this.$http,()=>{
                        this.$util.setCache('KDMB',res.VO);
                        if(this.$util.getCache('NEEDBACK')==1){
                            this.$util.setCache('KDMB-ID',res.VO.id);
                            this.$util.removeCache('NEEDBACK');
                        }
                        this.$router.go (-1);
                    });
                },err=>{
                    this.load=false;
                });
            }
          });
      },
      back(){
          if(!this.$util.compareEqualWidthObjects(this.details,this._details)){
            this.$confirm('返回后所填信息将丢失，是否继续, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.go(-1);
            }).catch(() => {
                    
            });
          }else{
              this.$router.go(-1);
          }
      }
  },
  activated(){
      this.$refs.form.resetFields();
      if(this.$route.params.id!=='-1'){
          this.getDetails(this.$route.params.id);
      }else{
          this.details={
              id:-1,
              name:'',
              jffs:0,//0-个-按件 1-千克-按重量
              data:[]
          };
          this._details=JSON.parse(JSON.stringify(this.details));
      }
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
