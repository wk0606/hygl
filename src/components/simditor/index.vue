<template>
  <textarea ref="simditor"></textarea>
</template>
<script>
import Simditor from 'simditor'
export default {
 props:{
     toolbar:{
         default:false
     },
     placeholder:{
         default:'请输入文字...'
     },
     value:{
         default:''
     },
     uploadUrl:{
         default:'/api/x6/saveMsgMainFile.do'
     }
 },
 data(){
     return{
         editor:'',
         url:''
     }
 },
 methods:{
     initialEditor(){
         let _this=this;
         this.editor=new Simditor({
             textarea:this.$refs.simditor,
             placeholder:this.placeholder,
             toolbar: this.toolbar,
             toolbarFloat:true,
             pasteImage: true,
             allowedTags:['br', 'span', 'a', 'img', 'b', 'strong', 'i', 'strike', 'u', 'font', 'p', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'hr','table','thead','tbody','th','tr','td'],
             upload:{
                url:_this.url,
                params: null,
                fileKey: 'upload_file',
                connectionCount: 1,
                leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
             }
         });
         this.editor.on('valuechanged',()=>{
             this.$emit('input',this.editor.getValue());
         });
     },
     setEditContent(cnt){
         this.editor.setValue(cnt);      
     },
     clearContent(){
        this.editor.setValue('');
     }
 },
 mounted(){
     this.initialEditor();
     this.editor.setValue(this.value);
     //this.editor.blur=this.changeValue();
 },
 created(){
     this.url=this.$util.getServerUrl()+this.uploadUrl;
 }
}
</script>
<style lang="less" scoped>
    @import '../../../node_modules/simditor/styles/simditor.css';
</style>
