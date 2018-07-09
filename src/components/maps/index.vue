<template>
  <div class="maps" id="maps" :style="{width:width+'px',height:height+'px'}"></div>
</template>
<script>
import AMap from 'AMap'
export default {
  props:{
      lnglat:{required:true},
      width:{default:'auto'},
      height:{default:'400'}
  },
  watch:{
      'lnglat':{
          handler:function(nv){
              this.drawMap(nv);
          },
          deep:true
      }
  },
  methods:{
      //绘制地图
    drawMap(lnglat){
        var map = new AMap.Map("maps", {
            resizeEnable: true,
            zoom:15,
            center:[lnglat.lng,lnglat.lat]
        });
        this.markerPoint(lnglat.lng,lnglat.lat,map);
        //添加点击事件
        var clickEventListener = map.on('click', e=>{
            this.lng=e.lnglat.getLng();
            this.lat=e.lnglat.getLat();
            this.lnglat.lng=this.lng;
            this.lnglat.lat=this.lat;
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
      marker.setMap(map);
    },
  },
  mounted(){
      this.drawMap(this.lnglat);
  }
}
</script>
<style lang="less" scoped>
    
</style>
