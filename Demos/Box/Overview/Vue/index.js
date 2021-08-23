import { createApp } from 'vue';
import App from './App.vue';

import themes from 'devextreme/ui/themes';

themes.initialized(() => createApp(App).mount('#app'));

