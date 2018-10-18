<template>
    <div @click.stop='' class="slideRight">
        <edit-model
            :title="disabled?'会员信息详情':'会员信息编辑'" 
            :views="views"
            ref="editModel"
        >
            <el-form
                slot="content"
                :model="views.data"
                :rules="rules"
                ref="editForm"
                label-width="70px"
                label-position="top"
            >
                <el-form-item label="姓名" prop="name" required>
                    <el-input v-model="views.data.name" size="small" placeholder="请输入姓名" @blur="saveChange('name')" :disabled="disabled" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone" required>
                    <el-input v-model="views.data.phone" size="small" placeholder="请输入手机号码" @blur="saveChange('phone')" :disabled="disabled" clearable></el-input>
                </el-form-item>
                <!-- <el-form-item label="初始积分" prop="initjf">
                    <el-input v-model="views.data.initjf" size="small" placeholder="请输入初始积分" @blur="saveChange('initjf')" :disabled="disabled"></el-input>
                </el-form-item> -->
                <el-form-item label="微信号" prop="wx">
                    <el-input v-model="views.data.wx" size="small" placeholder="请输入微信号" @blur="saveChange('wx')" :disabled="disabled" clearable></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="views.data.sex" @change="saveChange(0)">
                        <el-radio :label="0" :disabled="disabled">男</el-radio>
                        <el-radio :label="1" :disabled="disabled">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日" prop="csny">
                    <el-date-picker
                        :disabled="disabled"
                        v-model="views.data.csny"
                        type="date"
                        placeholder="请选择出生年月"
                        value-format="yyyy-MM-dd"
                        size="small"
                        style="width:353px;"
                        :editable="false"
                        @change="saveChange(0)"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="地址" prop="dz">
                    <div class="address">
                        <el-select
                            :disabled="disabled"
                            v-model="views.data.province"
                            placeholder="请选择省份"
                            size="small"
                            @change="chearCityAndTown"
                        >
                            <el-option
                                v-for="(province,key) in maps"
                                :key="key"    
                                :label="key"
                                :value="key"
                            ></el-option>
                        </el-select>
                        <el-select
                            :disabled="disabled"
                            v-model="views.data.city"
                            placeholder="请选择城市"
                            size="small"
                            @change="getTown"
                            style="margin:0 10px;"
                        >
                            <el-option
                                v-for="(city,index) in maps[views.data.province]"
                                :key="index"    
                                :label="city"
                                :value="city"
                            ></el-option>
                        </el-select>
                        <el-select
                            :disabled="disabled"
                            v-model="views.data.town"
                            placeholder="请选择县区"
                            size="small"
                            @change="saveChange(0)"
                        >
                            <el-option
                                v-for="(town,index) in townList"
                                :key="index"    
                                :label="town.town"
                                :value="town.town"
                            ></el-option>
                        </el-select>
                    </div>
                    <div><el-input v-model="views.data.dz" size="small" placeholder="请输入街道地址" @blur="saveChange('dz')" :disabled="disabled" clearable></el-input></div>
                </el-form-item>
                <el-form-item label="添加画像" prop="hx">
                    <div v-if="!disabled" class="tag-btn"><img src="../../assets/addtag.png" width="20" @click="tags.show=true;"/></div>
                    <ul class="tag-body">
                        <li
                            v-for="(tag,index) in views.data.tags"
                            :key="index"
                            :style="{borderColor:tag.color,color:tag.color}"
                        >
                            <span>{{tag.name}}</span>
                            <i class="el-icon-close"></i>
                        </li>
                    </ul>
                </el-form-item>
            </el-form>
        </edit-model>
        <tag v-if='tags.show' :managetagShow='tags' :savetagList='tags.list' @changeTags='changeTags'></tag>
    </div>
</template>
<script>
import editModel from '../../components/editModel/index'
import tag from './tag'
export default {
    props:{
        'views':{required:true},
        'disabled':{default:false}
    },
    data(){
        return {
            rules:{
                name:[
                    {required:true,message:'请输入姓名',trigger:'blur'}
                ],
                phone:[
                    {required:true,message:'请输入手机号',trigger:'blur'},
                    {pattern: /^1\d{10}$/,message: '请输入正确的手机号格式', trigger: 'blur'}
                ]
            },
            maps:{},
            townList:[],
            _copyForm:null,
            tags:{
                show:false,
                list:null
            }
        }
    },
    watch:{
        'views.slideBottom':function(nv){
            if(nv){
                this.$refs.editModel.scrollTo('bottom');
            }else{
                this.$refs.editModel.scrollTo();
            }
        }
    },
    methods:{
        //清空市/县区
        chearCityAndTown(){
            this.views.data.city='';
            this.views.data.town='';
        },
        //获取市
        getTown(){
            this.$http('/api/x6/getTownList.do',{
                province:this.views.data.province,
                city:this.views.data.city
            }).then(res=>{
                this.townList=res.list;
            });
        },
        //保存更改
        saveChange(key){
            this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    if(this.views.data[key]!=this._copyForm[key]||!key){
                        this.$http('api/x6/saveHyHyxx.do',this.views.data).then(res=>{
                            this.$message('会员信息更新成功');
                            this.$emit('edit-success',res.hyxx);
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        changeTags(){
            this.views.data.tags=this.$util.deepCopy(this.tags.list);
            this.saveChange(0);
        }
    },
    mounted(){
        this.maps=this.$util.getProvinceAndCity();
        this._copyForm=this.$util.deepCopy(this.views.data);
        this.tags.list=this.$util.deepCopy(this.views.data.tags);
        if(this.views.slideBottom){
            this.$refs.editModel.scrollTo('bottom');
        }
    },
    components:{
        editModel,
        tag
    }
}
</script>
<style lang="less" scoped>
    label{line-height: 0 !important;}
    .address{
        display: flex;
        align-items: center;
    }
    .tag-btn{
        line-height: 0;
        img{cursor: pointer;}
    }
    .tag-body{
        display: flex;
        flex-wrap:wrap;
        li{
            padding: 5px 7px;
            border-width: 1px;
            border-style: solid;
            border-radius: 4px;
            font-size: 12px;
            line-height: 0;
            margin: 10px 10px 0 0;
            i{cursor: pointer;}
        }
    }
</style>
