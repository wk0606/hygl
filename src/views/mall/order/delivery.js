import Vue from 'vue'
import GOODS_FH from './order_wdfh/order_fh'
export const delivery={
    open(options){
        const goods_fh=Vue.extend(GOODS_FH);
        const ID=`fh-${Math.floor(Math.random()*10000000)}`;
        var dom=new goods_fh({
            el:document.createElement('div'),
            data:Object.assign({},{DomID:ID},options)
        });
        dom.$el.setAttribute('id',ID);
        document.body.appendChild(dom.$el);
    }
}
