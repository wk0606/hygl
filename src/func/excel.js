import Vue from 'vue'
import EXCEL from '../components/excel/index'
export const excel={
    open(options={}){
        const _excel=Vue.extend(EXCEL);
        var dom=new _excel({
            el:document.createElement('div'),
            data:{
                fileName:options.fileName,
                title:options.title,
                condition:options.conditions,
                columns:options.columns||[],
                data:options.data||[],
                show:true
            }
        });
        document.body.appendChild(dom.$el);
    }
}