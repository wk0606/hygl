<template>
  <div>
      <bread-nav :data="navs"></bread-nav>
      <div class="set-rz-container">
        <div class="set-rz-header">
          <img src="../../../../../assets/miyalogo.png" alt="">
          <b>苏州麦尔芽科技有限公司</b>
          <em></em>
          <span>店铺认证</span>
        </div>
        <div class="set-rz-tips">
          <div class="set-rz-title">
            <span>麦尔芽认证说明</span>
            <em>麦尔芽提供两种认证类型,请根据实际情况任选一种</em>
          </div>
          <p>个人认证 : 大陆身份证默认进行实时快速认证；审核周期为1个工作日；</p>
          <p>企业认证 : 适合公司经营者；审核周期为3个工作日；</p>
        </div>
        <div class="set-rz-body">
          <!-- block 1 -->
          <div class="set-rz-title">
            <span>主体信息</span>
          </div>
          <div class="set-rz-items">
            <div>
              <span>我是</span>
              <el-radio v-model="details.ztsf" label="1">个人</el-radio>
              <el-radio v-model="details.ztsf" label="2">公司</el-radio>
            </div>
          </div>
          <div class="set-rz-items" v-show="!showQyItems">
            <div>
              <span>姓名</span>
              <el-input size="mini" v-model="details.userName" style="width:250px;" @input="rules.userName.show=false"></el-input>
            </div>
            <div class="tips" v-if="rules.userName.show">{{rules.userName.label}}</div>
          </div>
          <div class="set-rz-items" v-show="!showQyItems">
            <div>
              <span>身份证号码</span>
              <el-input size="mini" v-model="details.cardNum" style="width:250px;" @input="rules.cardNum.show=false"></el-input>
            </div>
            <div class="tips" v-if="rules.cardNum.show">{{rules.cardNum.label}}</div>
          </div>
          <div class="set-rz-items" v-show="showQyItems">
            <div>
              <span>企业名称</span>
              <el-input size="mini" v-model="details.company" style="width:250px;" @input="rules.company.show=false"></el-input>
            </div>
            <div class="tips" v-if="rules.company.show">{{rules.company.label}}</div>
          </div>
          <div class="set-rz-items" v-show="showQyItems">
            <div>
              <span>法人</span>
              <el-input size="mini" v-model="details.legalPerson" style="width:250px;" @input="rules.legalPerson.show=false"></el-input>
            </div>
            <div class="tips" v-if="rules.legalPerson.show">{{rules.legalPerson.label}}</div>
          </div>
          <div class="set-rz-items set-rz-top" v-show="showQyItems">
            <div>
              <p class="set-item-label">
                <span>法人证件</span>
                <i>身份证正面</i>
              </p>
              <div class="set-upload" :style="{backgroundImage:'url('+details.frupUrl+')'}" @click="selectImg('frupUrl')">
                <div class="set-upload-btn"><i :class="frupUrl.disabled?'el-icon-loading':'el-icon-plus'" v-if="!details.frupUrl"></i></div>
              </div>
              <div class="set-img">
                <span>示例 ：</span>
                <img src="../../../../../assets/sfz1.png" alt="">
              </div>
            </div>
            <div class="tips" v-if="rules.frupUrl.show">{{rules.frupUrl.label}}</div>
          </div>
          <div class="set-rz-items set-rz-top" v-show="showQyItems">
            <div>
              <p class="set-item-label">
                <span>法人证件</span>
                <i>身份证反面</i>
              </p>
              <div class="set-upload" :style="{backgroundImage:'url('+details.frdownUrl+')'}" @click="selectImg('frdownUrl')">
                <div class="set-upload-btn"><i :class="frdownUrl.disabled?'el-icon-loading':'el-icon-plus'" v-if="!details.frdownUrl"></i></div>
              </div>
              <div class="set-img">
                <span>示例 ：</span>
                <img src="../../../../../assets/sfz2.png" alt="">
              </div>
            </div>
            <div class="tips" v-if="rules.frdownUrl.show">{{rules.frdownUrl.label}}</div>
          </div>
          <div class="set-rz-items set-rz-top" v-show="showQyItems">
            <div>
              <span>营业执照</span>
              <div class="set-upload" :style="{backgroundImage:'url('+details.yyzzUrl+')'}" @click="selectImg('yyzzUrl')">
                <div class="set-upload-btn"><i :class="yyzzUrl.disabled?'el-icon-loading':'el-icon-plus'" v-if="!details.yyzzUrl"></i></div>
              </div>
              <div class="set-img">
                <span>示例 ：</span>
                <img src="../../../../../assets/yyzz.jpg" alt="">
              </div>
            </div>
            <div class="tips" v-if="rules.yyzzUrl.show">{{rules.yyzzUrl.label}}</div>
          </div>
          <div class="set-rz-items" v-show="showQyItems">
            <div>
              <span>营业执照号</span>
              <el-input size="mini" v-model="details.yyzzNum" style="width:250px;" @input="rules.yyzzNum.show=false"></el-input>
            </div>
            <div class="tips" v-if="rules.yyzzNum.show">{{rules.yyzzNum.label}}</div>
          </div>
          <!-- block 2 -->
          <div class="set-rz-title">
            <span>网点信息</span>
          </div>
          <div class="set-rz-items">
            <div>
              <span>店铺名称</span>
              <em>{{details.dpName}}</em>
            </div>
          </div>
          <div class="set-rz-items">
            <div>
              <span>主营商品</span>
              <el-select
                v-model="details.zylm"
                size="mini"
                style="width:180px;"
              >
                <el-option
                  v-for="item in zylm"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <!-- block 3 -->
          <div class="set-rz-title">
            <span>门店信息</span>
          </div>
          <div class="set-rz-items">
            <div>
              <span>门店位置</span>
              <city-select
                :data="details"
                style="width:450px;"
              ></city-select>
            </div>
            <div class="no-label">
              <el-input size="mini" v-model="details.jtdz" style="width:360px;margin-right:10px;" @input="rules.jtdz.show=false;rules.province.show=false;rules.city.show=false;rules.town.show=false"></el-input>
              <el-button size="mini" @click="searchMaps">搜索地图</el-button>
            </div>
            <div class="tips" v-if="rules.jtdz.show||rules.province.show||rules.city.show||rules.town.show">{{rules.jtdz.label}}</div>
            <div class="no-label">
              <maps v-model="details.jwd" width="600"></maps>
            </div>
          </div>
          <div class="set-rz-items set-rz-top">
            <div>
              <span>门店门头照片</span>
              <div class="set-upload" :style="{backgroundImage:'url('+details.mtPicUrl+')'}" @click="selectImg('mtPicUrl')">
                <div class="set-upload-btn"><i :class="mtPicUrl.disabled?'el-icon-loading':'el-icon-plus'" v-if="!details.mtPicUrl"></i></div>
              </div>
              <div class="set-img">
                <span>示例 ：</span>
                <img src="../../../../../assets/mdpic1.png" alt="">
              </div>
            </div>
            <div class="tips" v-if="rules.mtPicUrl.show">{{rules.mtPicUrl.label}}</div>
          </div>
          <div class="set-rz-items set-rz-top">
            <div>
              <span>门店内景照片</span>
              <div class="set-upload" :style="{backgroundImage:'url('+details.njPicUrl+')'}" @click="selectImg('njPicUrl')">
                <div class="set-upload-btn"><i :class="njPicUrl.disabled?'el-icon-loading':'el-icon-plus'" v-if="!details.njPicUrl"></i></div>
              </div>
              <div class="set-img">
                <span>示例 ：</span>
                <img src="../../../../../assets/mdpic2.jpg" alt="">
              </div>
            </div>
            <div class="tips" v-if="rules.njPicUrl.show">{{rules.njPicUrl.label}}</div>
          </div>
          <div class="set-rz-items set-rz-top">
            <div>
              <span>收银台照片</span>
              <div class="set-upload" :style="{backgroundImage:'url('+details.sytPicUrl+')'}" @click="selectImg('sytPicUrl')">
                <div class="set-upload-btn"><i :class="sytPicUrl.disabled?'el-icon-loading':'el-icon-plus'" v-if="!details.sytPicUrl"></i></div>
              </div>
              <div class="set-img">
                <span>示例 ：</span>
                <img src="../../../../../assets/mdpic3.jpg" alt="">
              </div>
            </div>
            <div class="tips" v-if="rules.sytPicUrl.show">{{rules.sytPicUrl.label}}</div>
          </div>
          <div class="set-rz-items">
            <div>
              <span>短信验证码</span>
              <div class="set-yzm">
                <input type="text" v-model="details.code" @input="rules.code.show=false">
                <sms-code :phone="details.phone"></sms-code>
              </div>
            </div>
            <div class="tips" v-if="rules.code.show">{{rules.code.label}}</div>
            <div class="no-label" style="color:#ccc;">验证短信将发送到你绑定的手机 : {{this.details.phone.substring(0,3)}}****{{this.details.phone.substring(7)}},请注意查收</div>
          </div>
          <div class="set-rz-items" style="margin-top:30px;">
            <div class="no-label">
              <div class="set-btn" style="width:224px;" @click="save">提交认证</div>
            </div>
          </div>
        </div>
      </div>
      <input type="file" ref="file" @change="uploadImg" style="display:none;"/>
  </div>
</template>
<script>
import breadNav from '../../../../../components/breadNav/index'
import citySelect from '../../../../../components/citySelect/index'
import maps from '../../../../../components/maps/index'
import smsCode from '../../../../../components/smsCode/index'
import lrz from 'lrz'
import {jylm} from '../../../../../func/jylm'
export default {
  data(){
    return {
      navs:[
        {label:'店铺信息',path:'/main/mallchildren/set_dp'},
        {label:'店铺认证'}
      ],
      details:{
        ztsf:'1',//1-个人 2-公司
        userName:'',
        cardNum:'',
        dpName:'',
        zylm:"2",
        province:'',
        city:'',
        town:'',
        jtdz:'',
        jwd:'',
        mtPicUrl:'',
        njPicUrl:'',
        sytPicUrl:'',
        code:'',
        phone:'',
        //公司认证多填写的信息
        company:'',
        legalPerson:'',
        frupUrl:'',
        frdownUrl:'',
        yyzzUrl:'',
        yyzzNum:''
      },
      zylm:jylm,
      mtPicUrl:{
        disabled:false
      },
      njPicUrl:{
        disabled:false
      },
      sytPicUrl:{
        disabled:false
      },
      frupUrl:{
        disabled:false
      },
      frdownUrl:{
        disabled:false
      },
      yyzzUrl:{
        disabled:false
      },
      rules:{
        cardNum:{
          label:'请输入正确的身份证号',
          show:false
        },
        userName:{
          label:'姓名不可为空',
          show:false
        },
        province:{
          label:'请完善地理信息',
          show:false
        },
        city:{
          label:'请完善地理信息',
          show:false
        },
        town:{
          label:'请完善地理信息',
          show:false
        },
        jtdz:{
          label:'请完善地理信息',
          show:false
        },
        mtPicUrl:{
          label:'请上传门店门头照片',
          show:false
        },
        njPicUrl:{
          label:'请上传门店内景照片',
          show:false
        },
        sytPicUrl:{
          label:'请上传收银台照片',
          show:false
        },
        code:{
          label:'验证码不可为空',
          show:false
        },
        company:{
          label:'企业名称不可为空',
          show:false
        },
        legalPerson:{
          label:'法人名称不可为空',
          show:false
        },
        frupUrl:{
          label:'请上传法人证件',
          show:false
        },
        frdownUrl:{
          label:'请上传法人证件',
          show:false
        },
        yyzzUrl:{
          label:'请上传营业执照',
          show:false
        },
        yyzzNum:{
          label:'营业执照号不可为空',
          show:false
        }
      },
      currentKey:'',
      dpInformation:null
    }
  },
  computed:{
    showQyItems(){
      return this.details.ztsf=="1"?false:true;
    }
  },
  watch:{
    'details.ztsf':function(nv){
      for(let key in this.rules){
        this.rules[key].show=false;
      }
    }
  },
  methods:{
    save(){
      var temp=false;
      var keys=Object.keys(this.rules);
      if(this.details.ztsf=='1')
        keys=keys.slice(0,10);
      else
        keys=keys.slice(2);
      for(let key of keys){
        if(key!=='cardNum'){
          this.rules[key].show=this.details[key]?false:true;
          if(!this.details[key]){
            console.log(key,this.details[key])
            temp=true;
          } 
        }else{
          this.rules[key].show=(this.details[key].length==15||this.details[key].length==18)?false:true;
          if(this.details[key].length!=15&&this.details[key].length!=18)
            temp=true;
        }
      }
      if(temp){
        this.$message('请完善信息','error');
        return;
      }else{
        this.$http('/api/x6/saveHysetRzInfo.do',this.details).then(res => {
          this.$message('认证已提交，请等待审核');
          this.$router.push('/main/mallchildren/set_dp');
        });
      }
    },
    selectImg(key){
      this.currentKey=key;
      if(this[this.currentKey].disabled){
        this.$message('正在上传,请稍后','error');
        return;
      }
      this.$refs.file.click();
    },
    uploadImg(){
      var file=this.$refs.file.files[0];
      this.$refs.file.value='';
      if(!/^image/.test(file.type)){
          this.$message('请上传图片文件','error');
      }else{
          this[this.currentKey].disabled=true;
          lrz(file).then(rst=>{
              rst.formData.append('base64img', rst.base64);
              this.$http('/api/x6/saveOtherPic.do',rst.formData).then(res=>{
                  this.$message('上传成功');
                  this.details[this.currentKey]=res.file_path;
                  this[this.currentKey].disabled=false;
                  this.rules[this.currentKey].show=false;
              },err=>{
                  this[this.currentKey].disabled=false;
              });
          });
      }
    },
    searchMaps(){
      if(!this.details.province){
        this.$message('请至少选择所在省份','error');
      }else{
        var dz=this.details.province+this.details.city+this.details.town+this.details.jtdz;
        this.$util.parseAddressToLng(this.$http,dz).then(res=>{
          this.details.jwd=res.lnglat;
        });
      }
    }
  },
  mounted(){
    this.details.phone=this.$route.params.phone;
    this.details.dpName=this.$route.params.name;
  },
  components:{
    breadNav,
    citySelect,
    maps,
    smsCode
  }
}
</script>
<style lang="less" scoped>
  @import './dprz.less';
</style>
