<template>
  <div class="ex-container" v-if="show">
      <div>
          <div class="ex-title">
              <span>Excel导出</span>
              <i class="el-icon-close" @click="close"></i>
          </div>
          <div class="ex-body">
              <div>
                  <i class="el-icon-document"></i>
                  <div><span>{{fileName}}.xlsx</span></div>
              </div>
              <div>
                  <div style="margin-bottom:18px;"><b>文件兼容格式</b></div>
                  <div>
                    <el-radio-group v-model="options.rptype">
                        <el-radio label="2007">Office 2007</el-radio>
                        <el-radio label="2003">Office 2003</el-radio>
                    </el-radio-group>
                  </div>
              </div>
          </div>
          <div class="ex-footer">
              <el-button size="mini" type="primary" @click="save" :loading="load">确认</el-button>
              <el-button size="mini" @click="close">关闭</el-button>
          </div> 
      </div>
  </div>
</template>
<script>
export default {
  data(){
      return{
          ver:2007,
          colModel:{
              colName:'',
              align:'center',
              colId:0,
              font:'宋体',
              fontSize:11,
              dataType:'string',
              formate:'',
              height:28,
              isBold:0,
              isSum:0,
              valign:'center',
              width:200
          },
          options:{
              colOffset:1,
              columns:null,
              condition:'',
              data:null,
              fileName:'',
              title:'',
              rptype:"2007",
              rowOffset:1
          },
          load:false
      }
  },
  methods:{
      save(){
          if(!this.data.length&&!this.exportFlag){
              this.$message('没有要导出的数据','error');
              return;
          }
          const URL=this.exportFlag?this.url:'/api/x6/exportExcel.do';
          this.load=true;
          this.options.condition=this.condition||'';
          this.options.fileName=this.fileName||'';
          this.options.title=this.title||this.fileName;
          this.options.columns=[];
          this.options.data=[];
          this.options.data=this.data;
          for(let i=0;i<this.columns.length;i++){
              this.colModel.colId=i;
              this.columns[i].dataType=this.columns[i].isSum?'number':'string';
              this.options.columns.push(Object.assign({},this.colModel,this.columns[i]));
          }
          if(this.exportFlag){
              delete this.options.data;
              this.options.paramData=this.paramData;
          }
          this.$http(URL,this.options).then(res=>{
              this.load=false;
              window.location.href=res.url;
              this.close();
          },err=>{
              this.load=false;
          });
      },
      close(){
          this.show=false;
     }
  }
}
</script>
<style lang="less" scoped>
    @import './index.less';
</style>
