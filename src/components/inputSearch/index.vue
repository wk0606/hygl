<template>
    <el-autocomplete
        v-model="name"
        size="mini"
        :fetch-suggestions="querySearch"
        :placeholder="placeholder"
        @select="handleSelect"
        @focus="openSlide"
        @custom-clear="clear"
        ref="component"
        need-empty
        clearable
    >
        <template slot-scope="{ item }">
            <div v-if="!item.text" class="custom-item">{{ item.name }}</div>
            <div v-else class="custom-item custom-flex">
                <div
                    v-for="c in item.text"
                    :class="{'hight-light':c.isred}"
                >{{c.value}}</div>
            </div>
        </template>
    </el-autocomplete>
</template>
<script>
import py from '../../func/pinyin'
export default {
    props:{
        data:{//搜索源数据
            default:function(){
                return [];
            }
        },
        placeholder:{
            default:'请输入内容匹配商品'
        },
        emptyText:{
            type:String,
            default:'暂无数据'
        }
    },
    data(){
        return {
            name:'',
        }
    },
    methods:{
        handleSelect(item){
            this.name=item.name;
            this.$emit('change',{
                id:item.id,
                name:item.name
            });
        },
        clear(){
            this.handleSelect({
                id:'',
                name:''
            });
            this.$refs.component.$children[0].blur();
            this.$refs.component.activated = false;
        },
        // Begin
        // !!!!
        // !!!!
        // !!!!
        // 构建列表项相关
        // !!!!
        // !!!!
        // !!!!
        querySearch(queryString,cb){
            var lists=this.data;
            var results=queryString?this.createFilter(queryString,lists):lists;
            cb(results);
        },
        createFilter(queryString,lists) {
            var temp=[];
            for(let obj of lists){
                let matchInfo=this.matchCharForIndex(obj.name,queryString);
                if(matchInfo.flag){
                    temp.push({
                        id:obj.id,
                        name:obj.name,
                        text:this.splitStrByArray(matchInfo.index,obj.name)
                    });
                }
            }
            return temp;
        },
        matchCharForIndex(target,queryString){
            var temp=[];
            var zjm=py.GetPY(target).toLowerCase();
            var str=queryString.toLowerCase();
            for(let i=0;i<str.length;i++){
                let pointer=temp.length?temp[temp.length-1]+1:0;
                let charIndex=(/[\u4e00-\u9fa5]/.test(str[i])?target:zjm).indexOf(str[i],pointer);
                if(charIndex>-1)
                    temp.push(charIndex);
                else{
                    return {
                        flag:false
                    }
                }
            }
            return {
                flag:true,
                index:temp
            }
        },
        splitStrByArray(array,target){
            if(!array)
                return '';
            var temp=[];
            var [start,end]=[0,0];
            for(let i=0;i<array.length;i++){
             if(i==0){
               start=0;
               end=array[i];
             }else{
               start=end+1;
               end=array[i];
             }
             temp.push({
                isred:false,
                value:target.substring(start,end)
              });
              temp.push({
                isred:true,
                value:target.charAt(end)
              });
            }
            if(array[array.length-1]<target.length){
              temp.push({
                isred:false,
                value:target.substring(array[array.length-1]+1)
              });
            }
            return temp;
        },
        openSlide(){
            if(!this.data.length){
                let target=this.$refs.component.popperElm.children[0].children[0];
                const NAME='empty-suggestion-tip';
                if(target.children.length==1){
                    let empty=document.createElement('div');
                    empty.setAttribute('class',NAME);
                    //empty.setAttribute('id',this.emptyId);
                    empty.innerText=this.emptyText;
                    target.appendChild(empty);
                }
            }
        }
    },
    mounted(){
        //this.emptyId=`empty-suggestion-${Math.floor(Math.random()*100000000000)}`;
    }
}
</script>
<style lang="less" scoped>
    .custom-item{
        font-size: 12px;
        word-break: break-all;
        white-space: normal;
        flex-wrap: wrap;
        line-height: 18px;
        padding: 5px 0;
    }
    .custom-flex{
        display: flex;
    }
    .hight-light{color:red;font-weight: bold;}
</style>
