<template>
    <pop-up
        :title="views.title"
        width="700"
        :views="views"
        :confirm="save"
        :confirmText="views.yxbz?'下架':'上架'"
        :disabled="!spdms.length"
    >
        <div class="content" slot="content">
            <div style="margin-bottom:10px;">
                <auto-complate :data="List" @change="handlerChange"></auto-complate>
            </div>
            <el-table
                :data="spList"
                border
                empty-text="请先选择一个商品"
                max-height="450"
                @selection-change="selectChange"
                ref="table"
            >
                <el-table-column
                    type="selection"
                    align="center"
                    width="50">
                </el-table-column>
                <el-table-column
                    v-for="item in colModel"
                    :key="item.prop"
                    :label="item.label"
                    :width="item.width"
                    header-align="center"
                    :align="item.align||'center'"
                >
                    <template slot-scope="scope">
                        <span class="cell-span-wrap">{{scope.row[item.prop]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </pop-up>
</template>
<script>
import popUp from '../../../../components/popUp/index'
import autoComplate from '../../../../components/inputSearch/index'
export default {
    props:['views','yxbz'],
    data(){
        return {
            List:[],//商品列表
            pId:0,
            spList:[],
            model:[
                {prop:'qspmc',label:'商品名称',align:'left'},
                {prop:'dyjg',label:'网店售价',width:100},
                {prop:'kskc',label:'可售库存',width:100,align:'right'}
            ],
            colModel:[],
            spdms:[],
        }
    },
    methods:{
        getList(){
            this.$http("/api/x6/getSpxxListByCondition.do",{
                bzw:this.yxbz,
                name:''
            }).then(res => {
                for(let obj of res.List){
                    this.List.push({
                        id:obj.id,
                        name:obj.name
                    });
                }
                
            });
        },
        handlerChange(obj){
            this.pId=obj.id;
            this.getSpDetails(obj.id,true);
        },
        getSpDetails(id,flag){
            this.$http('/api/x6/getHySetSpxxByid.do',{
                id:id,
                yxbz:this.yxbz
            }).then(res=>{
                var spxx=JSON.parse(res.VO.ggspgx);
                if(flag){
                    this.colModel=[];
                    for(let gg of spxx[0].spgg){
                        this.colModel.push({
                            prop:gg.name,
                            label:gg.name,
                            width:100
                        });
                    }
                    this.colModel=this.colModel.concat(this.model);
                }
                this.spList=[];
                for(let obj of spxx){
                    var temp={
                        spdm:obj.spdm,
                        qspmc:obj.qspmc,
                        dyjg:obj.dyjg,
                        kskc:obj.kskc
                    };
                    for(let gg of obj.spgg){
                        temp[gg.name]=gg.value;
                    }
                    this.spList.push(temp);
                }
            });
        },
        selectChange(val){
            this.spdms=val.map(item=>{
                return item.spdm;
            });  
        },
        save(){
            this.$confirm(`确认进行${this.yxbz?'上架':'下架'}操作吗`,'提示',{
                type:'warning'
            }).then(()=>{
                this.$http('/api/x6/batchSetSpxx.do',{
                    ids:this.pId.toString(),
                    spdms:this.spdms.join(','),
                    yxbz:this.yxbz?0:1
                }).then(res=>{
                    if(this.spdms.length==this.spList.length){
                        this.views.show=false;
                    }else{
                        this.getSpDetails(this.pId);
                    }
                    this.$parent.getList();
                });
            }).catch(()=>{});
        }
    },
    mounted(){
        this.colModel=this.colModel.concat(this.model);
        this.getList();
    },
    components:{
        popUp,
        autoComplate
    }
}
</script>
<style lang="less" scoped>

</style>
