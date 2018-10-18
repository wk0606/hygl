<template>
    <div
        class="m-d-picker"   
    >
        <div :style="{width:width+'px'}">
            <el-date-picker
                ref="picker1"
                :size="size"
                v-model="date[0]"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :editable="false"
                :picker-options="pickerOptions1"
                @change="handlerChange">
            </el-date-picker>
            <span style="margin:0 5px;" v-show="type=='daterange'">{{separator}}</span>
            <el-date-picker
                v-show="type=='daterange'"
                ref="picker2"
                :size="size"
                v-model="date[1]"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :editable="false"
                :picker-options="pickerOptions2"
                @change="handlerChange">
            </el-date-picker>
        </div>
        <div class="m-d-options" v-if="needOption!==false">
            <div
                v-for="item in options"
                :key="item.label"
                :class="{selected:currentOption==item.label}"
                @click="setDate(item)"
            >{{item.label}}</div>
        </div>
    </div>
</template>
<script>
let that;
export default {
    props:{
        width:{
            default:300
        },
        size:{
            default:'mini'
        },
        date:{
            default:function(){
                return []
            }
        },
        separator:{
            default:'~'//分隔符
        },
        type:{
            default:'daterange'//默认类型
        },
        needOption:{default:false},
        hidePicker:{default:false}
    },
    data(){
        return {
            pickerOptions1: {
                disabledDate(time) {
                    if(that.$refs.picker2.value){
                        let end=new Date(that.$refs.picker2.value).getTime();
                        return time.getTime() >= end;
                    }
                },
                shortcuts: [{
                                text: '最近一周',
                                onClick(picker) {
                                    let date=[that.$util.getDateByDistance(-7),that.$util.getCurrentDate()];
                                    that.$emit('update:date',date);
                                    that.$refs.picker1.hidePicker();
                                }
                            }, {
                                text: '最近一个月',
                                onClick(picker) {
                                    let date=[that.$util.getDateByDistance(-30),that.$util.getCurrentDate()];
                                    that.$emit('update:date',date);
                                    that.$refs.picker1.hidePicker();
                                }
                            }, {
                                text: '最近三个月',
                                onClick(picker) {
                                    let date=[that.$util.getDateByDistance(-90),that.$util.getCurrentDate()];
                                    that.$emit('update:date',date);
                                    that.$refs.picker1.hidePicker();
                                }
                            }]
            },
            pickerOptions2: {
                disabledDate(time) {
                    if(that.$refs.picker1.value){
                        let start=new Date(that.$refs.picker1.value).getTime()-3600*24*1000;
                        return time.getTime() < start;
                    }
                },
                shortcuts: [{
                                text: '最近一周',
                                onClick(picker) {
                                    let date=[that.$util.getDateByDistance(-7),that.$util.getCurrentDate()];
                                    that.$emit('update:date',date);
                                    that.$refs.picker2.hidePicker();
                                }
                            }, {
                                text: '最近一个月',
                                onClick(picker) {
                                    let date=[that.$util.getDateByDistance(-30),that.$util.getCurrentDate()];
                                    that.$emit('update:date',date);
                                    that.$refs.picker2.hidePicker();
                                }
                            }, {
                                text: '最近三个月',
                                onClick(picker) {
                                    let date=[that.$util.getDateByDistance(-90),that.$util.getCurrentDate()];
                                    that.$emit('update:date',date);
                                    that.$refs.picker2.hidePicker();
                                }
                            }]
            },
            options:[
                {label:'今',value:0},
                {label:'昨',value:-1},
                {label:'最近7天',value:-7},
                {label:'最近30天',value:-30}
            ],
            currentOption:''
        }
    },
    methods:{
        setDate(obj){
            this.currentOption=obj.label;
            let date=null;
            if(obj.label==this.options[1].label)
                date=[this.$util.getDateByDistance(obj.value),this.$util.getDateByDistance(obj.value)];
            else
                date=[this.$util.getDateByDistance(obj.value),this.$util.getCurrentDate()];
            this.$emit('update:date',date);
        },
        handlerChange(){
            this.currentOption='';
            console.log(this.$refs.picker1.value,this.$refs.picker2.value)
            let date=[this.$refs.picker1.value||'',this.$refs.picker2.value||''];
            console.log(date)
            this.$emit('update:date',date);
            this.$emit('change');
        }
    },
    mounted(){
        that=this;
        if(this.hidePicker!==false){
            this.pickerOptions1.shortcuts='';
            this.pickerOptions2.shortcuts='';
        }
    },
    activated(){
        that=this;
    }
}
</script>
<style lang="less" scoped>
    .m-d-picker{
        display: inline-flex;
        align-items: center;
        >div:nth-child(1){
            display: inline-flex;
            align-items: center;
        }
        >span{margin: 0 5px;}
        .m-d-options{
            display: inline-flex;
            align-items: center;
            >div{
                padding: 5px 6px;
                border:1px solid #d3d3d3;
                cursor: pointer;
                color:#d3d3d3;
                margin-left: 10px;
            }
            .selected{
                border-color: #409eff;
                color: #409eff;
            }
        }
    }
</style>
