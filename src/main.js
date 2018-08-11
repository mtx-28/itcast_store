// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
// 导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引人css公共样式
import '@/assets/css/index.css';
import moment from 'moment';
// 配置自定义组件MyAxios

import myaxios from '@/plugins/MyAxios';
// 注册插件
Vue.use(ElementUI);
// 注册myaxios插件
Vue.use(myaxios);
// 全局过滤器格式化日期
Vue.filter('fmtDate', (value, fmtString) => {
  return moment(value).format(fmtString);
});
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';

// Vue.prototype.$http = axios;
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
