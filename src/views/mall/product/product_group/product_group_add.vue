<template>
  <div>
    <bread-nav :data="navs"></bread-nav>
    <div class="g-add-body" ref="body">
      <real-view
        width="300px"
        height="600px"
      >
        <div>
          <img src="../../../../assets/spxq.png" alt="" ref="img">
          <div class="g-add-header" ref="header">
            <b>{{name}}</b>
          </div>
          <div class="g-add-main">
            <div>
              <img src="../../../../assets/mrfz.jpeg" alt="">
              <div class="g-footer">￥ 999.00</div>
            </div>
            <div>
              <img src="../../../../assets/mrfz.jpeg" alt="">
              <div class="g-footer">￥ 999.00</div>
            </div>
            <div>
              <img src="../../../../assets/mrfz.jpeg" alt="">
              <div class="g-footer">￥ 999.00</div>
            </div>
            <div>
              <img src="../../../../assets/mrfz.jpeg" alt="">
              <div class="g-footer">￥ 999.00</div>
            </div>
          </div>
        </div>
      </real-view>
      <div :style="{width:width+'px'}" class="g-add-right">
        <div>
          <span><i style="color:red;">*</i>分组名称 ：</span>
          <el-input size="mini" v-model="name" style="width:150px;" :disabled="id==1"></el-input>
        </div>
      </div>
    </div>
    <div class="g-add-bottom" :style="{width:footerWidth+'px'}">
      <el-button size="mini" type="primary" :loading="load" @click="save">保存</el-button>
      <el-button size="mini" @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import breadNav from '../../../../components/breadNav/index'
import realView from '../../../../components/realView/index'
export default {
  props:['views'],
  data(){
    return {
      navs:[
        { label: "分组列表", path:'/main/mall/shop/product_sp' },
        { label: "编辑分组" }
      ],
      width:0,
      scrollTop:0,
      name:'',
      id:-1,
      List:[],
      spList:[
        {url:''}
      ],
      load:false,
      footerWidth:0
    }
  },
  methods:{
    save(){
      var name=this.name.trim();
      if(name===''){
        this.name='';
        this.$message('名称不能为空','error');
      }else{
        this.load=true;
        this.$http('/api/x6/HySetSpfzSave.do',{
          id:this.id,
          name:name
        }).then(res=>{
          this.$message(this.id==-1?'新增成功':'修改成功');
          this.load=false;
          this.name='';
          this.$util.requestAllCache(this.$http);
          this.cancel();
        },err=>{
          this.load=false;
        });
      }
    },
    cancel(){
      this.$router.go (-1);
      if(this.$util.getCache('NEEDBACK')==1)
        this.$util.removeCache('NEEDBACK');
    },
    getDetail(){
      this.$http('/api/x6/getSpfzById.do',{
        id:this.id
      }).then(res=>{
        this.name=res.VO.name;
      });
    }
  },
  activated(){
    this.width=this.$refs.body.offsetHeight*9/16;
    this.footerWidth=this.$refs.body.offsetWidth;
    setTimeout(()=>{
      this.scrollTop=this.$refs.img.offsetHeight;
    },0);
    this.id=this.$route.params.id;
    //this.id=this.views.id;
    if(this.id!=='-1'){
      this.getDetail();
    }
  },
  components:{
    breadNav,
    realView
  }
}
</script>
<style lang="less" scoped>
  .g-add-body{
    display: flex;
    justify-content: center;
    padding-bottom: 48px;
    >div{
      margin: 0 20px;
      height:100%;
      box-sizing: border-box;
      img{
        width: 100%;
        height:auto;
      }
    }
    .g-add-header{
      height: 35px;
      line-height: 35px;
      background: #fff;
      text-align: center;
      font-size: 13px;
    }
    .g-add-main{
      box-sizing: border-box;
      //padding: 10px;
      padding: 0 10px 10px 0;
      height: ~"calc(100% - 86px)";
      display: flex;
      flex-wrap: wrap;
      >div{
        width:50%;
        height: 50%;
        border-top:10px solid transparent;
        border-left:10px solid transparent;
        background: #fff;
        box-sizing: border-box;
        img{
          display: block;
          width: 100%;
          height: 80%;
        }
        .g-footer{
          height: 20%;
          display: flex;
          align-items: center;
          font-size: 14px;
          color: red;
          box-sizing: border-box;
          padding: 0 10px;
        }
      }
    }
    .g-add-right{
      position: relative;
      >div{
        width: 100%;
        height: auto;
        box-sizing: border-box;
        padding: 10px;
        background: #f8f8f8;
        border: 1px solid #f2f2f2;
        border-radius: 4px;
        position: relative;
        top:109px;
        &:before{
          content: '';
          display: block;
          width: 0;
          height: 0;
          border: 7px solid transparent;
          border-right: 7px solid #f8f8f8;
          position: absolute;
          top:50%;
          left: -14px;
          transform: translateY(-50%);
        }
      }
    }
  }
  .g-add-bottom{
    background: #f8f8f8;
    padding: 10px 0;
    text-align: center;
    margin-top:10px;
    position: fixed;
    bottom: 0;
  }
</style>
