<template>
  <div class="map-container" ref="mapContainer" @click.stop="">
    <div class="map-title">
      <div>
        <i class="iconfont icon-fcstubiao21"></i>
        <b>门店设置</b>
      </div>
      <i class="el-icon-close close" @click="close"></i>
    </div>
    <div class="map-details">
      <div class="map-details-item"><span>门店名称 ：</span><el-input size="small" v-model="location.name" placeholder="请输入门店名称" style="width:450px;" :disabled="true"></el-input></el-input></div>
      <div class="map-details-item">
        <span>门店照片 ：</span>
        <div class="map-details-logo">
          <img :src="location.picurl" width="50%" v-if="location.picurl"/>
          <div class="logo-upload" @click="selectLogo">
            <i :class="icon"></i>
            <b>{{location.picurl?'重新上传':'选取图片'}}</b>
          </div>
          <input type="file" ref="upload" style="display:none;" @change="uploadLogo"/>
        </div>
      </div>
      <div class="map-details-item">
        <span>所属区域 ：</span>
        <el-select
            v-model="location.province"
            size="small"
            @change="clearCity()"
            placeholder="省">
          <el-option v-for="(k,v) in maps"
                      :label="v"
                      :value="v"
                      :key="v"></el-option>
        </el-select>
        <el-select v-model="location.city"
                    size="small"
                    @change="getTown(location.province,location.city)"
                    placeholder="市">
          <el-option v-for="v in maps[location.province]"
                      :label="v"
                      :key="v"
                      :value="v">
          </el-option>
        </el-select>
        <el-select v-model="location.town"
                    size="small"
                    placeholder="区">
          <el-option v-for="v in town_list" :key="v.town"
                      :label="v.town"
                      :value="v.town">
          </el-option>
        </el-select>
      </div>
      <div class="map-details-item">
        <span>详细地址 ：</span>
        <el-input size="small" v-model="location.dz" style="width:370px;margin-right:10px;"></el-input>
        <!-- <div style="line-height:30px;padding:0 7px;box-sizing:border-box;border-radius:4px;border:1px solid #ccc;"></div> -->
        <el-button size="small" @click="searchMap">搜索地图</el-button>
        <span style="color:#aaa;margin-left:10px;">(可点击地图来调整商铺的位置)</span>
      </div>
      <div class="map-details-item map-body">
        <span>地图定位 ：</span>
        <div  id="shop" class="shop"></div>
      </div>
      <div class="map-details-item">
        <span>商家标签 ：</span>
        <el-tag
          v-for="tag in location.tags"
          :key="tag.name"
          :closable="true"
          @close="handleClose(tag)"
        >{{tag.name}}</el-tag>
        <div class="add-tag" @click="openTags"><i class="el-icon-plus"></i></div>
      </div>
      <div style="text-align:right;box-sizing:border;padding-right:10px;">
        <el-button type="primary" size="small" @click="save">保存</el-button>
        <el-button size="small" @click="close">关闭</el-button>
      </div>
    </div>
    <!-- 标签 -->
    <tag v-if="dialog.show" :views="dialog" @tag-select="tagSelected"></tag>
  </div>
</template>
<script>
import AMap from 'AMap'
import tag from './tag'
import {Loading} from '../../func/loading'
export default {
  props:['views'],
  data(){
    return {
      icon:'el-icon-plus',
      location:{},
      lng:'',
      lat:'',
      dialog:{
        show:false,
        data:null
      },
      orginalPoint:null,//经纬度初始位置
      maps:[],
      town_list:[]
    }
  },
  watch:{
    'views.data.name':function(val){
      this.resetPage();
    }
  },
  methods:{
    clearCity() {
      this.location.city='';
      this.location.town='';
      this.location.townList=[];
    },
    getTown(p,c){
      this.location.town = "";
      this.$http("/api/x6/getTownList.do", {
        province: p,
        city: c
      }).then((res) => {
        this.town_list = res.list;
      })
    },
    save(){
      if(!this.location.province || !this.location.city || !this.location.town || !this.location.dz){
          this.$message('请完善地址信息','error');
          return;
      }
      var dz=this.location.province+this.location.city+this.location.town+this.location.dz;
      this.$http('/api/x6/gps/getDzGps.do',{
        dz:dz
      }).then(res=>{
        var temp;
        if(res.lnglat!=this.location.lnglat){
          this.$confirm('当前地图定位与地址信息不符合，是否使用此定位?', '提示', {
            confirmButtonText: '使用',
            cancelButtonText: '不使用',
            type: 'warning'
          }).then(() => {
            this.$http('/api/x6/updateHyCrmInfor.do',{
              id:this.location.id,
              lnglat:this.location.lnglat,
              picurl:this.location.picurl,
              tags:this.location.tags,
              province:this.location.province,
              city:this.location.city,
              town:this.location.town,
              dz:this.location.dz,
              country:'中国'
            }).then(res=>{
              this.$message('商铺设置更新成功');
              this.$emit('location-success');
              this.close();
            });
          }).catch(() => {  
            this.$http('/api/x6/updateHyCrmInfor.do',{
              id:this.location.id,
              lnglat:res.lnglat,
              picurl:this.location.picurl,
              tags:this.location.tags,
              province:this.location.province,
              city:this.location.city,
              town:this.location.town,
              dz:this.location.dz,
              country:'中国'
            }).then(res=>{
              this.$message('商铺设置更新成功');
              this.$emit('location-success');
              this.close();
            });     
          });
        }else{
          this.$http('/api/x6/updateHyCrmInfor.do',{
            id:this.location.id,
            lnglat:this.orginalPoint,
            picurl:this.location.picurl,
            tags:this.location.tags,
            province:this.location.province,
            city:this.location.city,
            town:this.location.town,
            dz:this.location.dz,
            country:'中国'
          }).then(res=>{
            this.$message('商铺设置更新成功');
            this.$emit('location-success');
            this.close();
          });
        }
      });
    },
    //选取商铺照片
    selectLogo(){
      if(this.icon=='el-icon-loading')
        this.$message('正在上传,请稍后','warning');
      else
        this.$refs.upload.click();
    },
    //上传照片
    uploadLogo(){
      var file=this.$refs.upload.files[0];
      if(!/^image/.test(file.type)){
        this.$alert('请上传图片文件','提示',{type:'warning'});
      }else{
          this.icon='el-icon-loading';
          var _file=new FormData();
          _file.append('file',file);
          this.$http('/api/x6/saveOtherPic.do',_file).then(res=>{
            this.icon='el-icon-plus';
            this.location.picurl=res.file_path;
          },err=>{
            this.icon='el-icon-plus';
          });
      }
    },
    searchMap(){
      var dz=this.location.province+this.location.city+this.location.town+this.location.dz;
      this.$http('/api/x6/gps/getDzGps.do',{
        dz:dz
      }).then(res=>{
        this.drawMap(res.lnglat.split(','));
      });
    },
    //绘制地图
    drawMap(lnglat){
        var map = new AMap.Map("shop", {
            resizeEnable: true,
            zoom:15,
            center:lnglat
        });
        this.markerPoint(lnglat[0],lnglat[1],map);
        //添加点击事件
        var clickEventListener = map.on('click', e=>{
            this.lng=e.lnglat.getLng();
            this.lat=e.lnglat.getLat();
            this.location.lnglat=this.lng+','+this.lat;
            this.markerPoint(this.lng,this.lat,map);
        });
    },
    //标注地点
    markerPoint(lng,lat,map){
      map.clearMap();
      var marker = new AMap.Marker({
          position: [lng, lat],
          map:map
      });
      //也可以在创建完成后通过setMap方法执行地图对象
      marker.setMap(map);
    },
    //地理解析
    parseAddressToLng(){
      var dz=this.location.province+this.location.city+this.location.town+this.location.dz;
      this.$http('/api/x6/gps/getDzGps.do',{
        dz:dz
      }).then(res=>{
        this.location.lnglat=res.lnglat;
        this.orginalPoint=this.location.lnglat;
        this.drawMap(this.location.lnglat.split(','));
      });
    },
    //选择标签
    openTags(){
      this.dialog.show=true;
      this.dialog.data=this.location.tags;
    },
    //关闭标签
    handleClose(tag){
      this.location.tags=this.location.tags.filter(item=>{
        return item.name!=tag.name;
      });
    },
    //标签选择完毕
    tagSelected(array){
      this.location.tags=array;
    },
    //初始化页面
    resetPage(){
      this.location=this.views.data;
      if(this.location.lnglat){
        this.drawMap(this.location.lnglat.split(','));
      }
      else
        this.parseAddressToLng();
    },
    close(){
      this.views.show=false;
    }
  },
  mounted(){
    this.orginalPoint=this.views.data.lnglat;
    this.maps=this.$util.getProvinceAndCity();
    Loading.open({
      target:this.$refs.mapContainer
    });
    setTimeout(()=>{
      Loading.close();
      this.resetPage();
    },1000);
  },
  components:{tag}
}
</script>
<style lang="less" scoped>
  .map-container {
    width: 70%;
    height: 100%;
    position: absolute;
    right: 0;
    top:0;
    z-index: 9;
    background: #fff;
    box-shadow: -3px 0px 5px #E3E3E3;
    .map-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 10px;
      div{
        font-size: 15px;
        color:#333;
        display: inline-flex;
        align-items: center;
        i{font-size: 26px;margin-right:  10px;color:#F7BA2A; }
      }
      >i{color:#aaa;cursor: pointer;}
    }
    .shop{
      height: 400px;
      margin: 0 10px;
      flex-grow: 1;
    }
    .map-details{
      height:~"calc(100% - 50px)";
      overflow-y: auto;
      margin-left: 2%;
      >div{
        margin: 15px 0;
      }
    }
    .map-details-item{
      display: flex;
      align-items: center;
      .el-input{
        //flex-grow: 1;
        margin-left: 10px;
      }
      .el-select{
        margin-left:10px;
        width: 143px;
      }
      .el-tag{margin-right: 10px;}
      >span{
        flex-shrink: 0;
      }
      .map-details-logo{
        margin-left: 10px;
        position: relative;
        display:inline-flex;
        align-items: flex-end;
        img{margin-right: 10px;}
        .logo-upload{
          padding: 7px 10px;
          border-radius: 4px;
          border: 1px dashed #ccc;
          font-size: 12px;
          color: #aaa;
          cursor: pointer;
        }
      }
      .add-tag{
        padding: 3px;
        background: #20A0FF;
        color: #fff;
        border-radius: 50%;
        cursor: pointer;
      }
    }
    .map-body{
      align-items: flex-start;
    }
  }  
</style>
