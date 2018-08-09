<template>
    <pop-up
        title="网店发货"
        width="400"
        :views="views"
        :confirm="save"
    >
        <div slot="content" class="content">
            <el-form
                :model="details"
                :rules="rules"
                ref="form"
                label-width="85px"
            >
                <el-form-item
                    label="发货单号"
                    prop="fhdh"
                >
                    <el-input size="mini" v-model="details.fhdh" placeholder="请输入发货单号"></el-input>
                </el-form-item>
                <el-form-item
                    label="串号"
                    prop="ch"
                    required
                    v-if="views.lx"
                >
                    <el-input size="mini" v-model="ch" placeholder="请输入商品串号"></el-input>
                </el-form-item>
                <el-form-item
                    label="仓库"
                    prop="ckdm"
                    v-if="!views.lx"
                >
                    <company-select :changeOnSelect="false" width="280px" @change="handleCk"></company-select>
                </el-form-item>
            </el-form>
        </div>
    </pop-up>
</template>
<script>
import popUp from '../../../../components/popUp/index'
import companySelect from '../../../../components/companySelect/index'
export default {
    props:['views'],
    data(){
        var validatorCh=(rule, value, callback)=>{
            if(this.details.ch.length<3)
                callback(new Error(`串号数量与发货商品数量( ${this.sl} )不一致`));
            else
                callback();
        }
        return {
            rules:{
                fhdh:[{required:true,message:'发货单号不可为空'}],
                ch:[{validator:validatorCh}],
                ckdm:[{required:true,message:'仓库不可为空'}]
            },
            details:{
                fhdh:'',
                ch:[],
                ckdm:''
            },
            ch:'',
            sl:3
        }
    },
    methods:{
        handleCk(item){
            this.details.ckdm=item.bm;
        },
        save(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    mounted(){
        this.$refs.form.resetFields();
        if(this.views.lx){
            delete this.details.ckdm;
            delete this.rules.ckdm;
        }else{
            delete this.details.ch;
            delete this.rules.ch;
        }
    },
    components:{
        popUp,
        companySelect
    }
}
</script>
<style lang="less" scoped>
    .el-input{
        width: 280px;
    }
</style>
