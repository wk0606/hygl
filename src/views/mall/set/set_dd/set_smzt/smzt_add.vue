<template>
  <pop-up
    title="新增自提点"
    width="800"
    :confirm="save"
    :views="views"
    :loading="saveload"
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
          <el-form-item label="地理定位" prop="jwd">
            <maps v-model="addInfo.jwd" ref="maps"></maps>
          </el-form-item>
          <el-form-item label="联系电话" prop="lxdhhm">
            <el-input v-model="addInfo.lxdhqh" size="mini" style="width:80px;" placeholder="区号"></el-input>
            <span style="margin:0 5px;">-</span>
            <el-input v-model="addInfo.lxdhhm" size="mini" style="width:445px;" placeholder="填写联系电话便于买家联系（区号可留空）"></el-input>
          </el-form-item>
          <el-form-item label="接待时间" prop="jdrq">
            <div class="form-item-time">
              <time-picker v-model="defaultTime" style="width:180px;margin-right:20px;"></time-picker>
              <div
                class="weekend"
                v-for="item in weekend"
                :key="item.value"
                :class="{selected:defaultWd.indexOf(item.value)>-1,disabled:hasSelectWd.indexOf(item.value)>-1}"
                @click="changeWeekend(item)"
              >{{item.label}}</div>
              <div class="form-item-btn" @click="addJdrq">确定</div>
              <em class="form-item-line"></em>
              <div class="form-item-btn" @click="cancelJdrq">取消</div>
            </div>
            <div
              class="form-item-date"
              v-for="(item,index) in hasSelectedSj"
              :key="index"
            >
              <time-picker v-model="item.time" :disabled="true" style="width:180px;margin-right:20px;"></time-picker>
              <span>{{item.wks}}</span>
              <el-button type="text" size="mini" @click="removeJdrq(index)">删除</el-button>
            </div>
          </el-form-item>
          <el-form-item label="自提时间" prop="ztsjxz">
            <el-row>
              <el-checkbox v-model="addInfo.ztsjxz">需要买家选择自提时间</el-checkbox>
            </el-row>
            <el-row>
              <p class="form-tips">勾选后买家选择上门自提,必须选择自提时间,卖家需要按约定时间备货.</p>
              <p class="form-tips">不勾选将会提示买家尽快到店自提.</p>
            </el-row>
          </el-form-item>
          <el-form-item label="预约自提" prop="sdxf">
            <el-row>
              <el-radio v-model="addInfo.ztlx" :label="0">无需提前</el-radio>
            </el-row>
            <el-row>
              <el-radio v-model="addInfo.ztlx" :label="1">提前<input-number v-model="addInfo.ztsj" style="margin:0 10px;" min="1"></input-number>天</el-radio>
            </el-row>
          </el-form-item>
          <el-form-item label="最长预约" prop="zcyy">
            <el-row>
              <el-radio v-model="addInfo.zcyylx" :label="0">无需提前</el-radio>
            </el-row>
            <el-row>
              <el-radio v-model="addInfo.zcyylx" :label="1">提前<input-number v-model="addInfo.zcyyts" style="margin:0 10px;" min="1"></input-number>天</el-radio>
            </el-row>
          </el-form-item>
          <el-form-item label="自提点照片" prop="ztdzp" required>
            <div class="form-item-upload">
              <div v-if="addInfo.ztdzp" class="form-item-img" :style="{backgroundImage:'url('+addInfo.ztdzp+')'}"></div>
              <el-button type="primary" icon="el-icon-upload" size="mini" :loading="load" @click="openFile">选择图片</el-button>
              <input type="file" ref="file" @change="uploadImg" style="display:none;">
            </div>
          </el-form-item>
          <el-form-item label="商家推荐" prop="sjtj">
            <el-row>
              <el-input
                style="width:550px;"
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="addInfo.sjtj">
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
import lrz from 'lrz'
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
    var validateJdrq = (rule, value, callback) =>{
      if(!this.addInfo.jdrq.length){
        callback(new Error('请选择接待时间'));
      }else{
        callback();
      }
    }
    return {
      load:false,
      saveload:false,
      defaultTime: ["08:00","22:00"],
      defaultWd:[],
      hasSelectWd:[],
      hasSelectedSj:[],
      addInfo:{
        name:'',
        province:'',
        city:'',
        town:'',
        pct:'',
        dz:'',
        jwd:'',
        lxdhqh:'',
        lxdhhm:'',
        jdrq:[],
        ztsjxz:true,
        ztlx:0,
        ztsj:7,//预约自提
        zcyylx:0,
        zcyyts:1,//最长预约天数
        ztdzp:'',
        sjtj:'',
        ismdjd:false
      },
      rules:{
        name:{required:true,message:'请输入自提点名称'},
        dz:{required:true,message:'请填写地址'},
        lxdhhm:{required:true,message:'请填写联系方式',trigger:'none'},
        ztdzp:{required:true,message:'请上传自提点照片'},
        jwd:{required:true,message:'请搜索地图或者自行选择地理位置'},
        pct:{validator: validateAddress,trigger:'none'},
        jdrq:[
          {required:true,message:'请填写联系方式',trigger:'none'},
          {validator: validateJdrq,trigger:'none'}
        ]
      },
      weekend:[
        {label:'周一',value:1},
        {label:'周二',value:2},
        {label:'周三',value:3},
        {label:'周四',value:4},
        {label:'周五',value:5},
        {label:'周六',value:6},
        {label:'周日',value:7}
      ],
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
          this.saveload=true;
          var temp=JSON.parse(JSON.stringify(this.addInfo));
          temp.ismdjd=temp.ismdjd?1:0;
          temp.ztsjxz=temp.ztsjxz?1:0;
          temp.id=this.views.data?this.views.data.id:-1;
          delete temp.pct;
          this.$http('/api/x6/HySetZtdSave.do',temp).then(res=>{
            this.saveload=false;
            this.$message('新增成功');
            this.views.show=false;
            this.$emit('success');
          },err=>{
            this.saveload=false;
          });
        } else {
          this.$message('请完善信息后保存','error');
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
    changeWeekend(item){
      if(this.hasSelectWd.indexOf(item.value)>-1)
        return;
      if(this.defaultWd.indexOf(item.value)>-1){
        this.defaultWd=this.defaultWd.filter(w=>{
          return w!=item.value;
        });
      }else{
        this.defaultWd.push(item.value);
      }
      this.defaultWd.sort();

    },
    addJdrq(){
      if(!this.defaultWd.length){
        this.$message('请至少选择一个工作日','error');
      }else{
        var temp={
          xqj:JSON.parse(JSON.stringify(this.defaultWd)),
          jdrqs:this.defaultTime[0],
          jdrqz:this.defaultTime[1]
        };
        this.addInfo.jdrq.push(temp);
        var week=[];
        for(let obj of this.weekend){
          for(let v of this.defaultWd){
            if(obj.value==v){
              week.push(obj.label);
              break;
            }
          }
        }
        this.hasSelectedSj.push({
          time:JSON.parse(JSON.stringify(this.defaultTime)),
          wks:week.join(',')
        });
        for(let v of this.defaultWd){
          this.hasSelectWd.push(v);
        }
        this.cancelJdrq();
      }
    },
    cancelJdrq(){
      this.defaultWd=[];
      this.defaultTime=["08:00","22:00"];
    },
    removeJdrq(index){
      var temp=this.addInfo.jdrq[index].xqj;
      this.hasSelectWd=this.hasSelectWd.filter(sw=>{
        return temp.indexOf(sw)==-1;
      });
      this.hasSelectedSj.splice(index,1);
      this.addInfo.jdrq.splice(index,1);
    },
    //地理解析
    parseAddressToLng(){
      var dz=this.addInfo.province+this.addInfo.city+this.addInfo.town+this.addInfo.dz;
      this.$http('/api/x6/gps/getDzGps.do',{
        dz:dz
      }).then(res=>{
        this.addInfo.jwd=res.lnglat;
      });
    },
    openFile(){
      this.$refs.file.click();
    },
    uploadImg(){
      var file=this.$refs.file.files[0];
      this.$refs.file.value='';
      if(!/^image/.test(file.type)){
          this.$message('请上传图片文件','error');
      }else{
          this.load=true;
          lrz(file).then(rst=>{
              rst.formData.append('base64img', rst.base64);
              this.$http('/api/x6/saveOtherPic.do',rst.formData).then(res=>{
                  this.addInfo.ztdzp=res.file_path;
                  this.load=false;
              },err=>{
                  this.load=false;
              });
          });
      }
    }
  },
  mounted(){
    if(this.views.data){
      this.addInfo=JSON.parse(JSON.stringify(this.views.data));
      this.addInfo.ismdjd=this.addInfo.ismdjd?true:false;
      this.addInfo.ztsjxz=this.addInfo.ztsjxz?true:false;
      this.addInfo.ztdzp=this.addInfo.ztdp;
      this.addInfo.jdrq=JSON.parse(this.addInfo.jdrq.value);
      this.hasSelectWd=[];
      this.hasSelectedSj=[];
      for(let obj of this.addInfo.jdrq){
        var week=[];
        this.hasSelectWd=this.hasSelectWd.concat(obj.xqj);
        for(let w of this.weekend){
          for(let v of obj.xqj){
            if(w.value==v){
              week.push(w.label);
              break;
            }
          }
        }
        this.hasSelectedSj.push({
          time:[obj.jdrqs,obj.jdrqz],
          wks:week.join(',')
        });
      }
    }
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
  div.selected{
    color:#409eff !important;
    border-color:#409eff !important;
  }
  .form-item-date{
    display: flex;
    align-items: center;
    span{font-size: 12px;width: 190px;}
  }
  .disabled{
    background: #f8f8f8 !important;
    cursor: not-allowed !important;
  }
</style>
