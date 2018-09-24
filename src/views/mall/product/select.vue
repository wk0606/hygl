<template>
    <div
        class="m-select"
        :class="{error:high}"
    >
        <div @click="getGgByName">
            <span>{{value?`${label}/${value}`:label}}</span>
            <i class="el-icon-arrow-down"></i>
        </div>
        <el-collapse-transition>
            <div class="m-select-option" v-if="show" ref="options">
                <el-input
                    size="mini"
                    v-model.trim="name" 
                    placeholder="回车新增小规格"
                    @keyup.enter.native="saveGg"
                ></el-input>
                <scroll class="scroll" scroll-color="#fff" bar-color="#f2f2f2" need-hover>
                    <ul>
                        <li
                             v-for="item in list"
                            :key="item.sortid"
                            @click="change(item.ggname)"
                        >
                            <span>{{item.ggname}}</span>
                            <i class="el-icon-check" v-if="value==item.ggname"></i>
                        </li>
                    </ul>
                </scroll>
            </div>
        </el-collapse-transition>
        <i class="el-icon-circle-close" @click="iconClick"></i>
    </div>
</template>
<script>
import scroll from '../../../components/scroll/scroll'
export default {
    props:{
        label:{default:''},
        id:{required:true},
        value:{required:true},
        highLight:{default:false}
    },
    data(){
        return {
            name:'',
            list:[],
            show:false,
            high:false
        }
    },
    watch:{
        show(nv){
            const self=this;
            if(nv){
                window.addEventListener('click',self.close);
            }else{
                window.removeEventListener('click',self.close);
            }
        },
        highLight(nv){
            this.high=nv;
        }
    },
    methods:{
        getGgByName(){
            if(this.show){
                this.show=false;
            }else{
                this.$http('/api/x6/getSpggListByName.do',{
                    name:this.label
                }).then(res=>{
                    this.list=JSON.parse(res.List[0].data.value);
                    this.show=true;
                });
            }
        },
        saveGg(){
            if(!this.name){
                this.$message('名称不可为空','error');
            }else{
                this.$http('/api/x6/hySetSpggSave.do',{
                    id:this.id,
                    name:this.label,
                    ggname:this.name
                }).then(res=>{
                    var temp=JSON.parse(res.VO.data);
                    for(let obj of temp){
                        if(obj.ggname==this.name){
                            this.list.splice(0,0,{
                                ggname:obj.ggname,
                                sortid:obj.sortid,
                                checked:true
                            });
                        }
                    }
                    this.name='';
                });
            }
        },
        iconClick(){
            this.$emit('icon-click',{
                id:this.id,
                name:this.label
            });
        },
        change(name){
            this.high=false;
            this.$emit('change',{
                id:this.id,
                name:this.label,
                ggname:name
            });
            this.show=false;
        },
        close(ev){
            if(!this.$refs.options.contains(ev.target)){
                this.show=false;
            }
        }
    },
    components:{
        scroll
    }
}
</script>
<style lang="less" scoped>
    @border-color:#dcdfe6;
    .m-select{
        height: 30px;
        border-radius: 4px;
        border: 1px solid @border-color;
        position: relative;
        >i{
            position: absolute;
            top:-8px;
            right:-8px;
            font-size: 15px;
            cursor: pointer;
            color: red;
            visibility: hidden;
        }
        >div:nth-child(1){
            width: 100%;
            height: 100%;
            cursor: pointer;
            box-sizing: border-box;
            padding: 0 7px;
            display: flex;
            align-items: center;
            >span{
                flex-grow: 1;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            >i{
                flex-shrink: 0;
            }
        }
        .m-select-option{
            width: 100%;
            position: absolute;
            left: 0;
            top:32px;
            border: 1px solid @border-color;
            background: #fff;
            box-sizing: border-box;
            border-radius: 4px;
            z-index: 9;
            .el-input{
                margin: 10px 10px 0 10px;
                width: auto;
            }
            .scroll{
                max-height: 200px;
                margin-top:10px;
                li{
                    box-sizing: border-box;
                    padding: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    i{color: #999;}
                    &:hover{
                        background: #f2f2f2;
                    }
                }
            }
        }
        &:hover{
            i{
                visibility: visible;
            }
        }
    }
    .error{
      border: 1px solid red;
      >div:nth-child(1){color: red;}      
    }
</style>
