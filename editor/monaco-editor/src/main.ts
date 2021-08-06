import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import ElementUI from 'element-plus';


const app = createApp(App)
  .use(store)
  .use(router)
  .use(ElementUI)
  .mount('#app');
