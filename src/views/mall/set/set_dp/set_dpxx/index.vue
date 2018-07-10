<template>
  <div>
    <!-- <div
      class="set-items"
      v-for="item in details"
      :key="item.prop"
    >
      <span>{{item.label}} : </span>
      <span>{{data[item.prop]}}</span>
      <el-button
        v-if="item.btnText"
        type="text"
      >{{item.btnText}}</el-button>
    </div> -->
    <table>
      <tr
        v-for="item in details"
        :key="item.prop"
      >
        <td :style="{verticalAlign:item.prop=='comments'?'top':'center'}">{{item.label}} :</td>
        <td :colspan="item.prop=='comments'?2:1">
          <div style="min-height:28px;">
            <el-input
              v-if="item.prop=='comments'"
              type="textarea"
              v-model="data[item.prop]"
              :rows="3"
            ></el-input>
            <span v-if="!item.show&&item.prop!='comments'">{{item.format?item.format(data[item.prop]):data[item.prop]}}</span>
            <el-select
              v-if="item.show&&item.prop=='lm'"
              v-model="data.lm"
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
            <el-input v-if="item.show&&item.prop=='name'||item.show&&item.prop=='lxfs'" size="mini" v-model="data[item.prop]" @blur="item.show=false"></el-input>
          </div>
        </td>
        <td>
          <el-button
            v-if="item.btnText"
            type="text"
            @click="item.click(item)"
          >{{item.btnText}}</el-button>
        </td>
      </tr>
    </table>
    <div style="padding-left:15px;padding-top:15px;">
      <el-button type="primary" size="mini" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
import {jylm} from '../../../../../func/jylm'
export default {
  data(){
    return {
      details:[
        {label:'店铺名称',prop:'name',btnText:'修改',show:false,click:this.openInput},
        {label:'店铺代码',prop:'gsdm'},
        {label:'店铺认证',prop:'isrz',btnText:'立即认证',click:this.openRz},
        {label:'主营类目',prop:'lm',show:false,btnText:'修改',click:this.openInput,format:this.formatName},
        {label:'有效日期',prop:'yxrq',btnText:'续费',click:this.openXf},
        {label:'店铺描述',prop:'comments'},
        {label:'联系方式',prop:'lxfs',btnText:'修改',show:false,click:this.openInput}
      ],
      data:{
        name:'苏州迈尔呀',
        gsdm:'877',
        isrz:0,
        lm:2,
        yxrq:'2018-09-09',
        comments:'少林功夫好',
        lxfs:'13456789000'
      },
      lm:jylm
    }
  },
  methods:{
    openInput(item){
      item.show=!item.show;
    },
    openRz(){
      this.$router.push('/main/mallchildren/set_dprz');
    },
    openXf(){

    },
    formatName(value){
      for(let item of jylm){
        if(item.value==value)
          return item.label;
      }
    },
    save(){
      console.log(this.data)
    }
  }
}
</script>
<style lang="less" scoped>
  td{
    font-size: 14px;
    color:#3a3a3a;
    box-sizing: border-box;
    padding: 20px 0;
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
  td .el-button{font-family: 'microsoft yahei';padding: 0;}
</style>
