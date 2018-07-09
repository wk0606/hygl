<template>
  <div style="overflow-y:auto;">
      <div class="table-header table-row-item">
          <div
            v-for="item in colModel"
            :key="item.prop"
            :style="{width:item.width||'auto'}"
          >{{item.label}}</div>
      </div>
      <div class="table-body">
          <div
            v-for="(fgs,index) in companyData.children"
            :key="fgs.bm"
            class="table-row"
          >
            <div class="table-row-item" :class="{'select-row':currentBm.indexOf(fgs.bm)>-1}">
                <div
                    v-for="item in colModel"
                    :key="item.prop"
                    :style="{width:item.width||'auto',textAlign:item.align||'center'}"
                    @click.stop="openFgs(fgs)"  
                >
                    <span v-if="item.prop!='isks'">{{fgs[item.prop]}}</span>
                    <span v-else :class="fgs.isks?'success':'error'" @click.stop="setKsck(fgs)">{{fgs.isks?'可售':'不可售'}}</span>
                </div>
            </div>
            <el-collapse-transition>
                <div v-if="fgs.show">
                    <div
                        v-for="md in fgs.mdList"
                        :key="md.bm"
                        class="table-row"
                        :class="{'select-row-item':md.bm==currentMdBm}"
                    >
                        <div class="table-row-item" @click.stop="openMd(md,index)">
                            <div
                                v-for="item in colModel"
                                :key="item.prop"
                                :style="{width:item.width||'auto',textAlign:item.align||'center'}"  
                            >
                                <span v-if="item.prop!='isks'">{{md[item.prop]}}</span>
                                <span v-else :class="fgs.isks?'success':'error'">{{md.isks?'可售':'不可售'}}</span>
                            </div>
                        </div>
                        <el-collapse-transition>
                            <div class="table-row" v-if="md.show">
                                <div
                                    v-for="ck in md.ckList"
                                    :key="ck.bm"
                                    class="table-row-item"
                                >
                                    <div
                                        v-for="item in colModel"
                                        :key="item.prop"
                                        :style="{width:item.width||'auto',textAlign:item.align||'center'}"  
                                    >
                                        <span v-if="item.prop!='isks'">{{ck[item.prop]}}</span>
                                        <span v-else :class="fgs.isks?'success':'error'">{{ck.isks?'可售':'不可售'}}</span>
                                    </div>
                                </div>
                            </div>
                        </el-collapse-transition>
                    </div>
                    <div
                        v-for="ck in fgs.ckList"
                        :key="ck.bm"
                        class="table-row-item"
                    >
                        <div
                            v-for="item in colModel"
                            :key="item.prop"
                            :style="{width:item.width||'auto'}"  
                        >{{ck[item.prop]}}</div>
                    </div>
                </div>
            </el-collapse-transition>   
          </div>
      </div>
  </div>
</template>
<script>
export default {
  data(){
      return{
          companyData:{},
          colModel:[
              {label:'机构名称',prop:'name',width:'20%',align:'left'},
              {label:'省份',prop:'province',width:'10%'},
              {label:'城市',prop:'city',width:'10%'},
              {label:'县区',prop:'town',width:'30%'},
              {label:'地址',prop:'dz',width:'10%',align:'left'},
              {label:'网点可售',prop:'isks'}
          ],
          currentBm:[],
          currentMdBm:''
      }
  },
  methods:{
      getData(){
          this.$http('/api/x6/getXtGsList.do').then(res=>{
              var temp=[];
              for(let obj of res.gsList){
                  if(obj.cj==1){
                      this.$set(this.companyData,'name',obj.name);
                      this.$set(this.companyData,'bm',obj.bm);
                      this.$set(this.companyData,'id',obj.id);
                      this.$set(this.companyData,'gsdm',obj.gsdm);
                  }else
                    temp.push(obj);
              }
              this.$set(this.companyData,'children',temp);
              //获取总公司的直属仓库
              this.$http('/api/x6/getZsckList.do',{
                  gsdm:this.companyData.gsdm,
                  bm:this.companyData.bm
              }).then(res=>{
                  if(res.ckList.length){
                      for(let ck of res.ckList)
                        this.companyData.children.push(ck);
                  }
              });
          });
      },
      openFgs(item){
          if(!item.hasOwnProperty('show'))
            this.$set(item,'show',false);
          item.show=!item.show;
          if(item.show)
            this.currentBm.push(item.bm);
          else{
              this.currentBm=this.currentBm.filter(bm=>{
                  return bm!=item.bm;
              })
          }
          if(!item.hasOwnProperty('ckList')){
              this.$set(item,'ckList',[]);
              //获取f分公司的直属仓库
              this.$http('/api/x6/getZsckList.do',{
                  gsdm:this.companyData.gsdm,
                  bm:item.bm
              }).then(res=>{
                  if(res.ckList.length){
                      for(let ck of res.ckList){
                          item.ckList.push(ck);
                      }
                  }
              });
          }
      },
      openMd(item,index){
          for(let obj of this.companyData.children[index].mdList){
              obj.show=false;
          }
          this.currentMdBm=item.bm;
          if(!item.hasOwnProperty('show'))
            this.$set(item,'show',false);
          item.show=!item.show;
          if(item.lx!==4&&!item.hasOwnProperty('ckList')){
              this.$set(item,'ckList',[]);
              //获取此门店的直属仓库
              this.$http('/api/x6/getZsckList.do',{
                  gsdm:this.companyData.gsdm,
                  bm:item.bm
              }).then(res=>{
                  if(res.ckList.length){
                      for(let ck of res.ckList)
                        item.ckList.push(ck);
                  }
              });
          }
      },
      setKsck(item){
          console.log(item)
          if(!item.hasOwnProperty('isks'))
            this.$set(item,'isks',false);
          item.isks=!item.isks;
          if(item.cj==2){
              for(let md of item.mdList){
                  if(!md.hasOwnProperty('isks'))
                    this.$set(md,'isks',false);
                  md.isks=item.isks;
                  if(md.ckList){
                      for(let ck of md.ckList){
                          this.$set(ck,'isks',item.isks);
                      }
                  }
              }
              if(item.ckList){
                    for(let ck of item.ckList){
                        if(!ck.hasOwnProperty('isks'))
                            this.$set(ck,'isks',false);
                        ck.isks=item.isks;
                    }
              }
          }
      }
  },
  mounted(){
      this.getData();
  }
}
</script>
<style lang="less" scoped>
    .table-row-item{
        display: flex;
        align-items: center;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        user-select: none;
        >div{
            box-sizing:border-box;
            padding: 15px 10px;
            flex-grow: 1;
        }
    }
    .table-header{
        background: #f0f0f0;
        >div{
            text-align: center;
        }
    }
    .table-body{
        box-sizing: border-box;
        //border-bottom: 1px solid #f0f0f0;
        
        >div{
            border-top: 1px solid #f0f0f0;
            border-left: 1px solid #f0f0f0;
            border-right: 1px solid #f0f0f0;
            margin-bottom: 15px;
        }
    }
    .select-row{
        background: #409eff;
        color: #fff;
    }
    .select-row-item{
        background: #f5f7fa;
    }
    .success{color:#67C23A;}
    .error{color:#F56C6C;}
</style>
