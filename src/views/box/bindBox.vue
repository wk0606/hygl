<template>
  <pop-up
    :title="'【' + control.item.name +'】绑定麦芽盒子'"
    width="460"
    :views="control"
    :loading="Loading"
    :confirm="save"
  >
    <div class="add-container" slot="content">
      <div class="lineWrapper">
        <span class="leftText">麦芽盒子ID： </span>
        <el-input v-model="mac" style="width: 250px" size="small" placeholder="请输入麦芽盒子ID"></el-input>
      </div>
      <!-- <div class="footer">
        <el-button type="info" size="small" :loading="Loading" @click.native="save">绑定</el-button>
        <el-button type="info" size="small" :plain="true" @click='close'>关闭</el-button>
      </div> -->
    </div>
  </pop-up>
</template>
<script>
  import popUp from '../../components/popUp/index'
  export default {
    props: {
      control: {
        type: Object
      }
    },
    data() {
      return {
        Loading: false,
        mac: ''
      }
    },
    components: {
      popUp
    },
    methods: {
      close() {
        this.control.show=false;
      },
      save() {
        if (!this.mac) {
          this.$message('请输入麦芽盒子ID','warning');
          return;
        }
        this.Loading = true
        this.$http("/api/x6/box/bindbox.do", {
          boxid: this.mac,
          gsdm: this.$util.getCache('user').gsdm,
          ssgsid: this.control.item.id
        }).then((response) => {
          this.control.item.havebind = 1
          this.Loading = false
          this.$message("绑定成功!")
          this.$emit('bind-success')
          this.close()
        },err=>{
            this.Loading = false
        });
      }
    }
  }
</script>
<style lang="less" scoped>

  .lineWrapper {
    width: 100%;
    box-sizing: border-box;
    padding: 40px 20px;
    display: flex;
    .leftText {
      margin-right: 10px;
      margin-left: 10px;
      line-height: 30px;
    }

  }

  .add-container {
    .highLight {
      color: red;
    }
  }
</style>
