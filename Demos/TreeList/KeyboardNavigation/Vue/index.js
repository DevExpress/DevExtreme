import Vue from 'vue';
import App from './App.vue';
import config from 'devextreme-vue/core/config';
config({ useLegacyTemplateEngine: false });

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});
