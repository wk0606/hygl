<template>
  <div class="details-body">
      <div class="details-body-edit">
        <div
            
         >
            <div class="d-textarea">
                <div>商品简介</div>
                <div class="d-textarea-body">
                    <textarea rows="5" maxlength="100" v-model="details.spjj"></textarea>
                    <p>
                        <span>{{details.spjj.length}}/100</span>
                    </p>
                </div>
                <p>选填,微信分享给好友时会显示这里的文案。</p>
            </div>
            <div class="d-textarea d-textarea-edit">
                <div>商品卖点</div>
                <div class="d-textarea-body">
                    <textarea rows="5" maxlength="50" v-model="details.spmd"></textarea>
                    <p>
                        <span>{{details.spmd.length}}/50</span>
                    </p>
                </div>
                <p>在商品详情页下面展示卖点,建议50字以内。</p>
            </div>
        </div>
        <div style="width:254.98px;">
            <span>商品详情图片:</span>
            <span style="color:#ccc;">可拖动图片改变缩略图</span>
            <input type="file" ref="file" multiple="multiple" style="display:none;" @change="uploadImgs">
        </div>
        <div class="thumb">
            <draggable
                v-model="details.xqtp"
                :options="{
                    animation:150,
                    filter:'.t-btn'
                }"
                @start="drag=true"
                @end="drag=false"
            >
                <div
                    class="d-thumb"
                    v-for="item in details.xqtp"
                    :key="item"
                >
                    <div :style="{backgroundImage:'url('+item+')'}"></div>
                    <i class="el-icon-circle-close" @click="removeImg(item)"></i>
                </div>
                <div class="t-btn" @click="openFile">
                    <i :class="imgLoading?'el-icon-loading':'el-icon-plus'"></i>
                    <span>加图</span>
                </div>
            </draggable>
        </div>
      </div>
      <div>
          <real-view
            width="300px"
            height="600px"
          >
            <div class="d-preview">
                <img src="../../../../assets/spxq.png" alt="" width="100%">
                <div class="d-main">
                    <!-- <div class="d-header">
                        <p><b>基本信息区</b></p>
                        <p>固定样式,显示商品主图、价格等信息</p>
                    </div> -->
                    <img src="../../../../assets/jbxx.jpeg" alt="" width="100%">
                    <div class="line"><div>商品详情</div></div>
                    <div class="d-img" style="width:100%;">
                        <div
                            v-for="(img,index) in details.xqtp"
                            :key="index"
                        >
                            <img :src="img" alt="" width="100%">
                            <div class="remove-mask"><i class="el-icon-delete" @click="removeImg(img,index)"></i></div>
                        </div>
                    </div>
                </div>
            </div>
          </real-view>
      </div>
  </div>
</template>
<script>
import scroll from '../../../../components/scroll/scroll'
import realView from '../../../../components/realView/index'
import draggable from 'vuedraggable'
export default {
  props:['height','details'],
  data(){
      return {
          width:0,
          imgLoading:false
      }
  },
  methods:{
      openFile() {
        if(this.imgLoading)
            return;
        this.$refs.file.click();
      },
      uploadImgs() {
        var baseArray=[];
        var files=[...this.$refs.file.files];
        files = files.filter(item => {
            return /^image/.test(item.type);
        });
        if(files.length==0){
            this.$message('您上传的文件的中无图片文件','error');
            return;
        }
        this.imgLoading=true;
        for(let i=0;i<files.length;i++){
            lrz(files[i]).then(rst=>{
                baseArray.push({
                    imgStr:rst.base64.split(',')[1],
                    extname:files[i].type.split('/')[1]
                }); 
            });
        }
        //压缩方法异步处理
        var ID=setInterval(()=>{
            if(baseArray.length==files.length){
                this.$http('/api/x6/saveOtherPicsByBase64.do',{
                    pics:baseArray
                }).then(res=>{
                    this.details.xqtp=this.details.xqtp.concat(res.filePathArray);
                    this.imgLoading=false;
                },err=>{
                    this.imgLoading=false;
                });
                clearInterval(ID);
            }
        },150);
      },
      removeImg(img,index){
          this.details.xqtp=this.details.xqtp.filter(item=>{
              return item!=img;
          });
      },
      productUp(){
          this.save(0);
      },
      productDown(){
          this.save(1);
      },
      save(){
          if(!this.details.spmd){
              this.$message('请填写商品卖点','error');
              return;
          }
          if(!this.details.xqtp.length){
              this.$message('请上传详情图片','error');
              return;
          }
          let params=JSON.parse(JSON.stringify(this.details));
          let array=[];
          //let keys=['dyjg','isch','kskc','qspmc','spdm'];
          //设置配送方式
          params.psfs=params.psfs.length==2?2:params.psfs[0]=='快递配送'?1:0;
          if(!params.psfs){
              //选择到店自提
              params.tyyfje=0;
              params.yfmbid=0;
          }else{
              if(params.yfsz){
                  //选择运费模板
                  params.tyyfje=0;
              }else{
                  params.yfmbid=0;
              }
          }
          params.spList=params.spList.filter(item=>{
              return item.spdm?true:false;
          });
          for(let obj of params.spList){
              let temp={
                  spgg:[]
              };
              for(let key in obj){
                  if(this.details.ggList.indexOf(key)==-1){
                      temp[key]=obj[key];
                  }
              }
              for(let gg of this.details.ggList){
                temp.spgg.push({
                    name:gg,
                    value:obj[gg]
                });
              }
              array.push(temp);
          }
          params.ggspgx=array;
          delete params.spList;
          delete params.ggList;
          this.$http('/api/x6/hySetSpxxSave.do',params).then(res=>{
            this.$message(params.id==-1?'上架成功':'编辑成功');
            if(params.id==-1){
                this.$parent.resetForm();
                this.$router.push('/main/mall/shop/product_sp');
                //this.$parent.currentTab='information';
            }else{
                this.$parent.backList();
                //this.$parent.getList();
            }
            this.$util.removeCache(this.$parent.CACHE_KEY);
          }); 
      }
  },
  mounted(){
      this.$parent.footer='prev,save';
      //this.width=9*this.height/16;
      //console.log(this.$parent.$refs.component)
  },
  activated(){
      //this.width=9*this.height/16;
  },
  components:{
      scroll,
      realView,
      draggable
  }
}
</script>
<style lang="less" scoped>
    @bgcolor:#ddd;
    @size:50px;
    .details-body{
        display: flex;
        justify-content: center;
        height: 100%;
        box-sizing: border-box;
        padding-top: 10px;
        min-height: 480px;
        overflow-y: auto;
        >div{
            width: 50%;
            height: 100%;
            box-sizing: border-box;
            overflow-y: auto;
            flex-shrink: 0;
        }
        >div:nth-child(2){padding-left: 10px;box-sizing: border-box;}
        .details-body-edit{
            height: 600px;
            display: inline-flex;
            box-sizing: border-box;
            padding-right: 10px;
            align-items: flex-end;
            flex-direction: column;
            >div{
                height: auto;
            }
            >div:nth-child(1){flex-shrink: 0;}
            .thumb{
                width: 264.98px;
                display: flex;
                flex-wrap: wrap;
                .t-btn{
                    width: @size;
                    height: @size;
                    border: 1px solid #ddd;
                    margin: 10px 0 0 10px;
                    box-sizing: border-box;
                    padding: 3px; 
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    color: #409eff;
                    cursor: pointer;
                    vertical-align: top;
                }
            }
            .d-thumb{
                width: @size;
                height: @size;
                border: 1px solid #ddd;
                margin: 10px 0 0 10px;
                box-sizing: border-box;
                padding: 3px;
                cursor: pointer;
                border-radius: 2px;
                display: inline-block;
                position: relative;
                >div{
                    height: 100%;
                    background-size: cover;
                    background-position: center center;
                }
                >i{
                    position: absolute;
                    top:-8px;
                    right: -8px;
                    font-size: 15px;
                    color: red;
                    visibility: hidden;
                    cursor: pointer;
                }
                &:hover{
                    >i{
                        visibility: visible;
                    }
                }
            }
        }
        //border: 1px solid @bgcolor;
        .d-preview{
            height: 100%;
            display: flex;
            flex-direction: column;
            >img{
                width: 100%;
                flex-shrink: 0;
            }
            .d-main{
                flex-grow: 1;
                height: 0;
                margin-top: -5px;
                overflow-y: auto;
                .d-header{
                    background: #e5e5e5;
                    height: 30%;
                    color: #aaa;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    b{
                        font-size: 14px;
                        color: #6e6e6e;
                    }
                    p:nth-child(1){margin-bottom: 10px;}
                }
                .line{
                    width: 90%;
                    height: 1px;
                    background: #d3d3d3;
                    margin: 20px auto;
                    text-align: center;
                    div{
                        display: inline-block;
                        padding: 0 10px;
                        background: #fff;
                        position: relative;
                        color: #999;
                        top:-7px;
                    }
                }
                .d-img{
                    box-sizing: border-box;
                    padding: 0 10px 10px 10px;
                    display: flex;
                    flex-direction: column;
                    div{
                        position: relative;
                        .remove-mask{
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top:0;
                            left: 0;
                            background: rgba(0,0,0,.5);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all .1s;
                            opacity: 0;
                            visibility: hidden;
                            i{
                                font-size: 25px;
                                color: #fff;
                                cursor: pointer;
                            }
                        }  
                        &:hover{
                            .remove-mask{
                                opacity: 1;
                                visibility: visible;
                            }
                        } 
                    }
                    img{
                        width: 100%;
                        height: auto;
                        font-size: 0;
                    }
                }
            }
        }
        .d-textarea{
            box-sizing: border-box;
            padding: 10px;
            background: #f8f8f8;
            border: 1px solid #dbdbdb;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            p{
                color: #aaa;
            }
            .d-textarea-body{
                border: 1px solid #dbdbdb;
                margin:10px 0;
                width:100%;
                display: flex;
                flex-direction: column;
                textarea{
                    width:100%;
                    padding: 5px;
                    font-size: 12px;
                    font-family: 'microsoft yahei';
                    box-sizing: border-box;
                    border:none;
                }
                >p{
                    text-align: right;
                    background: #fff;
                    padding: 5px;
                    box-sizing: border-box;

                }
            }
            
        }
        .d-textarea-edit{
            overflow-y: auto;
        }
    }
</style>
