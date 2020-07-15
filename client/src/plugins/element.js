import Vue from 'vue'
// 按需引入 element-ui 组件
import {
  Button, Message, Container, Header, Main, Alert, Card, Select, Option,
  Popover, Divider, RadioGroup, Radio, Input, ColorPicker, Switch, Dialog
} from 'element-ui'
// 国际化配置
import enLang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(enLang)
// 将组建添加到 Vue 实例中
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Alert)
Vue.use(Card)
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Popover)
Vue.use(Divider)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Input)
Vue.use(ColorPicker)
Vue.use(Switch)
Vue.use(Dialog)
// 全局挂载 message 组件
Vue.prototype.$message = Message
