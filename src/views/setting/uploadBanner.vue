<template>
  <div>
    <pop-up
        title="Banner图上传 (推荐图片尺寸 1000×400)"
        width="400"
        :views="views"
    >
        <div class="content" slot="content">
            <p>该图显示在小程序的首页中,作为展示公司的文化窗户(<el-button type="text" size="small" @click='openPreview'>真机预览</el-button>)</p>
            <div :style="{backgroundImage:'url('+picUrl+')'}">
                <b v-if="!picUrl">暂未上传</b>
            </div>
            <p class="tips">如果没有合适的Bannner图，可以<span @click="openSet">点我</span>去定制个性化Banner</p>
            <input type="file" ref="upload" style="display:none;" @change="uploadBanner"/>
        </div>
        <el-button type="info" size="small" @click="selectImg" :loading="load" slot="footer">选择图片</el-button>
        <el-button type="danger" size="small" @click="removeImg" v-if="picUrl" slot="footer">删除图片</el-button>
    </pop-up>
    <preview v-if="preview.show" :views="preview"></preview>
    <set-banner v-if="banner.show" :views="banner" @success="setSuccess"></set-banner>
  </div>
</template>
<script>
import popUp from '../../components/popUp/index'
import preview from './preview'
import lrz from 'lrz'
import setBanner from './setBanner'
export default {
    props:['views'],
    data(){
        return{
            load:false,
            picUrl:'',
            picId:0,
            preview:{
                show:false,
                url:''
            },
            banner:{
                show:false,
                data:null
            }
        }
    },
    methods:{
        selectImg(){
            if(this.load)
                this.$message('正在上传,请稍后','warning');
            else
                this.$refs.upload.click();
        },
        uploadBanner(){
            var file=this.$refs.upload.files[0];
            if(!/^image/.test(file.type)){
                this.$alert('请上传图片文件','提示',{type:'warning'});
            }else{
                this.load=true;
                lrz(file).then(rst=>{
                    rst.formData.append('base64img', rst.base64);
                    this.$http('/api/x6/saveOtherPic.do',rst.formData).then(res=>{
                        this.$http('/api/x6/crmAddBanner.do',{
                            url:res.file_path
                        }).then(response=>{
                            this.$message('上传成功');
                            this.load=false;
                            this.picUrl=JSON.parse(response.VO.data).url;
                        },err=>{
                            this.load=false;
                        });
                    },err=>{
                        this.load=false;
                    });
                });
            }
        },
        removeImg(){
            this.$confirm('确认要删除此Banner图吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http('/api/x6/crmDelBanner.do',{
                    id:this.picId
                }).then(res=>{
                    this.$message('删除成功');
                    this.picUrl='';
                    this.picId=0;
                });
            }).catch(() => {
                          
            });
        },
        openPreview(){
            this.preview.show=true;
            this.preview.url=this.picUrl;
        },
        openSet(){
            this.banner.show=true;
        },
        setSuccess(path){
            this.picUrl=path;
            this.$http('/api/x6/crmAddBanner.do',{
                url:path
            }).then(response=>{
                this.$message('上传成功');
            });
        },
        close(){
            this.$refs.pop.hide(this,function(){
                this.views.name='';
            });
        }
    },
    mounted(){
        this.$http('/api/x6/crmGetBannerList.do',{}).then(res=>{
           if(res.List.length){
               this.picUrl=JSON.parse(res.List[0].data).url;
               this.picId=res.List[0].id;
           }
        });
    },
    components:{
        popUp,
        preview,
        setBanner
    }
}
</script>
<style lang="less" scoped>
    .content{
        box-sizing: border-box;
        position: relative;
        max-height: 600px;
        overflow-y: auto;
        >div{
            width: 100%;
            height: 130px;
            background: #f4f9f4;
            color: #bbb;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-size: cover;
            background-position: center center;
        }
        P{padding-bottom: 5px;}  
        .tips{
            margin-top: 15px;
            color:#999;
            span{
                color: #F56C6C;
                cursor: pointer;
                &:hover{
                    text-decoration: underline;
                }
            }
        }
    }
    .footer{
        box-sizing: border-box;
        padding: 10px;
        text-align: right;
        border-top:1px solid #ccc;
    }
</style>
