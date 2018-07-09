import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        filterTable:{}
    },
    mutations:{
        updateFilterTable(state,obj){
            state.filterTable[obj.key]=obj.data;
        }
    }
});