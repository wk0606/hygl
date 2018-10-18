<template>
  <div ref="main">
    <table cellspacing="10">
      <tr
        v-for="item in details"
        :key="item.prop"
      >
        <td :style="{verticalAlign:item.prop=='dpjj'?'top':'center'}"><span style="line-height:30px;">{{item.label}} :</span></td>
        <td :colspan="item.prop=='dpjj'?2:1">
          <div style="min-height:28px;">
            <el-input
              v-if="item.prop=='dpjj'"
              type="textarea"
              v-model="data[item.prop]"
              :rows="3"
            ></el-input>
            <!-- <div v-if="item.prop=='wxgzh'" class="wxgzh-btn">
              关联微信公众号
            </div> -->
            <el-button type="success" size="small" v-if="item.prop=='wxgzh'"><i class="iconfont icon-icon4"></i>我有微信公众号,立即设置</el-button>
            <span v-if="!item.show&&item.prop!='dpjj'" :class="{hightlight:item.prop=='isValidate'&&data.isValidate==1}">{{item.format?item.format(data[item.prop]):data[item.prop]}}</span>
            <el-select
              v-if="item.show&&item.prop=='zylm'"
              v-model="data.zylm"
              size="mini"
              @change="item.show=false"
              style="width:180px;"
             >
              <el-option
                v-for="item in lm"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input v-if="item.show&&item.prop=='dpName'" clearable size="mini" v-model="data[item.prop]" @blur="item.show=false" style="width:273px;" autofocus></el-input>
            <upload v-if="item.prop=='dpImg'" :src.sync="data.dptpUrl"></upload>       
          </div>
        </td>
        <td>
          <el-button
            v-if="item.btnText"
            type="text"
            @click="item.click(item)"
            
          >{{typeof item.btnText=='string'?item.btnText:item.btnText()}}</el-button>
        </td>
      </tr>
    </table>
    <div class="form-save-btn" :style="{width:footerWidth+'px'}">
      <el-button :type="modifyCount>1?'primary':''" size="mini" @click="save" :disabled="modifyCount<=1">保存</el-button>
    </div>
    <modify-phone v-if="dialog.show" :views="dialog" @change="setNewPhone"></modify-phone>
  </div>
</template>
<script>
import {jylm} from '../../../../../func/jylm'
import modifyPhone from './modifyPhone'
import upload from '../../../../../components/upload/index'
export default {
  data(){
    return {
      details:[
        {label:'公司名称',prop:'gsname'},
        {label:'公司代码',prop:'gsdm'},
        {label:'公司认证',prop:'isValidate',btnText:this.rzBtnText,click:this.openRz,format:this.formatRz},
        {label:'店铺名称',prop:'dpName',btnText:'修改',show:false,click:this.openInput},
        {label:'店铺图片',prop:'dpImg'},
        {label:'主营类目',prop:'zylm',format:this.formatName},
        // {label:'关联微信公众号',prop:'wxgzh'},
        {label:'有效日期',prop:'enddate',btnText:'续费',click:this.openXf},
        {label:'店铺描述',prop:'dpjj'},
        {label:'联系方式',prop:'phone',btnText:'修改',show:false,click:this.openModify}
      ],
      data:{},
      lm:jylm,
      dialog:{
        show:false,
        phone:''
      },
      modifyCount:0,
      footerWidth:0
    }
  },
  watch:{
    'data':{
      handler:function(nv){
        this.modifyCount++;
      },
      deep:true
    },
    'data.dptpUrl':function(nv){
      this.$store.commit('updateShopImg',nv);
    }
  },
  computed:{
    
  },
  methods:{
    rzBtnText(){
      if(this.data.isValidate==0)
        return '去认证';
      else if(this.data.isValidate==1)
        return '查看详情';
      else if(this.data.isValidate==2)
        return '查看申请';
      else
        return '重新认证';
      //return this.data.isValidate?this.data.isValidate==1?'查看详情':'重新认证':'查看详情';
    },
    getDetails(){
      this.$http('/api/x6/getHySetInfo.do').then(res=>{
        this.data=res.VO;
      });
    },
    openInput(item){
      item.show=!item.show;
    },
    openRz(){
      if(!this.$util.vartifyPhone(this.data.phone)){
        this.$message('请完善联系方式','error');
      }else{
        this.$router.push(`/main/mall/shop/set_dprz`);
      }
    },
    openXf(){
      window.open("http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDA3MzcyM18xNzU0OTRfODAwMDczNzIzXzJf");
    },
    formatRz(value){
      if(value==0)
        return '未提交认证';
      else if(value==1)
        return '已提交认证,审核中';
      else if(value==2)
        return '认证通过';
      else
        return '认证不通过';
    },
    formatName(value){
      for(let item of jylm){
        if(item.value==value)
          return item.label;
      }
    },
    openModify(){
      this.dialog.show=true;
      this.dialog.phone=this.data.phone;
    },
    setNewPhone(phone){
      this.data.phone=phone;
    },
    save(){
      this.$http('/api/x6/saveHysetInfo.do',this.data).then(res=>{
        this.$message('店铺信息更新成功');
        this.modifyCount=1;
        this.$store.commit('updateShopImg',this.data.dptpUrl);
      });
    }
  },
  mounted(){
    this.footerWidth=this.$refs.main.offsetWidth;
    this.getDetails();
  },
  activated(){
    this.getDetails();
  },
  components:{
    modifyPhone,
    upload
  }
}
</script>
<style lang="less" scoped>
  td{
    font-size: 14px;
    color:#3a3a3a;
    box-sizing: border-box;
    padding: 10px 0;
    // vertical-align: top;
  }
  td span{line-height: 28px;}
  tr td:nth-child(1){padding-left: 15px;}
  tr td:nth-child(2){
    padding-left: 5px;
    padding-right: 15px;
    min-width: 210px;
    min-height: 50px;
  }
  tr td:nth-child(3){padding-left:10px;}
  td>.el-button{font-family: 'microsoft yahei';padding: 0;}
  .modify-item{
    display: flex;
    justify-content: space-between;
    .el-input{
      flex-shrink: 1;
    }
  }
  .wxgzh-btn{
    color:#fff;
    background: #49b920;
    padding: 10px ;
    font-size: 13px;
  }
  .hightlight{color:red;}
</style>
