import { createApp } from 'vue';
import themes from 'devextreme/ui/themes';
import App from './App.vue';

themes.initialized(() => createApp(App).mount('#app'));

