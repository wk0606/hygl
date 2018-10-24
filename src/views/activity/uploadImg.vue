<template>
  <pop-up
    title="选择活动图片(推荐图片尺寸 500×500)"
    width="400"
    :views="views"
    cancelText="确定"
  >
    <div slot="content" class="content">
        <div class="img-body image-fixed">
            <b v-if="!path">请选择活动图片</b>
            <img v-else :src="path"/>
        </div>
        <div class="img-thumb">
            <span>如果不想上传图片可以选择我们提供的模板</span>
            <div
                v-for="(item,index) in thumbs"
                :key="index"
                @click="chooseTemplate(item)"
            >
                <img :src="item">
                <i v-if="item==path" class="el-icon-success"></i>
            </div>
        </div>
        <input type="file" ref="upload" style="display:none;" @change="uploadImg"/>
    </div>
    <el-button size="mini" type="warning" slot="footer" :loading="load" @click="selectImg">选择图片</el-button>
  </pop-up>
</template>
<script>
import popUp from '../../components/popUp/index'
export default {
  props:['views'],
  data(){
      return{
          load:false,
          path:'',
          thumbs:[
              'https://x3web.oss-cn-hangzhou.aliyuncs.com/hyactmb/1.jpeg',
              'https://x3web.oss-cn-hangzhou.aliyuncs.com/hyactmb/2.jpeg',
              'https://x3web.oss-cn-hangzhou.aliyuncs.com/hyactmb/3.jpeg',
              'https://x3web.oss-cn-hangzhou.aliyuncs.com/hyactmb/4.jpeg'
          ]
      }
  },
  methods:{
    selectImg(){
        this.$refs.upload.click();
    },
    uploadImg(){
        var file=this.$refs.upload.files[0];
        if(!/^image/.test(file.type)){
            this.$alert('请上传图片文件','提示',{type:'warning'});
        }else{
            this.load=true;
            var _file=new FormData();
            _file.append('file',file);
            this.$http('/api/x6/saveOtherPic.do',_file).then(res=>{
                this.load=false;
                this.path=res.file_path;
                this.$emit('change',res.file_path)
            },err=>{
                this.load=false;
            });
        }
    },
    chooseTemplate(url){
        this.path=url;
        this.$emit('change',url)
    }
  },
  mounted(){
      this.path=this.views.data;
  },
  components:{
      popUp
  }
}
</script>
<style lang="less" scoped>
    .content{
        width: 100%;
        text-align: center;
        
        .img-body{
            width: 380px;
            height: 380px;
            line-height: 380px;
            border-radius: 5px;
            background: #f0f0f0;
            color: #ccc;
            font-size: 30px;
            margin-bottom: 20px;
            display: inline-block;
            position: relative;
            >img{position: absolute;}
        }
        .img-thumb{
            display: flex;
            justify-content: space-between;
            position: relative;
            height: auto;
            box-sizing: border-box;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-top: 10px;
            div{
                width: 80px;
                height: 80px;
                border-radius: 4px;
                position: relative;
                cursor: pointer;
                i{
                    position: absolute;
                    top:0;
                    right: 0;
                    color: #4bd606;
                    font-size: 15px;
                }
            }
            img{
                width: 80px;
                height: 80px;
            }
            span{
                background: #fff;
                padding: 5px;
                position: absolute;
                top:-13px;
                left: 7px;
            }
        }
    }
</style>
