<template>
 <div>
     <div class="edit-block">
         <div>商品信息</div>
         <div>
             <div class="edit-items">
                 <span class="edit-items-required">商品名称</span>
                 <div>
                     <div><el-input size="mini" style="width:300px;" v-model.trim="details.name"></el-input></div>
                     <div class="tips" v-if="rules.name.show" >{{rules.name.label}}</div>
                 </div>
             </div>
             <div class="edit-items">
                 <span class="edit-items-required">网店售价</span>
                 <div>
                     <div class="edit-items-flex">
                         <!-- <el-input size="mini" style="width:150px;" v-model="details.spdj"></el-input> -->
                         <input-number
                            :arrow-control="false"
                            v-model="details.spdj"
                            style="width:150px;"
                         ></input-number>
                         <div class="edit-items-price">
                             <span>原价:￥</span>
                             <input-number
                                v-model="details.predj"
                                :arrow-control="false"
                                :border="false"
                             ></input-number>
                         </div>
                     </div>
                     <div class="tips" v-if="rules.spdj.show">{{rules.spdj.label}}</div>
                 </div>
             </div>
             <div class="edit-items">
                 <span class="edit-items-required">商品分组</span>
                 <div>
                     <div>
                         <el-select
                            size="mini"
                            v-model="details.spfz"
                            placeholder="请选择商品分组"
                            @focus="getCache('spfzList')"
                         >
                            <el-option
                                v-for="item in spfz"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                         </el-select>
                         <a @click="openRouter('/main/mallchildren/product_group_add/-1')" style="color:#409eff;margin-left:10px;">新建分组</a>
                     </div>
                     <div class="tips" v-if="rules.spfz.show">{{rules.spfz.label}}</div>
                 </div>
             </div>
             <div class="edit-items">
                 <span class="edit-items-required">商品图片</span>
                 <div>
                     <div class="edit-items-flex edit-items-start">
                         <div style="diaplay:inline-flex;" v-if="details">
                            <draggable
                                v-model="details.sptp"
                                @start="drag=true"
                                @end="drag=false"
                            >
                                <div
                                    v-for="pic in details.sptp"
                                    :key="pic"
                                    class="edit-items-pic"
                                    :style="{backgroundImage:'url('+pic+')'}"
                                ><i class="el-icon-circle-close close" @click="removImg(pic)"></i></div>
                            </draggable>
                         </div>
                         <div
                            class="edit-items-pic edit-items-plus"
                            @click="openFile"
                            v-if="details.sptp&&details.sptp.length<4"
                         >
                            <i :class="imgLoading?'el-icon-loading':'el-icon-plus'"></i>加图
                         </div>
                         <input type="file" ref="file" multiple="multiple" style="display:none;" @change="uploadImgs">
                     </div>
                     <div class="tips" v-if="rules.sptp.show">{{rules.sptp.label}}</div>
                     <div style="color:#ccc;margin-top:5px;">建议尺寸: 640*640,可以拖拽图片调整顺序</div>
                 </div>
             </div>
         </div>
     </div>
     <div class="edit-block">
         <div>库存/规格</div>
         <div>
             <div class="edit-items">
                 <span>规格设置</span>
                 <div>
                     <gg-select :data="type_group" @select-change="handleChange"></gg-select>
                 </div>
             </div>
             <div class="edit-items">
                 <span>规格信息</span>
                 <div>
                     <el-table
                        :data="details.spList"
                        :span-method="arraySpanMethod"
                        border
                        
                     >
                        <el-table-column
                            v-for="item in colModels"
                            :key="item.prop"
                            :label="item.label"
                            :prop="item.prop"
                            :align="item.align||'center'"
                            :width="item.width"
                        >
                            <template slot-scope="scope">
                                <span class="cell-span" v-if="item.prop!='spdm'&&item.prop!='dyjg'&&item.prop!='kskc'">{{scope.row[item.prop]}}</span>
                                <el-button
                                    size="mini"
                                    type="text"
                                    v-if="item.prop=='spdm'"
                                    @click="openGoodsDialog(scope.row,scope.$index)"
                                >{{scope.row.qspmc||'选择商品库商品'}}</el-button>
                                <input-number
                                    v-if="item.prop=='dyjg'&&scope.row.spdm"
                                    v-model="scope.row.dyjg"
                                    icon="iconfont icon-qian1"
                                    :arrow-control="false"
                                    style="width:100px;"
                                ></input-number>
                                <span class="cell-span" v-if="item.prop=='kskc'&&scope.row.spdm">{{scope.row.kskc}}</span>
                            </template>
                        </el-table-column>
                     </el-table>
                     <div class="table-footer">
                         <span>批量设置 ：</span>
                         <el-button
                          style="line-height:normal"
                          size="mini"
                          type="text"
                          :disabled="details.spList===undefined||details.spList!==undefined&&!details.spList.length"
                          @click="openPrompt"
                        >价格</el-button>
                     </div>
                     <div class="tips" v-if="rules.ggspgx.show" style="width:300px;">{{rules.ggspgx.label}}</div>
                 </div>
             </div>
             <div class="edit-items">
                 <span>库存预警数量</span>
                 <div>
                     <div>
                         <input-number :arrow-control="false" v-model="details.kcyjsl" style="width:100px;"></input-number>
                         <i class="el-icon-question" style="margin-right:10px;cursor:pointer;" title="当可售库存到达设置的数量，将受到通知，0代表不预警"></i>
                         <div class="edit-items-price">
                             <span>全部可售库存 :</span>
                             <span style="margin-left:10px;">{{calcKcTotal}}</span>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     </div>
     <div class="edit-block">
         <div>物流/其他</div>
         <div>
             <div class="edit-items">
                 <span class="edit-items-required">配送方式</span>
                 <div>
                     <div style="line-height:28px;">
                        <el-radio v-model="details.psfs" :label="1">快递配送</el-radio>
                        <el-radio v-model="details.psfs" :label="0">到店自提</el-radio>
                     </div>
                     <!-- <div class="tips" v-if="rules.name.show" style="width:300px;">{{rules.name.label}}</div> -->
                 </div>
             </div>
             <div class="edit-items" v-show="details.psfs">
                 <span class="edit-items-required">运费设置</span>
                 <div>
                     <div>
                        <div class="edit-items-yysz" style="margin-bottom:25px;">
                            <el-radio v-model="details.yfsz" :label="0">统一运费</el-radio>
                            <input-number
                                v-model="details.tyyfje"
                                icon="iconfont icon-qian1"
                                :arrow-control="false"
                                style="margin-left:20px;width:150px;"
                            ></input-number>
                        </div>
                        <div class="edit-items-yysz">
                            <el-radio v-model="details.yfsz" :label="1">运费模板</el-radio>
                            <el-select
                                size="mini"
                                v-model="details.yfmbid"
                                placeholder="请选择运费模板"
                                style="margin-left:20px;width:150px;"
                                @focus="getCache('kdmbList')"
                            >
                                <el-option
                                    v-for="item in yfmb"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                            <a @click="openRouter('/main/mallchildren/set_dd_addkd/-1')">新建模板</a>
                        </div>
                     </div>
                     <div class="tips" v-if="rules.yfsz.show" style="width:300px;">{{rules.yfsz.label}}</div>
                 </div>
             </div>
             <div class="edit-items">
                 <span>每人限购</span>
                 <div>
                     <div style="line-height:28px;">
                        <input-number
                            v-model="details.xgsl"
                            :arrow-control="false"
                            style="width:150px;"
                        ></input-number>
                     </div>
                     <div style="color:#ccc;margin-top:10px;">0代表不限购</div>
                 </div>
             </div>
         </div>
     </div>
     <goods-select
      v-if="dialog.show"
      :views="dialog"
      type="qspmc"
      @selected="goodsSelected"
     ></goods-select>
 </div> 
</template>
<script>
import draggable from "vuedraggable";
import ggSelect from "../specs_select";
import py from "../../../../func/pinyin";
import inputNumber from "../../../../components/inputNumber/index";
import goodsSelect from "../../../../components/goodsSelect/dialog";
import lrz from "lrz";
export default {
  props:['details'],
  data() {
    return {
      rules: {
        name: { label: "姓名不可为空", show: false },
        spdj: { label: "售价不可为空", show: false },
        spfz: { label: "分组不可为空", show: false },
        sptp: { label: "商品图片不可为空", show: false },
        ggspgx: { label: "请添加规格后选择商品", show: false },
        yfsz: { label: "运费模板不可为空", show: false }
      },
      type_group: [], //规格分组
      colModels: [
        { label: "商品名称", prop: "spdm" },
        { label: "网店售价", prop: "dyjg" },
        { label: "可售库存", prop: "kskc" }
      ],
      iskdps: true,
      isddzt: false,
      spfz: [],
      yfmb: [],
      dialog: { show: false },
      currentIndex: "",
      imgLoading: false //图片是否再上传中
    };
  },
  watch: {
    details: {
      handler: function(nv) {
        if (nv.name !== "") this.rules.name.show = false;
        if (nv.spdj !== "") this.rules.spdj.show = false;
        if (nv.spfz !== "") this.rules.spfz.show = false;
        if (nv.sptp.length) this.rules.sptp.show = false;
        if (nv.ggspgx.length) this.rules.ggspgx.show = false;
        if (nv.psfs) {
          if (!nv.yfsz && this.details.tyyfje !== "") {
            this.rules.yfsz.show = false;
          }
          if (nv.yfsz && this.details.yfmbid) {
            this.rules.yfsz.show = false;
          }
        }
      },
      deep: true
    }
  },
  computed:{
    calcKcTotal(){
      if(this.details.spList){
        var sum=0;
        for(let obj of this.details.spList){
          sum+=obj.kskc||0;
        }
        return sum;
      }else{
        return 0;
      }
    }
  },
  methods: {
    getCache(key){
      if(key=='spfzList')
        this.spfz=this.$util.getCache(key);
      else
        this.yfmb=this.$util.getCache(key);
    },
    openRouter(path){
        this.$router.push(path);
        this.$util.setCache('NEEDBACK',1);//新增完分组/模板后返回此页
        this.$util.setCache('NOTCONFIRM',1);//进入页面有缓存情况下是否不需要提示
    },
    openFile() {
      if (!this.imgLoading) {
        this.$refs.file.click();
      }
    },
    uploadImgs() {
      var baseArray = [];
      var files = [...this.$refs.file.files];
      files = files.filter(item => {
        return /^image/.test(item.type);
      });
      if (files.length == 0) {
        this.$message("您上传的文件的中无图片文件", "error");
        return;
      }
      if (files.length > 4) {
        this.$message("最多上传四张图片", "warning");
        files = files.slice(0, 4);
      }
      this.imgLoading = true;
      for (let i = 0; i < files.length; i++) {
        lrz(files[i]).then(rst => {
          baseArray.push({
            imgStr: rst.base64.split(",")[1],
            extname: files[i].type.split("/")[1]
          });
        });
      }
      //压缩方法异步处理
      var ID = setInterval(() => {
        if (baseArray.length == files.length) {
          this.$http("/api/x6/saveOtherPicsByBase64.do", {
            pics: baseArray
          }).then(
            res => {
              var temp = res.filePathArray.slice(
                0,
                4 - this.details.sptp.length
              );
              this.details.sptp = this.details.sptp.concat(temp);
              this.imgLoading = false;
            },
            err => {
              this.imgLoading = false;
            }
          );
          clearInterval(ID);
        }
      }, 150);
    },
    //删除图片
    removImg(pic) {
      this.details.sptp = this.details.sptp.filter(item => {
        return item != pic;
      });
    },
    //打开商品选
    openGoodsDialog(row, index) {
      this.currentIndex = index;
      this.dialog.show = true;
    },
    //商品选择完毕
    goodsSelected(item) {
      this.details.spList[this.currentIndex].spdm = item.spdm;
      this.details.spList[this.currentIndex].qspmc = item.qspmc;
      this.details.spList[this.currentIndex].kskc=item.kskc;
      this.details.spList[this.currentIndex].isch=item.isch;
    },
    //统一设置价格
    openPrompt(){
      this.$prompt('请输入价格', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\d/,
        inputErrorMessage: '价格格式不正确'
      }).then(({ value }) => {
        var price=parseFloat(value);
        for(let obj of this.details.spList)
          obj.dyjg=price;
      }).catch(() => {
               
      });
    },
    //检验表单
    vartifyForm() {
      var flag = true;
      var keys1 = ["name", "spdj", "spfz"]; //此类检验是否为空
      //开始验证之前先把所有验证信息关闭
      for (let key in this.rules) {
        this.rules[key].show = false;
      }
      //开始验证
      for (let key of keys1) {
        if (this.details[key] === "") {
          this.rules[key].show = true;
        }
      }
      if (!this.details.sptp.length) {
        this.rules.sptp.show = true;
      }
      if (!this.details.spList.length) {
        this.rules.ggspgx.show = true;
      }
      //验证运费这一块
      //如果选择快递配送
      if (this.details.psfs) {
        //如果选择统一运费 验证是否为空
        if (!this.details.yfsz && this.details.tyyfje === "") {
          this.rules.yfsz.label = "运费不能为空";
          this.rules.yfsz.show = true;
        }
        //如果选择运费模板
        if (this.details.yfsz && !this.details.yfmbid) {
          this.rules.yfsz.label = "请选择运费模板";
          this.rules.yfsz.show = true;
        }
      }
      for (let key in this.rules) {
        if (this.rules[key].show) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    //检验商品选择
    vartifyTable() {
      var temp=this.details.spList.filter(item=>{
        return item.spdm;
      });
      if(!temp.length){
        this.$message('请至少关联一个商品','error');
        return false;
      }else{
        for (let obj of temp) {
          if (obj.dyjg === "") {
            this.$message(`规格为 ${this.setMessage(obj)} 行未填写售价`, "error");
            return false;
          }
        } 
      }
      return true;
    },
    //拼装提示
    setMessage(obj) {
      var temp = ["dyjg", "kskc", "qspmc", "spdm"];
      var array = [];
      for (let key in obj) {
        if (temp.indexOf(key) == -1) array.push(key + ":" + obj[key]);
      }
      return array.join(" ");
    },
    //
    createGgxx(target){
      target.ggspgx = [];
      var notNeedKeys = ["dyjg", "kskc", "qspmc", "spdm","isch"];
      for (let obj of target.spList) {
        var temp = [];
        var keys = Object.keys(obj).filter(item => {
          return notNeedKeys.indexOf(item) == -1;
        });
        for (let key of keys) {
          temp.push({
            name: key,
            value: obj[key]
          });
        }
        target.ggspgx.push({
          spgg: temp,
          spdm: obj.spdm,
          qspmc: obj.qspmc,
          kskc: obj.kskc,
          dyjg: obj.dyjg,
          isch:obj.isch
        });
      }
    },
    save() {
      //将splist转成需要的ggspgx格式并插入
      if (this.vartifyForm()) {
        if (this.vartifyTable()) {
          this.createGgxx(this.details);
          this.$emit("next-step");
        }
      } else {
        this.$message("请先完善信息", "error");
      }
    },
    //规格选择完毕
    handleChange(array) {
      this.type_group = array.filter(item => {
        return item.name && item.value.length;
      });
      this.type_group = this.type_group.reverse();
      this.colModels = this.colModels.slice(-3);
      for (let obj of this.type_group) {
        this.colModels.splice(0, 0, {
          label: obj.name,
          prop: obj.name,
          width: 100
        });
      }
      var temp = {};
      var index = 0;
      this.details.spList = [];
      if (this.type_group.length) {
        this.type_group = this.type_group.reverse();
        this.tarnsferArray(temp, this.type_group, index, null);
      }
      //每一行中添加其他属性
      for (let obj of this.details.spList) {
        this.$set(obj, "spdm", 0);
        this.$set(obj, "qspmc", "");
        this.$set(obj, "dyjg", "");
        this.$set(obj, "kskc", 0);
        this.$set(obj, "isch", 0);
      }
    },
    //转发规格二维数组为列表形式的一维数组
    tarnsferArray(target, data, row, el) {
      for (let i = 0; i < data[row].value.length; i++) {
        target[data[row].name] = data[row].value[i];
        var k = row + 1;
        if (k > data.length - 1) {
          target[data[row].name] = data[row].value[i];
          this.details.spList.push(JSON.parse(JSON.stringify(target)));
          delete target[data[row].name];
        } else {
          this.tarnsferArray(target, data, k, data[k - 1].name);
        }
        if (i >= data[row].value.length - 1) {
          delete target[el];
        }
      }
    },
    //合并行的方法
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      for (let i = 0; i < this.type_group.length - 1; i++) {
        var k = this.type_group.slice(i + 1).reduce(function(num, obj) {
          return num * obj.value.length;
        }, 1);
        if (columnIndex == i) {
          if (rowIndex % k == 0) {
            return [k, 1];
          } else {
            return [0, 0];
          }
        }
      }
    },
    resetPage() {
      if(this.details.ggspgx.length){
        var ggspgx=this.details.ggspgx;
        //在这里需要将ggspgx中的值转成当前需要的spList和type_group
        this.type_group = [];
        var _type_group = {};
        for (let obj of ggspgx) {
          var spgg = obj.spgg;
          for (let gg of spgg) {
            if (!_type_group.hasOwnProperty(gg.name)) _type_group[gg.name] = [];
            if (_type_group[gg.name].indexOf(gg.value) == -1)
              _type_group[gg.name].push(gg.value);
          }
        }
        for (let key in _type_group) {
          this.type_group.push({
            name: key,
            value: _type_group[key],
            show: false
          });
        }
        var temp = JSON.parse(JSON.stringify(this.type_group)).reverse();
        //在这里要构建colmodels
        this.colModels = [
          { label: "商品名称", prop: "spdm" },
          { label: "网店售价", prop: "dyjg" },
          { label: "可售库存", prop: "kskc" }
        ];
        for (let obj of temp) {
          this.colModels.splice(0, 0, {
            label: obj.name,
            prop: obj.name,
            width: 100
          });
        }
      }
      //this.spfz=this.$util.getCache('spfzList');
      //this.yfmb=this.$util.getCache('kdmbList');
    },
    saveDetailsToStorage() {
      //在这里之判断当填写了商品名称的时候才去做缓存
      if (this.details.name) {
        var key1 = this.$route.params.id == -1 ? "MYHZ_SPXX_ADD" : "MYHZ_SPXX_EDIT";
        var key2 = this.$route.params.id == -1 ? "MYHZ_SPGG_ADD" : "MYHZ_SPGG_EDIT";
        //将此信息保存到sessionStorage中 留待填写详情页面使用
        this.$util.setCache(key1, this.details);
        //保存规格信息
        this.$util.setCache(key2, this.type_group);
      }
    }
  },
  mounted() {
    this.resetPage();
  },
  activated() {
    this.resetPage();
  },
  destroyed() {
    //this.$emit('clear-tab')
    //this.saveDetailsToStorage();
  },
  deactivated() {
    //this.$emit('clear-tab')
    //this.saveDetailsToStorage();
  },
  components: {
    draggable,
    ggSelect,
    inputNumber,
    goodsSelect
  }
};
</script>
<style lang="less" scoped>
@import "./information";
</style>
