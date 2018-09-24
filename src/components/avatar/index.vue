<template>
  <div class="avatar">
    <div
      class="a-header"
      :style="{width:width_map[size],height:width_map[size],borderRadius:radius[type],backgroundImage:'url('+src+')'}"
      :class="{'a-upload':needUpload!==false}"
      @click="selectFile"
    >
      <span v-if="!src">{{label.substring(label.length-2)}}</span>
    </div>
    <span class="label" v-if="needLabel!==false">{{label}}</span>
    <!-- file控件 -->
    <input type="file" accept="image/jpeg,image/png,image/jpg" class="file" ref="FILE"
           @change="getImages"/>
    <!-- 裁剪窗口 -->
    <cropping v-if="model.show" :views="model" @clearFile="clearFile" @saveHeaderPic="saveHeaderPic"
              ref="clip"></cropping>
  </div>
</template>
<script>
  import cropping from './header-cropping'
  export default {
    props: {
      size: {default: 'mini'},//大小--50/40/30px
      type: {default: 'circle'},//外观--圆角矩形/圆形
      border: {default: false},//边框--默认无
      src: {default: ''},//图片-
      label: {default: ''},//姓名
      needUpload:{default:false},//是否需要上传功能
      needLabel:{default:false},//是否需要标签（头像款右侧部分）
    },
    data() {
      const WIDTH_MAP = {
        'small': '40px',
        'large': '50px',
        'mini': '30px'
      }
      const RADIUS = {
        'square': '5px',
        'circle': '50%'
      }
      return {
        width_map: WIDTH_MAP,
        radius: RADIUS,
        model: {
          show: false,
          files: '',
          _fn: ''
        }
      }
    },
    watch: {
      'model.show': function (nv) {
        if (!nv) {
          this.$refs.clip.reset();
        }
      }
    },
    methods: {
      //点击上传触发file选择
      selectFile() {
        if(this.needUpload!==false)
          this.$refs.FILE.click();
      },
      //获取选择到的文件
      getImages() {
        var file = this.$refs.FILE.files[0];
        if (this.checkFileType(file)) {
          this.model.show = true;
          this.model.files = file;
          this.model._fn = this.checkFileType;
        }
      },
      //校验文件类型
      checkFileType(file) {
        if (!/^image\/[jp]/.test(file.type)) {
          this.$alert('请选择jpg或png格式的图片', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
          return false;
        } else {
          return true;
        }
      },
      clearFile() {
        this.$refs.FILE.value = '';
      },
      /***
       * 保存修改图片--要更新本地
       * src===false是自己 否则是他人
       */
      saveHeaderPic(newpic) {
        console.log(newpic)
      },
    },
    components: {cropping}
  }
</script>
<style lang="less" scoped>
  .avatar{
        display:flex;
        align-items: center;
        width: auto;
        .label{
            font-size: 13px;
            margin-left: 5px;
        }
  }
  .a-header {
    background: #26bf8c;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    box-sizing: border-box;
    span {
      font-size: 14px;
      color: #fff;
    }
  }
  .a-upload{
    cursor: pointer;
    &:before {
      content: '上传';
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .8);
      position: absolute;
      top: 0;
      left: 0;
      border-radius: inherit;
      font-size: 12px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      opacity: 0;
    }
    &:hover:before {
      opacity: 1;
    }
  }
  .file {
    display: none;
  }
</style>
