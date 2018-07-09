import axios from 'axios'
import util from './util'
import {Message} from 'element-ui'
axios.defaults.headers.common['token'] = util.getTokenid();
axios.defaults.baseURL = util.getServerUrl()||'https://b.miya365.com/x3.0';
axios.defaults.timeout = 1000 * 60;
export function $http(url, options){
    var promise = new Promise(function (resolve, reject) {
        axios.post(url, options).then((res) => {
            if (res.data.result == 'ok') {
                resolve(res.data)
            } else {
                Message({
                    message:res.data.message,
                    type:'error'
                });
                reject(res.data)
            }
        }).catch((err) => {
            Message({
                message:'未知错误',
                type:'error'
            });
            reject(err);
        });
    });
    return promise;
}