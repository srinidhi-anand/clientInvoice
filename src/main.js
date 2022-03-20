import { createApp } from 'vue'
import App from './App.vue'

import './bootstrap/dist/css/bootstrap.css'
import './bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'
import VuePaginator from 'vuejs-paginator';

createApp(App).use(router).use(VuePaginator).mount('#app')
