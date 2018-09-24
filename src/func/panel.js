import Vue from 'vue'
import PANEL from '../components/filter/index'
var dom=null;
export const panel={
    open(options={},target=document.body){
        if(!document.body.contains(document.getElementById('FILTER_PANEL'))){
            const _panel=Vue.extend(PANEL);
            dom=new _panel({
                el:document.createElement('div'),
                data:{
                    show:true,
                    top:options.top,
                    left:options.left,
                    datas:options.datas,//表格的原数据
                    column:options.column,//当前过滤的列
                    filterColumn:options.filterColumn,//页面中的指定属性（需手动注册此属性,名称必须一致）
                    formatter:options.formatter,//列的格式化方法
                }
            });
            document.body.appendChild(dom.$el);
        }else{
            dom.top=options.top;
            dom.left=options.left;
            dom.datas=options.datas;
            dom.column=options.column;
            dom.formatter=options.formatter;
        }
    }
}