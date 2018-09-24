<template>
  <div class="cropping">
      <div>
          <p>
              <span>头像裁剪</span>
              <i class="el-icon-close" @click.self="close"></i>
          </p>
          <div class="cropping-container">
              <!-- 裁剪区域 -->
              <div class="crop">
                  <div ref="crop">
                      <img :width="img_width" :height="img_height" :src="path"/>
                      <!-- 实际上不显示 -->
                      <!-- <canvas id="canvas" width="290" height="180" style="display:none;">Your browser does not support the HTML5 canvas tag.</canvas> -->
                      <canvas id="canvas" width="290" height="290" style="display:none;">Your browser does not support the HTML5 canvas tag.</canvas>
                      <!-- 裁剪框 -->
                      <div class="clip" @mouseup="resizeUp">
                          <div
                            :style="{width:init_w+'px',height:init_h+'px',top:init_t+'px',left:init_l+'px'}"
                          >
                              <div class="viewbox"
                                @mousedown="down"
                                @mousemove="move"
                                @mouseup="up"
                                @mouseleave="up"
                              >
                                  <img :width="img_width" :height="img_height" :src="path" :style="{marginLeft:mLeft+'px',marginTop:mTop+'px'}"/>
                              </div>
                              <div class="resize"
                                @mousedown.stop="resizeDown"
                                @mousemove.stop="resize"
                                @mouseup.stop="resizeUp"
                              ></div>
                          </div>
                      </div>
                  </div>
              </div>
              <!-- 预览区域 -->
              <div class="preview">
                  <b>预览</b>
                  <div class="preview-div large">
                      <canvas id="large" width="290" height="290"></canvas>
                  </div>
                  <p>50*50</p>
                  <div class="preview-div small">
                      <canvas id="small" width="290" height="290"></canvas>
                  </div>
                  <p>40*40</p>
                  <div class="preview-div mini">
                      <canvas id="mini" width="290" height="290"></canvas>
                  </div>
                  <p>30*30</p>
              </div>
          </div>
          <div class="footer">
              <el-button size="small" type="primary" @click="restart" :disabled="is_upload">重新选择</el-button>
              <el-button size="small" type="warning" @click="upload" :loading="load">上传</el-button>
          </div>
          <!-- file控件 -->
          <input type="file" ref="RE_FILE" @change="selectImage" style="display:none;"/>
      </div>
  </div>
</template>
<script>
var distanceX=0;
var distanceY=0;
export default {
    props:['views'],
    data(){
        const INIT_SIZE=100;
        return{
            image:'',//全局image对象
            path:'',//转base64之后的路径
            init_w:INIT_SIZE,//viewbox初始宽
            init_h:INIT_SIZE,//viewbox初始高
            init_w2:INIT_SIZE,//拷贝viewbox初始top
            init_h2:INIT_SIZE,//拷贝viewbox初始left
            init_t:distanceY,//viewbox初始top
            init_l:distanceX,//viewbox初始left
            sign:false,//viewbox拖拽标志 true可拖拽 false不可拖拽
            sign2:false,//resize拖拽标志 true可拖拽 false不可拖拽
            location:{sx:0,sy:0,sx2:0,sy2:0},//记录viewbox和resizemousedown的pagex,pagey
            img_width:'0px',//遮罩中图片的初始宽
            img_height:'0px',//遮罩中图片的初始高
            mLeft:-2,//遮罩中图片的初始left
            mTop:-2,//遮罩中图片的初始top
            max_resize:0,// 保存宽和高最大的值--取img宽和高中的最小值
            proportion:0,//保存图片宽和高的比
            min_resize:116,// 保存宽和高最小的值--默认
            _s:0,//记录拖拽时候的距离
            extname:'',//选择文件的扩展名,
            load:false,//上传按钮loading状态
            is_upload:false,//记录是否正在上传
        }
    },
    methods:{
        //获取选取的图像--转成base64
        createImage(file,callback){
            var reader=new FileReader();
            reader.readAsDataURL(file);
            reader.onload=(e)=>{
                this.drawImg(e.target.result,callback);
            }
        },
        //绘制图像
        drawImg(result,callback){
            const SIZE=290;
            var canvas=document.getElementById('canvas');
            var ctx=canvas.getContext('2d');
            ctx.clearRect(0,0,290,290);
            this.image=new Image();
            this.image.src=result;
            this.path=result;
            this.image.onload=()=>{
                var w=this.image.width;
                var h=this.image.height;
                this.proportion=w/h;
                var _w,_h;
                if(w>h){
                    _w=SIZE;
                    _h=parseInt(SIZE*h/w);
                    this.init_w=_h;
                    this.init_h=_h;
                    this.max_resize=_h;
                }else if(w<h){
                    _h=SIZE;
                    _w=parseInt(SIZE*w/h);
                    this.init_w=_w;
                    this.init_h=_w;
                    this.max_resize=_w;
                }else{
                    _w=SIZE;
                    _h=SIZE;
                    this.init_w=SIZE;
                    this.init_h=SIZE;
                    this.max_resize=_h;
                }
                this.init_w2=this.init_w;
                this.init_h2=this.init_h;
                this.$refs.crop.style.width=_w+'px';
                this.$refs.crop.style.height=_h+'px';
                this.img_width=_w+'px';
                this.img_height=_h+'px';
                ctx.drawImage(this.image,0,0,_w,_h);
                if(callback){
                    var points=callback();
                    this.previewImage(canvas,points,0,0,_w,_h);
                }
            }
        },
        //拖拽移动viewbox位置
        down(event){
            this.sign=true;
            this.location.sx=event.pageX;
            this.location.sy=event.pageY;
        },
        move(event){
            if(this.sign){
                var mx=event.pageX-this.location.sx;
                var my=event.pageY-this.location.sy;
                //检测拖动范围不可超出可见区域
                if(my+distanceY<0){
                    this.init_t=0
                }else if(my+distanceY+this.init_h>parseInt(this.img_height)){
                    this.init_t=parseInt(this.img_height)-this.init_h;
                }else{
                   this.init_t=my+distanceY;
                }
                if(mx+distanceX<0){
                    this.init_l=0; 
                }else if(mx+distanceX+this.init_w>parseInt(this.img_width)){
                    this.init_l=parseInt(this.img_width)-this.init_w;
                }else{
                    this.init_l=mx+distanceX; 
                }
                //移动img
                this.mLeft=-this.init_l-2; 
                this.mTop=-this.init_t-2;
                //绘制预览的图像
                var points=this.getClipArea();
                var canvas=document.getElementById('canvas');
                this.previewImage(canvas,points,0,0);
            }
        },
        up(){
            this.sign=false;
            distanceX=this.init_l;
            distanceY=this.init_t;
        },
        //拖拽改变viewbox大小
        resizeDown(event){
            this.sign2=true;
            this.location.sx2=event.pageX;
            this.location.sy2=event.pageY;
        },
        resize(event){
            if(this.sign2){
                var rx=event.pageX-this.location.sx2;
                var ry=event.pageY-this.location.sy2;
                //console.log(rx,ry)
                //保证拖动之后是一个圆形
                if(rx>ry)
                    this._s=rx;
                else if(rx<ry)
                    this._s=ry;
                else
                    this._s=rx;
                //this._s/=3
                if(this.proportion>=1){
                    if(this._s+this.init_h2+this.init_t>this.max_resize){
                        this.init_h=this.max_resize+this.init_t;
                    }else if(this._s+this.init_h2<this.min_resize){
                        this.init_h=this.min_resize;
                    }else{
                        this.init_h=this.init_h2+this._s;
                    }
                    this.init_w=this.init_h;
                }else{
                     if(this._s+this.init_w2+this.init_l>this.max_resize){
                        this.init_w=this.max_resize+this.init_t;
                    }else if(this._s+this.init_w2<this.min_resize){
                        this.init_w=this.min_resize;
                    }else{
                        this.init_w=this.init_w2+this._s;
                    }
                    this.init_h=this.init_w;
                }
                //绘制预览的图像
                var points=this.getClipArea();
                var canvas=document.getElementById('canvas');
                this.previewImage(canvas,points,0,0);
            }
        },
        resizeUp(){
            this.sign2=false;
            this.init_w2=this.init_w;
            this.init_h2=this.init_h;
        },
        //获取要裁剪的区域
        getClipArea(){
            var sx,sy,cx,cy;
            if(this.init_t<=0&&this.init_l<=0){
                sx=0;sy=0;
                cx=this.init_w+this.init_l;
                cy=this.init_h+this.init_t;
            }else if(this.init_t>0&&this.init_l<=0){
                sx=0;sy=this.init_t;
                cx=this.init_w+this.init_l;
                cy=this.init_h;
            }else if(this.init_t<=0&&this.init_l>0){
                sx=this.init_l;sy=0;
                cx=this.init_w;
                cy=this.init_h+this.init_t;
            }else{
                sx=this.init_l;
                sy=this.init_t;
                cx=this.init_w;
                cy=this.init_h;
            }
            return {
                sx:sx,
                sy:sy,
                cx:cx,
                cy:cy
            }
        },
        //预览图片
        previewImage(target,points,dx,dy,w,h){
            //依次获取3个canvas对象
            var large=document.getElementById('large');
            var small=document.getElementById('small');
            var mini=document.getElementById('mini');
            //依次获取绘图环境
            var large_ctx=large.getContext('2d');
            var small_ctx=small.getContext('2d');
            var mini_ctx=mini.getContext('2d');
            //依次清空画布
            large_ctx.clearRect(0,0,290,290);
            small_ctx.clearRect(0,0,290,290);
            mini_ctx.clearRect(0,0,290,290);
            //依次绘制图像
            large_ctx.drawImage(target,points.sx,points.sy,points.cx,points.cy,dx,dy,290,290);
            small_ctx.drawImage(target,points.sx,points.sy,points.cx,points.cy,dx,dy,290,290);
            mini_ctx.drawImage(target,points.sx,points.sy,points.cx,points.cy,dx,dy,290,290);
        },
        //上传图片至服务器  
        upload(){
            var large=document.getElementById('large');
            var large_ctx=large.getContext('2d');
            this.load=true;
            var base64=large.toDataURL().split(',')[1];
            this.is_upload=true;
            this.$http('/api/x6/saveUserPicBase64.do',{
                imgStr:base64,
                extname:this.extname
            }).then(res=>{
                /***
                 * 这只是第一步
                 * 成功之后要调用保存的接口
                 */
                this.is_upload=false;
                this.$emit('saveHeaderPic',res.fileProp.showPath);
            },err=>{
                this.load=false;
                this.is_upload=false;
            });
        },
        //重新选择图片
        restart(){
            this.$refs.RE_FILE.click();
        },
        //获取重选的文件
        selectImage(){
            var file=this.$refs.RE_FILE.files[0];
            var checked=this.views._fn(file);
            if(checked){
                this.reset();
                this.extname=file.type.split('/')[1];
                this.createImage(file,this.getClipArea);
            }
        },
        //如果正在上传提示
        setTipsForUpload(){
            this.$confirm('当前图片正在上传,如果关闭可能导致保存失败!','提示',{
                type:'warning'
            })
            .then(_ => {
                this.$emit('clearFile');
                this.views.show=false;
            })
            .catch(_ => {});
        },
        //初始化变量
        reset(){
            distanceX=0;
            distanceY=0;
            this.init_t=distanceY;
            this.init_l=distanceX;
            this.mLeft=-2;
            this.mTop=-2;
        },
        //关闭
        close(){
            //清空选取的文件
            if(this.is_upload){
                this.setTipsForUpload();
            }else{
                this.$emit('clearFile');
                this.views.show=false;
            }
        }
    },
    created(){
        this.extname=this.views.files.type.split('/')[1];
        this.createImage(this.views.files,this.getClipArea);
    }
}
</script>
<style lang="less" scoped>
    @import './header-cropping.less';
</style>
