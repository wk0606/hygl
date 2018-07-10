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
          <p>个人认证 : 大陆身份证默认进行实时快速认证；其他证件类型可进行人工认证，审核周期为1个工作日；</p>
          <p>企业认证 : 适合公司经营者，增加可提现至公司银行账户，审核周期为1个工作日；</p>
        </div>
        <div class="set-rz-body">
          <!-- block 1 -->
          <div class="set-rz-title">
            <span>主体信息</span>
          </div>
          <div class="set-rz-items">
            <div>
              <span>我是</span>
              <el-radio v-model="details.lx" label="1">个人</el-radio>
              <el-radio v-model="details.lx" label="2">公司</el-radio>
            </div>
          </div>
          <div class="set-rz-items" v-show="!showQyItems">
            <div>
              <span>姓名</span>
              <el-input size="mini" v-model="details.name" style="width:250px;"></el-input>
            </div>
            <div class="tips" v-if="rules.name.show">{{rules.name.label}}</div>
          </div>
          <div class="set-rz-items" v-show="!showQyItems">
            <div>
              <span>身份证号码</span>
              <el-input size="mini" v-model="details.sfzid" style="width:250px;"></el-input>
            </div>
            <div class="tips" v-if="rules.sfzid.show">{{rules.sfzid.label}}</div>
          </div>
          <div class="set-rz-items" v-show="showQyItems">
            <div>
              <span>企业名称</span>
              <el-input size="mini" v-model="details.qyname" style="width:250px;"></el-input>
            </div>
            <div class="tips" v-if="rules.qyname.show">{{rules.qyname.label}}</div>
          </div>
          <div class="set-rz-items" v-show="showQyItems">
            <div>
              <span>法人</span>
              <el-input size="mini" v-model="details.frname" style="width:250px;"></el-input>
            </div>
            <div class="tips" v-if="rules.frname.show">{{rules.frname.label}}</div>
          </div>
          <div class="set-rz-items set-rz-top" v-show="showQyItems">
            <div>
              <p class="set-item-label">
                <span>法人证件</span>
                <i>身份证正面</i>
              </p>
              <div class="set-upload">
                <div class="set-upload-btn"><i class="el-icon-plus"></i></div>
              </div>
              <div class="set-img">
                <span>示例 ：</span>
                <img src="../../../../../assets/sfz1.png" alt="">
              </div>
            </div>
            <div class="tips" v-if="rules.frpic1.show">{{rules.frpic1.label}}</div>
          </div>
          <div class="set-rz-items set-rz-top" v-show="showQyItems">
            <div>
              <p class="set-item-label">
                <span>法人证件</span>
                <i>身份证反面</i>
              </p>
              <div class="set-upload">
                <div class="set-upload-btn"><i class="el-icon-plus"></i></div>
              </div>
              <div class="set-img">
                <span>示例 ：</span>
                <img src="../../../../../assets/sfz2.png" alt="">
              </div>
            </div>
            <div class="tips" v-if="rules.frpic2.show">{{rules.frpic2.label}}</div>
          </div>
          <div class="set-rz-items set-rz-top" v-show="showQyItems">
            <div>
              <span>营业执照</span>
              <div class="set-upload">
                <div class="set-upload-btn"><i class="el-icon-plus"></i></div>
              </div>
              <div class="set-img">
                <span>示例 ：</span>
                <img src="../../../../../assets/yyzz.jpg" alt="">
              </div>
            </div>
            <div class="tips" v-if="rules.yypic.show">{{rules.yypic.label}}</div>
          </div>
          <div class="set-rz-items" v-show="showQyItems">
            <div>
              <span>营业执照号</span>
              <el-input size="mini" v-model="details.yyid" style="width:250px;"></el-input>
            </div>
            <div class="tips" v-if="rules.yyid.show">{{rules.yyid.label}}</div>
          </div>
          <!-- block 2 -->
          <div class="set-rz-title">
            <span>网点信息</span>
          </div>
          <div class="set-rz-items">
            <div>
              <span>店铺名称</span>
              <em>{{details.dpname}}</em>
            </div>
          </div>
          <div class="set-rz-items">
            <div>
              <span>主营商品</span>
              <el-select
                v-model="details.lm"
                size="mini"
                style="width:180px;"
              >
                <el-option
                  v-for="item in lm"
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
              <el-input size="mini" v-model="details.dz" style="width:450px;"></el-input>
            </div>
            <div class="tips" v-if="rules.dz.show">{{rules.dz.label}}</div>
            <div class="no-label">
              <maps v-model="details.lnglat" width="600"></maps>
            </div>
          </div>
          <div class="set-rz-items set-rz-top">
            <div>
              <span>门店门头照片</span>
              <div class="set-upload">
                <div class="set-upload-btn"><i class="el-icon-plus"></i></div>
              </div>
              <div class="set-img">
                <span>示例 ：</span>
                <img src="../../../../../assets/mdpic1.png" alt="">
              </div>
            </div>
            <div class="tips" v-if="rules.mdpic1.show">{{rules.mdpic1.label}}</div>
          </div>
          <div class="set-rz-items set-rz-top">
            <div>
              <span>门店内景照片</span>
              <div class="set-upload">
                <div class="set-upload-btn"><i class="el-icon-plus"></i></div>
              </div>
              <div class="set-img">
                <span>示例 ：</span>
                <img src="../../../../../assets/mdpic2.jpg" alt="">
              </div>
            </div>
            <div class="tips" v-if="rules.mdpic2.show">{{rules.mdpic2.label}}</div>
          </div>
          <div class="set-rz-items set-rz-top">
            <div>
              <span>收银台照片</span>
              <div class="set-upload">
                <div class="set-upload-btn"><i class="el-icon-plus"></i></div>
              </div>
              <div class="set-img">
                <span>示例 ：</span>
                <img src="../../../../../assets/mdpic3.jpg" alt="">
              </div>
            </div>
            <div class="tips" v-if="rules.mdpic3.show">{{rules.mdpic3.label}}</div>
          </div>
          <div class="set-rz-items">
            <div>
              <span>短信验证码</span>
              <div class="set-yzm">
                <input type="text">
                <div class="set-btn">获取验证码</div>
              </div>
            </div>
            <div class="tips" v-if="rules.yzm.show">{{rules.yzm.label}}</div>
            <div class="no-label" style="color:#ccc;">验证短信将发送到你绑定的手机 : ,请注意查收</div>
          </div>
          <div class="set-rz-items" style="margin-top:30px;">
            <div class="no-label">
              <div class="set-btn" style="width:224px;" @click="save">提交认证</div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import breadNav from '../../../../../components/breadNav/index'
import citySelect from '../../../../../components/citySelect/index'
import maps from '../../../../../components/maps/index'
import {jylm} from '../../../../../func/jylm'
export default {
  data(){
    return {
      navs:[
        {label:'店铺信息',path:'/main/mallchildren/set_dp'},
        {label:'店铺认证'}
      ],
      details:{
        lx:'1',//1-个人 2-公司
        name:'',
        sfzid:'',
        dpname:'好达通尊享会员店',
        lm:2,
        province:'',
        city:'',
        town:'',
        dz:'',
        lnglat:'',
        mdpic1:'',
        mdpic2:'',
        mdpic3:'',
        yzm:'',
        //公司认证多填写的信息
        qyname:'',
        frname:'',
        frpic1:'',
        frpic2:'',
        yypic:'',
        yyid:''
      },
      lm:jylm,
      rules:{
        name:{
          label:'姓名不可为空',
          show:false
        },
        sfzid:{
          label:'身份证号码不可为空',
          show:false
        },
        dz:{
          label:'门店位置不可为空',
          show:false
        },
        mdpic1:{
          label:'请上传门店门头照片',
          show:false
        },
        mdpic2:{
          label:'请上传门店内景照片',
          show:false
        },
        mdpic3:{
          label:'请上传收银台照片',
          show:false
        },
        yzm:{
          label:'验证码不可为空',
          show:false
        },
        qyname:{
          label:'企业名称不可为空',
          show:false
        },
        frname:{
          label:'法人名称不可为空',
          show:false
        },
        frpic1:{
          label:'请上传法人证件',
          show:false
        },
        frpic2:{
          label:'请上传法人证件',
          show:false
        },
        yypic:{
          label:'请上传营业执照',
          show:false
        },
        yyid:{
          label:'营业执照号不可为空',
          show:false
        }
      }
    }
  },
  computed:{
    showQyItems(){
      return this.details.lx=="1"?false:true;
    }
  },
  methods:{
    save(){
      var temp=true;
      var keys=Object.keys(this.rules);
      if(this.details.lx=='1')
        keys=keys.slice(0,7);
      for(let key of keys){
        this.rules[key].show=this.details[key]?false:true;
        if(!this.details[key])
          temp=true;
      }
      if(temp){
        this.$message('请完善信息','error');
        return;
      }else{
        console.log(this.details)
      }
    }
  },
  components:{
    breadNav,
    citySelect,
    maps
  }
}
</script>
<style lang="less" scoped>
  @import './dprz.less';
</style>
