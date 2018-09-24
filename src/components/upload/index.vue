<template>
    <div
        class="m-upload"
    >
        <div
            :style="{width:width+'px',height:height+'px',backgroundImage:'url('+src+')'}"
            :class="{'m-upload-border':!src}"
            @click="selectFile"
        >
            <i class="el-icon-plus" v-if="!src"></i>
            <div class="m-loading" v-show="loading">
                <i class="el-icon-loading"></i>
            </div>
            <input type="file" ref="file" @change="uploadImg">
        </div>
        <span @click="selectFile">重新上传</span>
    </div>
</template>
<script>
import lrz from 'lrz'
export default {
    props:{
        width:{default:100},
        height:{default:100},
        action:{
            default:'/api/x6/saveOtherPic.do'//上传路径
        },
        src:{
            default:''//初始图片地址
        }
    },
    data(){
        return {
            loading:false
        }
    },
    methods:{
        selectFile(){
            if(!this.loading)
                this.$refs.file.click();
            else
                this.$message('图片正在上传,请稍后','error');
        },
        uploadImg(){
            this.loading=true;
            var file=this.$refs.file.files[0];
            this.$refs.file.value='';
            if(!/^image/.test(file.type)){
                this.$message('请上传图片文件','error');
            }else{
                lrz(file).then(rst=>{
                    this.loading=false;
                    rst.formData.append('base64img', rst.base64);
                    this.$http(this.action,rst.formData).then(res=>{
                        //this.$message('上传成功');
                        this.$emit('update:src',res.file_path);
                    },err=>{
                        this.loading=false;
                    });
                });
            }
        },
    }
}
</script>
<style lang="less" scoped>
    .m-upload{
        display: inline-flex;
        align-items: flex-end;
        justify-content: center;
        >div:nth-child(1){
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            cursor: pointer;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
            >i{
                font-size: 22px;
                color: #d3d3d3;
            }
            input{
                display: none;
            }
            .m-loading{
                position: absolute;
                top:0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,.8);
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
        } 
        >span{
            font-size: 12px;
            cursor: pointer;
            color: #409eff;
            margin-left: 10px;
        }
    }
    .m-upload-border{
        border: 1px dashed #d3d3d3;
    }
</style>
