<template>
    <div class="range">
        <el-select v-model="status" placeholder="请选择" size="small" style="width:70px;" @change="changeRange">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <el-date-picker
            v-model="currentTime"
            size="small"
            style="margin-left:10px;"
            :type="status"
            :format="timeFormat"
            :picker-options="pickerOptions"
            placeholder="请选择日期范围"
            @change="changeData"
            :clearable="false"
            :editable="false">
        </el-date-picker>
    </div>
</template>
<script>
export default {
    props:{
        range:{
            default:'date'
        },
        date:{
            default:''
        }
    },
    data(){
        return {
            status:'',
            options:[
                {value:'date',label:'日',type:'D'},
                {value:'week',label:'周',type:'W'},
                {value:'month',label:'月',type:'M'}
            ],
            currentTime:'',
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
        }
    },
    computed:{
        timeFormat(){
            if(this.status=='week'){
                return 'yyyy 年 第 WW 周';
            }else if(this.status=='month'){
                return 'yyyy 年 第 MM 月';
            }else{
                return 'yyyy 年 MM 月 dd 日';
            }
        }
    },
    methods:{
        changeRange(){
            this.$emit('update:range',this.status);
            this.changeData();
        },
        changeData(){
            this.$emit('change',this.getDate(this.status));
        },
        getDate(type){
            var params={};
            for(let obj of this.options){
                if(obj.value==type){
                    params.dtype=obj.type;
                    break;
                }	
            }
            if(type=='week'){
                let d=new Date(this.currentTime).getDay();
                params.fsrqq=this.$util.getDateByDistance(-1*d,this.currentTime);
                params.fsrqz=this.$util.getDateByDistance(6-d,this.currentTime);
            }else if(type=='month'){
                let y=new Date(this.currentTime).getFullYear();
                let m=new Date(this.currentTime).getMonth()+1;
                params.month=y+'-'+(m<10?'0'+m:m);
            }else{
                params.fsrq=this.$util.getFormatDate(this.currentTime);
            }
            return params;	
        }
    },
    mounted(){
        this.currentTime=this.date||this.$util.getCurrentDate();
        this.status=this.range;
        this.$emit('change',this.getDate(this.status));
    },
    activated(){
        this.currentTime=this.date||this.$util.getCurrentDate();
        this.status=this.range;
        this.$emit('change',this.getDate(this.status));
    }
}
</script>
<style lang="less" scoped>
    .range{
        width: auto;
        display: inline-flex;
        align-items: center;
    }
</style>
