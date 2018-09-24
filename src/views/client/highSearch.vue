<template>
    <pop-up
        title="高级检索"
        width="400"
        :confirm="save"
        :views="views"
    >
        <div slot="content" class="content">
            <div>
                <span>消费时间</span>
                <date-picker :date.sync="details.date"></date-picker>
            </div>
            <div>
                <span>商品</span>
                <goods style="width:300px;" @change="handlerGoods"></goods>
            </div>
            <div>
                <span>画像</span>
                <el-select v-model="details.tagid" placeholder="请选择画像" size="mini" style="width:300px;">
                    <el-option
                        v-for="item in tagList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>
    </pop-up>
</template>
<script>
import popUp from '../../components/popUp/index'
import goods from '../../components/goodsSelect/index'
import datePicker from '../../components/datePicker/index'
export default {
    props:['views','params'],
    data(){
        return {
            details:{
                date:[],
                spdm:'',
                splx:'',
                spmc:'',
                pp:'',
                tagid:''
            },
            tagList:[]
        }
    },
    methods:{
        handlerGoods({splx,pp,spmc,spdm}){
            this.details.splx=splx;
            this.details.pp=pp;
            this.details.spmc=spmc;
            this.details.spdm=spdm;
        },
        getTagList(){
            this.$http('/api/x6/getHyxxTagsList.do',{}).then(res=>{
                this.tagList=res.tagsList;
            });
        },
        save(){
            var temp=JSON.parse(JSON.stringify(this.details));
            temp.fsrqq=temp.date[0]||'';
            temp.fsrqz=temp.date[1]||'';
            temp.spdm=temp.spdm||0;
            temp.tagid=temp.tagid||0;
            delete temp.date;
            this.$emit('selected',temp);
            this.views.show=false;
        }
    },
    mounted(){
        //console.log(this.params)
        //this.details=Object({},this.details,this.params);
        this.getTagList();
    },
    components:{
        popUp,
        goods,
        datePicker
    }
}
</script>
<style lang="less" scoped>
    .content{
        padding: 0;
        >div{
            display: flex;
            align-items: center;
            margin: 15px 0;
            >span{
                width: 60px;
                font-size: 12px;
                text-align: right;
                &:after{
                    content: ':';
                    margin-right: 5px;
                }
            }
        }
    }
</style>
