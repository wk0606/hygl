import axios from 'axios'
import util from './util'
import {Message} from 'element-ui'

const service=axios.create({
    baseURL:util.getBaseUrl(),
    timeout:60000,
    headers:{
        token:util.getTokenid()
    }
});

const HttpService=function(url, options){
    var promise = new Promise(function (resolve, reject) {
        service.post(url,options).then(res=>{
            if (res.data.result == 'ok') {
                resolve(res.data)
            }else if(res.data.result == 'timeout'){
              Message({
                  message:'登录超时,请重新登录365',
                  type:'error'
              });
            }else {
                Message({
                    message:res.data.message,
                    type:'error'
                });
                reject(res.data)
            }
        }).catch(err=>{
            Message({
                message:'未知错误',
                type:'error'
            });
            reject(err);
        });
    });
    return promise;
}
export default HttpService;