<template>
  <pop-up
    title="门店选择"
    width="600"
    :confirm="save"
    :views="views"
  >
    <div class="content" slot="content">
        <div
            class="g-body"
            v-for="(item,index) in treeDatas"
            :key="index"
        >
            <div class="g-title">
                <span>{{item.name}}</span>
                <div class="g-checkbox" :class="{gSelect:item.select}" @click="handleSelectAll(item)"><i class="el-icon-check"></i></div>
            </div>
            <div class="g-item"
                v-for="md in item.list"
                :key="md.id"
                :class="{selected:md.select}"
                @click="handleChange(md)"treeDatas
            >{{md.name}}<i :class="md.select?'el-icon-check':'el-icon-close'"></i></div>
        </div>
    </div>
    <!-- <div class="footer" slot="footer">
        <el-button size="small" type="info" @click="save">确定</el-button>
        <el-button size="small" @click="close">关闭</el-button>
    </div> -->
  </pop-up>
</template>
<script>
import popUp from '../../components/popUp/index'
export default {
    props:['views'],
    data(){
        return{
            treeDatas:null,
            gslists:null,

        }
    },
    methods:{
        save(){
            var ids=[];
            for(let obj of this.treeDatas){
                for(let md of obj.list){
                    if(md.select)
                        ids.push(md.id);
                }
            }
            this.$emit('selection-change',ids);
            this.close();
        },
        getGsList(){
            this.gslists=this.$util.getMyGsList();
            var _temp={};
            var _array=[];
            //已经选中的门店id集合
            var hasSelected=this.views.data;
            for(let obj of this.gslists){
                //设置初始选中状态
                this.$set(obj,'select',hasSelected.indexOf(obj.id)!=-1?true:false);
                //如果是分公司
                if(obj.lx==2){
                    if(!_temp.hasOwnProperty(obj.bm))
                        _temp[obj.bm]=[];
                    continue;
                }
                if(obj.lx==3){
                    if(!_temp.hasOwnProperty(obj.pbm))
                        _temp[obj.pbm]=[];
                    _temp[obj.pbm].push(obj);
                }
            }
            for(let key in _temp){
                _array.push({
                    select:false,
                    name:this.matchInfoByBm(key),
                    bm:key,
                    list:_temp[key]
                });
            }
            return _array;
        },
        matchInfoByBm(bm){
            for(let obj of this.gslists){
                if(obj.bm==bm)
                    return obj.name;
            }
        },
        handleChange(obj){
            obj.select=!obj.select;
            //监测兄弟是否全选了
            for(let p of this.treeDatas){
                if(p.bm==obj.pbm){
                    for(let m of p.list){
                        if(!m.select){
                            p.select=false;
                            return;
                        }else{
                            p.select=true;
                        }
                    }
                }
            }
        },
        //全选-反全选
        handleSelectAll(p){
            p.select=!p.select;
            for(let obj of this.treeDatas){
                if(p.bm==obj.bm){
                    for(let m of obj.list){
                        m.select=p.select;
                    }
                }
            }
        },
        close(){
            this.views.show=false;
        }
    },
    mounted(){
        this.treeDatas=this.getGsList();
    },
    components:{
        popUp
    }
}
</script>
<style lang="less" scoped>
    .content{
        box-sizing: border-box;
        padding: 10px;
        background: #fff;
        max-height: 500px;
        overflow-y: auto;
        .g-body{
            box-sizing: border-box;
            padding: 10px;
            border-radius: 4px;
            position: relative;
            border:1px solid #ccc;
            display: flex;
            flex-wrap: wrap;
            margin: 15px 0;
            .g-title{
                display: flex;
                align-items: center;
                padding-right: 7px;
                background: #fff;
                position: absolute;
                left: 10px;
                top:-13px;
                span{
                    padding: 5px 7px;
                }
                .g-checkbox{
                    box-sizing: border-box;
                    width: 15px;
                    height: 15px;
                    border-radius: 2px;
                    border: 1px solid #ccc;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    i{
                        transform: scale(.6);
                        color:#ccc;
                    }
                }
                .gSelect{
                    border-color:#13CE66;
                    i{color:#13CE66;}
                }
            }
            .g-item{
                border: 1px solid #ccc;
                padding: 3px 5px;
                font-size: 12px;
                color: #555;
                margin: 10px;
                cursor: pointer;
                i{
                    margin-left: 7px;
                    font-size: 12px;
                    transform: scale(0.8);
                    color:#aaa;
                }
            }
            .selected{
                border-color: #13CE66;
                color:#13CE66;
                i{color:#13CE66;}
            }
        }
    }
    .footer{
        box-sizing: border-box;
        padding: 10px;
        text-align: right;
    }
</style>
