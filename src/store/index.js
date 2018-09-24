import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        filterTable:{},
        count:1,
        user:{}
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
        }
    }
});