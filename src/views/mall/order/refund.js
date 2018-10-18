import Vue from 'vue'
import ORDER from './order_qbdd/refund'

export const refund={
    open(options){
        const _order=Vue.extend(ORDER);
        const ID=`refund-${Math.floor(Math.random()*10000000)}`;
        var dom=new _order({
            el:document.createElement('div'),
            data:Object.assign({},{DomID:ID},options)
        });
        dom.$el.setAttribute('id',ID);
        document.body.appendChild(dom.$el);
    }
}