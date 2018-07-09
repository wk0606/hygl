<template>
    <div class="totals">
        <b>合计</b>
        <span
        v-for="(value,key,index) in data"
        :key="index"
        >
        <label>{{key}}</label><b>{{value}}</b>
        </span>
    </div>
</template>
<script>
    export default{
        props:['data']
    }
</script>
<style lang="less" scoped>
    .totals{
        font-size: 14px;
        box-sizing: border-box;
        padding: 15px 20px;
        background: #fff;
        b{margin-right: 20px;}
        label{
            &:after{
                content: ':';
                margin: 0 5px;
            }
        }
    }
</style>