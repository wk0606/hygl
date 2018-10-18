import Vue from 'vue'
import NOTIFY from '../components/notify/index'

export const notify={
    /**
     * 
     * @param {title} 标题
     * @param {context} 标题
     * @param {context} 消息内容
     * @param {top} 初始上边距
     * @param {duration} 显示时间，如果不设置或者=0将不会消失
     */
    open({title='提示',context,top=100,duration=3000}={}){
        var pointer=0;
        if(document.getElementsByClassName('c-notify').length>=4){
            document.body.removeChild(document.getElementsByClassName('c-notify')[0]);
        }
        for(let obj of document.getElementsByClassName('c-notify')){
            obj.style.top=top+pointer+'px';
            pointer+=obj.offsetHeight+10;
        }
        top+=pointer;
        const _notify=Vue.extend(NOTIFY);
        let n_dom=new _notify({
            el:document.createElement('div'),
            data:{
                title:title,
                context:context,
                top:top,
                duration:duration
            }
        });
        document.body.appendChild(n_dom.$el);
    }
}