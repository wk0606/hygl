<template>
  <div class="city-select">
    <el-select
        v-model="data.province"
        size="small"
        @change="clearCity()"
        placeholder="省">
        <el-option v-for="(k,v) in maps"
                    :label="v"
                    :value="v"
                    :key="v"></el-option>
    </el-select>
    <el-select v-model="data.city"
                size="small"
                @change="getTown(data.province,data.city)"
                placeholder="市">
        <el-option v-for="v in maps[data.province]"
                    :label="v"
                    :key="v"
                    :value="v">
        </el-option>
    </el-select>
    <el-select v-model="data.town"
                size="small"
                placeholder="区">
        <el-option v-for="v in townList" :key="v.town"
                    :label="v.town"
                    :value="v.town">
        </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props:['data'],
  data(){
      return {
        maps:[],
        townList:[]
      }
  },
  methods:{
    clearCity() {
        this.data.city='';
        this.data.town='';
        this.townList=[];
        this.$emit('change');
    },
    getTown(p,c){
        this.data.town = "";
        this.$http("/api/x6/getTownList.do", {
            province: p,
            city: c
        }).then((res) => {
            this.townList = res.list;
        });
        this.$emit('change');
    }
  },
  mounted(){
      this.maps=this.$util.getProvinceAndCity();
  }
}
</script>
<style lang="less" scoped>
    .city-select{
        display: flex;
        justify-content: space-between;
        .el-select{width: 32%;}
    }
</style>
