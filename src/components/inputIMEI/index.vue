<template>
    <div class="input-imei" :style="{width:width}">
        <el-input
            v-if="show"
            size="mini"
            :disabled="disabled"
            v-model.trim="text"
            placeholder="请输入串号"
            @focus="show=false"
        ></el-input>
        <el-input
            v-else
            size="mini"
            v-model.trim="ch"
            placeholder="请输入串号"
            :disabled="disabled"
            @keyup.enter.native="openIMEI"
            @input="handlerInput"
        ></el-input>
    </div>
</template>
<script>
import {IMEI} from '../../func/IMEI'
import bus from '../../func/eventBus'

export default {
    props:{
        width:{default:'auto'},
        spdm:{default:''},
        ckdm:{default:0},
        text:{default:''},
        disabled:{default:false}
    },
    data(){
        return {
            show:true,
            ch:''
        }
    },
    methods:{
        openIMEI(){
            IMEI.open({
                ch:this.ch,
                spdm:this.spdm,
                ckdm:this.ckdm
            });
        },
        handlerInput(){
            this.$emit('input',this.ch);
        }
    },
    mounted(){
        bus.$on('imei-selected',({ch})=>{
            this.$emit('selected',ch);
            this.ch='';
            this.show=true;
        });
    }
}
</script>
<style lang="less" scoped>
    .input-imei{
        .el-input{
            width:100%;
        }
    }
</style>
