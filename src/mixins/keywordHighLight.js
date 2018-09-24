import py from '../func/pinyin'

export default{
    data(){
        return {

        }
    },
    methods: {
        /**
         * 匹配字符位置
         * @param target  匹配字符串
         * @param str 被匹配字符串
         */
        matchCharForIndex(target,str){
            var temp=[];
            var zjm=py.GetPY(target).toLowerCase();
            var str=str.toLowerCase();
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
        //根据索引数组分割字符串
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
          //根据关键字分割字符串
          splitStrByKeyWords(keywords,target){
            var k=py.GetPY(keywords).toLowerCase();
            var t=py.GetPY(target).toLowerCase();
            var p=t.indexOf(k);
            return [
              {isred:false,value:target.substring(0,p)},
              {isred:true,value:target.substring(p,p+keywords.length)},
              {isred:false,value:target.substring(p+keywords.length)},
            ]
          },
          //值匹配首字母
          filterOfFirstLetter(array,letter,key){
            let char=letter.toLowerCase();
            let temp=[];
            for(let obj of array){
                let str=key?obj[key]:obj;
                if(!char){
                    temp.push(obj);
                }else {
                    if(py.GetPY(str)[0]==char)
                        temp.push(obj);   
                }        
            }
            return temp;
          }
    }
}