<template>
  <pop-up
    title="新增自提点"
    width="800"
    :confirm="save"
    :views="views"
  >
    <div slot="content" class="content">
        <el-form
          :model="addInfo"
          :rules="rules"
          ref="addForm"
          label-width="100px"
        >
          <el-form-item label="自提点名称" prop="name">
            <el-input v-model="addInfo.name" size="mini" style="width:550px;"></el-input>
          </el-form-item>
          <el-form-item label="自提点地址" required>
            <el-row>
              <el-form-item prop="pct">
                <city-select
                  :data="addInfo"
                  style="width:550px;"
                ></city-select>
              </el-form-item>
            </el-row>
            <el-row style="margin-top:15px;width:550px;">
              <el-form-item prop="dz">
                  <el-input v-model="addInfo.dz" size="mini" style="width:455px;margin-right:10px;"></el-input>
                  <el-button size="mini" @click="searchForMap">搜索地图</el-button>
                </el-form-item>
            </el-row>
          </el-form-item>
          <el-form-item label="地理定位" prop="lnglat">
            <maps v-model="addInfo.lnglat" ref="maps"></maps>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="addInfo.qh" size="mini" style="width:80px;"></el-input>
            <span style="margin:0 5px;">-</span>
            <el-input v-model="addInfo.phone" size="mini" style="width:445px;"></el-input>
          </el-form-item>
          <el-form-item label="接待时间" required>
            <div class="form-item-time">
              <time-picker v-model="defaultTime" style="width:180px;margin-right:20px;"></time-picker>
              <div
                class="weekend"
                v-for="item in weekend"
                :key="item"
              >{{item}}</div>
              <div class="form-item-btn">确定</div>
              <em class="form-item-line"></em>
              <div class="form-item-btn">取消</div>
            </div>
          </el-form-item>
          <el-form-item label="自提时间" prop="iszt">
            <el-row>
              <el-checkbox v-model="addInfo.iszt">需要买家选择自提时间</el-checkbox>
            </el-row>
            <el-row>
              <p class="form-tips">勾选后买家选择上门自提,必须选择自提时间,卖家需要按约定时间备货.</p>
              <p class="form-tips">不勾选将会提示买家尽快到店自提.</p>
            </el-row>
          </el-form-item>
          <el-form-item label="预约自提" prop="sdxf">
            <el-row>
              <el-radio v-model="addInfo.yyzt" label="0">无需提前</el-radio>
            </el-row>
            <el-row>
              <el-radio v-model="addInfo.yyzt" label="1">提前<input-number v-model="addInfo.tqts" style="margin:0 10px;" min="1"></input-number>天</el-radio>
            </el-row>
          </el-form-item>
          <el-form-item label="最长预约" prop="zcyy">
            <el-row>
              <el-radio v-model="addInfo.zcyy" label="0">无需提前</el-radio>
            </el-row>
            <el-row>
              <el-radio v-model="addInfo.zcyy" label="1">提前<input-number v-model="addInfo.zcyyts" style="margin:0 10px;" min="1"></input-number>天</el-radio>
            </el-row>
          </el-form-item>
          <el-form-item label="自提点照片" prop="picurl" required>
            <div class="form-item-upload">
              <div v-if="addInfo.picurl" class="form-item-img" :style="{backgroundImage:'url('+addInfo.picurl+')'}"></div>
              <el-button type="primary" icon="el-icon-upload" size="mini">选择图片</el-button>
            </div>
          </el-form-item>
          <el-form-item label="商家推荐" prop="comments">
            <el-row>
              <el-input
                style="width:550px;"
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="addInfo.comments">
              </el-input>
            </el-row>
            <el-row>
              <el-checkbox v-model="addInfo.ismdjd">同时作为门店接待</el-checkbox>
            </el-row>
          </el-form-item>
        </el-form>
    </div>
  </pop-up>
</template>
<script>
import popUp from '../../../../../components/popUp/index'
import citySelect from '../../../../../components/citySelect/index'
import maps from '../../../../../components/maps/index'
import timePicker from '../../../../../components/timePicker/index'
import inputNumber from '../../../../../components/inputNumber/index'
export default {
  props:['views'],
  data(){
    var validateAddress = (rule, value, callback) => {
      if(!this.addInfo.province){
        callback(new Error('请选择省份'));
      }else if(!this.addInfo.city){
        callback(new Error('请选择城市'));
      }else if(!this.addInfo.town){
        callback(new Error('请选择县区'));
      }else{
        callback();
      }
    };
    return {
      defaultTime: ["08:00","22:00"],
      addInfo:{
        name:'',
        province:'',
        city:'',
        town:'',
        pct:'',
        dz:'',
        lnglat:'',
        qh:'',
        phone:'',
        jdsj:[],
        iszt:true,
        yyzt:"0",//预约自提
        tqts:1,//预约自提提前天数
        zcyy:"0",//最长预约
        zcyyts:1,//最长预约天数
        picurl:'',
        comments:'',
        ismdjd:false
      },
      rules:{
        name:{required:true,message:'请输入自提点名称'},
        province:{required:true,message:'请选择省份'},
        city:{required:true,message:'请选择城市'},
        town:{required:true,message:'请选择县区'},
        dz:{required:true,message:'请填写地址'},
        phone:{required:true,message:'请填写联系方式'},
        picurl:{required:true,message:'请上传自提点照片'},
        pct:{validator: validateAddress}
      },
      weekend:['周一','周二','周三','周四','周五','周六','周日'],
      yyzt:[
        {type:'',value:0},
        {type:'天',value:0},
        {type:'小时',value:0},
        {type:'分钟',value:0},
      ]
    }
  },
  methods:{
    save(){
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    searchForMap(){
      if(!this.addInfo.province){
        this.$message('请选择省份','error');
      }else{
        this.parseAddressToLng();
      }
    },
    //地理解析
    parseAddressToLng(){
      var dz=this.addInfo.province+this.addInfo.city+this.addInfo.town+this.addInfo.dz;
      this.$http('/api/x6/gps/getDzGps.do',{
        dz:dz
      }).then(res=>{
        this.addInfo.lnglat=res.lnglat;
      });
    }
  },
  mounted(){
    //this.parseAddressToLng();
  },
  components:{
      popUp,
      citySelect,
      maps,
      timePicker,
      inputNumber
  }
}
</script>
<style lang="less" scoped>
  .form-item-time{
    display: flex;
    align-items: center;
    font-size: 12px;
    .weekend{
      width: 28px;
      line-height: 28px;
      border: 1px solid #dcdfe6;
      text-align: center;
      font-size: 10px;
      cursor: pointer;
      margin-right: 10px;
      color:#ccc;
    }
  }
  .form-tips{
    font-size: 12px;
    color: #ccc;
    line-height: 20px;
  }
  .form-item-btn{
    padding: 5px 7px;
    font-size: 12px;
    color: #409eff;
  }
  .form-item-line{
    height: 13px;
    width: 1px;
    background: #409eff;
  }
  .form-item-upload{
    .form-item-img{
      width:100px;
      height: 100px;
      margin-right: 10px;
      display: inline-block;
      vertical-align: bottom;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
  }
</style>
