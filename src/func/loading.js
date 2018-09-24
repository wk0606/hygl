/**
 * 使用方法:
 *  import {Loading} from '.../path/...
 *  打开:Loading.open(options)
 *       options={
 *        target:xxx,要显示的位置，非必填(默认body)
 *        height:xxx,高度，非必填
 *        top:xxx，上边距，非必填
 *        text:xxx，提示文字，非必填
 *       }
 *  关闭 Loading.close()
 * 
 */
import Vue from 'vue'
import loading from '../components/loading/index'
export const Loading={
    LOAD_EL:'',
    PARENT:'',
    isCanAppend:false,
    open(options){
        if(this.isCanAppend){
            return;
        }
        this.isCanAppend=true;
        var options=options||{};
        var target;
        if(!options||!options.target){
            target=document.body;
        }else{
            target=options.target;
        }
        const load=Vue.extend(loading);
        this.LOAD_EL=new load({
            el:document.createElement('div'),
            data:{
                height:options.height+'px'||'',
                top:options.top||0,
                text:options.text||'拼命加载中...'
            }
        });
        this.PARENT=target;
        target.appendChild(this.LOAD_EL.$el);
    },
    close(){
        if(this.isCanAppend)
            this.PARENT.removeChild(this.LOAD_EL.$el);
        this.isCanAppend=false;
    }
};