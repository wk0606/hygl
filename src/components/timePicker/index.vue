<template>
  <div class="time-picker">
    <el-time-picker
        style="width:100%;"
        is-range
        v-model="defaultTime"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围"
        format="HH:mm"
        value-format="HH:mm"
        size="mini"
        :disabled="disabled"
        :clearable="clearable"
        @change="changeTime">
    </el-time-picker>
  </div>
</template>
<script>
export default {
  props:{
      value:{required:true},
      disabled:{default:false},
      clearable:{default:false}
  },
  data(){
      return {
          defaultTime:this.value
      }
  },
  watch:{
      value(nv){
          this.defaultTime=nv;
      }
  },
  methods:{
      changeTime(){
        this.$emit('input',this.defaultTime);
      }
  }
}
</script>
<style lang="less" scoped>
    .time-picker{
        display: inline-block;
    }
</style>
