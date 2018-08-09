import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store'
import HttpService from './func/httpService'
import util from './func/util'
import {panel} from './func/panel'
import bus from './func/eventBus'
import 'animate.css'
import './styles/reset.css'
import './styles/common.css'
/**引入自定义指令和过滤器 */
import './public/directive'
import './public/filter'

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
/**公共方法 */
Vue.prototype.$util=util
Vue.config.productionTip = false
//http方法
Vue.prototype.$http=HttpService;
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

/**Message */
Vue.prototype.$message = function (msg, type = 'success') {
  Message({
      message: msg,
      type: type
  });
}
/**Alert/confirm*/
Vue.prototype.$alert = function (msg, title = '提示', type = 'warning') {
  MessageBox.alert(msg, title, {
      type: type
  });
}
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$dialog = function (msg = '', options = {}) {
  MessageBox.confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
  }).then(() => {
      options.success(options.params);
  });
}

/* eslint-disable no-new */
new Vue({
  el: '#root',
  router,
	template: '<App/>',
	components: {
    App
	}
})
