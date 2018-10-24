import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const dptp=require('../assets/mjlogo.png')
export default new Vuex.Store({
    state:{
        filterTable:{},
        count:1,
        user:{},
        dptp:'',
    },
    getters:{
        getShopImg:state=>{
            return state.dptp||sessionStorage.getItem('dptpUrl')||dptp
        }
    },
    mutations:{
        updateFilterTable(state,obj){
            state.filterTable[obj.key]=obj.data;
        },
        updateCount(state,value){
            state.count=value;
        },
        updateUserInfo(state,data){
            state.user=data;
        },
        updateShopImg(state,data){
            sessionStorage.setItem('dptpUrl',data);
            state.dptp=data;
        }
    }
});