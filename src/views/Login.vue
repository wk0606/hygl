<template>
  <div>
      <div>
            <label>账号</label>
            <el-input size="small"></el-input>
        </div>
        <div>
            <label>密码</label>
            <el-input size="small"></el-input>
        </div>
        <div>
            <el-button @click="login">登录</el-button>
        </div>
        </div>
</template>
<script>
export default {
  data(){
      return{
          loginForm:{
              "phone":"13584833734",
              "pwd":"e10adc3949ba59abbe56e057f20f883e",
              "clientType":"pc",
              "erroryzm":"",
              "safeyzm":"",
              "machineId":"",
              "gsdm":"232"
          }
      }
  },
  methods:{
      login(){
        var _this=this;
        // var params={
        //     "phone":"13584833734",
        //     "pwd":"e10adc3949ba59abbe56e057f20f883e",
        //     "clientType":"pc",
        //     "erroryzm":"",
        //     "safeyzm":"",
        //     "machineId":"",
        //     "gsdm":"232"
        // }
        var params={
            //"phone":"18936531252",
            //"pwd":"e10adc3949ba59abbe56e057f20f883e",
            "phone":"13584833734",
            "pwd":"c33367701511b4f6020ec61ded352059",
            "clientType":"pc",
            "erroryzm":"",
            "safeyzm":"",
            "machineId":"1QKNKIDEWM:S607W3R14:S607W3R15:SY2FPRUE0",
            "gsdm":"166"
        }
        params.safeyzm=localStorage.getItem('safeyzm')||'';
        var xhr=new XMLHttpRequest();
        xhr.open('POST',`${this.$util.getBaseUrl()}/api/x6/login.do`);
        xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
        xhr.send(JSON.stringify(params));
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4&&xhr.status==200){
                var obj=JSON.parse(xhr.response);
                console.log(obj)
                if(obj.result=='error'){
                    _this.$message(obj.message,'error');
                }else{
                    _this.$util.setCache('user',obj.VO);
                    //_this.$util.setCache('tokenid',obj.tokenid);
                    _this.$util.setTokenid(obj.tokenid);
                    _this.$util.setCache('serverurl',obj.url);
                    localStorage.setItem('safeyzm',obj.safeyzm);
                    _this.$http('/api/x6/getProvinceListWithCity.do').then(res=>{
                        _this.$util.setCache('map',res.list);
                        _this.$router.push('/main');
                    });
                    // _this.$util.requestAllCache(_this.$http,function(){
                    //     _this.$router.push('/main');
                    // })
                }
            }else{
                //console.log()
            }
        }
      }
  }
}
</script>
<style lang="less" scoped>

</style>
