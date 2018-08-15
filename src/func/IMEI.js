import Vue from 'vue'
import imei from '../components/IMEI/index'
import HttpService from './httpService'
import bus from '../func/eventBus'

export const IMEI = {
    open({ch='',spdm='',ckdm=0}) {
        HttpService('/api/x6/queryCh.do',{
            ch:ch,
            spdm:spdm,
            ckdm:ckdm
        }).then(res=>{
            if(res.List.length==1){
                bus.$emit('imei-selected',res.List[0]);
            }else{
                const _imei=Vue.extend(imei);
                var dom=new _imei({
                    el:document.createElement('div'),
                    data:{
                        data:res.List
                    }
                });
                document.body.appendChild(dom.$el);
            }
        });
    }
}