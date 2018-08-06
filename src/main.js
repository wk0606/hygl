import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/index'
import util from './func/util'
//import {$http} from './func/axios'
import {panel} from './func/panel'
import bus from './func/eventBus'
import 'animate.css'
import './styles/reset.css'
import './styles/common.css'

/**引入element */
import {
  Input,
  Button,
  Row,
  Col,
  Select,
  Option,
  OptionGroup,
  DatePicker,
  TimePicker,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  Radio,
  RadioGroup,
  Checkbox,
  Upload,
  Tabs,
  TabPane,
  Switch,
  Tag,
  Rate,
  Transfer,
  cascader,
  Steps,
  Step,
  
  Message,
  MessageBox
} from 'element-ui'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
Vue.use(Input)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Switch)
Vue.use(Tag)
Vue.use(Rate)
Vue.use(Transfer)
Vue.use(cascader)
Vue.use(Steps)
Vue.use(Step)
Vue.component(CollapseTransition.name, CollapseTransition)
/**vuex */
Vue.prototype.$store=store;
/**事件总线 */
Vue.prototype.$bus=bus;
/**Message */
Vue.prototype.$message=function(msg,type='success'){
  Message({
    message:msg,
    type:type
  });
}
/**Alert/confirm*/
Vue.prototype.$alert=function(msg,title='提示',type='warning'){
  MessageBox.alert(msg,title,{
    type:type
  });
}
Vue.prototype.$confirm=MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$dialog=function(msg='',options={}){
  MessageBox.confirm(msg,'提示',{
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(()=>{
    options.success(options.params);
  });
}
/**END */
Vue.prototype.$util=util
Vue.config.productionTip = false
// 拦截响应response，并做一些错误处理
// axios.interceptors.response.use(response=>{
//   console.log(response)
//   if(response.data.result=='ok'){
//     return response;
//   }
// },error=>{
//   console.log(error)
//   if(error.response){
//     console.log(error.response);
//   }
// });
//http方法
axios.defaults.baseURL = util.getBaseUrl();
axios.defaults.headers.common['token'] = util.getTokenid();
axios.defaults.timeout = 1000 * 60;
Vue.prototype.$http = function(url, options){
  var promise = new Promise(function (resolve, reject) {
      axios.post(url, options).then((res) => {
          if (res.data.result == 'ok') {
              resolve(res.data)
          }else if(res.data.result == 'timeout'){
            Message({
                message:'登录超时,请重新登录365',
                type:'error'
            });
            //console.log(this.$router.push('/main'))
          }else {
              Message({
                  message:res.data.message,
                  type:'error'
              });
              reject(res.data)
          }
      }).catch((err) => {
          Message({
              message:'未知错误',
              type:'error'
          });
          reject(err);
      });
  });
  return promise;
}
/**带过滤表头的渲染方法 */
Vue.prototype.renderFilterHead=function(h, {column, $index, store, _self}){
  return h('div', {
    style: {
      position: 'relative',
      overflow: 'visible',
      lineHeight:0
    }
  }, [h('span', {
    style:{
      width:'20px'
    }
  },column.label),
    h('i',
      {
        style: {
          cursor: 'pointer',
          fontSize: '13px',
          marginLeft:'10px',
          opacity: 1,
          color: '#aaa',
          zIndex: 5
        },
        class: {
          'iconfont': true,
          'icon-loudou': true
        },
        on:{
          click:function($event){
            panel.open({
              top:$event.target.getBoundingClientRect().bottom,
              left:$event.target.getBoundingClientRect().right,
              column:column.property,
              datas:_self.filterColumn.datas,
              filterColumn:_self.filterColumn
            },$event.target.parentNode);
          }
        }
      }
    )
  ]);
}
/**自定义指令 */
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
});
//调整fixed定位的位置--防止边界超出
Vue.directive('checkOutBounding',{
  update(el){
    var _right=el.getBoundingClientRect().right;
    var _left=el.getBoundingClientRect().left;
    var w=document.body.offsetWidth;
    //右边超出了边界
    if(_right>w){
      el.style.left=(_left-_right-10+w)+'px';
    }
    //左边超出了边界
    if(_left<0){
      el.style.left='10px';
    }
  }
})
/**自定义过滤器 */
Vue.filter('currency', function (value) {
  if (isNaN(parseInt(value))) {
    return value
  }
  if (!value) {
    return '0.00'
  } else if (value.toString().indexOf('.') == -1) {
    return value + '.00'
  } else {
    return value
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#root',
  router,
	template: '<App/>',
	components: {
    App
	}
})
