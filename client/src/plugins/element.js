import Vue from 'vue'
// 按需引入 element-ui 组件
import {
  Button, Message, Container, Header, Main, Alert, Card, Select, Option, Table, TableColumn,
  Popover, Divider, RadioGroup, Radio, Input
} from 'element-ui'
// 将组建添加到 Vue 实例中
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Alert)
Vue.use(Card)
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Popover)
Vue.use(Divider)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Input)
// 全局挂载 message 组件
Vue.prototype.$message = Message
