<template>
  <pop-up :width="'900'" title="导入消费者信息" :views="views" :cancel="close">
    <div slot="content" class="content-container">
      <div class="topLine">
        <h3 style="font-size: 18px">消费者信息导入步骤：</h3>
        <span>第一步：<i style="color: #13CE66">下载</i>消费者信息导入模板：
        <el-button type="success" size="mini" @click.native="downloadFile"><i
          class="iconfont icon-weibiaoti101"
          style="font-size:14px;margin-right: 2px"></i>下载</el-button>
        </span>
        <span style="display: block">第二步：<i style="color: #F7BA2A">上传</i>消费者信息文件：
          <el-upload style="display: inline-block"
                     :action="baseurl" :show-file-list="false" :on-success="handleAvatarScucess"
                     :headers="headers" :on-progress="handleAvatarProgress" :on-error="uploadErr"
                     :file-list="fileList" :before-upload="beforeAvatarUpload">
             <el-button type="warning" :loading="uploadLoading" size="mini"
                        icon="upload">上传</el-button>
          </el-upload>
        </span>
        <span style="display: block">第三步：消费者信息校验无误后，点击<i style="color: #20A0FF">一键导入</i>完成操作。
        <el-button type="info" style="width: 80px;height: 26px" size="mini" :loading="addLoading"
                   @click.native="doSave">一键导入</el-button>
        </span>
      </div>

      <el-table :data="showDatas" stripe border height=300>
        <el-table-column prop="name" width="65" label="删行" align="center">
          <template slot-scope="scope">
            <i class="el-icon-delete cell-span-blue"
               @click.stop="deleteRow(scope.$index,scope.$index + (currentPage - 1) * pageItemCount)"></i>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="序号" width="70" align="center">
          <template slot-scope="scope" >
            <span
              class="cell-span ">{{ scope.$index + 1 + (currentPage - 1) * pageItemCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" v-if="isError" label="错误原因"
                         width="110" align="center">
          <template slot-scope="scope" >
            <el-tooltip :content="scope.row.error" placement="top">
              <span class="cell-span "
                    style="color: red;cursor: pointer">{{scope.row.error }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" header-align="center" align="left" min-width="90">
          <template slot-scope="scope">
            <div style="cursor: pointer;width: 100%;min-height: 30px"
                 @click="currentColumIndex = 0,currentRowIndex = scope.$index">
              <el-input v-if="currentRowIndex == scope.$index && currentColumIndex == 0"
                            size="small"
                          v-model="scope.row.name"
                          @blur="blueInut">
              </el-input>
              <span v-else class="cell-span ">{{ scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="手机号" header-align="center" min-width="120" align="center">
          <template slot-scope="scope">
            <div style="cursor: pointer;width: 100%;min-height: 30px"
                 @click="currentColumIndex = 1,currentRowIndex = scope.$index">
              <el-input v-if="currentRowIndex == scope.$index && currentColumIndex == 1"
                            size="small"
                          v-model="scope.row.phone"
                          @blur="blueInut">
              </el-input>
              <span v-else class="cell-span ">{{ scope.row.phone}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="微信号" header-align="center" align="left" min-width="130">
          <template slot-scope="scope">
            <div style="cursor: pointer;width: 100%;min-height: 30px"
                 @click="currentColumIndex =2,currentRowIndex = scope.$index">
              <el-input v-if="currentRowIndex == scope.$index && currentColumIndex == 2"
                            size="small"
                          v-model="scope.row.wx"
                          @blur="blueInut">
              </el-input>
              <span v-else class="cell-span ">{{ scope.row.wx}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="性别" min-width="80" align="center">
          <template slot-scope="scope">
            <div style="cursor: pointer;width: 100%;min-height: 30px"
                 @click="currentColumIndex =3,currentRowIndex = scope.$index">
              <el-input v-if="currentRowIndex == scope.$index && currentColumIndex == 3"
                          size="small"
                          v-model="scope.row.sex"
                          @blur="blueInut">
              </el-input>
              <span v-else class="cell-span ">{{ scope.row.sex}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="生日" header-align="center" min-width="120" align="center">
          <template slot-scope="scope">
            <div style="cursor: pointer;width: 100%;min-height: 30px"
                 @click="currentColumIndex =4,currentRowIndex = scope.$index">
              <el-input v-if="currentRowIndex == scope.$index && currentColumIndex == 4"
                          size="small"
                          v-model="scope.row.csny"
                          @blur="blueInut">
              </el-input>
              <span v-else class="cell-span ">{{ scope.row.csny}}</span>
            </div>
          </template>
        </el-table-column>

      </el-table>
      <!--表尾-->
      <div class="pagination">
        <el-pagination @current-change="changePage" :page-size="pageItemCount"
                       layout="total, prev, pager, next, jumper" :current-page="currentPage"
                       :total="allDatas.length"></el-pagination>
      </div>
    </div>
  </pop-up>
</template>

<script>
  import popUp from '../../components/popUp/index'
  import {excel} from '../../func/excel'
  export default {
    data() {
      return {
        showDatas: [],
        allDatas: [],
        tableHeight: 400,
        currentRowIndex: -1,
        currentColumIndex: -1,
        currentPage: 0,
        pageItemCount: 20,
        addLoading: false,
        uploadLoading: false,
        fileList: [],
        baseurl: '',
        headers: {token: this.$util.getTokenid()},
        isError: false,
        exportDatas: {
          fileName: '消费者导入错误信息',
          title: '',
          data: [],
          columns: [],
          condition: '',
        }
      }
    },
    props: ['views'],

    components: {
        popUp
    },

    methods: {
      deleteRow(currentIndex, allIndex) {
        this.$confirm('确认删除此行?', '提示', {
          type: 'warning',
        }).then(() => {
          this.showDatas.splice(currentIndex, 1)
          this.allDatas.splice(allIndex, 1)
        }).catch(() => {

        });
      },

      changePage(page) {//page切换
        this.currentPage = page
        let begin = (page - 1) * this.pageItemCount
        let end = this.allDatas.length < page * this.pageItemCount ? this.allDatas.length : page * this.pageItemCount
        this.showDatas = this.allDatas.slice(begin, end)
      },

      //excel上传过程中
      handleAvatarProgress() {
        this.uploadLoading = true
      },
      //excel上传成功
      handleAvatarScucess(res, file) {
        this.isError = false
        this.uploadLoading = false
        if (res.result == 'ok') {
          if (res.List.length == 0) {
            this.$alert('没有读取到消费者信息数据，请按照标准格式编辑！', '提示', {
              confirmButtonText: '确定',
              type: 'error',
            })
            return
          }
          //将最后的空数据过滤掉
          let spliceIndex = -1
          for (let i = res.List.length - 1; i > 0; i--) {
            if (!res.List[i].name && !res.List[i].phone) {
              spliceIndex = i
            } else {
              break
            }
          }
          if (spliceIndex > -1) {
            res.List.splice(spliceIndex, res.List.length - spliceIndex)
          }
          res.List.forEach(item => {
            item.csny = this.$util.formatExcelDate(item.csny)
          })


          this.allDatas = res.List
          this.changePage(1)
        }
      },
      uploadErr() {
        this.$message('上传文件失败，请重新上传!','error');
        this.uploadLoading = false
      },
      beforeAvatarUpload(file) {
        let f_content = file.name
        let fileext = f_content.substring(f_content.lastIndexOf('.'), f_content.length)
        fileext = fileext.toLowerCase()
        if (fileext != '.xls') {
          this.$message('请上传excel 2003格式的文件!','error');
          return false
        }
        return true
      },
      downloadFile() {
        this.$http('/api/x6/getHyxxDowoLoadMbUrl.do', {}).then((response) => {
          window.location.href = response.url
        })
      },
      blueInut(val) {
        this.currentRowIndex = -1
        this.currentColumIndex = -1
      },
      //  保存
      doSave() {
        if (!this.allDatas || this.allDatas.length == 0) {
          this.$message('没有要保存的数据','warning');
          return
        }
        for (let index = 0; index < this.allDatas.length; index++) {
          if (!this.allDatas[index].name) {
            this.$message(`请完善第【${index + 1}】条信息的【姓名】`,'warning');
            return
          }
          if (!this.allDatas[index].phone || !this.$util.vartifyPhone(this.allDatas[index].phone)) {
            this.$message(`请完善第【${index + 1}】条信息的【手机号】`,'warning');
            return
          }
          if (this.allDatas[index].csny && !this.allDatas[index].csny.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)) {
            this.$message(`请校验第【${index + 1}】条信息的【出生日期】格式，参考【2017-10-10】,也可以不填`,'warning');
            return
          }

          if (this.allDatas[index].sex && this.allDatas[index].sex != '男' && this.allDatas[index].sex != '女') {
            this.$message(`请修改第【${index + 1}】条信息的【性别】，可选值为【男、女】，也可以不填`,'warning');
            return
          }
        }
        this.addLoading = true//开始请求
        this.importXfzxx()
      },
      importXfzxx() {
        let paras = new Set()
        this.allDatas.forEach((item => {
          paras.add({
            name: item.name,
            phone: item.phone,
            wx: item.wx ? item.wx : '',
            sex: item.sex ? (item.sex == '男' ? 0 : 1) : 0,
            csny: item.csny ? item.csny : ''
          })
        }))
        this.$http('/api/x6/importHyxx.do', {List: Array.from(paras)}).then((response) => {
          this.addLoading = false
          if (response.errorList && response.errorList.length > 0) {
            const h = this.$createElement
            this.isError = true
            this.$alert('\n\n', '提示', {
              confirmButtonText: '导出',
              cancelButtonText: '修改',
              showCancelButton: true,
              type: 'error',
              message: h('span', [h('i', '部分消费者信息导入失败！你可以继续以下操作：'), h('i', {
                style: {
                  display: 'block',
                  cursor: 'pointer',
                  color: '#58B7FF',
                  fontSize: '14px',
                  lineHeight: '24px'
                },
              }, '1、将导入失败的消费者信息导出为excel文档到电脑；'), h('i', {
                style: {
                  display: 'block',
                  cursor: 'pointer',
                  color: '#58B7FF',
                  fontSize: '14px',
                  lineHeight: '24px'
                },
              }, '2、修改错误信息，继续导入。')])
            }).then(() => {
//              console.log('success')
              this.exportExcel()
            }).catch(() => {
//              console.log('error')
            })
            response.errorList.forEach((item) => {
              item.sex = item.sex == '0' ? '男' : '女'
              item.csny = this.$util.formatExcelDate(item.csny)
            })
            this.allDatas = response.errorList
            this.changePage(1)

          } else {
            this.$emit('updateList')
            this.isError = false
            this.$message('消费者信息导入成功！')
            this.allDatas = []
            this.changePage(0)
            this.close()
          }

        }).catch(() => {
          this.addLoading = false
        })
      },

      exportExcel() {
        this.exportDatas.data = []
        this.exportDatas.columns = []
        let list = this.allDatas
        if (list.length == 0) {
          this.$confirm('没有要导出的数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          return
        }
        this.exportDatas.condition = ''
        this.exportDatas.title = ''
        this.exportDatas.columns.push({colName: '姓名（必填项并且列位置不可移动）', align: 'center', width: 300})
        this.exportDatas.columns.push({colName: '手机（必填项并且列位置不可移动）', align: 'center', width: 300})
        this.exportDatas.columns.push({colName: '生日（位置不可移动）', align: 'center', width: 200})
        this.exportDatas.columns.push({colName: '性别（位置不可移动）', align: 'center', width: 200})
        this.exportDatas.columns.push({colName: '微信（位置不可移动）', align: 'center', width: 200})
        list.forEach((item) => {
          let tmp = [
            item.name,
            item.phone,
            item.csny,
            item.sex == 0 ? '男' : '女',
            item.wx,
          ]
          this.exportDatas.data.push(tmp)
        })
        excel.open(this.exportDatas);
      },
      close() {
        if (this.allDatas && this.allDatas.length > 0) {
          this.$confirm('确定不保存表格数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.views.show=false;
            this.views.name='';
          }).catch(() => {
          })
        } else {
           this.views.show=false;
           this.views.name='';
        }
      }
    },

    mounted() {
      this.baseurl=this.$util.getServerUrl()+'/api/x6/uploadHyxxExcel.do';
    },
  }

</script>

<style lang="less" scoped>
  .content-container {
    height: 469px;
    .topLine {
      font-size: 15px;
      h3 {
        font-size: 17px;
      }
      span {
        display: block;
        line-height: 32px;
      }
      .notify {
        position: absolute;
        width: 40%;
        min-width: 350px;
        max-width: 580px;
        top: 10px;
        right: 2%;
        border: 1.5px solid blue;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 3px 10px;

        > i {
          display: block;
          font-size: 13px;
          line-height: 20px;
          .marked {
            color: red;
          }
        }
      }
    }
    .deleteStyle {
      font-size: 25px;
      color: #479bfd;
      cursor: pointer;
      position: relative;
      &:hover {
        color: #3057a0;
      }
    }
    .blueText {
      color: #479bfd;
    }

    .close {
      position: absolute;
      right: 20px;
      bottom: 10px;
    }
  }
</style>
