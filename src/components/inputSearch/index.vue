<template>
    <el-autocomplete
        v-model="name"
        size="mini"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容匹配商品"
        @select="handleSelect"
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
        }
    },
    data(){
        return {
            name:''
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
            console.log(temp);
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
        }
    }
}
</script>
<style lang="less" scoped>
    .custom-item{
        font-size: 12px;
    }
    .custom-flex{
        display: flex;
    }
    .hight-light{color:red;font-weight: bold;}
</style>
