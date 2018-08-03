<template>
  <!-- 既是编辑也是新增 😶 -->
  <div ref="container">
    <bread-nav :data="navs"></bread-nav>
    <div class="p-edit-tab">
        <div
            v-for="item in tabs"
            :key="item.value"
            :class="{selected:item.value==currentTab}"
        >{{item.label}}</div>
    </div>
    <component
        :is="currentTab"
        :height="height"
        :details="form"
        v-if="height"
        ref="component"
        @next-step="openNext"
        @clear-tab="currentTab=''"
    ></component>
    <div class="p-tab-submit">
        <div v-if="currentTab=='information'"><el-button type="primary" size="mini" @click="nextStep">下一步</el-button></div>
        <div v-else>
            <el-button size="mini" @click="currentTab='information'">上一步</el-button>
            <el-button type="primary" size="mini" @click="productUp" v-if="upShow">上架</el-button>
            <el-button size="mini" @click="productDown" v-if="downShow">下架</el-button>
            <el-button type="primary" size="mini" @click="productSave" v-if="!disabled">保存</el-button>
        </div>
    </div>
  </div>
</template>
<script>
import breadNav from '../../../../components/breadNav/index'
import information from './product_edit_information'
import editDetails from './product_details'
export default {
  data(){
      return {
          navs:[
              {label:'网店商品',path:'/main/mallchildren/product_sp'},
              {label:'编辑商品'}
          ],
          tabs:[
              {
                label:'1. 编辑基本信息',
                value:'information'
              },
              {
                label:'2. 编辑商品详情',
                value:'editDetails'
              }
          ],
          currentTab:'',
          height:0,
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
            yxbz:0
          },
          CACHE_KEY:''
      }
  },
  computed:{
    disabled(){
        return this.$route.params.id==-1?true:false;
    },
    upShow(){
        return this.$route.params.yxbz!=2&&this.$route.params.yxbz==0?true:false;
    },
    downShow(){
        return this.$route.params.yxbz!=2&&this.$route.params.yxbz==1?true:false;
    }
  },
  watch:{
    currentTab(nv){
        this.$util.setCache('MYHZ_PRODUCT_TAB',nv);
    }  
  },
  methods:{
      nextStep(){
          this.$refs.component.save();
      },
      openNext(){
          this.currentTab='editDetails';
      },
      productUp(){
          this.$refs.component.productUp();
      },
      productDown(){
          this.$refs.component.productDown();
      },
      productSave(){
          this.$refs.component.save();
      },
      //这里设置返回的数据格式化成form格式
      formattingForm(obj) {
        var data = JSON.parse(obj.data);
        var ggspgx = JSON.parse(obj.ggspgx);
        var wl = JSON.parse(obj.wl);
        this.form.name = obj.name;
        this.form.spdj = obj.spdj;
        this.form.predj = obj.predj;
        this.form.spfz = obj.spfz;
        this.form.kcyjsl = data.kcyjsl;
        this.form.sptp = data.sptp;
        this.form.ggspgx = ggspgx;
        this.form.spList = [];
        this.form.psfs = wl.psfs;
        this.form.yfsz = wl.yfsz;
        this.form.tyyfje = wl.tyyfje;
        this.form.yfmbid = wl.yfmbid;
        this.form.xgsl = data.xgsl;
        this.form.spjj = data.spjj;
        this.form.spmd = data.spmd;
        this.form.xqtp = data.xqtp;
        this.form.yxbz = obj.yxbz;
        for (let obj of ggspgx) {
          var spgg = obj.spgg;
          var temp = {};
          for (let gg of spgg) {
            temp[gg.name] = gg.value;
          }
          temp.dyjg = obj.dyjg;
          temp.kskc = obj.kskc;
          temp.spdm = obj.spdm;
          temp.qspmc = obj.qspmc;
          this.form.spList.push(temp);
        }
      },
      //这里进行一些初始化操作
      resetPage(){
        this.height=this.$refs.container.offsetHeight-120;
        if (this.$route.params.id != -1) {
            this.form.id = this.$route.params.id;
            //先判断是否有缓存
            if(this.$util.getCache(this.CACHE_KEY)){
                this.form=this.$util.getCache(this.CACHE_KEY);
                this.currentTab=this.$util.getCache('MYHZ_PRODUCT_TAB')||'information';
            }else{
                this.$http("/api/x6/getHySetSpxxByid.do", {
                    id: this.form.id
                }).then(res => {
                    this.formattingForm(res.VO);
                    this.currentTab=this.$util.getCache('MYHZ_PRODUCT_TAB')||'information';
                });
            }
        }else{
            this.resetForm();
            this.currentTab=this.$util.getCache('MYHZ_PRODUCT_TAB')||'information';
        }
      },
      resetForm(){
          this.form={
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
            yxbz:0
          };
      }
  },
  activated(){
    this.CACHE_KEY = this.$route.params.id == -1 ? "MYHZ_SPXX_ADD" : "MYHZ_SPXX_EDIT";
    this.resetPage();
  },
  deactivated(){
      if(this.form.id == -1){
          //保存数据到后台
      }else{
          //保存到本地
          if(this.currentTab=='information')
            this.$refs.component.createGgxx(this.form);
          this.$util.setCache(this.CACHE_KEY, this.form);
      }
      this.currentTab='';
  },
  components:{
      breadNav,
      information,
      editDetails
  }
}
</script>
<style lang="less" scoped>
    @gray:#f8f8f8;
    .p-edit-tab{
        width: 100%;
        display: flex;
        >div{
            flex-grow: 1;
            padding: 10px 0;
            text-align: center;
            font-size: 14px;
            border-top:1px solid @gray;
            border-bottom:1px solid @gray;
            border-right:1px solid @gray;
            color: #666;
            font-size: 13px;
            cursor: pointer;
            background: #f0f0f0;
        }
        >div:nth-child(1){border-left:1px solid @gray}
        .selected{
            background: #fff;
            border-bottom: none;
        }
    }
    .p-tab-submit{
        background: #f8f8f8;
        padding: 10px 0;
        text-align: center;
        margin-top: 10px;
    }
</style>

