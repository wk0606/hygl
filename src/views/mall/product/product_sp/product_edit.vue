<template>
  <!-- 既是编辑也是新增 😶 -->
  <div ref="container">
    <bread-nav :data="navs" v-if="needBreadNav!==false"></bread-nav>
    <div class="p-edit-tab" ref="tab">
        <div
            v-for="item in tabs"
            :key="item.value"
            :class="{selected:item.value==currentTab}"
        >{{item.label}}</div>
    </div>
    <component
        class="component"
        :is="currentTab"
        :details="form"
        ref="component"
        @clear-tab="currentTab=''"
    ></component>
    <div class="form-save-btn form-save-border" :style="{width:footerWidth+'px'}">
        <el-button v-if="footer.indexOf('prev')>-1" size="mini" @click="currentTab='information'">上一步</el-button>
        <el-button v-if="footer.indexOf('next')>-1" type="primary" size="mini" @click="nextStep">下一步</el-button>
        <el-button v-if="footer.indexOf('up')>-1" type="primary" size="mini" @click="productUp">上架</el-button>
        <el-button v-if="footer.indexOf('down')>-1" size="mini" @click="productDown">下架</el-button>
        <el-button v-if="footer.indexOf('save')>-1" type="primary" size="mini" @click="productSave">保存</el-button>
    </div>
  </div>
</template>
<script>
import breadNav from "../../../../components/breadNav/index";
import information from "./product_edit_information";
import editDetails from "./product_details";
export default {
  props:{
    id:{default:-1},
    yxbz:{default:0},
    layout:{//底部按钮 上一步-'prev' 上架-'up' 下架-’down‘ 下一步-’next‘ 下架-’down‘ 保存-’save‘
      default:'next'
    },
    needBreadNav:{
      default:false//是否需要顶部面包屑导航
    }
  },
  data() {
    return {
      navs: [
        { label: "商品列表", click: this.backList },
        { label: "编辑商品" }
      ],
      tabs: [
        {
          label: "1. 编辑基本信息",
          value: "information"
        },
        {
          label: "2. 编辑商品详情",
          value: "editDetails"
        }
      ],
      currentTab: "",
      footer:'',
      //这是表单数据
      form: {
        id: -1,
        name: "",
        spdj: "",
        predj: 0,
        spfz: "",
        kcyjsl: 0,
        sptp: [],
        ggspgx: [],
        spList: [], //表格商品列表
        psfs: 1,
        yfsz: 0,
        tyyfje: "",
        yfmbid: "",
        xgsl: 0,
        spjj: "",
        spmd: "",
        xqtp: [],
        yxbz: 0
      },
      CACHE_KEY: "",
      footerWidth:0
    };
  },
  methods: {
    //返回商品列表
    backList(){
      this.$parent.editShow=false;
      this.$parent.refreshList();
    },
    nextStep() {
      this.$refs.component.save();
    },
    productUp() {
      this.$refs.component.productUp();
    },
    productDown() {
      this.$refs.component.productDown();
    },
    productSave() {
      this.$refs.component.save();
    },
    //建构商品规格和商品列表
    formatSpggAndData(array) {
      let data={
        list:[],
        gg:[]
      };
      //构建商品列表
      for(let obj of array){
        let temp=Object.assign({},obj);
        delete temp.spgg;
        for(let gg of obj.spgg){
          temp[gg.name]=gg.value;
        }
        data.list.push(temp);
      }
      //构建商品规格
      for(let spgg of array[0].spgg){
        data.gg.push(spgg.name);
      }
      return data;
    },
    //这里进行一些初始化操作
    resetPage(value=false) {
      this.footerWidth=this.$refs.tab.offsetWidth;
      this.footer=this.layout;
      //先取缓存
      let form=this.$util.getCache(this.CACHE_KEY);
      if(form){
        if(this.$util.getCache('GROUP-ID')){
          if(this.$refs.component){
            this.$refs.component.getCache('spfzList');
            form.spfz=parseInt(this.$util.getCache('GROUP-ID'));
          }
          this.$util.removeCache('GROUP-ID');
        }
        if(this.$util.getCache('KDMB-ID')){
          if(this.$refs.component){
            this.$refs.component.getCache('kdmbList');
            form.yfmbid=parseInt(this.$util.getCache('KDMB-ID'));
          }
          this.$util.removeCache('KDMB-ID');
        }
        this.form=form;
        this.currentTab='information';
        this.$util.removeCache(this.CACHE_KEY);
      }else{
        if(this.id!=-1){
          this.$http('/api/x6/getHySetSpxxByid.do',{
            id:this.id,
            yxbz:this.yxbz
          }).then(res=>{
            let data=JSON.parse(res.VO.data);
            let wl=JSON.parse(res.VO.wl);
            let spgg=this.formatSpggAndData(JSON.parse(res.VO.ggspgx));
            this.form.id=this.id;
            this.form.name=res.VO.name;
            this.form.spdj=res.VO.spdj;
            this.form.predj=res.VO.predj;
            this.form.spfz=res.VO.spfz;
            this.form.kcyjsl=data.kcyjsl;
            this.form.sptp=data.sptp;
            this.form.ggspgx=spgg.gg;
            this.form.spList=spgg.list;
            this.form.psfs=wl.psfs==2?['快递配送','到店自提']:wl.psfs==1?['到店自提']:['快递配送'];
            this.form.yfsz=wl.yfsz;
            this.form.tyyfje=wl.tyyfje;
            this.form.yfmbid=wl.yfmbid||'';
            this.form.xgsl=data.xgsl;
            this.form.spjj=data.spjj;
            this.form.spmd=data.spmd;
            this.form.xqtp=data.xqtp;
            this.form.yxbz=res.VO.yxbz;
            this.currentTab='information';
          });
        }else{
          this.resetForm(value);
          this.currentTab='information';
        }
      }
    },
    resetForm(value) {
      this.form = {
        id: -1,
        name: "",
        spdj: "",
        predj: 0,
        spfz: "",
        kcyjsl: 0,
        sptp: [],
        ggspgx: [],
        spList: [], //表格商品列表
        psfs: value?['快递配送']:[],
        yfsz: 0,
        tyyfje: 0,
        yfmbid: "",
        xgsl: 0,
        spjj: "",
        spmd: "",
        xqtp: [],
        yxbz: 0
      };
    }
  },
  mounted(){
    this.$http('/api/x6/getZtKdgnKqzt.do').then(res=>{
      this.CACHE_KEY=this.id==-1?'PRODUCT-ADD':'PRODUCT-EDIT';
      this.resetPage(!!res.kdkqzt);
    });
  },
  activated() {
    this.$http('/api/x6/getZtKdgnKqzt.do').then(res=>{
      this.CACHE_KEY=this.id==-1?'PRODUCT-ADD':'PRODUCT-EDIT';
      this.resetPage(!!res.kdkqzt);
    });
  },
  deactivated() {
    this.$util.setCache(this.CACHE_KEY,this.form);
  },
  components: {
    breadNav,
    information,
    editDetails
  }
};
</script>
<style lang="less" scoped>
    @gray:#f8f8f8;
    .p-edit-tab{
        width: 100%;
        display: flex;
        justify-content: center;
        >div{
            padding: 0 100px;
            height: 30px;
            line-height: 30px;
            background: #e4e4e4;
            position: relative;
            margin: 0 15px;
        }
        >div:nth-child(1){
          &:after{
            content: '';
            width: 0;
            height: 0;
            position: absolute;
            right: -50px;
            top:0;
            border-top: 15px solid transparent;
            border-bottom: 15px solid transparent;
            border-right: 25px solid transparent;
            border-left: 25px solid #e4e4e4;
          }
        }
        >div:nth-child(2){
          &:before{
            content: '';
            width: 0;
            height: 0;
            position: absolute;
            left: 0;
            top:0;
            border-top: 15px solid transparent;
            border-bottom: 15px solid transparent;
            border-right: 25px solid transparent;
            border-left: 25px solid #fff;
          }
        }
        .selected{
            background: #33ccff;
            color: #fff;
            &:after{
              border-left-color:#33ccff !important;
            }
        }
    }
    .p-tab-submit{
        background: #f8f8f8;
        padding: 10px 0;
        text-align: center;
        margin-top: 10px;
        position: fixed;
        bottom: 0;
        padding: 10px 0;
        background: @gray;
        z-index: 2;
    }
    .component{
      flex-grow: 1;
      padding-bottom: 48px;
    }
</style>

