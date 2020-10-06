import { createApp } from 'vue';
import App from './App.vue';
import config from 'devextreme-vue/core/config';
config({ useLegacyTemplateEngine: false });

createApp(App).mount('#app');
