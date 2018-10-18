<template>
    <div class="input-imei" :style="{width:width}">
        <el-autocomplete
            size="mini"
            v-model.trim="ch"
            :fetch-suggestions="querySearch"
            :placeholder="placeholder"
            :disabled="disabled"
            @select="handlerInput"
            @input="handlerInput"
            @keyup.enter.native="keyUpEvent"
            @focus="openSlide"
            ref="component"
            need-empty
        >
            <template slot-scope="{ item }">
                <div style="font-size:12px;">{{ item.value }}</div>
            </template>
        </el-autocomplete>
    </div>
</template>
<script>
export default {
    props:{
        width:{default:'auto'},
        spdm:{default:''},
        ckdm:{default:0},
        disabled:{default:false},
        placeholder:{default:'请输入串号'},
        emptyText:{
            type:String,
            default:'暂无数据'
        }
    },
    data(){
        return {
            show:true,
            ch:'',
            List:[]
        }
    },
    watch:{
        ckdm(nv){
            this.ch='';
            this.$emit('update:text',this.ch);
            this.List=[];
        }
    },
    methods:{
        querySearch(queryString,cb){
            if(!this.List.length){
                this.$http('/api/x6/getKcchListBySpdm.do',{
                    spdm:this.spdm,
                    ckdm:this.ckdm
                }).then(res=>{
                    for(let obj of res.VO)
                        obj.value=obj.ch;
                    this.List=res.VO;
                    var results=queryString?this.createFilter(queryString,this.List):this.List;
                    cb(results);
                });
            }else{
                var results=queryString?this.createFilter(queryString,this.List):this.List;
                cb(results);
            }
        },
        createFilter(queryString,lists) {
            var temp=[];
            var reg=new RegExp('\S*'+queryString+'$','g');
            for(let obj of lists){
                if(reg.test(obj.value)){
                    temp.push(obj)
                }
            }
            return temp;
        },
        handlerInput(){
            this.$emit('update:text',this.ch);
        },
        keyUpEvent(){
            if(!this.List.length){
                this.$message('当前仓库中此商品无库存','error');
            }
            if(this.List.length==1){
                this.ch=this.List[0].ch;
                this.$emit('update:text',this.ch);
                this.$refs.autocomplate.activated=false;
            }
        },
        openSlide(){
            if(!this.List.length){
                let target=this.$refs.component.popperElm.children[0].children[0];
                const NAME='empty-suggestion-tip';
                if(target.children.length==1){
                    let empty=document.createElement('div');
                    empty.setAttribute('class',NAME);
                    empty.setAttribute('id',this.emptyId);
                    empty.innerText=this.emptyText;
                    target.appendChild(empty);
                }
            }
        }
    },
    mounted(){
        this.ch=this.text;
    }
}
</script>
<style lang="less" scoped>
    .input-imei{
        .el-input{
            width:100%;
        }
    }
</style>
