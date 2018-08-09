import Vue from 'vue'
import EXCEL from '../components/excel/index'
export const excel = {
    open(options = {}) {
        const _excel = Vue.extend(EXCEL);
        var dom = new _excel({
            el: document.createElement('div'),
            data: {
                fileName: options.fileName,
                title: options.title,
                condition: options.conditions,
                columns: options.columns || [],
                data: options.data || [],
                show: true,
                exportFlag: options.exportFlag || 0,//到出标志 如果为1表示导出数据需要后台查询
                paramData: options.paramData || '',
                url:options.url
            }
        });
        document.body.appendChild(dom.$el);
    }
}