<template>
  <pop-up
    title="个性化广告页"
    width="520"
    :views="views"
    confirmText="生成图片"
    :confirm="save"
    :loading="load"
  >
    <div class="content" slot="content">
        <div class="canvas-area">
            <canvas ref="cvs" width="1000" height="400"></canvas>
            <canvas class="cvs-top" ref="cvsText" width="1000" height="400"></canvas>
            <canvas class="cvs-top" ref="cvsLogo" width="1000" height="400"></canvas>
        </div>
        <div class="canvas-edit">
            <span>公司Logo</span>
            <el-button
                size="mini"
                icon="el-icon-upload"
                @click="selectLogo"
            >
                选择图片
            </el-button>
            <input type="file" ref="logo" style="display:none;" @change="uploadLogo">
        </div>
        <div
            class="canvas-edit"
            v-for="(item,index) in desc"
            :key="index"
            v-if="show"
        >
            <span>描述文字</span>
            <el-input
                style="width:250px;"
                size="mini"
                placeholder="请填写描述文字"
                v-model="item.cxt"
                @input="drawText(index)"
                clearable
            ></el-input>
            <i class="el-icon-circle-plus" v-if="index+1==desc.length" @click="addDesc"></i>
            <i class="el-icon-remove" v-else @click="removeDesc(index)"></i>
        </div>
    </div>
  </pop-up>
</template>
<script>
import popUp from '../../components/popUp/index'
import lrz from 'lrz'
export default {
  props:['views'],
  data(){
      return{
          show:false,
          logo:{
              path:'',
              sx:0,
              sy:0,
              w:0,
              h:0
          },
          desc:[
              {cxt:''}
          ],
          desc2:null,
          context:null,
          load:false,
          bg:require('../../assets/bg3.jpg')
      }
  },
  methods:{
      //绘制背景
      drawBackground(sx=0,sy=0,w=500,h=200){
          var canvas=this.$refs.cvs;
          var ctx=canvas.getContext('2d');
          ctx.scale(2,2);
          lrz(this.bg).then(res=>{
            var img=new Image();
            img.src=res.base64;
            img.onload=function(){
                ctx.drawImage(img,sx,sy,w,h);
            }
          });
          this.context=ctx;
      },
      addDesc(){
          this.desc.push({
              cxt:''
          });
      },
      removeDesc(index){
          this.desc.splice(index,1);
          this.drawText();
      },
      //绘制文字
      drawText(){
          var canvas=this.$refs.cvsText;
          var ctx=canvas.getContext('2d');
          const max_w=200;//文字最大的宽度
          var st=100;
          ctx.clearRect(0,0,1000,400);
          var g=ctx.createLinearGradient(0,0,500,200);
          g.addColorStop(0,'#408aca');
          g.addColorStop(1,'#33a4d7');
          ctx.fillStyle=g;
          ctx.textBaseline='top';
          ctx.font='30px heiti';
          this.desc2=[];
          const max=15;
          for(let i=0;i<this.desc.length;i++){
              var txt=this.desc[i].cxt.trim();
              if(txt.length>max){
                for(let i=0;i<txt.length;i+=max){
                   this.desc2.push(txt.substring(i,i+max));
                }
              }else{
                this.desc2.push(txt);
              }
          }
          var init=this.logo.sy+this.logo.h/2-this.desc2.length*20;
          for(let i=0;i<this.desc2.length;i++){
              var sy=init+i*40;
              ctx.fillText(this.desc2[i],this.logo.sx+this.logo.w+30,sy);
          }
      },
      drawLogo(){
          var canvas=this.$refs.cvsLogo;
          var ctx=canvas.getContext('2d');
          ctx.clearRect(0,0,1000,400);
          var img = new Image();
          img.src = this.logo.path;
          var _this=this;
          img.onload=function(){
            _this.logo.w=150;
            _this.logo.h=img.height*_this.logo.w/img.width;
            _this.logo.sx=100;
            _this.logo.sy=200-_this.logo.h/4;
            ctx.drawImage(img, _this.logo.sx, _this.logo.sy, _this.logo.w, _this.logo.h);
            _this.show=true;
          }   
      },
      selectLogo(){
          this.$refs.logo.click();
      },
      uploadLogo(){
        var file=this.$refs.logo.files[0];
        if(!/^image/.test(file.type)){
            this.$alert('请上传图片文件','提示',{type:'warning'});
        }else{
            var _this=this;
            var reader = new FileReader();
            reader.readAsDataURL(file);//转化成base64数据类型
            reader.onload = function(e){
                _this.logo.path=this.result;
                _this.drawLogo();
            }
        }
      },
      save(){
          this.load=true;
          this.$refs.cvsLogo.style.display='none';
          this.$refs.cvsText.style.display='none';
          var img = new Image();
          img.src = this.logo.path;
          var _this=this;
          _this.context.scale(.5,.5);
          img.onload=function(){
            _this.context.drawImage(img, _this.logo.sx, _this.logo.sy, _this.logo.w, _this.logo.h);
            var init=_this.logo.sy+_this.logo.h/2-_this.desc2.length*20;
            var g=_this.context.createLinearGradient(0,0,500,200);
            g.addColorStop(0,'#408aca');
            g.addColorStop(1,'#33a4d7');
            _this.context.fillStyle=g;
            _this.context.textBaseline='top';
            _this.context.font='30px heiti';
            for(let i=0;i<_this.desc2.length;i++){
                var sy=init+i*40;
                _this.context.fillText(_this.desc2[i],_this.logo.sx+_this.logo.w+30,sy);
            }
            var base64=_this.$refs.cvs.toDataURL('image/jpeg').split(',')[1];
            _this.$http('/api/x6/saveOtherPicByBase64.do',{
                imgStr:base64,
                extname:'jpeg'
            }).then(res=>{
                _this.load=false;
                _this.$emit('success',res.file_path);
                _this.views.show=false;
            },err=>{
                _this.load=false;
            })
          }  
      }
  },
  mounted(){
      this.drawBackground();
  },
  components:{
      popUp
  }
}
</script>
<style lang="less" scoped>
    .canvas-area{
        zoom:0.5;
        position: relative;
        .cvs-top{
            background: rgba(0,0,0,0);
            position: absolute;
            top:0;
            left:0;
        }
    }
    .canvas-edit{
        margin: 15px 0 10px 0;
        display: flex;
        align-items: center;
        >span{
            margin-right: 10px;
            &:before{
                content: '*';
                color: red;
            }
        }
        >i{
            font-size: 20px;
            cursor: pointer;
            margin-left: 10px;
            color:#409EFF;
        }
    }
</style>
