<template>
  <div class="maps" id="maps" :style="{width:width+'px',height:height+'px'}"></div>
</template>
<script>
import AMap from 'AMap'
export default {
  props:{
      width:{default:'auto'},
      height:{default:'400'},
      value:{
          default:'120.585315,31.298886'
      }
  },
  data(){
      return{
          lnglat:this.value||'120.585315,31.298886'
      }
  },
  watch:{
      value(nv){
          this.lnglat=nv;
          var pointer=this.lnglat.split(',');
          this.drawMap(pointer);
      }
  },
  methods:{
      //绘制地图
    drawMap(lnglat){
        var map = new AMap.Map("maps", {
            resizeEnable: true,
            zoom:15,
            center:lnglat
        });
        this.markerPoint(lnglat[0],lnglat[1],map);
        //添加点击事件
        var clickEventListener = map.on('click', e=>{
            var lng=e.lnglat.getLng();
            var lat=e.lnglat.getLat();
            this.markerPoint(lng,lat,map);
            this.lnglat=lng+','+lat;
            this.$emit('input',this.lnglat);
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
      var pointer=this.lnglat.split(',');
      this.drawMap(pointer);
  }
}
</script>
<style lang="less" scoped>
    
</style>
