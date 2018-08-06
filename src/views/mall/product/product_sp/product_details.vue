<template>
  <div class="details-body" :style="{height:height+'px'}">
      <div
        :style="{width:width+'px'}"
        class="d-preview"
      >
        <img src="../../../../assets/mobilenav.png" alt="">
        <div class="d-main">
            <div class="d-header">
                <p><b>基本信息区</b></p>
                <p>固定样式,显示商品主图、价格等信息</p>
            </div>
            <div class="d-img">
                <div
                    v-for="(img,index) in details.xqtp"
                    :key="index"
                >
                    <img :src="img" alt="">
                    <div class="remove-mask"><i class="el-icon-delete" @click="removeImg(img,index)"></i></div>
                </div>
            </div>
        </div>
      </div>
      <div
        :style="{width:width+'px'}"
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
        <div>
            <el-button
                size="mini"
                icon="el-icon-upload"
                @click="openFile"
                :loading="imgLoading"
            >上传商品详情图片</el-button>
            <input type="file" ref="file" multiple="multiple" style="display:none;" @change="uploadImgs">
        </div>
      </div>
  </div>
</template>
<script>
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
      save(yxbz){
          if(!this.details.spmd){
              this.$message('请填写商品卖点','error');
              return;
          }
          if(!this.details.xqtp.length){
              this.$message('请上传详情图片','error');
              return;
          }
          if(this.details.id==-1)
            this.details.id=-1;
          if(yxbz!==undefined)
            this.details.yxbz=yxbz;
          var params=JSON.parse(JSON.stringify(this.details));
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
          delete params.spList;
          this.$http('/api/x6/hySetSpxxSave.do',params).then(res=>{
            this.removeStorage();
            this.$message(yxbz===undefined?'编辑成功':yxbz===0?'上架成功':'下架成功');
            this.$router.push('/main/mallchildren/product_sp');
          });
      },
      removeStorage(){
        var key1 = this.$route.params.id == -1 ? "MYHZ_SPXX_ADD" : "MYHZ_SPXX_EDIT";
        var key2 = this.$route.params.id == -1 ? "MYHZ_SPGG_ADD" : "MYHZ_SPGG_EDIT";
        this.$util.removeCache(key1);
        this.$util.removeCache(key2);
        this.$util.removeCache('MYHZ_PRODUCT_TAB');
      }
  },
  mounted(){
      this.width=9*this.height/16;
  },
  activated(){
      this.width=9*this.height/16;
  }
}
</script>
<style lang="less" scoped>
    @bgcolor:#ddd;
    .details-body{
        display: flex;
        justify-content: center;
        height: 100%;
        box-sizing: border-box;
        padding-top: 10px;
        min-height: 480px;
        overflow-y: auto;
        >div{
            height: 100%;
            margin: 0 10px;
            box-sizing: border-box;
            overflow-y: auto;
        }
        //border: 1px solid @bgcolor;
        .d-preview{
            border: 1px solid @bgcolor;
            >img{
                width: 100%;
                height: auto;
            }
            .d-main{
                height: ~"calc(100% - 44px)";
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
                .d-img{
                    box-sizing: border-box;
                    padding: 10px;
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
