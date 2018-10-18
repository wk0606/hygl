<template>
  <div>
      <bread-nav :data="navs"></bread-nav>
      <div class="set-rz-container">
        <div class="set-rz-header">
          <img src="../../../../../assets/miyalogo.png" alt="">
          <b>苏州麦尔芽科技有限公司</b>
          <em></em>
          <span>店铺认证</span>
        </div>
        <!-- <div class="set-rz-tips">
          <div class="set-rz-title">
            <span>麦尔芽认证说明</span>
            <em>麦尔芽提供两种认证类型,请根据实际情况任选一种</em>
          </div>
          <p>个人认证 : 大陆身份证默认进行实时快速认证；审核周期为1个工作日；</p>
          <p>企业认证 : 适合公司经营者；审核周期为3个工作日；</p>
        </div> -->
        <div
          ref="body"
          style="padding-bottom:30px;position:relative;"
         >
          <i
            v-if="details.isValidate>0"
            class="iconfont sh-status"
            :class="details.isValidate==1?'icon-audit zt1':details.isValidate==3?'icon-shenhebutongguo  zt2':'icon-tupian  zt3'"
          ></i>
          <div v-if="details.isValidate==0||details.isValidate==3">
            <!-- 联系信息 -->
            <div class="form-area">
              <div class="form-area-title">联系信息</div>
              <div class="form-area-body">
                <div class="form-item">
                  <span class="required">联系人姓名</span>
                  <div>
                    <el-input size="mini" v-model="details.userName" clearable @input="rules.userName.show=false"></el-input>
                    <span v-if="details.isValidate==3" class="error">
                      <i :class="nopassKeys.userName?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                      {{nopassKeys.userName}}
                    </span>
                    <p class="tips error" v-if="rules.userName.show">{{rules.userName.label}}</p>
                    <p class="tips">请填写商户微信支付业务联系人的真实姓名,我们会在微信签约时进行实名认证</p> 
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">手机号码</span>
                  <div>
                    <div class="form-item-phone">
                      <div>+86</div>
                      <el-input
                        size="mini"
                        v-model="details.userPhone"
                        @input="rules.userPhone.show=false"
                        style="width:260px;"
                        clearable
                      ></el-input>
                      <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.userPhone?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.userPhone}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.userPhone.show">{{rules.userPhone.label}}</p>
                    <p class="tips">用于接收微信支付的重要管理信息及日常操作验证码,我们会在微信签约时进行短信验证</p>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">常用邮箱</span>
                  <div>
                    <el-input size="mini" v-model="details.email" clearable @input="rules.email.show=false"></el-input>
                    <span v-if="details.isValidate==3" class="error">
                      <i :class="nopassKeys.email?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                      {{nopassKeys.email}}
                    </span>
                    <p class="tips error" v-if="rules.email.show">{{rules.email.label}}</p>
                    <p class="tips">非常重要!用于接收微信支付的账号密码</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- 经营信息 -->
            <div class="form-area">
              <div class="form-area-title">经营信息</div>
              <div class="form-area-body">
                <div class="form-item">
                  <span class="required">商户简称</span>
                  <div>
                    <el-input size="mini" v-model="details.shjc" clearable @input="rules.shjc.show=false"></el-input>
                    <span v-if="details.isValidate==3" class="error">
                      <i :class="nopassKeys.shjc?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                      {{nopassKeys.shjc}}
                    </span>
                    <p class="tips error" v-if="rules.shjc.show">{{rules.shjc.label}}</p>
                    <p class="tips">该简称将在支付完成页向买家展示,需与微信经营类目相关</p>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">经营类目</span>
                  <div>
                    <div class="form-item-lm">
                      <p>
                        <span>{{details.zylm?`您已选择 : ${details.zylm}`:'请在下方选择正确的经营类目'}}</span>
                        <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.zylm?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.zylm}}
                        </span>
                      </p>
                      <div>
                        <div
                          class="form-item-lm-input"
                        >
                          <input type="text" placeholder="请选择">
                          <i class="el-icon-search"></i>
                        </div>
                        <ul>
                          <li @click="details.zylm='企业';rules.zylm.show=false;">企业</li>
                          <li @click="details.zylm='个体工商户';rules.zylm.show=false;">个体工商户</li>
                        </ul>
                      </div>
                    </div>
                    <p class="tips error" v-if="rules.zylm.show">{{rules.zylm.label}}</p>
                    <p class="tips">请根据你的营业执照和实际售卖商品来选择主体和类目,审核通过后类目不可修改</p>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">门店地址</span>
                  <div>
                    <el-input size="mini" v-model="details.mdjtdz" clearable @input="rules.mdjtdz.show=false"></el-input>
                    <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.mdjtdz?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.mdjtdz}}
                    </span>
                    <p class="tips error" v-if="rules.mdjtdz.show">{{rules.mdjtdz.label}}</p>
                    <p class="tips">请填写详细的经营场所地址，如有多个场所，选择一个主要场所填写即可</p>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">客服电话</span>
                  <div>
                    <el-input size="mini" clearable v-model="details.kfdh" @input="rules.kfdh.show=false"></el-input>
                    <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.kfdh?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.kfdh}}
                    </span>
                    <p class="tips error" v-if="rules.kfdh.show">{{rules.kfdh.label}}</p>
                    <p class="tips">请正确填写客服电话，座机务必填写区号，格式如（座机：0755-XXXXXXXX；手机：136XXXXXXXX；400电话：400XXXXXXX）</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- 商户信息 -->
            <div class="form-area">
              <div class="form-area-title">商户信息</div>
              <div class="form-area-body">

                <div class="form-area-type">营业执照</div>

                <div class="form-item">
                  <span class="required">营业执照照片</span>
                  <div>
                    <p class="tips">需年检章齐全（当年成立公司除外）;</p>
                    <p class="tips">必须为彩色图片且小于2M，文件格式为bmp、png、jpeg、jpg或gif</p>
                    <el-button size="mini" style="margin-top:10px;" :loading="load&&currentBtn=='yyzzUrl'" @click="selectImg('yyzzUrl')">上传文件</el-button>
                    <div class="form-item-yyzz">
                      <div
                        v-if="details.yyzzUrl"
                        :style="{backgroundImage:'url('+details.yyzzUrl+')'}"
                      ></div>
                      <span>样张：</span>
                      <div class='form-item-yyzp'></div>

                      <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.yyzzUrl?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.yyzzUrl}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.yyzzUrl.show">{{rules.yyzzUrl.label}}</p>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">营业执照注册号</span>
                  <div>
                    <el-input size="mini" clearable v-model="details.yyzzNum" @input="rules.yyzzNum.show=false"></el-input>
                    <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.yyzzNum?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.yyzzNum}}
                    </span>
                    <p class="tips error" v-if="rules.yyzzNum.show">{{rules.yyzzNum.label}}</p>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">营业期限</span>
                  <div>
                    <div>
                      <date-picker
                        hide-picker
                        :type="details.isyyzzcq?'date':'daterange'"
                        separator="至"
                        :date.sync="details.yyqx"
                        @change="rules.yyqx.show=false"
                      ></date-picker>
                      <el-checkbox
                        style="margin-left:10px"
                        label="长期"
                        v-model="details.isyyzzcq"
                      ></el-checkbox>
                      <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.yyqx?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.yyqx}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.yyqx.show">{{rules.yyqx.label}}</p>
                    <p class="tips">证件有效期限需与上传文件上所示期限一致，若有效期超过2100年，请选择“长期”</p>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">经营范围</span>
                  <div>
                    <div>
                      <el-input
                        type="textarea"
                        style="width:300px;font-size:12px;font-family:'microsoft yahei';"
                        :rows="4"
                        v-model="details.jyfw"
                        @input="rules.jyfw.show=false"
                      ></el-input>
                      <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.jyfw?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.jyfw}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.jyfw.show">{{rules.jyfw.label}}</p>
                    <p class="tips">与企业工商营业执照上一致</p>
                  </div>
                </div>

                <div class="form-area-type">基本信息</div>

                <div class="form-item">
                  <span class="required">商户名称</span>
                  <div>
                    <div>
                      <el-input size="mini" clearable v-model="details.shmc" @input="rules.shmc.show=false"></el-input>
                      <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.shmc?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.shmc}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.shmc.show">{{rules.shmc.label}}</p>
                    <p class="tips">商户名称需与营业执照登记公司名称一致</p>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">注册地址</span>
                  <div>
                    <div>
                      <el-input size="mini"  clearable v-model="details.registdz" @input="rules.registdz.show=false"></el-input>
                      <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.registdz?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.registdz}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.registdz.show">{{rules.registdz.label}}</p>
                    <p class="tips">注册地址需与营业执照登记住所一致</p>
                  </div>
                </div>

                <div class="form-area-type">组织机构代码证</div>

                <div class="form-item">
                  <span class="required">组织机构代码</span>
                  <div>
                    <div>
                      <el-input size="mini" clearable v-model="details.zzjgdm" @input="rules.zzjgdm.show=false"></el-input>
                      <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.zzjgdm?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.zzjgdm}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.zzjgdm.show">{{rules.zzjgdm.label}}</p>
                    <p class="tips">请输入9位组织机构代码</p>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">营业期限</span>
                  <div>
                    <div>
                      <date-picker
                        hide-picker
                        separator="至"
                        :date.sync="details.zzjgqx"
                        :type="details.iszzjgcq?'date':'daterange'"
                        @change="rules.zzjgqx.show=false"
                      ></date-picker>
                      <el-checkbox
                        style="margin-left:10px"
                        label="长期"
                        v-model="details.iszzjgcq"
                      ></el-checkbox>
                      <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.zzjgqx?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.zzjgqx}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.zzjgqx.show">{{rules.zzjgqx.label}}</p>
                    <p class="tips">证件有效期限需与上传文件上所示期限一致，若有效期超过2100年，请选择“长期”</p>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">组织机构代码证照片</span>
                  <div>
                    <p class="tips">必须为彩色图片且小于2M，文件格式为bmp、png、jpeg、jpg或gif</p>
                    <el-button size="mini" style="margin-top:10px;" :loading="load&&currentBtn=='zzjgUrl'" @click="selectImg('zzjgUrl')">上传文件</el-button>
                    <div class="form-item-yyzz" v-if="details.zzjgUrl">
                      <div :style="{backgroundImage:`url(${details.zzjgUrl})`}"></div>
                      <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.zzjgUrl?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.zzjgUrl}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.zzjgUrl.show">{{rules.zzjgUrl.label}}</p>
                  </div>
                </div>

                <div class="form-area-type">企业法人/经办人</div>

                <div class="form-item">
                  <span class="required">证件持有人类型</span>
                  <div>
                    <el-select size="mini" v-model="details.zjcyrlx" @change="rules.zjcyrlx.show=false">
                      <el-option label="法人" :value="0"></el-option>
                      <el-option label="经办人" :value="1"></el-option>
                    </el-select>
                    <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.zjcyrlx?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.zjcyrlx}}
                    </span>
                    <p class="tips error" v-if="rules.zjcyrlx.show">{{rules.zjcyrlx.label}}</p>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">证件类型</span>
                  <div>
                    <el-select size="mini" v-model="details.zjlx" @change="rules.zjlx.show=false">
                      <el-option label="身份证（限中国大陆居民)" :value="0"></el-option>
                      <el-option label="护照（限境外人士）" :value="1"></el-option>
                    </el-select>
                    <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.zjlx?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.zjlx}}
                    </span>
                    <p class="tips error" v-if="rules.zjlx.show">{{rules.zjlx.label}}</p>
                  </div>
                </div>

                <div class="form-item" v-if="details.zjlx===0">
                  <span class="required">身份证正面照片</span>
                  <div>
                    <p class="tips">必须为彩色图片且小于2M，文件格式为bmp、png、jpeg、jpg或gif</p>
                    <el-button size="mini" style="margin-top:10px;" :loading="load&&currentBtn=='zjupUrl'" @click="selectImg('zjupUrl')">上传文件</el-button>
                    <div class="form-item-yyzz form-item-sfz">
                      <div
                        v-if="details.zjupUrl"
                        :style="{backgroundImage:`url(${details.zjupUrl})`}"
                      ></div>
                      <span>样张:</span>
                      <div class="form-item-sfz1"></div>
                      <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.zjupUrl?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.zjupUrl}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.zjupUrl.show">{{rules.zjupUrl.label}}</p>
                  </div>
                </div>

                <div class="form-item" v-if="details.zjlx===0">
                  <span class="required">身份证反面照片</span>
                  <div>
                    <p class="tips">必须为彩色图片且小于2M，文件格式为bmp、png、jpeg、jpg或gif</p>
                    <el-button size="mini" style="margin-top:10px;" :loading="load&&currentBtn=='zjdownUrl'" @click="selectImg('zjdownUrl')">上传文件</el-button>
                    <div class="form-item-yyzz form-item-sfz">
                      <div
                        v-if="details.zjdownUrl"
                        :style="{backgroundImage:`url(${details.zjdownUrl})`}"
                      ></div>
                      <span>样张:</span>
                      <div class="form-item-sfz2"></div>
                      <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.zjdownUrl?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.zjdownUrl}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.zjdownUrl.show">{{rules.zjdownUrl.label}}</p>
                  </div>
                </div>
                
                <div class="form-item" v-if="details.zjlx===1">
                  <span class="required">证件影印件</span>
                  <div>
                    <p class="tips">必须为彩色图片且小于2M，文件格式为bmp、png、jpeg、jpg或gif</p>
                    <el-button size="mini" style="margin-top:10px;" :loading="load&&currentBtn=='zjyyjUrl'" @click="selectImg('zjyyjUrl')">上传文件</el-button>
                    <div class="form-item-yyzz" v-if="details.zjyyjUrl">
                      <div
                        :style="{backgroundImage:`url(${details.zjyyjUrl})`}"
                      ></div>
                      <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.zjyyjUrl?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.zjyyjUrl}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.zjyyjUrl.show">{{rules.zjyyjUrl.label}}</p>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">证件号码</span>
                  <div>
                    <el-input size="mini" clearable v-model="details.zjnum" @input="rules.zjnum.show=false"></el-input>
                    <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.zjnum?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.zjnum}}
                    </span>
                    <p class="tips error" v-if="rules.zjnum.show">{{rules.zjnum.label}}</p>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">证件持有人姓名</span>
                  <div>
                    <el-input size="mini" clearable v-model="details.zjcyrmc" @input="rules.zjcyrmc.show=false"></el-input>
                    <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.zjcyrmc?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.zjcyrmc}}
                    </span>
                    <p class="tips error" v-if="rules.zjcyrmc.show">{{rules.zjcyrmc.label}}</p>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">证件有效期</span>
                  <div>
                    <div>
                      <date-picker
                        hide-picker
                        separator="至"
                        :date.sync="details.zjyxq"
                        :type="details.iszjcq?'date':'daterange'"
                        @change="rules.zjyxq.show=false"
                      ></date-picker>
                      <el-checkbox
                        style="margin-left:10px"
                        label="长期"
                        v-model="details.iszjcq"
                      ></el-checkbox>
                      <span v-if="details.isValidate==3" class="error">
                          <i :class="nopassKeys.zjyxq?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                          {{nopassKeys.zjyxq}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.zjyxq.show">{{rules.zjyxq.label}}</p>
                    <p class="tips">证件有效期限需与上传文件上所示期限一致，若有效期超过2100年，请选择“长期”</p>
                  </div>
                </div>

              </div>
            </div>
            <!-- 结算账户 -->
            <div class="form-area">
              <div class="form-area-title">结算账户</div>
              <div class="form-area-body">
                <div class="form-item">
                  <span class="required">账户类型</span>
                  <div>
                    <el-select
                      size="mini"
                      v-model="details.zhlx"
                      style="width:300px;"
                    >
                      <el-option label="对公账户" :value="0"></el-option>
                      <el-option label="对私账户" :value="1"></el-option>
                    </el-select>
                    <span v-if="details.isValidate==3" class="error">
                      <i :class="nopassKeys.zhlx?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                      {{nopassKeys.zhlx}}
                    </span>
                  </div>
                </div>
                <div class="form-item">
                  <span>开户名称</span>
                  <div>
                    <div>
                      <el-input size="mini" v-model="details.khmc" clearable></el-input>
                      <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.khmc?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.khmc}}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">开户银行</span>
                  <div>
                    <div>
                      <el-select size="mini" v-model="details.khyh" style="width:300px;" @change="rules.khyh.show=false">
                        <el-option
                          v-for="item in bankList"
                          :key="item"
                          :label="item"
                          :value="item"
                        >{{item}}</el-option>
                      </el-select>
                      <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.khyh?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.khyh}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.khyh.show">{{rules.khyh.label}}</p>
                    <p class="tips">如果找不到开户银行，请选择其他银行</p>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">开户银行城市</span>
                  <div>
                    <div>
                      <el-select size="mini" v-model="details.khyhpro" style="width:147px;"  @change="rules.khyhpro.show=false">
                        <el-option
                          v-for="(city,key) in map"
                          :key="key"
                          :label="key"
                          :value="key"
                        >{{key}}</el-option>
                      </el-select>
                      <el-select size="mini" v-model="details.khyhcity" style="width:147px;" @change="rules.khyhcity.show=false">
                        <el-option
                          v-for="item in map[details.khyhpro]"
                          :key="item"
                          :label="item"
                          :value="item"
                        >{{item}}</el-option>
                      </el-select>
                      <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.khcs?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.khcs}}
                      </span>
                    </div>
                    <p class="tips error" v-if="rules.khyhpro.show">{{rules.khyhpro.label}}</p>
                    <p class="tips error" v-if="rules.khyhcity.show">{{rules.khyhcity.label}}</p>
                    <p class="tips">如果找不到所在城市，请选择所在地区或者上级城市</p>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">开户支行</span>
                  <div>
                    <div>
                      <el-input size="mini" v-model="details.khzh" @input="rules.khzh.show=false" clearable></el-input>
                      <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.khzh?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.khzh}}
                      </span>
                    </div>
                    <p class="tips error" v-show="rules.khzh.show">{{rules.khzh.label}}</p>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">银行账号</span>
                  <div>
                    <div>
                      <el-input size="mini" v-model="details.yhzh" @input="rules.yhzh.show=false" clearable></el-input>
                      <span v-if="details.isValidate==3" class="error">
                        <i :class="nopassKeys.yhzh?'el-icon-circle-close':'el-icon-circle-check zt3'"></i>
                        {{nopassKeys.yhzh}}
                      </span>
                    </div>
                    <p class="tips error" v-show="rules.yhzh.show">{{rules.yhzh.label}}</p>
                    <p class="tips">你选择的是对公账户，请务必填写开户名为“{{details.khmc}}”的银行账号</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            style="position:relative;"
            >
            <!-- 联系信息 -->
            <div class="form-area">
              <div class="form-area-title">联系信息</div>
              <div class="form-area-body">
                <div class="form-item">
                  <span class="required">联系人姓名</span>
                  <div>
                    <span class="form-item-text">{{details.userName}}</span>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">手机号码</span>
                  <div>
                    <div class="form-item-phone">
                      <div>+86</div>
                      <span>{{details.userPhone}}</span>
                    </div>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">常用邮箱</span>
                  <div class="form-item-text">{{details.email}}</div>
                </div>
              </div>
            </div>
            <!-- 经营信息 -->
            <div class="form-area">
              <div class="form-area-title">经营信息</div>
              <div class="form-area-body">
                <div class="form-item">
                  <span class="required">商户简称</span>
                  <div class="form-item-text">
                    {{details.shjc}}
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">经营类目</span>
                  <div>
                    <span class="form-item-text">{{details.zylm}}</span>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">门店地址</span>
                  <div class="form-item-text">
                    {{details.mdjtdz}}
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">客服电话</span>
                  <div class="form-item-text">
                    {{details.kfdh}}
                  </div>
                </div>
              </div>
            </div>
            <!-- 商户信息 -->
            <div class="form-area">
              <div class="form-area-title">商户信息</div>
              <div class="form-area-body">

                <div class="form-area-type">营业执照</div>

                <div class="form-item">
                  <span class="required">营业执照照片</span>
                  <div class="form-item-yyzz">
                    <div
                        :style="{backgroundImage:'url('+details.yyzzUrl+')'}"
                    ></div>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">营业执照注册号</span>
                  <div class="form-item-text">
                    {{details.yyzzNum}}
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">营业期限</span>
                  <div class="form-item-text">
                    <span>{{details.yyqx[0]}}</span>
                    <span v-if="!details.isyyzzcq">至</span>
                    <span v-if="!details.isyyzzcq">{{details.yyqx[1]}}</span>
                    <span v-if="details.isyyzzcq">(长期)</span>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">经营范围</span>
                  <div class="form-item-text">
                    {{details.jyfw}}
                  </div>
                </div>

                <div class="form-area-type">基本信息</div>

                <div class="form-item">
                  <span class="required">商户名称</span>
                  <div class="form-item-text">
                    {{details.shmc}}
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">注册地址</span>
                  <div class="form-item-text">
                    {{details.registdz}}
                  </div>
                </div>

                <div class="form-area-type">组织机构代码证</div>

                <div class="form-item">
                  <span class="required">组织机构代码</span>
                  <div class="form-item-text">
                    {{details.zzjgdm}}
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">营业期限</span>
                  <div class="form-item-text">
                    <span>{{details.zzjgqx[0]}}</span>
                    <span v-if="!details.iszzjgcq">至</span>
                    <span v-if="!details.iszzjgcq">{{details.zzjgqx[1]}}</span>
                    <span v-if="details.iszzjgcq">(长期)</span>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">组织机构代码证照片</span>
                  <div class="form-item-yyzz">
                    <div
                        :style="{backgroundImage:'url('+details.zzjgUrl+')'}"
                    ></div>
                  </div>
                </div>

                <div class="form-area-type">企业法人/经办人</div>

                <div class="form-item">
                  <span class="required">证件持有人类型</span>
                  <div class="form-item-text">
                    {{details.zjcyrlx?'法人':'经办人'}}
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">证件类型</span>
                  <div class="form-item-text">
                    {{details.zjlx?'护照':'身份证'}}
                  </div>
                </div>

                <div class="form-item" v-if="details.zjlx===0">
                  <span class="required">身份证正面照片</span>
                  <div class="form-item-yyzz form-item-sfz">
                    <div
                        :style="{backgroundImage:'url('+details.zjupUrl+')'}"
                    ></div>
                  </div>
                </div>

                <div class="form-item" v-if="details.zjlx===0">
                  <span class="required">身份证反面照片</span>
                  <div class="form-item-yyzz form-item-sfz">
                    <div
                        :style="{backgroundImage:'url('+details.zjdownUrl+')'}"
                    ></div>
                  </div>
                </div>
                
                <div class="form-item" v-if="details.zjlx===1">
                  <span class="required">证件影印件</span>
                  <div class="form-item-yyzz">
                    <div
                        :style="{backgroundImage:'url('+details.zjyyjUrl+')'}"
                    ></div>
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">证件号码</span>
                  <div class="form-item-text">
                    {{details.zjnum}}
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">证件持有人姓名</span>
                  <div class="form-item-text">
                    {{details.zjcyrmc}}
                  </div>
                </div>

                <div class="form-item">
                  <span class="required">证件有效期</span>
                  <div class="form-item-text">
                    <span>{{details.zjyxq[0]}}</span>
                    <span v-if="!details.iszjcq">至</span>
                    <span v-if="!details.iszjcq">{{details.zjyxq[1]}}</span>
                    <span v-if="details.iszjcq">(长期)</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 结算账户 -->
            <div class="form-area">
              <div class="form-area-title">结算账户</div>
              <div class="form-area-body">
                <div class="form-item">
                  <span class="required">账户类型</span>
                  <div>
                    <span class="form-item-text">{{details.zhlx?'对私账户':'对公账户'}}</span>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">开户名称</span>
                  <div>
                    <span class="form-item-text">{{details.khmc||'未填写'}}</span>
                  </div>
                </div>
                <div class="form-item">
                  <span class="required">开户银行</span>
                  <div class="form-item-text">{{details.khyh}}</div>
                </div>
                <div class="form-item">
                  <span class="required">开户银行城市</span>
                  <div class="form-item-text">{{details.khyhpro+'-'+details.khyhcity}}</div>
                </div>
                <div class="form-item">
                  <span class="required">开户支行</span>
                  <div class="form-item-text">{{details.khzh}}</div>
                </div>
                <div class="form-item">
                  <span class="required">银行账号</span>
                  <div class="form-item-text">{{details.yhzh}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-save-btn" :style="{width:footerWidth+'px'}">
            <el-button
              size="mini"
              type="primary"
              :disabled="details.isValidate==2?true:false"
              @click="doClick"
              :loading="load"
            >{{details.isValidate==1?'撤回审核':'提交审核'}}</el-button>
          </div>
        </div>
      </div>
      <input type="file" ref="file" @change="uploadImg" style="display:none;"/>
  </div>
</template>
<script>
import breadNav from '../../../../../components/breadNav/index'
import citySelect from '../../../../../components/citySelect/index'
import maps from '../../../../../components/maps/index'
import smsCode from '../../../../../components/smsCode/index'
import datePicker from '../../../../../components/datePicker/index'
import lrz from 'lrz'
import {jylm} from '../../../../../func/jylm'
import {banks} from '../../../../../public/wx_bank'
export default {
  data(){
    return {
      navs:[
        {label:'店铺信息',path:'/main/mall/shop/set_dp'},
        {label:'店铺认证'}
      ],
      currentBtn:'',
      load:false,
      rules:{
        userName:{show:false,label:'姓名不可为空'},
        userPhone:{show:false,label:''},
        email:{show:true,label:''},
        shjc:{show:false,label:'商户简称不可为空'},
        zylm:{show:false,label:'经营类目不可为空'},
        mdjtdz:{show:false,label:'店铺地址不可为空'},
        kfdh:{show:false,label:''},
        yyzzUrl:{show:false,label:'请上传营业执照'},
        yyzzNum:{show:false,label:'营业执照号码不可为空'},
        yyqx:{show:false,label:''},
        isyyzzcq:false,
        jyfw:{show:false,label:'经营范围不可为空'},
        shmc:{show:false,label:'商户名称不可为空'},
        registdz:{show:false,label:'注册地址不可为空'},
        zzjgdm:{show:false,label:''},
        zzjgqx:{show:false,label:''},
        iszzjgcq:false,
        zzjgUrl:{show:false,label:'请上传组织机构代码证照片'},
        zjcyrlx:{show:false,label:'请选择证件持有人类型'},
        zjlx:{show:false,label:'请选择证件类型'},
        zjupUrl:{show:false,label:'请上传身份证正面照片'},
        zjdownUrl:{show:false,label:'请上传身份证反面照片'},
        zjyyjUrl:{show:false,label:'请上传证件影印件照片'},
        zjnum:{show:false,label:'证件号码不可为空'},
        zjcyrmc:{show:false,label:'证件号码持有人不可为空'},
        zjyxq:{show:false,label:''},
        iszjcq:false,
        khyh:{show:false,label:'开户银行不可为空'},
        khyhpro:{show:false,label:'请选择开户银行省份'},
        khyhcity:{show:false,label:'请选择开户银行城市'},
        khzh:{show:false,label:'开户支行不可为空'},
        yhzh:{show:false,label:'银行账户不可为空'}
      },
      details:{
        isValidate:0,
        userName:'',
        userPhone:'',
        email:'',
        shjc:'',
        zylm:'',
        mdjtdz:'',
        kfdh:'',
        yyzzUrl:'',
        yyzzNum:'',
        yyqx:[],
        isyyzzcq:false,
        jyfw:'',
        shmc:'',
        registdz:'',
        zzjgdm:'',
        zzjgqx:[],
        iszzjgcq:false,
        zzjgUrl:'',
        zjcyrlx:'',
        zjlx:'',
        zjupUrl:'',
        zjdownUrl:'',
        zjyyjUrl:'',
        zjnum:'',
        zjcyrmc:'',
        zjyxq:[],
        iszjcq:false,
        zhlx:0,
        khmc:'',
        khyh:'',
        khyhpro:'',
        khyhcity:'',
        khzh:'',
        yhzh:''
      },
      nopassKeys:{},
      footerWidth:0,
      load:false,
      bankList:[],
      map:{}
    }
  },
  methods:{
    getDetails(){
      this.$http('/api/x6/getHysetRzInfo.do').then(res=>{
        if(res.VO.isValidate>0){
          this.nopassKeys=res.VO.reason;
          delete res.VO.reason;
          res.VO.isyyzzcq=res.VO.isyyzzcq?true:false;
          res.VO.iszzjgcq=res.VO.iszzjgcq?true:false;
          res.VO.iszjcq=res.VO.iszjcq?true:false;
          res.VO.yyqx=[res.VO.yyqxq,res.VO.yyqxz];
          res.VO.zjyxq=[res.VO.zjyxqq,res.VO.zjyxqz];
          res.VO.zzjgqx=[res.VO.zzjgqxq,res.VO.zzjgqxz];
          delete res.VO.yyqxq;
          delete res.VO.yyqxz;
          delete res.VO.zjyxqq;
          delete res.VO.zjyxqz;
          delete res.VO.zzjgqxq;
          delete res.VO.zzjgqxz;
          this.details=res.VO;
        }
      });
    },
    selectImg(key){
      this.currentBtn=key;
      this.$refs.file.click();
    },
    uploadImg(){
      var file=this.$refs.file.files[0];
      var gs=['bmp','png','jpeg','jpg','gif'];
      this.$refs.file.value='';
      if(gs.indexOf(file.type.split('/')[1])==-1){
          this.$message('文件格式有误','error');
      }else if(file.size>2*1024*1024){
          this.$message('文件超过2M,请重新选择','error');
      }else{
          this.load=true;
          lrz(file).then(rst=>{
              rst.formData.append('base64img', rst.base64);
              this.$http('/api/x6/saveOtherPic.do',rst.formData).then(res=>{
                  // this.$message('上传成功');
                  this.load=false;
                  this.details[this.currentBtn]=res.file_path;
                  this.rules[this.currentBtn].show=false;
              },err=>{
                this.load=false;
              });
          });
      }
    },
    doClick(){
      if(this.details.isValidate==1){
        this.details.isValidate=0;
      }else{
        this.save();
      }
    },
    save(){
      var flag=this.vartifyForm();
      if(!flag){
        this.$message('请将信息填写完整','error');
      }else{
        this.load=true;
        let params=JSON.parse(JSON.stringify(this.details));
        params.isyyzzcq=params.isyyzzcq?1:0;
        params.iszzjgcq=params.iszzjgcq?1:0;
        params.iszjcq=params.iszjcq?1:0;
        params.yyqxq=params.yyqx[0];
        params.yyqxz=params.yyqx[1];
        params.zjyxqq=params.zjyxq[0];
        params.zjyxqz=params.zjyxq[1];
        params.zzjgqxq=params.zzjgqx[0];
        params.zzjgqxz=params.zzjgqx[1];
        params.gsdm=this.$util.getCache('user').gsdm;
        delete params.yyqx;
        delete params.zjyxq;
        delete params.zzjgqx;
        if(params.zjlx){
          params.zjupUrl='';
          params.zjdownUrl='';
        }else{
          params.zjyyjUrl='';
        }
        this.$http('/api/x6/saveHysetRzInfo.do',params).then(res=>{
          this.$message('提交成功');
          this.details.isValidate=1;
          this.load=false;
        },err=>{
          this.load=false;
        });
      }
    },
    vartifyForm(){
      let flag=true;
      let nonull=['userName','shjc','zylm','mdjtdz','yyzzUrl','yyzzNum','jyfw','shmc','registdz','zzjgUrl','zjnum','zjcyrmc','khyh','khyhpro','khyhcity','khzh','yhzh'];
      for(let key in this.details){
        if(nonull.indexOf(key)>-1&&this.details[key].trim()===''){
          this.rules[key].show=true;
          flag=false;
        }
        if(key=='zjcyrlx'||key=='zjlx'){
          if(this.details[key]===''){
            this.rules[key].show=true;
            flag=false;
          }
        }
        //,'zjupUrl','zjdownUrl',,,'zjyyjUrl'
        if(this.details.zjlx===0){
          if(!this.details.zjupUrl){
            this.rules.zjupUrl.show=true;
            flag=false;
          }
          if(!this.details.zjdownUrl){
            this.rules.zjdownUrl.show=true;
            flag=false;
          }
        }
        if(this.details.zjlx===1){
          if(!this.details.zjyyjUrl){
            this.rules.zjyyjUrl.show=true;
            flag=false;
          }
        }
        if(key=='userPhone'){
          if(!this.details.userPhone){
            this.rules.userPhone.show=true;
            this.rules.userPhone.label='联系人电话不可为空';
            flag=false;
          }
          if(this.details.userPhone&&!/^1[0-9]{10}$/.test(this.details.userPhone)){
            this.rules.userPhone.show=true;
            this.rules.userPhone.label='手机号格式有误';
            flag=false;
          }
        }
        if(key=='email'){
          if(!this.details.email){
            this.rules.email.show=true;
            this.rules.email.label='邮箱不可为空';
            flag=false;
          }
          if(this.details.email&&!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this.details.email)){
            this.rules.email.show=true;
            this.rules.email.label='邮箱格式有误';
            flag=false;
          }
        }
        if(key=='kfdh'){
          if(!this.details.kfdh){
            this.rules.kfdh.show=true;
            this.rules.kfdh.label='客服电话不可为空';
            flag=false;
          }
          if(this.details.kfdh){
            if(!/^0[0-9]{2,3}-{1}[0-9]{8}$/.test(this.details.kfdh)&&!/^400[0-9]{7}$/.test(this.details.kfdh)&&!/^1[0-9]{10}$/.test(this.details.kfdh)){
              this.rules.kfdh.show=true;
              this.rules.kfdh.label='客服电话格式有误';
              flag=false;
            }
          }
        }
        if(key=='yyqx'){
          if(!this.details.isyyzzcq&&!this.details.yyqx[0]||!this.details.isyyzzcq&&!this.details.yyqx[1]){
            this.rules.yyqx.show=true;
            this.rules.yyqx.label='请将营业期限选择完整';
            flag=false;
          }
          if(this.details.isyyzzcq&&!this.details.yyqx[0]){
            this.rules.yyqx.show=true;
            this.rules.yyqx.label='请将营业期限选择完整';
            flag=false;
          }
        }
        if(key=='zzjgqx'){
          if(!this.details.iszzjgcq&&!this.details.zzjgqx[0]||!this.details.iszzjgcq&&!this.details.zzjgqx[1]){
            this.rules.zzjgqx.show=true;
            this.rules.zzjgqx.label='请将营业期限选择完整';
            flag=false;
          }
          if(this.details.iszzjgcq&&!this.details.zzjgqx[0]){
            this.rules.zzjgqx.show=true;
            this.rules.zzjgqx.label='请将营业期限选择完整';
            flag=false;
          }
        }
        if(key=='zjyxq'){
          if(!this.details.iszjcq&&!this.details.zjyxq[0]||!this.details.iszjcq&&!this.details.zjyxq[1]){
            this.rules.zjyxq.show=true;
            this.rules.zjyxq.label='请将营业期限选择完整';
            flag=false;
          }
          if(this.details.iszjcq&&!this.details.zjyxq[0]){
            this.rules.zjyxq.show=true;
            this.rules.zjyxq.label='请将营业期限选择完整';
            flag=false;
          }
        }
        if(key=='zzjgdm'&&!this.details.zzjgdm){
          this.rules.zzjgdm.show=true;
          this.rules.zzjgdm.label='组织机构代码不可为空';
          flag=false;
        }
        if(key=='zzjgdm'&&this.details.zzjgdm&&this.details.zzjgdm.length!==9){
          this.rules.zzjgdm.show=true;
          this.rules.zzjgdm.label='组织机构代码位数有误';
          flag=false;
        }
      }
      return flag;
    }
  },
  mounted(){
    this.footerWidth=this.$refs.body.offsetWidth;
    this.bankList=banks;
    this.map=this.$util.getCache('map');
    this.getDetails();
  },
  components:{
    breadNav,
    citySelect,
    maps,
    smsCode,
    datePicker
  }
}
</script>
<style lang="less" scoped>
  @import './dprz.less';
</style>